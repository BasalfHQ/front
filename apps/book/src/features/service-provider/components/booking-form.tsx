"use client";

import { Book } from "@repo/apis";
import { Link, useRouter, useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { AutoSizeInput } from "@repo/ui/components/auto-size-input";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { formatDay, formatHour } from "@repo/ui/lib/dates";
import { MapPin, MoveLeft } from "@repo/ui/icons";
import { useState } from "react";
import { formatDuration } from "@/lib/price";
import { createBooking } from "../actions";

const inputClassName = "h-auto min-h-[46px] w-full max-w-none hover:cursor-auto";

function capitalize(s: string): string {
  return s.length ? s[0]!.toUpperCase() + s.slice(1) : s;
}

function formatAddress(organization: Book.Organization): string | null {
  const adr = organization.address;
  if (!adr) return null;
  return [
    [adr.streetNumber, adr.streetAddress].filter(Boolean).join(" "),
    [adr.postalCode, adr.addressLocality].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(", ");
}

export const BookingForm = ({
  orgId,
  locale,
  organization,
  service,
  slot,
  priceLabel,
}: {
  orgId: string;
  locale: string;
  organization: Book.Organization;
  service: Book.Service;
  slot: Book.Slot;
  priceLabel: string | null;
}) => {
  const t = useTranslations("booking");
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const durationLabel = formatDuration(slot.startDate, slot.endDate);
  const address = formatAddress(organization);
  const dayLabel = capitalize(
    formatDay(slot.startDate, locale, organization.timezone),
  );
  const hourLabel = formatHour(slot.startDate, locale, organization.timezone);

  const isFormValid =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "";

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
    if (result.success) {
      router.push(`/service-provider/${orgId}/book/success`);
      return;
    }
    setIsPending(false);
    if (result.error === "SLOT_CAPACITY_EXCEEDED") {
      setError(t("slotNotAvailable"));
    } else {
      setError(t("bookingError"));
    }
  };

  const submitButton = (
    <Button
      type="submit"
      form="booking-form"
      disabled={isPending || !isFormValid}
      className="min-h-[44px] w-full"
    >
      {isPending
        ? t("confirming")
        : isFormValid
          ? t("confirm")
          : t("completeYourInfo")}
    </Button>
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Link
        href={`/service-provider/${orgId}/book/slot?serviceId=${service.serviceId}`}
        className="flex min-h-[44px] w-fit items-center gap-2 text-info hover:underline"
      >
        <MoveLeft size={16} />
        <span className="text-sm font-medium">{t("changeSlot")}</span>
      </Link>

      <div className="flex flex-col gap-1 rounded-lg bg-accent p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-foreground/70">
          {t("yourSlot")}
        </span>
        <p className="font-semibold text-accent-foreground">
          {dayLabel} {t("at")} {hourLabel}
        </p>
        <p className="text-sm text-accent-foreground/80">
          {[service.name, durationLabel, priceLabel].filter(Boolean).join(" · ")}
        </p>
        {address && (
          <div className="mt-1 flex items-start gap-2 text-sm text-accent-foreground/80">
            <MapPin size={16} className="mt-0.5 shrink-0 text-info" />
            <p>{address}</p>
          </div>
        )}
      </div>

      <form
        id="booking-form"
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={inputClassName}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClassName}
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
              className={inputClassName}
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
            className="w-full min-w-full bg-card"
          />
        </div>

        <p className="text-[12.5px] text-muted-foreground">
          {t("cancellationNote")}
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="hidden md:block">{submitButton}</div>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        {submitButton}
      </div>
    </div>
  );
};
