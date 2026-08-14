"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@repo/ui";
import { Calendar } from "@repo/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { cn } from "../lib/utils";

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  }) {
  const [open, setOpen] = React.useState(false);
  
  const date = value ? parseISO(value) : undefined;

  function handleSelect(selected: Date | undefined) {
    onChange(selected ? format(selected, "yyyy-MM-dd") : "");
  }

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "h-9 w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              error && "border-destructive",
              className,
            )}
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
            onDayClick={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
