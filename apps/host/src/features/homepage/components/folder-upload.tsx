"use client";

import { useRef, useState } from "react";
import { Upload, X } from "@repo/ui/icons";

import { Button, Progress } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

import { Host } from "@repo/apis";

type Props = {
  uploadUrl: Host.UploadUrl;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function WebsiteUpload({
  uploadUrl,
  className,
  onSuccess,
  onError,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    setFiles(newFiles);
    setError(undefined);
    setProgress(0);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    // webkitRelativePath contains the selected folder name.
    // Remove it so the selected folder itself is treated as the root.
    const normalizedFiles = files
      .filter((file) => {
        const path = file.webkitRelativePath || file.name;
        return !path.split("/").some((part) => part.startsWith(".git"));
      })
      .map((file) => {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split("/");

        const normalizedPath = parts.slice(1).join("/");

        Object.defineProperty(file, "webkitRelativePath", {
          value: normalizedPath,
          configurable: true,
        });

        return file;
      });

    addFiles(normalizedFiles);

    event.target.value = "";
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const items = Array.from(event.dataTransfer.items);

    const entries = items
      .map((item) => item.webkitGetAsEntry?.())
      .filter((entry): entry is FileSystemEntry => !!entry);

    const directories = entries.filter(
      (entry): entry is FileSystemDirectoryEntry => entry.isDirectory,
    );

    if (!directories.length) {
      setError("Please drop a folder.");
      onError?.(new Error("Please drop a folder."));
      return;
    }

    const files = (
      await Promise.all(
        directories.map((directory) => readDirectory(directory)),
      )
    ).flat();

    addFiles(files);
  };

  const upload = async () => {
    const hasIndex = files.some((file) => {
      const path = file.webkitRelativePath || file.name;

      return path.split("/").pop()?.toLowerCase() === "index.html";
    });

    if (!hasIndex) {
      setError("The folder must contain an index.html file.");
      onError?.(new Error("The folder must contain an index.html file."));
      return;
    }

    try {
      setError(undefined);

      let uploaded = 0;

      for (const file of files) {
        const path = file.webkitRelativePath || file.name;
        const key = `${uploadUrl.prefix}${path}`;

        const form = new FormData();

        for (const [name, value] of Object.entries(uploadUrl.fields)) {
          form.append(name, value);
        }

        form.set("key", key);
        form.append("Content-Type", file.type || "application/octet-stream");
        form.append("file", file);

        const response = await fetch(uploadUrl.url, {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const body = await response.text();

          console.error("[WebsiteUpload] S3 upload failed:", {
            status: response.status,
            body,
            key,
          });

          throw new Error(body || "Upload failed");
        }

        uploaded++;

        setProgress(Math.round((uploaded / files.length) * 100));
      }
      onSuccess?.();
    } catch (error) {
      console.error("[WebsiteUpload] Upload failed:", error);

      setError("Upload failed.");
      onError?.(new Error("Upload failed."));
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        multiple
        // @ts-expect-error webkitdirectory is not included in React's types
        webkitdirectory=""
        className="hidden"
        onChange={onInputChange}
      />

      <div
        className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center hover:bg-muted/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
      >
        <Upload className="mb-3 size-8 text-muted-foreground" />

        <p className="font-medium">Drop your website folder here</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Or click to select a folder
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <>
          <div className="max-h-48 overflow-auto rounded-md border p-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 px-2 py-1 text-sm"
              >
                <span className="flex-1 truncate">
                  {file.webkitRelativePath || file.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setFiles((current) => current.filter((_, i) => i !== index))
                  }
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          {progress > 0 && <Progress value={progress} />}

          <Button className="w-full" onClick={upload}>
            Upload website
          </Button>
        </>
      )}
    </div>
  );
}

async function readDirectory(
  directory: FileSystemDirectoryEntry,
): Promise<File[]> {
  const reader = directory.createReader();
  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });

    if (!batch.length) break;

    entries.push(...batch);
  }

  const filteredEntries = entries.filter(
    (entry) => !entry.name.startsWith(".git"),
  );

  const files = await Promise.all(
    filteredEntries.map(async (entry) => {
      if (entry.isFile) {
        return new Promise<File[]>((resolve, reject) => {
          (entry as FileSystemFileEntry).file((file) => {
            const fullPath = entry.fullPath.slice(1);

            // fullPath is relative to the dropped folder:
            //
            // factorio/index.html
            // factorio/assets/app.js
            //
            // Remove the root folder name:
            //
            // index.html
            // assets/app.js
            const parts = fullPath.split("/");
            const normalizedPath = parts.slice(1).join("/");

            Object.defineProperty(file, "webkitRelativePath", {
              value: normalizedPath,
              configurable: true,
            });

            resolve([file]);
          }, reject);
        });
      }

      if (entry.isDirectory) {
        return readDirectory(entry as FileSystemDirectoryEntry);
      }

      return [];
    }),
  );

  return files.flat();
}
