"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import { useLocale } from "@repo/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addWeeks, subWeeks, addDays, subDays } from "date-fns";
import "./calendar.css";
import { CreateSlots, CreateSlotsDialogState } from "./create-slots";
import { EditSlot, EditSlotDialogState } from "./edit-slot";
import { addHours } from "date-fns";
import { getSlots } from "../actions";
import type { Slot } from "@repo/apis";
import { SlotEvent } from "./event";

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

function slotsToEvents(slots: Slot[] | undefined) {
  if (!slots) return [];
  return slots.map((slot) => ({
    id: slot.slotId,
    start: slot.startDate,
    end: slot.endDate,
    title: `${slot.usedCapacity}/${slot.maxCapacity}`,
    extendedProps: {
      usedCapacity: slot.usedCapacity,
      maxCapacity: slot.maxCapacity,
    },
  }));
}

export function SlotCalendar({ initialSlots }: { initialSlots?: Slot[] }) {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const calendarRef = useRef<FullCalendar>(null);

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
    <div className="fc-shadcn">
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
        events={slotsToEvents(slots as Slot[] | undefined)}
        eventContent={(arg) => <SlotEvent arg={arg} />}
        ref={calendarRef}
        height="75vh"
        allDaySlot={false}
        nowIndicator={true}
        validRange={{ start: new Date() }}
      />
      <CreateSlots state={createSlotState} setState={setCreateSlotState} />
      <EditSlot state={editSlotState} setState={setEditSlotState} />
    </div>
  );
}
