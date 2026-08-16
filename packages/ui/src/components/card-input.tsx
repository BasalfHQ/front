"use client";

import { cn } from "../lib/utils";
import { AutoSizeInput } from "./auto-size-input";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";

type CardInputProps =
  | {
      type: "input";
      onChange: (value: string) => void;
      value: string;
      placeholder?: string;
    }
  | {
      type: "select";
      onChange: (value: string) => void;
      value: string;
      placeholder?: string;
      options: { component: React.ReactNode; value: string }[];
    };

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
  error,
  required,
  ...inputProps
}: CardInputProps & {
  label: string;
  description?: string;
  className?: string;
  classNameLabel?: string;
  classNameDescription?: string;
  classNameInput?: string;
  error?: string;
  required?: boolean;
}) {
  const inputId = label.toLowerCase().replace(/ /g, "-");

  const focusInput = () => {
    document.getElementById(inputId)?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border p-4 w-fit justify-between",
        error && "border-destructive",
        className,
      )}
      onClick={focusInput}
    >
      <div className="flex flex-col gap-1">
        <p className={cn("text-sm font-medium", classNameLabel)}>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </p>
        {description && (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              classNameDescription,
            )}
          >
            {description}
          </p>
        )}
      </div>
      {inputProps.type === "input" ? (
        <AutoSizeInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          className="border-muted-foreground shadow-none min-w-[300px] w-fit min-h-[30px] h-fit text-wrap"
        />
      ) : (
        <Select value={value} onValueChange={onChange} required={required}>
          <SelectTrigger
            id={inputId}
            className={cn(
              "w-full",
              error && "border-destructive",
              classNameInput,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {inputProps.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.component}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
