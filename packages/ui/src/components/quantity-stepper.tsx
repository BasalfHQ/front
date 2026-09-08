"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  className,
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && <span className="text-sm text-foreground-mid">{label}</span>}
      <div className="flex items-center rounded-md border border-input">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="decrease"
          className="flex size-11 items-center justify-center text-plum-text transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/15 disabled:text-disabled disabled:hover:bg-transparent"
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-8 text-center font-mono text-sm tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="increase"
          className="flex size-11 items-center justify-center text-plum-text transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/15 disabled:text-disabled disabled:hover:bg-transparent"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
