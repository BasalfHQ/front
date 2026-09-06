"use client";

import { Book } from "@repo/apis";
import type { BookingCategory } from "@repo/esco";
import { useTranslations } from "@repo/i18n";
import { createContext, useContext, useMemo, useState } from "react";
import { SlotSelector } from "./slot-selector";
import { BookingForm } from "./booking-form";
import { Success } from "./success";

type Variant = "slots" | "form" | "success" | "error";

type BookingContextValue = {
  organization: Book.Organization;
  slots: Book.Slot[];
  services: Book.Service[];
  serviceProvider: Book.ServiceProvider;
  categories: BookingCategory[];
  locale: string;
  variant: Variant;
  slot: Book.Slot | null;
  setVariant: (variant: Variant) => void;
  selectSlot: (slot: Book.Slot) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  getService: (serviceId: string) => Book.Service | undefined;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookAppointment");
  return ctx;
};

export function BookAppointment({
  organization,
  slots,
  services,
  serviceProvider,
  categories,
  locale,
}: {
  organization: Book.Organization;
  slots: Book.Slot[];
  services: Book.Service[];
  serviceProvider: Book.ServiceProvider;
  categories: BookingCategory[];
  locale: string;
}) {
  const t = useTranslations("booking");
  const [variant, setVariant] = useState<Variant>("slots");
  const [slot, setSlot] = useState<Book.Slot | null>(null);

  const availableSlots = useMemo(
    () => slots.filter((s) => s.usedCapacity < s.maxCapacity),
    [slots],
  );

  const getService = (serviceId: string) =>
    services.find((s) => s.serviceId === serviceId);

  const selectSlot = (s: Book.Slot) => {
    setSlot(s);
    setVariant("form");
  };

  const goToPreviousStep = () => {
    if (variant === "form") setVariant("slots");
  };

  const goToNextStep = () => {
    if (variant === "form") setVariant("success");
  };

  return (
    <BookingContext.Provider
      value={{
        organization,
        slots: availableSlots,
        services,
        serviceProvider,
        categories,
        locale,
        variant,
        slot,
        setVariant,
        selectSlot,
        goToPreviousStep,
        goToNextStep,
        getService,
      }}
    >
      <div className="flex flex-col gap-4 min-h-[400px] w-full">
        {variant === "slots" && <SlotSelector />}
        {variant === "form" && <BookingForm />}
        {variant === "success" && <Success />}
        {variant === "error" && (
          <div className="flex flex-col gap-2 w-full items-center py-8 text-center">
            <h2 className="text-xl font-semibold">{t("errorTitle")}</h2>
            <p className="text-gray-600">{t("bookingError")}</p>
          </div>
        )}
      </div>
    </BookingContext.Provider>
  );
}
