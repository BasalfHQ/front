"use client";

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "@repo/i18n";
import { Button, type ButtonProps } from "./button";

export interface SignedUploadUrl {
  url: string;
  fields: Record<string, string>;
  fileId: string;
  key: string;
}

export interface UploadedFile {
  fileId: string;
  key: string;
  /** Local object url for the just-picked file — lets the caller show it immediately instead of waiting for the backend to confirm the upload. Caller should revoke it (URL.revokeObjectURL) once done with it. */
  previewUrl: string;
}

export interface UploadFileButtonProps
  extends Omit<ButtonProps, "onClick" | "children"> {
  getUploadUrl: (input: {
    name: string;
    size: number;
    contentType?: string;
    key?: string;
  }) => Promise<SignedUploadUrl | null>;
  onUploaded?: (file: UploadedFile) => void;
  onError?: (error: unknown) => void;
  accept?: string;
  /** Pin the file at this deterministic key instead of a random one, for fixed-slot uploads (profile picture, logo, ...) that should overwrite in place on re-upload. */
  keyOverride?: string;
  children?: ReactNode;
}

export function UploadFileButton({
  getUploadUrl,
  onUploaded,
  onError,
  accept,
  keyOverride,
  children,
  disabled,
  ...buttonProps
}: UploadFileButtonProps) {
  const t = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    try {
      // Signed url needs the file's name/size, so it can only be requested
      // once picked — fired immediately on selection, no extra round trip.
      console.log("[UploadFileButton] requesting signed url", {
        name: file.name,
        size: file.size,
        contentType: file.type || undefined,
        key: keyOverride,
      });
      const signed = await getUploadUrl({
        name: file.name,
        size: file.size,
        contentType: file.type || undefined,
        key: keyOverride,
      });
      console.log("[UploadFileButton] signed url response", signed);
      if (!signed) throw new Error("No upload url returned");

      const formData = new FormData();
      Object.entries(signed.fields).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append("file", file);

      const response = await fetch(signed.url, {
        method: "POST",
        body: formData,
      });
      console.log("[UploadFileButton] S3 upload response", {
        status: response.status,
        ok: response.ok,
      });
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

      onUploaded?.({
        fileId: signed.fileId,
        key: signed.key,
        previewUrl: URL.createObjectURL(file),
      });
    } catch (error) {
      console.error("[UploadFileButton] upload failed", error);
      onError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading}
        {...buttonProps}
      >
        {isUploading ? t("loading") : (children ?? t("uploadFile"))}
      </Button>
    </>
  );
}
