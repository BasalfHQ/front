"use client";

import { Book } from "@repo/apis";
import { useRouter, useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { formatDay, formatHour } from "@repo/ui/lib/dates";
import { Calendar, Check, MapPin } from "@repo/ui/icons";
import { clearBookingConfirmation } from "../actions";

function formatDateForCalendar(date: string): string {
  return date.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function formatAddress(address?: Book.Address): string | null {
  if (!address) return null;
  const parts = [
    [address.streetNumber, address.streetAddress].filter(Boolean).join(" "),
    [address.postalCode, address.addressLocality].filter(Boolean).join(" "),
    address.addressCountry,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function capitalize(s: string): string {
  return s.length ? s[0]!.toUpperCase() + s.slice(1) : s;
}

export function Success({
  orgId,
  locale,
  organization,
  service,
  booking,
  providerName,
  occupationLabel,
  priceLabel,
  durationLabel,
}: {
  orgId: string;
  locale: string;
  organization: Book.Organization;
  service: Book.Service | undefined;
  booking: Book.Booking;
  providerName: string;
  occupationLabel: string | null;
  priceLabel: string | null;
  durationLabel: string | null;
}) {
  const t = useTranslations("booking");
  const router = useRouter();

  const title = service
    ? `${service.name} - ${organization.name}`
    : organization.name;
  const location = formatAddress(organization.address);

  const googleUrl = (() => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatDateForCalendar(booking.startDate)}/${formatDateForCalendar(booking.endDate)}`,
      details: title,
      ...(location ? { location } : {}),
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  const appleUrl = (() => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${formatDateForCalendar(booking.startDate)}`,
      `DTEND:${formatDateForCalendar(booking.endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${title}`,
      ...(location ? [`LOCATION:${location}`] : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  })();

  const bookAnother = async () => {
    await clearBookingConfirmation();
    router.push(`/service-provider/${orgId}`);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-success/30 bg-success/10">
          <Check size={26} className="text-success" />
        </div>

        <h2 className="text-xl font-semibold">{t("successTitle")}</h2>
        <p className="text-muted-foreground">{t("successText")}</p>

        <div className="flex w-full flex-col gap-3 rounded-lg border border-border bg-muted p-4 text-left">
          {service && (
            <p className="font-medium">
              {[service.name, durationLabel, priceLabel]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <p className="text-muted-foreground">
            {capitalize(
              formatDay(booking.startDate, locale, organization.timezone),
            )}{" "}
            {t("at")}{" "}
            {formatHour(booking.startDate, locale, organization.timezone)}
          </p>
          {location && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-info" />
              <p className="text-sm">{location}</p>
            </div>
          )}
          <div className="h-px w-full bg-border" />
          <p className="text-sm text-muted-foreground">
            {[providerName, occupationLabel].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full gap-2">
              <Calendar size={16} />
              {t("addToGoogleCalendar")}
            </Button>
          </a>
          <a href={appleUrl} download="rdv.ics" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Calendar size={16} />
              {t("addToAppleCalendar")}
            </Button>
          </a>
        </div>

        <Button onClick={bookAnother} className="hidden w-full md:flex">
          {t("bookAnother")}
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <Button onClick={bookAnother} className="w-full">
          {t("bookAnother")}
        </Button>
      </div>
    </div>
  );
}
