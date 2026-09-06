"use client";

import { useLocale, useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { AutoSizeInput } from "@repo/ui/components/auto-size-input";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { formatDay, formatHour } from "@repo/ui/lib/dates";
import { MapPin, MoveLeft } from "@repo/ui/icons";
import { useState } from "react";
import { createBooking } from "../actions";
import { useBooking } from "./book";

export const BookingForm = () => {
  const t = useTranslations("booking");
  const locale = useLocale();
  const { organization, slot, goToPreviousStep, goToNextStep } = useBooking();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!slot) return <p>{t("missingInfo")}</p>;

  const formatAddress = () => {
    const adr = organization.address;
    if (!adr) return null;
    return [
      [adr.streetNumber, adr.streetAddress].filter(Boolean).join(" "),
      [adr.postalCode, adr.addressLocality].filter(Boolean).join(" "),
    ]
      .filter(Boolean)
      .join(", ");
  };

  const address = formatAddress();

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const result = await createBooking(organization.organizationId, {
      serviceId: slot.serviceId,
      slotId: slot.slotId,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      additionalInfo: form.additionalInfo || undefined,
      startDate: slot.startDate,
      endDate: slot.endDate,
      numberOfPerson: 1,
    });
    setIsPending(false);
    if (result.success) {
      goToNextStep();
    } else if (result.error === "SLOT_CAPACITY_EXCEEDED") {
      setError(t("slotNotAvailable"));
    } else {
      setError(t("bookingError"));
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      <div className="w-full">
        <div
          className="flex items-center gap-2 cursor-pointer border-b border-transparent hover:border-gray-400 w-fit text-gray-500"
          onClick={goToPreviousStep}
        >
          <MoveLeft size={16} />
          <p className="text-sm">{t("changeSlot")}</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full"
      >
        <h2 className="text-xl font-semibold">{t("formTitle")}</h2>

        <div className="flex flex-col gap-1">
          <p className="text-gray-600">
            {formatDay(slot.startDate, locale, organization.timezone)} {t("at")}{" "}
            {formatHour(slot.startDate, locale, organization.timezone)}
          </p>
          {address && (
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} className="flex-shrink-0" />
              <p>{address}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
          <div className="flex flex-col gap-1 flex-1">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="additionalInfo">{t("additionalInfo")}</Label>
          <AutoSizeInput
            id="additionalInfo"
            value={form.additionalInfo}
            onChange={(e) => update("additionalInfo", e.target.value)}
            className="w-full min-w-full bg-white"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("confirming") : t("confirm")}
        </Button>
      </form>
    </div>
  );
};
