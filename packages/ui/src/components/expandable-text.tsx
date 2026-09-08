"use client";

import { useState } from "react";
import { useTranslations } from "@repo/i18n";
import { cn } from "../lib/utils";

export interface ExpandableTextProps {
  html: string;
  className?: string;
}

// Plain-text length past which the 3/4-line clamp is likely to actually
// truncate — avoids a client-side layout measurement (ResizeObserver /
// scrollHeight) just to decide whether to show the toggle button.
const CLAMP_THRESHOLD = 220;

export function ExpandableText({ html, className }: ExpandableTextProps) {
  const t = useTranslations("common");
  const [expanded, setExpanded] = useState(false);

  if (!html) return null;

  const isLikelyClamped =
    html.replace(/<[^>]*>/g, "").trim().length > CLAMP_THRESHOLD;

  return (
    <div className={className}>
      <div
        className={cn(!expanded && "line-clamp-3 md:line-clamp-4")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isLikelyClamped && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 flex min-h-[24px] items-center text-sm font-medium text-info"
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
}
