"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@repo/ui";
import { Calendar } from "@repo/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { cn } from "../lib/utils";
import { useLocale } from "@repo/i18n";

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Pick a date range",
  className,
  error,
  minDate,
  maxDate,
}: {
  startDate?: string;
  endDate?: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();

  const from = startDate ? parseISO(startDate) : undefined;
  const to = endDate ? parseISO(endDate) : undefined;

  const selected: DateRange | undefined =
    from ? { from, to: to ?? from } : undefined;

  function handleSelect(range: DateRange | undefined) {
    if (!range || !range.from) return;
    onChange({
      startDate: format(range.from, "yyyy-MM-dd"),
      endDate: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!from}
            className={cn(
              "h-9 w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              error && "border-destructive",
              className,
            )}
          >
            {from ? (
              <span>
                {from.toLocaleDateString(locale, { dateStyle: "medium" })}
                {" – "}
                {(to ?? from).toLocaleDateString(locale, { dateStyle: "medium" })}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            showOutsideDays={false}
            defaultMonth={from}
            disabled={(day) =>
              (minDate && day < minDate) || (maxDate && day > maxDate) || false
            }
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
