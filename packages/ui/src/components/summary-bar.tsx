import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export interface SummaryBarProps {
  price: string;
  context?: string;
  ctaLabel: string;
  onCta?: () => void;
  ctaDisabled?: boolean;
  className?: string;
}

export function SummaryBar({
  price,
  context,
  ctaLabel,
  onCta,
  ctaDisabled,
  className,
}: SummaryBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-4 border-t border-border bg-card px-4 py-3 shadow-[0_-6px_16px_-6px_rgb(12_10_18_/_0.08)]",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="font-mono text-lg font-semibold text-foreground">{price}</span>
        {context && <span className="text-xs text-muted-foreground">{context}</span>}
      </div>
      <Button size="lg" onClick={onCta} disabled={ctaDisabled}>
        {ctaLabel}
      </Button>
    </div>
  );
}
