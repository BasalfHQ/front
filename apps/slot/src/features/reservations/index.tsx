import { Slot } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, getTranslations, redirect } from "@repo/i18n";
import { PageDescription, PageTitle, QueryProvider } from "@repo/ui";
import { BookingList } from "./components/booking-list";
import { addMonths } from "date-fns";

export default async function Reservations() {
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("reservations"),
    getLocale(),
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const now = new Date();
  const startDate = now.toISOString();
  const endDate = addMonths(now, 1).toISOString();
  const [bookings, services] = await Promise.all([
    Slot.getBookings(session.idToken, startDate, endDate),
    Slot.getServices(session.idToken),
  ]);
  const serviceMap = Object.fromEntries(
    services.map((s) => [s.serviceId, s.name]),
  );
  return (
    <div className="flex flex-col gap-1">
      <PageTitle>{t("title")}</PageTitle>
      <PageDescription>{t("description")}</PageDescription>

      <QueryProvider>
        <BookingList
          initialBookings={bookings}
          initialStartDate={startDate}
          initialEndDate={endDate}
          serviceMap={services.length > 1 ? serviceMap : undefined}
        />
      </QueryProvider>
    </div>
  );
}
