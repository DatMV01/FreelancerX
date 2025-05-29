import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import JSZip from "jszip";
import { Trash2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import ButtonGreenBorder from "../../../components/ButtonGreenBorder";

type FileType = "image" | "video" | "pdf" | "zip";

interface FileUploaderProps {
  accept?: FileType[];
  onChange?: (file: File) => void;
  onRemove?: (file: File) => void;
  className?: string;
  initialFileUrl?: string;
}

const MAX_SIZE_MB: Record<FileType, number> = {
  image: 5,
  video: 50,
  pdf: 10,
  zip: 30,
};

const ACCEPT_MIME: Record<FileType, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/webm"],
  pdf: ["application/pdf"],
  zip: ["application/zip", "application/x-zip-compressed"],
};

export const getFileType = (file: File): FileType | null => {
  const type = file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf") return "pdf";
  if (type === "application/zip" || type === "application/x-zip-compressed")
    return "zip";
  return null;
};

const createFileSchema = (allowed: (keyof typeof MAX_SIZE_MB)[]) =>
  z.custom<File>(
    (file) => {
      if (!(file instanceof File)) return false;

      const type = getFileType(file);
      if (!type || !allowed.includes(type)) return false;

      const maxSize = MAX_SIZE_MB[type];
      const acceptedTypes = ACCEPT_MIME[type];

      return (
        file.size <= maxSize * 1024 * 1024 && acceptedTypes.includes(file.type)
      );
    },
    {
      message: "Invalid file type or size.",
    },
  );

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = ["image", "video", "pdf", "zip"],
  onChange,
  onRemove,
  className = "",
  initialFileUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<FileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<string>("");
  const [zipEntries, setZipEntries] = useState<string[]>([]);

  const inputAccept = useRef(
    accept.flatMap((type) => ACCEPT_MIME[type]).join(","),
  );

  const readableAccepts = useRef(
    accept.map((type) => {
      const exts = ACCEPT_MIME[type]
        .map((mime) => {
          if (mime.startsWith("image/")) return mime.replace("image/", "");
          if (mime.startsWith("video/")) return mime.replace("video/", "");
          if (mime === "application/pdf") return "pdf";
          if (mime.includes("zip")) return "zip";

          return mime;
        })
        .join(", ");

      return {
        type,
        max: MAX_SIZE_MB[type],
        extensions: exts,
      };
    }),
  );

  useEffect(() => {
    const fetchInitialFile = async () => {
      if (!initialFileUrl) return;

      try {
        const response = await fetch(initialFileUrl);
        const blob = await response.blob();
        const fileName = initialFileUrl.split("/").pop() || "remote-file";

        const file = new File([blob], fileName, { type: blob.type });

        const fileType = getFileType(file);
        if (!fileType || !accept.includes(fileType)) {
          setError("Unsupported file type.");
          return;
        }

        const maxSizeMB = MAX_SIZE_MB[fileType];
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`The file exceeds ${maxSizeMB}MB.`);
          return;
        }

        setFile(file);

        setUploadDate(new Date().toLocaleString());
        setPreviewType(fileType);

        if (["image", "video", "pdf"].includes(fileType)) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }

        if (fileType === "zip") {
          const zip = new JSZip();
          const contents = await zip.loadAsync(file);
          setZipEntries(Object.keys(contents.files));
        }
      } catch (err) {
        setError("Failed to load file.");
      }
    };

    fetchInitialFile();
  }, [initialFileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    reset();
    if (!file) return;

    const fileType = getFileType(file);
    if (!fileType || !accept.includes(fileType)) {
      setError("Unsupported file type.");

      return;
    }

    const maxSizeMB = MAX_SIZE_MB[fileType];
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`The file exceeds ${maxSizeMB}MB.`);
      return;
    }

    setFile(file);

    setUploadDate(new Date().toLocaleString());
    setPreviewType(fileType);
    onChange?.(file);

    if (["image", "video", "pdf"].includes(fileType)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    if (fileType === "zip") {
      const zip = new JSZip();
      zip.loadAsync(file).then((contents) => {
        const entries = Object.keys(contents.files);
        setZipEntries(entries);
      });
    }
  };

  const reset = () => {
    setFile(null);

    setPreviewUrl(null);
    setPreviewType(null);

    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`min-h-200px mx-auto flex flex-col items-center justify-between rounded border p-2 ${className}`}
    >
      {/* Preview */}
      <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
        {previewUrl && previewType === "image" && (
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-full max-w-full rounded border object-contain"
          />
        )}

        {previewUrl && previewType === "video" && (
          <video
            src={previewUrl}
            controls
            className="h-full w-full rounded border"
          />
        )}

        {previewUrl && previewType === "pdf" && (
          <div className="h-full w-full overflow-auto rounded border">
            <iframe
              src={previewUrl}
              title="PDF Preview"
              className="h-full w-full"
            />
          </div>
        )}
        {previewType === "zip" && file && (
          <div className="flex h-full w-full gap-6 px-4 py-2 text-sm text-gray-700">
            {/* Left: File Info */}
            <div className="w-1/2 space-y-2 break-words">
              <p>
                <strong>File Name:</strong> {file.name}
              </p>
              <p>
                <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                MB
              </p>
              <p>
                <strong>Type:</strong> application/zip
              </p>
              <p>
                <strong>Uploaded At:</strong>

                {formatDate(new Date(uploadDate), "dd/MM/yyyy HH:mm")}
              </p>
            </div>

            {/* Right: Zip Contents */}
            <div className="w-1/2 space-y-2">
              <p>
                <strong>Contents:</strong>
              </p>
              <ul className="h-full list-inside list-disc space-y-1 overflow-auto pb-10">
                {zipEntries.length > 0 ? (
                  zipEntries.map((entry, index) => <li key={index}>{entry}</li>)
                ) : (
                  <li className="text-gray-400 italic">
                    No content found or unable to read ZIP.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        {!previewUrl && !file && (
          <div className="flex flex-col text-base">
            <div className="w-full rounded border bg-gray-50 p-3 text-sm text-gray-600">
              <p className="font-medium">Accepted file types:</p>
              <ul className="list-inside list-disc space-y-1">
                {readableAccepts.current.map(({ type, max, extensions }) => (
                  <li key={type}>
                    <strong className="capitalize">{type}</strong>: max {max}MB
                    {extensions && ` (${extensions})`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Hidden Input */}
      <input
        type="file"
        ref={inputRef}
        accept={inputAccept.current}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2">
        <ButtonGreenBorder
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            inputRef.current?.click();
          }}
        >
          <Upload />
          Choose
        </ButtonGreenBorder>

        {file && (
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.(file);
              reset();
            }}
          >
            <Trash2 />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
