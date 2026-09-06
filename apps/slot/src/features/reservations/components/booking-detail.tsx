import { Slot } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, getTranslations, redirect, Link } from "@repo/i18n";
import { Badge, formatDate } from "@repo/ui";
import { isPast } from "date-fns";
import { CancelBookingButton } from "./cancel-booking-button";
import { RescheduleBookingButton } from "./reschedule-booking-button";
import { notFound } from "next/navigation";

export default async function BookingDetail({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("reservations.detail"),
    getLocale(),
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const [booking, services] = await Promise.all([
    Slot.getBooking(session.idToken, bookingId),
    Slot.getServices(session.idToken),
  ]);
  if (!booking) {
    return notFound();
  }
  const hasMultipleServices = services.length > 1;
  const serviceName = services.find((s) => s.serviceId === booking.serviceId)?.name;

  const isInThePast = isPast(booking.startDate);
  const status = isInThePast ? "isPast" : booking.status;
  const variant = (() => {
    switch (status) {
      case "booked":
        return "success";
      case "canceled":
        return "destructive";
      default:
        return "outline";
    }
  })();
  const isCanceled = booking.status === "canceled";

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Link
        href="/reservations"
        className="text-sm text-muted-foreground hover:underline"
      >
        ←{t("back")}
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">
          {booking.firstName} {booking.lastName}
        </h1>
        <Badge
          variant={variant}
          className="w-fit"
        >
          {t(status)}
        </Badge>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {hasMultipleServices && serviceName && (
          <p>
            <span className="text-muted-foreground">{t("service")}:</span>{" "}
            {serviceName}
          </p>
        )}
        <p>
          <span className="text-muted-foreground">{t("date")}:</span>{" "}
          {formatDate(booking.startDate, locale, booking.timezone)}
        </p>
        <p>
          <span className="text-muted-foreground">{t("persons")}:</span>{" "}
          {booking.numberOfPerson}
        </p>
        {booking.email && (
          <p>
            <span className="text-muted-foreground">{t("email")}:</span>{" "}
            {booking.email}
          </p>
        )}
        {booking.phone && (
          <p>
            <span className="text-muted-foreground">{t("phone")}:</span>{" "}
            {booking.phone}
          </p>
        )}
        {booking.additionalInfo && (
          <p>
            <span className="text-muted-foreground">
              {t("additionalInfo")}:
            </span>{" "}
            {booking.additionalInfo}
          </p>
        )}
      </div>

      {!isCanceled && (
        <div className="flex gap-2">
          <RescheduleBookingButton booking={booking} />
          <CancelBookingButton booking={booking} />
        </div>
      )}
    </div>
  );
}
