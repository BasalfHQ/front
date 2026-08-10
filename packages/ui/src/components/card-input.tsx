"use client";

import { cn } from "../lib/utils";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

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
  ...inputProps
}: CardInputProps & {
  label: string;
  description?: string;
  className?: string;
  classNameLabel?: string;
  classNameDescription?: string;
  classNameInput?: string;
}) {
  const inputId = label.toLowerCase().replace(/ /g, "-");

  const focusInput = () => {
    document.getElementById(inputId)?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border p-4 w-fit justify-between",
        className,
      )}
      onClick={focusInput}
    >
      <div className="flex flex-col gap-1"> 
        <p className={cn("text-sm font-medium", classNameLabel)}>{label}</p>
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
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={inputId}
          className={cn("w-full", classNameInput)}
          placeholder={placeholder}
        />
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={inputId} className={cn("w-full", classNameInput)}>
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
    </div>
  );
}
