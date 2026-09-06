"use client";

import { Book } from "@repo/apis";
import { useLocale, useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { formatDay, formatHour } from "@repo/ui/lib/dates";
import { Calendar, CheckCircle, MapPin } from "@repo/ui/icons";
import { useBooking } from "./book";

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

export function Success() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const { organization, slot, getService, setVariant } = useBooking();

  if (!slot) return <p>{t("missingInfo")}</p>;

  const service = getService(slot.serviceId);
  const title = service
    ? `${service.name} - ${organization.name}`
    : organization.name;
  const location = formatAddress(organization.address);

  const googleUrl = (() => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatDateForCalendar(slot.startDate)}/${formatDateForCalendar(slot.endDate)}`,
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
      `DTSTART:${formatDateForCalendar(slot.startDate)}`,
      `DTEND:${formatDateForCalendar(slot.endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${title}`,
      ...(location ? [`LOCATION:${location}`] : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  })();

  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center">
      <div className="flex flex-col gap-4 items-center text-center max-w-md">
        <CheckCircle size={64} className="text-green-500" />

        <h2 className="text-xl font-semibold">{t("successTitle")}</h2>
        <p className="text-gray-600">{t("successText")}</p>

        <div className="flex flex-col gap-3 p-4 bg-white rounded-md w-full text-left">
          {service && <p className="font-medium">{service.name}</p>}
          <p className="text-gray-600">
            {formatDay(slot.startDate, locale, organization.timezone)} {t("at")}{" "}
            {formatHour(slot.startDate, locale, organization.timezone)}
          </p>
          {location && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{location}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full gap-2 bg-white">
              <Calendar size={16} />
              Google Calendar
            </Button>
          </a>
          <a href={appleUrl} download="rdv.ics" className="flex-1">
            <Button variant="outline" className="w-full gap-2 bg-white">
              <Calendar size={16} />
              Apple Calendar
            </Button>
          </a>
        </div>

        <Button onClick={() => setVariant("slots")} className="w-full">
          {t("bookAnother")}
        </Button>
      </div>
    </div>
  );
}
