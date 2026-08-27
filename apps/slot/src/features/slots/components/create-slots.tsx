"use client";

import { useTranslations } from "@repo/i18n";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  Label,
  DatePicker,
  DialogDescription,
  Card,
  Button,
  TimePicker,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@repo/ui";
import { Slot, SlotRepeatInterval, Service } from "@repo/apis";
import { useMemo, useState } from "react";
import { isPast, addMonths, addYears } from "date-fns";
import { useLocale } from "@repo/i18n";
import { createSlot, createSlots } from "../actions";
import { Loader2 } from "@repo/ui/icons";
import { useQueryClient } from "@tanstack/react-query";

export type InputSlot = Omit<Slot, "slotId" | "usedCapacity">;
export type CreateSlotsDialogState = {
  open: boolean;
  slot: InputSlot;
};

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function CreateSlots({
  state,
  setState,
  services,
  hasMultipleServices,
}: {
  state: CreateSlotsDialogState;
  setState: (state: CreateSlotsDialogState) => void;
  services: Service[];
  hasMultipleServices: boolean;
}) {
  const t = useTranslations("slots.CreateSlots");
  const [isLoading, setIsLoading] = useState(false);
  const [editingCapacity, setEditingCapacity] = useState(false);
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [interval, setInterval] = useState<SlotRepeatInterval | undefined>(
    undefined,
  );

  async function handleCreate() {
    try {
      setIsLoading(true);
      if (interval) {
        const end = new Date(repeatEndDate);
        const slotEnd = new Date(state.slot.endDate);
        end.setHours(slotEnd.getHours(), slotEnd.getMinutes(), 0, 0);
        await createSlots(
          new Date(state.slot.startDate).toISOString(),
          end.toISOString(),
          state.slot.maxCapacity,
          interval,
          state.slot.serviceId,
        );
      } else {
        await createSlot(
          new Date(state.slot.startDate).toISOString(),
          new Date(state.slot.endDate).toISOString(),
          state.slot.maxCapacity,
          state.slot.serviceId,
        );
      }
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      setState({ ...state, open: false });
    } catch (error) {
      console.error(error);
      toast.error(t("createSlotsError"));
    } finally {
      setIsLoading(false);
    }
  }

  function getTime(date: string) {
    const d = new Date(date);
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  const isPastDate = isPast(new Date(state.slot.startDate));

  const [repeatEndDate, setRepeatEndDate] = useState<string>(
    addMonths(new Date(), 6).toISOString(),
  );

  function getDayName(dayIndex: number) {
    const d = new Date(2024, 0, 1); // 2024-01-01 is Monday
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString(locale, { weekday: "long" });
  }

  const isAllDays = interval === "alldays";

  function handleAllDaysToggle() {
    if (isAllDays) {
      setInterval([...WEEKDAYS]);
    } else {
      setInterval("alldays");
    }
  }

  function handleDayToggle(day: (typeof WEEKDAYS)[number]) {
    if (isAllDays) {
      setInterval(WEEKDAYS.filter((d) => d !== day));
    } else if (Array.isArray(interval)) {
      if (interval.includes(day)) {
        setInterval(interval.filter((d) => d !== day));
      } else {
        const next = [...interval, day];
        if (next.length === 7) {
          setInterval("alldays");
        } else {
          setInterval(next);
        }
      }
    }
  }

  function isDayChecked(day: (typeof WEEKDAYS)[number]) {
    if (isAllDays) return true;
    if (Array.isArray(interval)) return interval.includes(day);
    return false;
  }

  const repeat = () => {
    if (!interval) return null;
    return (
      <div className="flex flex-col gap-4 pt-2 border-t">
        <Label>{t("repeatDescription")}</Label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAllDaysToggle}
            className={`flex-1 min-w-fit flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium capitalize cursor-pointer transition-colors ${
              isAllDays
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground"
            }`}
          >
            <Checkbox
              checked={isAllDays}
              onCheckedChange={handleAllDaysToggle}
            />
            {t("allDays")}
          </button>
          {WEEKDAYS.map((day, i) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayToggle(day)}
              className={`flex-1 min-w-fit flex items-center gap-2 rounded-md border px-2 py-2 text-sm capitalize cursor-pointer transition-colors ${
                isDayChecked(day)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <Checkbox
                checked={isDayChecked(day)}
                onCheckedChange={() => handleDayToggle(day)}
              />
              {getDayName(i)}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <Label>{t("repeatUntil")}</Label>
          <DatePicker
            value={repeatEndDate}
            onChange={setRepeatEndDate}
            minDate={(() => {
              const d = new Date(state.slot.startDate);
              d.setDate(d.getDate() + 1);
              return d;
            })()}
          />
        </div>
      </div>
    );
  };

  const content = useMemo(() => {
    if (isPastDate) {
      return (
        <Card variant="destructive" className="p-4 w-full">
          {t("startDateInThePast")}
        </Card>
      );
    }
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <Label>{t("day")}</Label>
          <DatePicker
            value={state.slot.startDate}
            onChange={(value) => {
              const picked = new Date(value);
              const start = new Date(state.slot.startDate);
              const end = new Date(state.slot.endDate);
              start.setFullYear(
                picked.getFullYear(),
                picked.getMonth(),
                picked.getDate(),
              );
              end.setFullYear(
                picked.getFullYear(),
                picked.getMonth(),
                picked.getDate(),
              );
              setState({
                ...state,
                slot: {
                  ...state.slot,
                  startDate: start.toISOString(),
                  endDate: end.toISOString(),
                },
              });
            }}
            minDate={new Date()}
            maxDate={
              interval ? new Date(repeatEndDate) : addYears(new Date(), 1)
            }
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <Label>{t("startTime")}</Label>
            <TimePicker
              value={getTime(state.slot.startDate)}
              onChange={(value) => {
                const [hour, minute] = value.split(":");
                const d = new Date(state.slot.startDate);
                d.setHours(Number(hour), Number(minute), 0, 0);
                setState({
                  ...state,
                  slot: {
                    ...state.slot,
                    startDate: d.toISOString(),
                  },
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label>{t("endTime")}</Label>
            <TimePicker
              value={getTime(state.slot.endDate)}
              onChange={(value) => {
                const [hour, minute] = value.split(":");
                const d = new Date(state.slot.endDate);
                d.setHours(Number(hour), Number(minute), 0, 0);
                setState({
                  ...state,
                  slot: {
                    ...state.slot,
                    endDate: d.toISOString(),
                  },
                });
              }}
              minTime={getTime(state.slot.startDate)}
            />
          </div>
        </div>
      </div>
    );
  }, [state.slot.startDate, state.slot.endDate]);

  return (
    <Dialog
      open={state.open}
      onOpenChange={(open) => setState({ ...state, open })}
    >
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>
        {content}
        {hasMultipleServices && (
          <div className="flex flex-col gap-1">
            <Label>{t("service")}</Label>
            <Select
              value={state.slot.serviceId}
              onValueChange={(value) =>
                setState({
                  ...state,
                  slot: { ...state.slot, serviceId: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.serviceId} value={s.serviceId}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            {editingCapacity ? (
              <Input
                type="number"
                min={1}
                autoFocus
                value={state.slot.maxCapacity}
                onChange={(e) =>
                  setState({
                    ...state,
                    slot: {
                      ...state.slot,
                      maxCapacity: Math.max(1, Number(e.target.value)),
                    },
                  })
                }
                onBlur={() => setEditingCapacity(false)}
                className="w-full"
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditingCapacity(true)}
                className="w-full"
              >
                {t("capacity", { count: state.slot.maxCapacity })}
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() =>
              interval ? setInterval(undefined) : setInterval("alldays")
            }
            className="flex-1"
          >
            {interval ? t("cancelRepeat") : t("repeat")}
          </Button>
        </div>
        {repeat()}
        <Button onClick={handleCreate} disabled={isPastDate || isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("create")
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
