"use client";

import { Book } from "@repo/apis";
import { Link, useLocale, useTranslations } from "@repo/i18n";
import { formatHour } from "@repo/ui/lib/dates";
import { ChevronLeft, ChevronRight } from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";
import { useMemo, useState } from "react";

type DayGroup = { date: string; slots: Book.Slot[] };

export type SlotSelectorService = {
  name: string;
  slots: Book.Slot[];
};

function groupByDay(slots: Book.Slot[]): DayGroup[] {
  const map = new Map<string, Book.Slot[]>();
  for (const slot of slots) {
    const date = slot.startDate.slice(0, 10);
    const existing = map.get(date) ?? [];
    existing.push(slot);
    map.set(date, existing);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, slots]) => ({
      date,
      slots: slots.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    }));
}

// Fills every date between the first and last slotted day so the calendar
// reads as continuous (empty days shown, not just skipped).
function addDaysToDateString(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// 0 (Sunday) – 6 (Saturday), Date.getDay()-compatible. Falls back to Monday
// (ISO 8601) when the runtime lacks Intl week-info support.
type LocaleWithWeekInfo = Intl.Locale & {
  weekInfo?: { firstDay: number };
};

// Intl's week-info (ECMA-402) isn't implemented everywhere yet (absent in
// this project's headless Chromium, for one) — fall back to this app's own
// two locales, then to the ISO default.
const WEEK_START_BY_LOCALE: Record<string, number> = { fr: 1, en: 0 };

function getWeekStartsOn(locale: string): number {
  try {
    const firstDay = (new Intl.Locale(locale) as LocaleWithWeekInfo).weekInfo
      ?.firstDay;
    if (firstDay) return firstDay % 7;
  } catch {
    // unsupported locale/API — fall through
  }
  return WEEK_START_BY_LOCALE[locale] ?? 1;
}

// Groups a contiguous run of days into real calendar weeks starting on
// `weekStartsOn`, so the first/last chunk can be a partial week.
function chunkByCalendarWeek(
  days: DayGroup[],
  weekStartsOn: number,
): DayGroup[][] {
  const chunks: DayGroup[][] = [];
  let current: DayGroup[] = [];
  let currentWeekStart: string | null = null;
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    const offsetFromWeekStart = (dow - weekStartsOn + 7) % 7;
    const weekStart = addDaysToDateString(day.date, -offsetFromWeekStart);
    if (weekStart !== currentWeekStart) {
      if (current.length) chunks.push(current);
      current = [];
      currentWeekStart = weekStart;
    }
    current.push(day);
  }
  if (current.length) chunks.push(current);
  return chunks;
}

function buildCalendarRange(grouped: DayGroup[]): DayGroup[] {
  if (grouped.length === 0) return [];
  const byDate = new Map(grouped.map((d) => [d.date, d.slots]));
  const start = grouped[0]!.date;
  const end = grouped[grouped.length - 1]!.date;
  const out: DayGroup[] = [];
  for (let cur = start; cur <= end; cur = addDaysToDateString(cur, 1)) {
    out.push({ date: cur, slots: byDate.get(cur) ?? [] });
  }
  return out;
}

function capitalize(s: string): string {
  return s.length ? s[0]!.toUpperCase() + s.slice(1) : s;
}

export const SlotSelector = ({
  orgId,
  organization,
  services,
}: {
  orgId: string;
  organization: Book.Organization;
  services: SlotSelectorService[];
}) => {
  const t = useTranslations("booking");

  if (services.length > 1) {
    return (
      <div className="flex flex-col gap-8">
        {services.map((service) => (
          <div key={service.name} className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold">{service.name}</h4>
            <WeekCalendar
              orgId={orgId}
              organization={organization}
              slots={service.slots}
              noSlotsLabel={t("noSlots")}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <WeekCalendar
      orgId={orgId}
      organization={organization}
      slots={services[0]?.slots ?? []}
      noSlotsLabel={t("noSlots")}
    />
  );
};

const WeekArrowButton = ({
  direction,
  disabled,
  onClick,
  size,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  size: number;
}) => {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "previous week" : "next week"}
      disabled={disabled}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border transition-colors",
        disabled
          ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
          : "border-info/50 bg-accent text-accent-foreground hover:bg-accent/80",
      )}
    >
      <Icon size={18} />
    </button>
  );
};

