"use client";

import { useTranslations } from "@repo/i18n";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  Label,
  Button,
  TimePicker,
  Input,
  AutoSizeInput,
  toast,
} from "@repo/ui";
import type { Slot } from "@repo/apis";
import { useState } from "react";
import {
  updateSlot,
  deleteSlot,
  deleteSlotsAtSameHour,
  createBooking,
} from "../actions";
import { useQueryClient } from "@tanstack/react-query";

export type EditSlotDialogState = {
  open: boolean;
  slot: Slot | null;
};

type Mode = "choice" | "update" | "book" | "delete";

export function EditSlot({
  state,
  setState,
}: {
  state: EditSlotDialogState;
  setState: (state: EditSlotDialogState) => void;
}) {
  const t = useTranslations("slots.EditSlot");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("choice");
  const [editedSlot, setEditedSlot] = useState<Slot | null>(null);
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    additionalInfo: "",
    numberOfPerson: 1,
  });
  const queryClient = useQueryClient();

  const slot = editedSlot ?? state.slot;

  function handleOpen(open: boolean) {
    setState({ ...state, open });
    if (!open) {
      setMode("choice");
      setEditedSlot(null);
      setBookingForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        additionalInfo: "",
        numberOfPerson: 1,
      });
    }
  }

  function getTime(date: string) {
    const d = new Date(date);
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  async function handleUpdate() {
    if (!slot) return;
    try {
      setIsLoading(true);
      await updateSlot({
        slotId: slot.slotId,
        maxCapacity: slot.maxCapacity,
        usedCapacity: slot.usedCapacity,
        startDate: slot.startDate,
        endDate: slot.endDate,
      });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      handleOpen(false);
    } catch {
      toast.error(t("updateError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSingle() {
    if (!slot) return;
    try {
      setIsLoading(true);
      await deleteSlot(slot.slotId, slot.startDate);
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      handleOpen(false);
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSameHour() {
    if (!slot) return;
    try {
      setIsLoading(true);
      await deleteSlotsAtSameHour(slot.startDate, slot.endDate, true);
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      handleOpen(false);
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBook() {
    if (!slot) return;
    try {
      setIsLoading(true);
      await createBooking({
        slotId: slot.slotId,
        firstName: bookingForm.firstName,
        lastName: bookingForm.lastName,
        email: bookingForm.email || undefined,
        phone: bookingForm.phone || undefined,
        additionalInfo: bookingForm.additionalInfo || undefined,
        startDate: slot.startDate,
        endDate: slot.endDate,
        numberOfPerson: bookingForm.numberOfPerson,
      });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      handleOpen(false);
    } catch {
      toast.error(t("bookingError"));
    } finally {
      setIsLoading(false);
    }
  }

  if (!slot) return null;

  return (
    <Dialog open={state.open} onOpenChange={handleOpen}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>
            {mode === "choice" && t("title")}
            {mode === "update" && t("updateTitle")}
            {mode === "book" && t("bookingTitle")}
            {mode === "delete" && t("deleteTitle")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {mode === "choice" && t("choiceDescription")}
          {mode === "update" && t("description")}
          {mode === "book" && t("bookingDescription")}
          {mode === "delete" && t("deleteDescription")}
        </DialogDescription>

        {mode === "choice" && (
          <div className="flex flex-col gap-2">
            <Button onClick={() => setMode("update")}>{t("update")}</Button>
            <Button onClick={() => setMode("book")}>{t("book")}</Button>
            <Button
              variant="destructive"
              onClick={() => setMode("delete")}
            >
              {t("delete")}
            </Button>
          </div>
        )}

        {mode === "update" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("startTime")}</Label>
                <TimePicker
                  value={getTime(slot.startDate)}
                  onChange={(value) => {
                    const [hour, minute] = value.split(":");
                    const d = new Date(slot.startDate);
                    d.setHours(Number(hour), Number(minute), 0, 0);
                    setEditedSlot({ ...slot, startDate: d.toISOString() });
                  }}
                  maxTime={getTime(slot.endDate)}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("endTime")}</Label>
                <TimePicker
                  value={getTime(slot.endDate)}
                  onChange={(value) => {
                    const [hour, minute] = value.split(":");
                    const d = new Date(slot.endDate);
                    d.setHours(Number(hour), Number(minute), 0, 0);
                    setEditedSlot({ ...slot, endDate: d.toISOString() });
                  }}
                  minTime={getTime(slot.startDate)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("usedCapacity")}</Label>
                <Input
                  type="number"
                  min={0}
                  max={slot.maxCapacity}
                  value={slot.usedCapacity}
                  onChange={(e) =>
                    setEditedSlot({
                      ...slot,
                      usedCapacity: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("maxCapacity")}</Label>
                <Input
                  type="number"
                  min={1}
                  value={slot.maxCapacity}
                  onChange={(e) =>
                    setEditedSlot({
                      ...slot,
                      maxCapacity: Math.max(1, Number(e.target.value)),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex-1"
              >
                {t("save")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode("choice")}
                disabled={isLoading}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}

        {mode === "book" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("firstName")}</Label>
                <Input
                  value={bookingForm.firstName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, firstName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("lastName")}</Label>
                <Input
                  value={bookingForm.lastName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("email")}</Label>
                <Input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, email: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label>{t("phone")}</Label>
                <Input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("additionalInfo")}</Label>
              <AutoSizeInput
                value={bookingForm.additionalInfo}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    additionalInfo: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                  }
                }}
              />
            </div>

            {slot.maxCapacity > 1 && (
              <div className="flex flex-col gap-1">
                <Label>{t("numberOfPerson")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={slot.maxCapacity - slot.usedCapacity}
                  value={bookingForm.numberOfPerson}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      numberOfPerson: Math.max(1, Number(e.target.value)),
                    })
                  }
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleBook}
                disabled={
                  isLoading || !bookingForm.firstName || !bookingForm.lastName
                }
                className="flex-1"
              >
                {t("confirmBooking")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode("choice")}
                disabled={isLoading}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}

        {mode === "delete" && (
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteSingle}
              disabled={isLoading}
            >
              {t("deleteThis")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSameHour}
              disabled={isLoading}
            >
              {t("deleteAllSameHour")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setMode("choice")}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
