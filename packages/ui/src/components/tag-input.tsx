"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Input, Badge } from "@repo/ui";
import { cn } from "../lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
  error?: string;
};

export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag...",
  className,
  badgeClassName,
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTags = (raw: string) => {
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !value.includes(t));

    if (tags.length) {
      onChange([...value, ...tags]);
    }

    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-1">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn("gap-1 pr-1", badgeClassName)}
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-muted"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        value={input}
        onChange={(e) => {
          const val = e.target.value;

          if (val.includes(",")) {
            addTags(val);
          } else {
            setInput(val);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTags(input);
          }

          if (e.key === "Backspace" && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
          }
        }}
        onBlur={() => {
          if (input.trim()) {
            addTags(input);
          }
        }}
        placeholder={placeholder}
        className={cn("min-w-[120px] flex-1 px-4 py-2 focus-visible:ring-0", error && "border-destructive", className)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
