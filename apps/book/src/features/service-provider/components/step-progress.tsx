"use client";

import { useTranslations } from "@repo/i18n";
import { cn } from "@repo/ui/lib/utils";

export function StepProgress({
  currentStep,
  className,
}: {
  currentStep: 0 | 1 | 2;
  className?: string;
}) {
  const t = useTranslations("booking");
  const steps = [t("stepSlot"), t("stepInfo"), t("stepDone")];

  return (
    <div className={cn("flex w-full gap-2 md:w-64", className)}>
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col gap-1">
          <div
            className={cn(
              "h-1 rounded-full",
              i <= currentStep ? "bg-info" : "bg-border",
            )}
          />
          <span
            className={cn(
              "text-[11px]",
              i === currentStep
                ? "font-bold text-info"
                : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
