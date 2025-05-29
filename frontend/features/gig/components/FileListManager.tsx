import { FileUploader } from "@/features/files/components/FileUploader";
import { GigForm } from "@/pages/dashboard/freelancer/gigs/new";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const fileSlotKeys = [
  "thumbnail",
  "video",
  ...Array.from({ length: 6 }, (_, i) => `gallery-${i}` as const),
] as const;

export type FileSlot = (typeof fileSlotKeys)[number];

export type FileChangesDetectedType = {
  added: Record<FileSlot, File>;
  removed: Record<FileSlot, FileInformation>;
  updated: Record<FileSlot, { from: FileInformation; to: File }>;
};

export type FileChangesDetected2Type = Record<
  FileSlot,
  { from: FileInformation | null; to: File | null }
>;

export interface FileInformation {
  id: string;
  url: string;
  mimeType: string;
  provider: string;
}

interface FileListManagerProps {
  form: UseFormReturn<GigForm>;
  galleryFiles?: Partial<Record<FileSlot, FileInformation | null>>;
  onChange?: (
    currentFiles: Partial<Record<FileSlot, File | FileInformation | null>>,
  ) => void;
  onFileChangesDetected?: (changes: FileChangesDetectedType) => void;
  onFileChangesDetected2?: (changes: FileChangesDetected2Type) => void;
}

const detectFileChanges = (
  initialFiles: Record<FileSlot, FileInformation | null>,
  currentFiles: Record<FileSlot, File | FileInformation | null>,
) => {
  const added: Record<string, File> = {};
  const removed: Record<string, FileInformation> = {};
  const updated: Record<string, { from: FileInformation; to: File }> = {};

  fileSlotKeys.forEach((slot: any) => {
    const from = initialFiles[slot];
    const to = currentFiles[slot] as File | null;

    if (!from && isFile(to)) {
      // New file added
      added[slot] = to;
    } else if (isFileInformation(from) && !to) {
      // File removed
      removed[slot] = from;
    } else if (isFileInformation(from) && isFile(to)) {
      // File updated
      updated[slot] = { from: from, to: to };
    }
  });

  return { added, removed, updated };
};

const detectFileChanges2 = (
  initialFiles: Record<FileSlot, FileInformation | null>,
  currentFiles: Record<FileSlot, File | FileInformation | null>,
) => {
  const changed: FileChangesDetected2Type = {} as FileChangesDetected2Type;

  fileSlotKeys.forEach((key: any) => {
    const initial = initialFiles[key];
    const current = currentFiles[key] as File | null;

    if (!initial && current) {
      changed[key] = { from: null, to: current };
    } else if (initial && !current) {
      changed[key] = { from: initial, to: null };
    } else if (
      initial &&
      current &&
      (initial.url !== current.name || initial.mimeType !== current.type)
    ) {
      changed[key] = { from: initial, to: current };
    } else {
      changed[key] = { from: initial, to: current ?? null };
    }
  });
  return changed;
};

type FileChangeMap = Record<
  string,
  {
    from: FileInformation | null;
    to: File | FileInformation | null;
  }
>;

function isFile(value: any): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function isFileInformation(value: any): value is FileInformation {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.url === "string"
  );
}

function getChangedFiles(fileChanges: FileChangeMap) {
  const added: Record<string, File> = {};
  const removed: Record<string, FileInformation> = {};
  const updated: Record<string, { from: FileInformation; to: File }> = {};

  for (const [slot, { from, to }] of Object.entries(fileChanges)) {
    if (from === null && isFile(to)) {
      added[slot] = to;
    } else if (isFileInformation(from) && to === null) {
      removed[slot] = from;
    } else if (isFileInformation(from) && isFile(to)) {
      updated[slot] = { from, to };
    }
  }

  return { added, removed, updated };
}

export function fillMissingFileSlots(
  input: Partial<Record<FileSlot, FileInformation | null>>,
): Record<FileSlot, FileInformation | null> {
  const result: Record<FileSlot, FileInformation | null> = {} as any;

  for (const key of fileSlotKeys) {
    result[key] = input[key] ?? null;
  }

  return result;
}

