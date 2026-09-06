"use client";

import { Slot } from "@repo/apis";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../actions";
import { useState } from "react";
import {
  DateRangePicker,
  formatDay,
  formatHour,
  TableHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Badge,
  Button,
} from "@repo/ui";
import { Loader2 } from "@repo/ui/icons";
import { useLocale, useTranslations } from "next-intl";
import { isPast } from "date-fns";
import { Link } from "@repo/i18n";

export function BookingList({
  initialBookings,
  initialStartDate,
  initialEndDate,
  serviceMap,
}: {
  initialBookings: Slot.Booking[];
  initialStartDate: string;
  initialEndDate: string;
  serviceMap?: Record<string, string>;
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const { data, isPending } = useQuery({
    queryKey: ["bookings", startDate, endDate],
    queryFn: () => getBookings(startDate, endDate),
    initialData: initialBookings,
  });

  return (
    <div className="flex flex-col gap-4">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
        className="w-[300px]"
      />
      <div className="flex flex-col gap-2">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <List bookings={data} serviceMap={serviceMap} />
        )}
      </div>
    </div>
  );
}

function List({ bookings, serviceMap }: { bookings: Slot.Booking[]; serviceMap?: Record<string, string> }) {
  const locale = useLocale();
  const t = useTranslations("reservations");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          {serviceMap && <TableHead>{t("service")}</TableHead>}
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          .map((booking) => {
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
            return (
              <TableRow key={booking.bookingId} className="cursor-pointer">
                <TableCell>
                  {booking.firstName} {booking.lastName}
                </TableCell>
                {serviceMap && (
                  <TableCell>
                    {serviceMap[booking.serviceId] ?? booking.serviceId}
                  </TableCell>
                )}
                <TableCell>
                  {formatDay(booking.startDate, locale, booking.timezone)} -{" "}
                  {formatHour(booking.startDate, locale, booking.timezone)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={variant}
                    className="w-[80px] flex justify-center text-center"
                  >
                    {t(status)}
                  </Badge>
                </TableCell>
                <TableCell> <Link href={`/reservations/${booking.bookingId}`}><Button variant="info">{t("view")}</Button></Link></TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
