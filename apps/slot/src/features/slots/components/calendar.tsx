"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import { useLocale } from "@repo/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addWeeks, subWeeks } from "date-fns";
import "./calendar.css";
import { CreateSlots, CreateSlotsDialogState } from "./create-slots";
import { EditSlot, EditSlotDialogState } from "./edit-slot";
import { addHours } from "date-fns";
import { getSlots } from "../actions";
import type { Slot, Service } from "@repo/apis";
import { SlotEvent } from "./event";
import { ServiceFilter } from "./service-filter";
import type { ServiceColorMap } from "../service-colors";

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

function slotsToEvents(
  slots: Slot[] | undefined,
  serviceColorMap: ServiceColorMap,
) {
  if (!slots) return [];
  return slots.map((slot) => ({
    id: slot.slotId,
    start: slot.startDate,
    end: slot.endDate,
    title: `${slot.usedCapacity}/${slot.maxCapacity}`,
    backgroundColor: serviceColorMap[slot.serviceId] ?? "#f5f5f4",
    borderColor: serviceColorMap[slot.serviceId] ?? "#f5f5f4",
    extendedProps: {
      usedCapacity: slot.usedCapacity,
      maxCapacity: slot.maxCapacity,
      serviceId: slot.serviceId,
      color: serviceColorMap[slot.serviceId] ?? "#f5f5f4",
    },
  }));
}

export function SlotCalendar({
  initialSlots,
  services,
  serviceColorMap,
}: {
  initialSlots?: Slot[];
  services: Service[];
  serviceColorMap: ServiceColorMap;
}) {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const hasMultipleServices = services.length > 1;

  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    () => new Set(services.map((s) => s.serviceId)),
  );

  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>(() => {
    const now = new Date();
    const start = subWeeks(now, 1);
    const end = addWeeks(now, 1);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  const { data: slots } = useQuery({
    queryKey: ["slots", dateRange.start, dateRange.end],
    queryFn: () => getSlots(dateRange.start, dateRange.end),
    initialData: initialSlots,
  });

  const filteredSlots = hasMultipleServices
    ? (slots as Slot[] | undefined)?.filter((s) =>
        selectedServiceIds.has(s.serviceId),
      )
    : (slots as Slot[] | undefined);

  const prefetch = useCallback(
    (start: Date, end: Date) => {
      queryClient.prefetchQuery({
        queryKey: ["slots", start.toISOString(), end.toISOString()],
        queryFn: () => getSlots(start.toISOString(), end.toISOString()),
      });
    },
    [queryClient],
  );

  function handleDatesSet(arg: DatesSetArg) {
    const start = arg.start.toISOString();
    const end = arg.end.toISOString();

    setDateRange((prev) => {
      if (prev.start === start && prev.end === end) return prev;
      return { start, end };
    });

    const duration = arg.end.getTime() - arg.start.getTime();
    prefetch(
      new Date(arg.end.getTime()),
      new Date(arg.end.getTime() + duration),
    );
    prefetch(new Date(arg.start.getTime() - duration), arg.start);
  }

  const [createSlotState, setCreateSlotState] =
    useState<CreateSlotsDialogState>({
      open: false,
      slot: {
        maxCapacity: 1,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        serviceId: services[0]?.serviceId ?? "",
      },
    });

  const [editSlotState, setEditSlotState] = useState<EditSlotDialogState>({
    open: false,
    slot: null,
  });

  function handleDateClick(info: DateClickArg) {
    const start = new Date(info.dateStr);
    const end = addHours(start, 1);
    setCreateSlotState({
      open: true,
      slot: {
        maxCapacity: 1,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        serviceId: services[0]?.serviceId ?? "",
      },
    });
  }

  function handleEventClick(info: EventClickArg) {
    const slotsArray = slots as Slot[] | undefined;
    const slot = slotsArray?.find((s) => s.slotId === info.event.id);
    if (slot) {
      setEditSlotState({ open: true, slot });
    }
  }

  return (
    <div className="fc-shadcn flex flex-col gap-4">
      {hasMultipleServices && (
        <ServiceFilter
          services={services}
          serviceColorMap={serviceColorMap}
          selectedIds={selectedServiceIds}
          onSelectionChange={setSelectedServiceIds}
        />
      )}
      <FullCalendar
        key={isMobile ? "day" : "week"}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        locale={locale}
        firstDay={1}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        events={slotsToEvents(filteredSlots, serviceColorMap)}
        eventContent={(arg) => <SlotEvent arg={arg} />}
        height="75vh"
        allDaySlot={false}
        nowIndicator={true}
        validRange={{ start: new Date() }}
      />
      <CreateSlots
        state={createSlotState}
        setState={setCreateSlotState}
        services={services}
        hasMultipleServices={hasMultipleServices}
      />
      <EditSlot
        state={editSlotState}
        setState={setEditSlotState}
        services={services}
        hasMultipleServices={hasMultipleServices}
      />
    </div>
  );
}
