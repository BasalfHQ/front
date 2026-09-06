"use client";

import { Book } from "@repo/apis";
import type { BookingCategory } from "@repo/esco";
import { useLocale, useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { formatHour } from "@repo/ui/lib/dates";
import { ChevronLeft, ChevronRight } from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useBooking } from "./book";

type DayGroup = { date: string; slots: Book.Slot[] };

function getOccupationLabel(
  categories: BookingCategory[],
  occupationId: string,
  locale: string,
): string | null {
  for (const cat of categories) {
    const occ = cat.occupations.find((o) => o.id === occupationId);
    if (occ) return occ.labels[locale] ?? occ.labels["en"] ?? null;
  }
  return null;
}

type ServiceGroup = {
  service: Book.Service;
  slots: Book.Slot[];
};

function groupByService(
  slots: Book.Slot[],
  services: Book.Service[],
): ServiceGroup[] {
  const slotsByService = new Map<string, Book.Slot[]>();
  for (const slot of slots) {
    const existing = slotsByService.get(slot.serviceId) ?? [];
    existing.push(slot);
    slotsByService.set(slot.serviceId, existing);
  }
  return services
    .map((service) => ({
      service,
      slots: slotsByService.get(service.serviceId) ?? [],
    }))
    .sort((a, b) => {
      if (a.slots.length === 0 && b.slots.length > 0) return 1;
      if (a.slots.length > 0 && b.slots.length === 0) return -1;
      return 0;
    });
}

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

function chunkDays(days: DayGroup[], size: number): DayGroup[][] {
  const chunks: DayGroup[][] = [];
  for (let i = 0; i < days.length; i += size) {
    chunks.push(days.slice(i, i + size));
  }
  return chunks;
}

function upcomingDays(
  count: number,
  timezone: string,
  today: Date,
): DayGroup[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      date: d.toLocaleDateString("en-CA", { timeZone: timezone }),
      slots: [],
    };
  });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export const SlotSelector = () => {
  const t = useTranslations("booking");
  const {
    slots,
    services,
    organization,
    serviceProvider,
    categories,
    locale,
  } = useBooking();
  const isMobile = useIsMobile();
  const chunkSize = isMobile ? 3 : 7;
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const hasMultipleServices = services.length > 1;
  const serviceGroups = useMemo(
    () => (hasMultipleServices ? groupByService(slots, services) : []),
    [slots, services, hasMultipleServices],
  );

  const getServiceDisplayName = (service: Book.Service) => {
    const defaultPattern = `${organization.organizationId}- Service`;
    if (service.name === defaultPattern) {
      return (
        getOccupationLabel(categories, serviceProvider.occupationId, locale) ??
        service.name
      );
    }
    return service.name;
  };

  if (!today) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("selectSlot")}</h2>
        <div className="h-32" />
      </div>
    );
  }

  if (hasMultipleServices) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">{t("selectSlot")}</h2>
        {serviceGroups.map((group) => {
          const days = groupByDay(group.slots);
          const hasSlots = days.length > 0;
          const chunks = hasSlots
            ? chunkDays(days, chunkSize)
            : chunkDays(upcomingDays(7, organization.timezone, today), chunkSize);
          return (
            <div key={group.service.serviceId} className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">
                {getServiceDisplayName(group.service)}
              </h3>
              <div className="relative">
                <DayChunks chunks={chunks} disabled={!hasSlots} />
                {!hasSlots && (
                  <p className="absolute inset-0 translate-y-20 flex items-center justify-center text-gray-600">
                    {t("noSlots")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const days = groupByDay(slots);
  const hasSlots = days.length > 0;
  const chunks = hasSlots
    ? chunkDays(days, chunkSize)
    : chunkDays(upcomingDays(7, organization.timezone, today), chunkSize);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t("selectSlot")}</h2>
      <div className="relative">
        <DayChunks chunks={chunks} disabled={!hasSlots} />
        {!hasSlots && (
          <p className="absolute inset-0 translate-y-20 flex items-center justify-center text-gray-600">
            {t("noSlots")}
          </p>
        )}
      </div>
    </div>
  );
};

const DayChunks = ({
  chunks,
  disabled,
}: {
  chunks: DayGroup[][];
  disabled?: boolean;
}) => {
  const [selected, setSelected] = useState(0);
  const current = chunks[selected];

  if (!current) return null;

  const canPrev = !disabled && selected > 0;
  const canNext = !disabled && selected < chunks.length - 1;

  return (
    <div className="flex gap-4 items-start">
      <ChevronLeft
        size={25}
        onClick={() => canPrev && setSelected(selected - 1)}
        className={cn(
          "flex-shrink-0",
          canPrev ? "cursor-pointer text-black" : "text-gray-300",
        )}
      />
      <div className="flex gap-2 flex-1 justify-center">
        {current.map((day) => (
          <div key={day.date} className="flex flex-col gap-2">
            <Day date={day.date} />
            <div className="flex flex-col gap-2">
              {day.slots.length === 0 ? (
                <span className="block py-2 text-center text-gray-300 select-none">
                  —
                </span>
              ) : (
                day.slots.map((slot) => (
                  <SlotButton key={slot.slotId} slot={slot} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <ChevronRight
        size={25}
        onClick={() => canNext && setSelected(selected + 1)}
        className={cn(
          "flex-shrink-0",
          canNext ? "cursor-pointer text-black" : "text-gray-300",
        )}
      />
    </div>
  );
};

const Day = ({ date }: { date: string }) => {
  const locale = useLocale();
  const { organization } = useBooking();
  const d = new Date(date);
  const weekday = d.toLocaleDateString(locale, {
    weekday: "short",
    timeZone: organization.timezone,
  });
  const rest = d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    timeZone: organization.timezone,
  });
  return (
    <div className="flex flex-col justify-center items-center w-[80px]">
      <p className="font-medium select-none capitalize">{weekday}</p>
      <p className="text-gray-600 text-sm select-none">{rest}</p>
    </div>
  );
};

const SlotButton = ({ slot }: { slot: Book.Slot }) => {
  const locale = useLocale();
  const { organization, selectSlot } = useBooking();

  return (
    <Button onClick={() => selectSlot(slot)}>
      <span className="select-none">
        {formatHour(slot.startDate, locale, organization.timezone)}
      </span>
    </Button>
  );
};
