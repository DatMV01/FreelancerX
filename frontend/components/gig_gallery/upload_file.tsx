"use client";

import { CircularProgress } from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

interface Props {
  localStorageKey?: string;
  fileType: "image" | "video" | "document";
  className?: string;
  autoUpload?: boolean;
}
const seperator = "|";

const UploadFile = forwardRef(
  (
    { localStorageKey, fileType, className, autoUpload = false }: Props,
    ref,
  ) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [error, setError] = useState("");

    const localStorageName = `uploaded_${localStorageKey}`;

    useImperativeHandle(ref, () => ({
      handleUpload,
    }));

    useEffect(() => {
      const storedFile = localStorage.getItem(localStorageName);
      const pathFile = storedFile && storedFile.split(seperator)[1]

      if (pathFile) setPreview(pathFile);
    }, []);

    useEffect(() => {
      if (autoUpload && file) {
        handleUpload();
      }
    }, [file]);

    const isValidFileType = async (file: File) => {
      if (!file) return false;

      if (fileType === "image") {
        if (!file.type.startsWith("image/")) {
          setError("Please upload a valid image file.");
          return false;
        }

        // return new Promise<boolean>((resolve) => {
        //   const img = new Image();
        //   img.onload = () => {
        //     if (img.width < 712 || img.height < 430) {
        //       setError("Image must be at least 712x430 pixels.");
        //       resolve(false);
        //     } else {
        //       resolve(true);
        //     }
        //   };
        //   img.src = URL.createObjectURL(file);
        // });
      } else if (fileType === "video") {
        if (!file.type.startsWith("video/")) {
          setError("Please upload a valid video file.");
          return false;
        }

        if (file.size > 50 * 1024 * 1024) {
          setError("Video file must be smaller than 50MB.");
          return false;
        }

        return new Promise<boolean>((resolve) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            if (video.duration > 75) {
              setError("Video must be less than 75 seconds.");
              resolve(false);
            } else {
              resolve(true);
            }
          };
          video.src = URL.createObjectURL(file);
        });
      } else if (fileType === "document") {
        if (!["application/pdf"].includes(file.type)) {
          setError("Please upload a valid document file (PDF).");
          return false;
        }
      }
      return true;
    };

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const isValid = await isValidFileType(file);
      if (isValid) {
        const objectURL = URL.createObjectURL(file);
        setFile(file);
        setPreview(objectURL);
        setError("");
      }
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(false);
      const file = event.dataTransfer.files[0];

      const isValid = await isValidFileType(file);

      if (isValid) {
        const objectURL = URL.createObjectURL(file);
        setFile(file);
        setPreview(objectURL);
        setError("");
      }
    };

    const handleUpload = async () => {
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/files/upload",
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();

        if (data.path) {
          setUploadedUrl(data.path);
          localStorage.setItem(
            localStorageName,
            data.id + seperator + data.path,
          );
        }
      } catch (error) {
        setError("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    const handleRemoveImage = () => {
      setFile(null);
      setPreview(null);
      setUploadedUrl(null);
      localStorage.removeItem(localStorageName);
    };

    return (
      <div className={cn("flex w-full flex-col items-center space-y-2 border")}>
        <div
          // className={`relative flex h-[250px]  w-full flex-col items-center justify-center overflow-hidden border-2 ${dragOver ? "border-4 border-blue-500" : "border-gray-400"}`}
          className={cn(
            `relative flex h-[250px] w-full flex-col items-center justify-center overflow-hidden border-2 ${dragOver ? "border-4 border-blue-500" : "border-gray-400"}`,
            className,
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {preview ? (
            <>
              {fileType === "image" && (
                <img
                  src={preview}
                  alt="Preview"
                  className={`h-full w-full object-scale-down ${uploading ? "opacity-50" : ""}`}
                />
              )}

              {fileType === "video" && (
                <video
                  src={preview}
                  controls
                  className={`w-full object-cover ${uploading ? "opacity-50" : ""}`}
                />
              )}

              {fileType === "document" && (
                <embed src={preview} width="100%" height="100%" />
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <CircularProgress />
                </div>
              )}
              {hovered && !uploading && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                >
                  ✕
                </button>
              )}
            </>
          ) : (
            <>
              <div>
                {/* <input
                type="file"
                className="w-fit"
                onChange={handleFileChange}
              /> */}

                <input
                  type="file"
                  name="uploadfile"
                  id={localStorageName}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor={localStorageName} className="cursor-pointer">
                  <span className="font-semibold text-blue-900">Browse</span>
                  &nbsp;{fileType}
                </label>
              </div>
              <p>or</p>
              <div className="text-center">
                <p>Drag & Drop {fileType} here</p>

                {error !== "" && <p className="text-red-500">{error}</p>}
              </div>
            </>
          )}
        </div>

        {!autoUpload && (
          <button
            onClick={handleUpload}
            disabled={uploading || uploadedUrl !== null}
            className={`self-center rounded-sm px-4 py-2 text-white ${uploadedUrl ? "cursor-not-allowed bg-green-500" : uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <CircularProgress size={16} sx={{ color: "white" }} />

                <p> Uploading...</p>
              </div>
            ) : uploadedUrl ? (
              "Uploaded"
            ) : (
              `Upload ${fileType}`
            )}
          </button>
        )}
      </div>
    );
  },
);

export default UploadFile;
