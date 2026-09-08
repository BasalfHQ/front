"use client";

import * as React from "react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useLocale } from "@repo/i18n";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

export interface DateRangeFieldProps {
  startDate?: string;
  endDate?: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  durationLabel?: (nights: number) => string;
}

export function DateRangeField({
  startDate,
  endDate,
  onChange,
  label,
  placeholder = "Select dates",
  className,
  minDate,
  maxDate,
  durationLabel,
}: DateRangeFieldProps) {
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();

  const from = startDate ? parseISO(startDate) : undefined;
  const to = endDate ? parseISO(endDate) : undefined;
  const selected: DateRange | undefined = from ? { from, to: to ?? from } : undefined;
  const nights = from && to ? differenceInCalendarDays(to, from) : undefined;

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from) return;
    onChange({
      startDate: format(range.from, "yyyy-MM-dd"),
      endDate: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
    });
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-sm text-foreground-mid">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!from}
            className="h-12 w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <span className="flex flex-col items-start">
              {from ? (
                <span>
                  {from.toLocaleDateString(locale, { dateStyle: "medium" })}
                  {" – "}
                  {(to ?? from).toLocaleDateString(locale, { dateStyle: "medium" })}
                </span>
              ) : (
                <span>{placeholder}</span>
              )}
              {nights !== undefined && nights > 0 && (
                <span className="text-xs text-plum-text">
                  {durationLabel
                    ? durationLabel(nights)
                    : `${nights} night${nights > 1 ? "s" : ""}`}
                </span>
              )}
            </span>
            <CalendarIcon className="size-4 text-muted-foreground" />
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
    </div>
  );
}
