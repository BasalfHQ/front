"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "@repo/i18n";
import { cn } from "../lib/utils";

export interface ExpandableTextProps {
  html: string;
  lines?: number;
  className?: string;
}

export function ExpandableText({ html, lines = 3, className }: ExpandableTextProps) {
  const t = useTranslations("common");
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [html, lines]);

  if (!html) return null;

  return (
    <div className={className}>
      <div
        ref={contentRef}
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isClamped && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            "mt-1 cursor-pointer text-sm underline underline-offset-2 text-muted-foreground hover:text-foreground",
          )}
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
}