const WeekCalendar = ({
  orgId,
  organization,
  slots,
  noSlotsLabel,
}: {
  orgId: string;
  organization: Book.Organization;
  slots: Book.Slot[];
  noSlotsLabel: string;
}) => {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [slot, selectSlot] = useState<Book.Slot | null>(null);

  const weekStartsOn = useMemo(() => getWeekStartsOn(locale), [locale]);
  const grouped = useMemo(() => groupByDay(slots), [slots]);
  const calendar = useMemo(() => buildCalendarRange(grouped), [grouped]);
  const chunks = useMemo(
    () => chunkByCalendarWeek(calendar, weekStartsOn),
    [calendar, weekStartsOn],
  );

  const firstSlottedDay = calendar.find((d) => d.slots.length > 0);

  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    firstSlottedDay?.date ?? null,
  );

  if (slots.length === 0) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card text-center">
        <p className="text-muted-foreground">{noSlotsLabel}</p>
      </div>
    );
  }

  const currentChunk = chunks[weekIndex] ?? [];
  const canPrevWeek = weekIndex > 0;
  const canNextWeek = weekIndex < chunks.length - 1;

  const jumpToDate = (date: string) => {
    const idx = chunks.findIndex((chunk) =>
      chunk.some((d) => d.date === date),
    );
    if (idx === -1) return;
    setSelectedDate(date);
    setWeekIndex(idx);
  };

  const goToWeek = (nextIndex: number) => {
    const chunk = chunks[nextIndex];
    if (!chunk) return;
    setWeekIndex(nextIndex);
    const firstWithSlots = chunk.find((d) => d.slots.length > 0);
    setSelectedDate((firstWithSlots ?? chunk[0])?.date ?? null);
  };

  const goToNextAvailableDay = () => {
    if (!selectedDate) return;
    const next = calendar.find(
      (d) => d.date > selectedDate && d.slots.length > 0,
    );
    if (next) jumpToDate(next.date);
  };

  const weekRangeLabel =
    currentChunk.length > 0
      ? `${formatShortDate(currentChunk[0]!.date, locale)} – ${formatShortDate(
          currentChunk[currentChunk.length - 1]!.date,
          locale,
        )}`
      : "";

  const chosenLabel = slot
    ? `${capitalize(
        new Date(slot.startDate).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          timeZone: organization.timezone,
        }),
      )} ${t("at")} ${formatHour(slot.startDate, locale, organization.timezone)}`
    : null;

  const selectedDay = calendar.find((d) => d.date === selectedDate);
  const selectedDayLabel = selectedDate
    ? capitalize(
        new Date(selectedDate).toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: organization.timezone,
        }),
      )
    : "";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* Mobile */}
      <div className="flex min-w-0 flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <WeekArrowButton
            direction="prev"
            disabled={!canPrevWeek}
            onClick={() => goToWeek(weekIndex - 1)}
            size={44}
          />
          <span className="text-sm text-muted-foreground">
            {weekRangeLabel}
          </span>
          <WeekArrowButton
            direction="next"
            disabled={!canNextWeek}
            onClick={() => goToWeek(weekIndex + 1)}
            size={44}
          />
        </div>
        <div
          className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {currentChunk.map((day) => (
            <DayPill
              key={day.date}
              day={day}
              selected={day.date === selectedDate}
              onSelect={jumpToDate}
              locale={locale}
              timezone={organization.timezone}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-semibold capitalize">{selectedDayLabel}</h4>
            <span className="text-sm text-muted-foreground">
              {t("slotsFree", { count: selectedDay?.slots.length ?? 0 })}
            </span>
          </div>
          {selectedDay && selectedDay.slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {selectedDay.slots.map((s) => (
                <button
                  key={s.slotId}
                  type="button"
                  onClick={() => selectSlot(s)}
                  className={cn(
                    "min-h-[44px] rounded-md border text-sm font-medium transition-colors",
                    slot?.slotId === s.slotId
                      ? "border-info bg-info text-info-foreground"
                      : "border-input bg-card hover:border-info/60",
                  )}
                >
                  {formatHour(s.startDate, locale, organization.timezone)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t("noSlotThisDay")}
              </p>
              <button
                type="button"
                onClick={goToNextAvailableDay}
                className="min-h-[44px] rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground"
              >
                {t("nextAvailableDay")}
              </button>
            </div>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {slot ? t("chosenSlot") : t("noSlotChosen")}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                !slot && "text-muted-foreground",
              )}
            >
              {chosenLabel ?? t("pickAnHour")}
            </span>
          </div>
          <BookCta slot={slot} orgId={orgId} label={t("book")} className="px-5" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden flex-col gap-4 md:flex">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold">{t("selectSlot")}</h3>
            <div className="flex items-center gap-3">
              <WeekArrowButton
                direction="prev"
                disabled={!canPrevWeek}
                onClick={() => goToWeek(weekIndex - 1)}
                size={34}
              />
              <span className="w-40 text-center text-sm text-muted-foreground">
                {weekRangeLabel}
              </span>
              <WeekArrowButton
                direction="next"
                disabled={!canNextWeek}
                onClick={() => goToWeek(weekIndex + 1)}
                size={34}
              />
            </div>
          </div>
          <div className="grid grid-cols-7">
            {currentChunk.map((day) => {
              const isActiveDay = slot
                ? slot.startDate.slice(0, 10) === day.date
                : false;
              const d = new Date(day.date);
              return (
                <div
                  key={day.date}
                  className="flex flex-col border-r border-border last:border-r-0"
                >
                  <div
                    className={cn(
                      "flex flex-col items-center gap-0.5 border-b-2 py-3",
                      isActiveDay ? "border-info" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        isActiveDay ? "text-info" : "text-foreground",
                      )}
                    >
                      {d.toLocaleDateString(locale, {
                        weekday: "short",
                        timeZone: organization.timezone,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {d.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        timeZone: organization.timezone,
                      })}
                    </span>
                  </div>
                  <div className="flex min-h-[80px] flex-col gap-1.5 p-2">
                    {day.slots.length === 0 ? (
                      <span className="select-none py-2 text-center text-sm text-muted-foreground/50">
                        —
                      </span>
                    ) : (
                      day.slots.map((s) => (
                        <button
                          key={s.slotId}
                          type="button"
                          onClick={() => selectSlot(s)}
                          className={cn(
                            "rounded-md border px-2 py-1.5 text-sm transition-colors",
                            slot?.slotId === s.slotId
                              ? "border-info bg-info text-info-foreground"
                              : "border-input bg-card hover:border-info/60",
                          )}
                        >
                          {formatHour(
                            s.startDate,
                            locale,
                            organization.timezone,
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-info" />
              <span>{t("selectedSlotLegend")}</span>
            </div>
            <span>{organization.timezone}</span>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg border px-5 py-4",
            slot
              ? "border-accent-foreground/20 bg-accent"
              : "border-border bg-muted",
          )}
        >
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {slot ? t("chosenSlot") : t("noSlotChosen")}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                !slot && "text-muted-foreground",
              )}
            >
              {chosenLabel ?? t("pickAnHourLong")}
            </span>
          </div>
          <BookCta slot={slot} orgId={orgId} label={t("book")} className="px-6" />
        </div>
      </div>
    </div>
  );
};

const BookCta = ({
  slot,
  orgId,
  label,
  className,
}: {
  slot: Book.Slot | null;
  orgId: string;
  label: string;
  className?: string;
}) => {
  if (!slot) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "min-h-[44px] shrink-0 cursor-not-allowed rounded-md bg-muted text-sm font-semibold text-muted-foreground",
          className,
        )}
      >
        {label}
      </button>
    );
  }
  return (
    <Link
      prefetch={true}
      href={`/service-provider/${orgId}/book?serviceId=${slot.serviceId}&slotId=${slot.slotId}`}
      className={cn(
        "flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-info text-sm font-semibold text-info-foreground hover:bg-info/90",
        className,
      )}
    >
      {label}
    </Link>
  );
};

const DayPill = ({
  day,
  selected,
  onSelect,
  locale,
  timezone,
}: {
  day: DayGroup;
  selected: boolean;
  onSelect: (date: string) => void;
  locale: string;
  timezone: string;
}) => {
  const d = new Date(day.date);
  const hasSlots = day.slots.length > 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      style={{ scrollSnapAlign: "start" }}
      className={cn(
        "flex h-[66px] w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg transition-colors",
        selected
          ? "bg-info text-info-foreground"
          : hasSlots
            ? "border border-border bg-card hover:border-info/60"
            : "bg-muted text-muted-foreground",
      )}
    >
      <span className="text-[11px] uppercase">
        {d.toLocaleDateString(locale, { weekday: "short", timeZone: timezone })}
      </span>
      <span className="text-base font-semibold">
        {d.toLocaleDateString(locale, { day: "numeric", timeZone: timezone })}
      </span>
      <span
        className={cn(
          "h-[5px] w-[5px] rounded-full",
          hasSlots
            ? selected
              ? "bg-info-foreground"
              : "bg-info"
            : "bg-transparent",
        )}
      />
    </button>
  );
};

function formatShortDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
}
