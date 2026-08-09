"use client";

import { cn } from "../lib/utils";
import { Input } from "./input";

export function CardInput({
  onChange,
  value,
  label,
  description,
  placeholder,
  className,
  classNameLabel,
  classNameDescription,
  classNameInput,
}: {
  onChange: (value: string) => void;
  value: string;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  classNameLabel?: string;
  classNameDescription?: string;
  classNameInput?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border p-4 w-fit",
        className,
      )}
      onClick={() => {
        const input = document.getElementById(
          label.toLowerCase().replace(/ /g, "-"),
        );
        if (input) {
          input.focus();
        }
      }}
    >
      <p className={cn("text-sm font-medium", classNameLabel)}>{label}</p>
      {description && (
        <p
          className={cn("text-sm text-muted-foreground", classNameDescription)}
        >
          {description}
        </p>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={label.toLowerCase().replace(/ /g, "-")}
        className={cn("w-full", classNameInput)}
        placeholder={placeholder}
      />
    </div>
  );
}
