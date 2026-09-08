import * as React from "react";
import { cn } from "../lib/utils";

export type SlotChipState = "available" | "selected" | "full" | "scarce";

const stateClasses: Record<SlotChipState, string> = {
  available:
    "border border-border bg-card text-foreground hover:border-plum hover:text-plum-text",
  selected: "border border-primary bg-primary text-primary-foreground",
  full: "border border-dashed border-border bg-transparent text-disabled",
  scarce: "border border-transparent bg-danger-tint text-danger-text",
};

export interface SlotChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  state?: SlotChipState;
  label: string;
  /** Shown under the label only when state is "scarce", e.g. "2 left". */
  scarceCaption?: string;
}

export function SlotChip({
  state = "available",
  label,
  scarceCaption,
  className,
  disabled,
  ...props
}: SlotChipProps) {
  const isFull = state === "full";
  return (
    <button
      type="button"
      disabled={disabled || isFull}
      aria-pressed={state === "selected"}
      className={cn(
        "flex h-12 min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/15 disabled:cursor-not-allowed",
        stateClasses[state],
        className
      )}
      {...props}
    >
      <span>{label}</span>
      {state === "scarce" && scarceCaption && (
        <span className="text-[11px] leading-none">{scarceCaption}</span>
      )}
    </button>
  );
}
