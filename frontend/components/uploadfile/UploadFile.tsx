"use client";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { cn } from "@/lib/utils";
import { CircularProgress } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { X } from "lucide-react";
import { Button } from "../ui/button";

export interface FileInfomation {
  id?: string;
  url: string;
  mimeType?: string;
  provider?: string;
}

interface Props {
  keyFile?: string;
  fileType: "image" | "video" | "document";
  className?: string;
  autoUpload?: boolean;
  addionalFileType?: any;
  onFileChangeCb?: any;
  onUploadSuccessCb?: any;
  onDeleteSuccessCb?: any;
  fileInfomation?: FileInfomation;
}

const UploadFile = ({
  addionalFileType,
  keyFile,
  fileType,
  className,
  autoUpload = false,
  onFileChangeCb,
  onDeleteSuccessCb,
  onUploadSuccessCb,
  fileInfomation,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<FileInfomation | null>();

  useEffect(() => {
    if (fileInfomation) {
      setPreview(fileInfomation.url);
      setFileInfo(fileInfomation);
    }
  }, []);

  useEffect(() => {
    if (onFileChangeCb && file) {
      onFileChangeCb({
        file: file,
        keyFile: keyFile,
        addionalFileType: addionalFileType,
      });
    } else if (autoUpload && file) {
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
          return false;
        };
        video.src = URL.createObjectURL(file);
      });
    } else if (fileType === "document") {
      if (!["application/pdf"].includes(file.type)) {
        setError("Please upload a valid document file (PDF).");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Document file must be smaller than 5MB.");
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

  const handleUpload = async (): Promise<boolean> => {
    if (!file) return false;
    setUploading(true);

    let newFile;
    if (addionalFileType) {
      const newFileName = `${addionalFileType}___${file.name}`;
      newFile = new File([file], newFileName, { type: file.type });
    }

    const formData = new FormData();
    formData.append("file", newFile || file);

    try {
      const { data, status } = await axiosInstanceV1.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (status === 201) {
        const { id, url } = data;

        setFileInfo(data);

        onUploadSuccessCb &&
          onUploadSuccessCb({ data, keyFile, addionalFileType });

        return true;
      } else {
        setPreview(null);
        return false;
      }
    } catch (error: any) {
      setPreview(null);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Request Error:" + error.message);
      }

      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    setFile(null);
    setPreview(null);

    if (onFileChangeCb) {
      onDeleteSuccessCb({
        keyFile: keyFile,
        addionalFileType: addionalFileType,
      });
    } else {
      await deleteFile();
    }

    setFileInfo(null);
  };

  const deleteFile = async (): Promise<boolean> => {
    if (fileInfo && fileInfo.id) {
      try {
        const response = await axiosInstanceV1.delete(`/file/${fileInfo.id}`);

        if (response.status === 200) {
          onDeleteSuccessCb &&
            onDeleteSuccessCb({
              keyFile: keyFile,
              addionalFileType: addionalFileType,
              response: response.data,
            });

          return true;
        }

        if (response.status === 400) {
          setError("File not found or cannot be deleted");
          return false;
        }

        return false;
      } catch (error) {
        setError("File not found or cannot be deleted");
        return false;
      }
    }

    if (fileInfo && fileInfo.url) {
      try {
        const response = await axiosInstanceV1.delete(
          `/file/name/${fileInfo.url}`,
        );

        if (response.status === 200) {
          onDeleteSuccessCb &&
            onDeleteSuccessCb({
              keyFile: keyFile,
              addionalFileType: addionalFileType,
              response: response.data,
            });

          return true;
        }

        if (response.status === 400) {
          setError("File not found or cannot be deleted");
          return false;
        }

        return false;
      } catch (error) {
        setError("File not found or cannot be deleted");
        return false;
      }
    }

    return false;
  };

  return (
    <div className="border">
      <div
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
                className={`absolute top-0 left-0 h-full w-full ${uploading ? "opacity-50" : ""}`}
              />
            )}

            {fileType === "document" && (
              <embed src={preview} width="100%" height="100%" />
            )}

            {uploading && (
              <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                <CircularProgress />
              </div>
            )}
            {hovered && !uploading && (
              <button
                onClick={handleRemoveFile}
                className="absolute flex items-center justify-center rounded-full"
              >
                <X
                  color="white"
                  size={40}
                  className="rounded-full border border-red-500 bg-red-500 p-2"
                />
              </button>
            )}
          </>
        ) : (
          <>
            <div>
              <input
                type="file"
                name="uploadfile"
                id={keyFile}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor={keyFile} className="cursor-pointer">
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
        <div className="mt-2 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={uploading || fileInfo?.url !== null}
            className={`rounded-sm px-4 py-2 text-white`}
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <CircularProgress size={16} sx={{ color: "white" }} />

                <p> Uploading...</p>
              </div>
            ) : (
              <div>Upload</div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
