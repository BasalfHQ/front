"use client";

import { Slot } from "@repo/apis";
import { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  formatHour,
} from "@repo/ui";
import { useLocale, useTranslations } from "next-intl";
import { rescheduleBooking, getSlots } from "../actions";
import { toast } from "@repo/ui";
import { useRouter } from "next/navigation";
import { addMonths, format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";

export function RescheduleBookingButton({ booking }: { booking: Slot.Booking }) {
  const t = useTranslations("reservations.detail");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<Slot.Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Slot.Slot | null>(null);
  const [month, setMonth] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const start = format(month, "yyyy-MM-dd");
    const end = format(addMonths(month, 2), "yyyy-MM-dd");
    getSlots(start, end).then((data) => {
      setSlots(data ?? []);
    });
  }, [open, month]);

  const availableSlots = slots.filter(
    (slot) => slot.maxCapacity - slot.usedCapacity >= booking.numberOfPerson,
  );

  const daysWithSlots = availableSlots.map((slot) => parseISO(slot.startDate));

  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter((slot) =>
        isSameDay(parseISO(slot.startDate), selectedDate),
      )
    : [];

  async function handleReschedule() {
    if (!selectedSlot) return;
    try {
      setIsLoading(true);
      await rescheduleBooking(booking.bookingId, booking.startDate, {
        startDate: selectedSlot.startDate,
        endDate: selectedSlot.endDate,
        slotId: selectedSlot.slotId,
      });
      toast.success(t("rescheduleSuccess"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("rescheduleError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("reschedule")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("rescheduleTitle")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
            month={month}
            onMonthChange={setMonth}
            locale={locale === "fr" ? fr : enUS}
            modifiers={{ hasSlot: daysWithSlots }}
            modifiersClassNames={{ hasSlot: "font-bold" }}
            disabled={(day) =>
              day < new Date() ||
              !daysWithSlots.some((d) => isSameDay(d, day))
            }
          />
          <div className="flex flex-col gap-2 min-w-[140px] max-h-[300px] overflow-y-auto">
            {selectedDate && slotsForSelectedDate.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("noSlots")}</p>
            )}
            {slotsForSelectedDate.map((slot) => (
              <Button
                key={slot.slotId}
                variant={selectedSlot?.slotId === slot.slotId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSlot(slot)}
                className="justify-start"
              >
                {formatHour(slot.startDate, locale, booking.timezone)}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {t("cancelAction")}
          </Button>
          <Button onClick={handleReschedule} disabled={isLoading || !selectedSlot}>
            {t("confirmReschedule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
