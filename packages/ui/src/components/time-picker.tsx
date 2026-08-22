"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { cn } from "../lib/utils";

const STEPS = [1, 2, 5, 10, 15, 20, 30] as const;

type TimeStep = (typeof STEPS)[number];

export function TimePicker({
  value,
  onChange,
  className,
  error,
  minTime,
  maxTime,
  step = 15,
}: {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  minTime?: string;
  maxTime?: string;
  step?: TimeStep;
}) {
  const [valueHour, valueMinute] = value?.split(":") ?? [];

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const minutes = Array.from({ length: 60 / step }, (_, i) => i * step).map(
    (minute) => String(minute).padStart(2, "0"),
  );

  function isAllowed(hour: string, minute: string) {
    const time = `${hour}:${minute}`;

    if (minTime && time < minTime) return false;
    if (maxTime && time > maxTime) return false;

    return true;
  }

  function handleHourChange(hour: string) {
    const minute = valueMinute ?? "00";

    if (isAllowed(hour, minute)) {
      onChange(`${hour}:${minute}`);
    } else {
      // Find the first valid minute for the selected hour
      const validMinute = minutes.find((minute) => isAllowed(hour, minute));

      if (validMinute) {
        onChange(`${hour}:${validMinute}`);
      }
    }
  }

  function handleMinuteChange(minute: string) {
    const hour = valueHour ?? "00";

    if (isAllowed(hour, minute)) {
      onChange(`${hour}:${minute}`);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={valueHour} onValueChange={handleHourChange}>
        <SelectTrigger
          className={cn("w-[4.5rem]", error && "border-destructive")}
        >
          <SelectValue placeholder="h" />
        </SelectTrigger>

        <SelectContent className="w-auto min-w-0">
          {hours
            .filter((hour) => minutes.some((minute) => isAllowed(hour, minute)))
            .map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}h
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select value={valueMinute} onValueChange={handleMinuteChange}>
        <SelectTrigger
          className={cn("w-[4rem]", error && "border-destructive")}
        >
          <SelectValue placeholder="min" />
        </SelectTrigger>

        <SelectContent className="w-auto min-w-0">
          {minutes
            .filter((minute) =>
              valueHour ? isAllowed(valueHour, minute) : true,
            )
            .map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
