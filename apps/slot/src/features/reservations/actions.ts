"use server";

import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import {
  getBookings as getBookingsApi,
  getBooking as getBookingApi,
  cancelBooking as cancelBookingApi,
  rescheduleBooking as rescheduleBookingApi,
  getSlots as getSlotsApi,
} from "@repo/apis";
import { revalidatePath } from "next/cache";

export async function getBookings(startDate: string, endDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const bookings = await getBookingsApi(
    session.idToken,
    startDate,
    endDate,
  );
  return bookings;
}

export async function getBooking(bookingId: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  return await getBookingApi(session.idToken, bookingId);
}

export async function cancelBooking(bookingId: string, startDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const result = await cancelBookingApi(session.idToken, bookingId, startDate);
  revalidatePath("/reservations");
  return result;
}

export async function rescheduleBooking(
  bookingId: string,
  startDate: string,
  newDates: { startDate: string; endDate: string; slotId?: string },
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const result = await rescheduleBookingApi(session.idToken, bookingId, startDate, newDates);
  revalidatePath("/reservations");
  return result;
}

export async function getSlots(startDate: string, endDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  return await getSlotsApi(session.idToken, startDate, endDate);
}
