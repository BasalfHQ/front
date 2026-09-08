"use client";

import { Book } from "@repo/apis";
import { Link, useTranslations } from "@repo/i18n";
import { ExpandableText } from "@repo/ui/components/expandable-text";
import { formatHour, formatShortDay } from "@repo/ui/lib/dates";
import { Pill } from "./pill";

// One service's booking entry point on the org home page: pill (duration ·
// price), description, and next available slots for one-tap booking — or
// the no-slots notice.
export function ServiceBookSection({
  orgId,
  service,
  heading,
  pillLabel,
  description,
  nextSlots,
  locale,
  timezone,
  anchorId,
}: {
  orgId: string;
  service: Book.Service;
  heading: string;
  pillLabel: string | null;
  description: string | null;
  nextSlots: Book.Slot[];
  locale: string;
  timezone: string;
  anchorId: string;
}) {
  const t = useTranslations("booking");
  const hasSlots = nextSlots.length > 0;
  return (
    <div id={anchorId} className="flex w-full scroll-mt-6 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-2xl font-bold">{heading}</h3>
        {pillLabel && <Pill>{pillLabel}</Pill>}
      </div>
      {description && (
        <ExpandableText html={description} className="text-muted-foreground" />
      )}
      {hasSlots ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("nextSlotsLabel")}
          </p>
          <div className="flex flex-wrap gap-2">
            {nextSlots.map((slot) => (
              <Link
                key={slot.slotId}
                prefetch={true}
                href={`/service-provider/${orgId}/book?serviceId=${service.serviceId}&slotId=${slot.slotId}`}
                className="flex min-h-[44px] flex-col items-center justify-center rounded-md border border-info px-3 py-1.5 text-info hover:bg-info hover:text-info-foreground"
              >
                <span className="text-xs font-medium capitalize">
                  {formatShortDay(slot.startDate, locale, timezone)}
                </span>
                <span className="text-sm font-semibold">
                  {formatHour(slot.startDate, locale, timezone)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noSlots")}</p>
      )}
    </div>
  );
}
