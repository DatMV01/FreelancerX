import { FileUploader } from "@/features/files/components/FileUploader";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";

interface GigGallaryInputProps {
  gallarys?: any;
  onSetGallaryCb?: any;
}
export interface FileInfomation {
  id: string;
  url: string;
  mimeType: string;
  provider: string;
}
export type FileWithOrder =
  | (FileInfomation & { order: number })
  | (File & { order: number });
export function detectFileChanges(
  original: FileInfomation[],
  updated: (FileInfomation | File)[],
) {
  const added: File[] = [];
  const removed: FileInfomation[] = [];
  const kept: FileInfomation[] = [];

  const originalIds = original.map((f) => f.id);
  const updatedIds = updated
    .filter((f): f is FileInfomation => "id" in f)
    .map((f) => f.id);

  // Detect added
  for (const f of updated) {
    if (f instanceof File) {
      added.push(f);
    }
  }

  // Detect removed + kept
  for (const orig of original) {
    if (updatedIds.includes(orig.id)) {
      kept.push(orig);
    } else {
      removed.push(orig);
    }
  }

  // New: Ordered list of all final files
  const finalOrdered = updated;

  return {
    added,
    removed,
    kept,
    finalOrdered,
  };
}

const GigGallaryInput = ({
  gallarys: initialFiles,
  onSetGallaryCb,
}: GigGallaryInputProps) => {
  const [gallary, setGalarry] = useState<FileInfomation[]>(initialFiles || []);
  const [files, setFiles] = useState<(FileInfomation | File)[]>(
    initialFiles || [],
  );

  console.log(files);

  useEffect(() => {
    onSetGallaryCb && onSetGallaryCb(gallary);
  }, [gallary]);

  const handleOnChange = (file: File) => {
    console.log(file);
    setFiles((prev) => [...prev, file]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const changes = detectFileChanges(initialFiles, files);
    console.log("✅ Changes:", changes);
    //onSubmit(changes);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex gap-x-4">
        <div className="w-1/3">
          <strong className="text-xl text-green-500">Thumbnail </strong>
          <span className="text-sm text-gray-400">(Required)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image"]}
            onChange={handleOnChange}
            //    onRemove={handleRemove}
          />
        </div>

        <div className="w-2/3">
          <strong className="text-xl">Video </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px] w-full"
            accept={["video"]}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <Divider />

      <div className="flex gap-x-4">
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>{" "}
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>{" "}
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <Divider />

      <div className="flex gap-x-4">
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>{" "}
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>{" "}
        <div className="w-1/3">
          <strong className="text-xl">File </strong>
          <span className="text-sm text-gray-400">(Optional)</span>
          <FileUploader
            className="h-[400px]"
            accept={["image", "pdf"]}
            onChange={handleOnChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GigGallaryInput;