const emptyInitialFiles = (() => {
  const _ = {} as Record<FileSlot, FileInformation | null>;
  fileSlotKeys.forEach((key) => {
    _[key] = null;
  });
  return _;
})();

export const FileListManager: React.FC<FileListManagerProps> = ({
  form,
  galleryFiles,
  onChange,
  onFileChangesDetected,
  onFileChangesDetected2,
}) => {
  const [currentFiles, setCurrentFiles] =
    useState<Record<FileSlot, FileInformation | File | null>>(
      emptyInitialFiles,
    );

  // const [initialFiles, setInitialFiles] = useState<
  //   Record<FileSlot, FileInformation | null>
  // >(() => {
  //   const _ = {} as Record<FileSlot, FileInformation | null>;
  //   fileSlotKeys.forEach((key) => {
  //     _[key] = null;
  //   });
  //   return _;
  // });
  const initialFilesRef =
    useRef<Record<FileSlot, FileInformation | null>>(emptyInitialFiles);

  const initialFiles = initialFilesRef.current;

  useEffect(() => {
    if (galleryFiles) {
      const _ = fillMissingFileSlots(galleryFiles);
      //setInitialFiles(_);
      initialFilesRef.current = _;
      setCurrentFiles(_);
    }
  }, []);

  const handleChange = (
    key: (typeof fileSlotKeys)[number],
    file: File | null,
  ) => {
    setCurrentFiles((prev) => {
      const updated2 = { ...prev, [key]: file } as Partial<
        Record<(typeof fileSlotKeys)[number], File | null>
      >;
      const updated = { ...prev, [key]: file };
      onChange?.(updated);
      return updated;
    });
  };
  const handleRemove = (slot: FileSlot) => {
    setCurrentFiles((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };
  const triggerChange = () => {
    const changes = detectFileChanges(initialFiles as any, currentFiles);
    const changes2 = detectFileChanges2(initialFiles as any, currentFiles);

    onFileChangesDetected?.(changes);
    onFileChangesDetected2?.(changes2);
  };

  useEffect(() => {
    triggerChange();
  }, [currentFiles]);

  const fieldState = form.getFieldState("medias.thumbnail");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold">Thumbnail (Required)</h2>
          <FileUploader
            initialFileUrl={
              currentFiles.thumbnail && "url" in currentFiles.thumbnail
                ? currentFiles.thumbnail.url
                : undefined
            }
            accept={["image"]}
            className={clsx(
              "h-[300px]",
              fieldState.error?.message && "border-red-500",
            )}
            onChange={(file) => {
              handleChange("thumbnail", file);

              //      form.setValue("thumbnail", file as File);
              form.setValue("medias.thumbnail", file as File);

              form.trigger("medias.thumbnail");
            }}
            onRemove={(file) => {
              handleRemove("thumbnail");
              //    form.setValue("thumbnail", null as any);
              form.setValue("medias.thumbnail", null as any);
              form.trigger("medias.thumbnail");
            }}
          />
          {fieldState.error && (
            <p className="text-red-500">{fieldState.error.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Video (Optional)</h2>
          <FileUploader
            initialFileUrl={
              currentFiles.video && "url" in currentFiles.video
                ? currentFiles.video.url
                : undefined
            }
            accept={["video"]}
            className="h-[300px]"
            onChange={(file) => handleChange("video", file)}
            onRemove={() => handleRemove("video")}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Gallery Files (Image/PDF)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <FileUploader
              initialFileUrl={
                currentFiles[`gallery-${i}`] &&
                "url" in (currentFiles[`gallery-${i}`] as FileInformation)
                  ? (currentFiles[`gallery-${i}`] as FileInformation).url
                  : undefined
              }
              className="h-[300px] w-full"
              key={`gallery-${i}`}
              accept={["image", "pdf"]}
              onChange={(file) => handleChange(`gallery-${i}`, file)}
              onRemove={() => handleRemove(`gallery-${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
