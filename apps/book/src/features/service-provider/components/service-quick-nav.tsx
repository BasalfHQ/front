"use client";

import { useTranslations } from "@repo/i18n";

// Jump-to-service strip above the services list: one link per service that
// has bookable slots, anchored to its section further down the page.
export function ServiceQuickNav({
  services,
}: {
  services: { name: string; anchorId: string }[];
}) {
  const t = useTranslations("booking");
  if (services.length === 0) return null;
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("book")}
      </span>
      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <a
            key={s.anchorId}
            href={`#${s.anchorId}`}
            className="flex min-h-[36px] items-center rounded-full border border-input bg-card px-4 text-sm font-medium hover:border-info/60"
          >
            {s.name}
          </a>
        ))}
      </div>
    </div>
  );
}
