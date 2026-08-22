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
  toast,
} from "@repo/ui";
import type { Slot } from "@repo/apis";
import { useState } from "react";
import { updateSlot, deleteSlot, deleteSlotsAtSameHour } from "../actions";
import { useQueryClient } from "@tanstack/react-query";

export type EditSlotDialogState = {
  open: boolean;
  slot: Slot | null;
};

export function EditSlot({
  state,
  setState,
}: {
  state: EditSlotDialogState;
  setState: (state: EditSlotDialogState) => void;
}) {
  const t = useTranslations("slots.EditSlot");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editedSlot, setEditedSlot] = useState<Slot | null>(null);
  const queryClient = useQueryClient();

  const slot = editedSlot ?? state.slot;

  function handleOpen(open: boolean) {
    setState({ ...state, open });
    if (!open) {
      setDeleteMode(false);
      setEditedSlot(null);
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
      await deleteSlotsAtSameHour(
        slot.startDate,
        slot.endDate,
        true,
      );
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      handleOpen(false);
    } catch {
      toast.error(t("deleteError"));
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
            {deleteMode ? t("deleteTitle") : t("title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {deleteMode ? t("deleteDescription") : t("description")}
        </DialogDescription>

        {deleteMode ? (
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
              onClick={() => setDeleteMode(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
          </div>
        ) : (
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
                variant="destructive"
                onClick={() => setDeleteMode(true)}
                disabled={isLoading}
                className="flex-1"
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
