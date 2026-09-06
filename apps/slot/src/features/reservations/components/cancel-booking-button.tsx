"use client";

import { Slot } from "@repo/apis";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { cancelBooking } from "../actions";
import { toast } from "@repo/ui";
import { useRouter } from "next/navigation";

export function CancelBookingButton({ booking }: { booking: Slot.Booking }) {
  const t = useTranslations("reservations.detail");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    try {
      setIsLoading(true);
      await cancelBooking(booking.bookingId, booking.startDate);
      toast.success(t("cancelSuccess"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("cancelError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t("cancel")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("cancelTitle")}</DialogTitle>
          <DialogDescription>{t("cancelDescription")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {t("cancelAction")}
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
            {t("confirmCancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
