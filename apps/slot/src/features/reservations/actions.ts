"use server";

import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import { Slot } from "@repo/apis";
import { revalidatePath } from "next/cache";

export async function getBookings(startDate: string, endDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const bookings = await Slot.getBookings(
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
  return await Slot.getBooking(session.idToken, bookingId);
}

export async function cancelBooking(bookingId: string, startDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  const result = await Slot.cancelBooking(session.idToken, bookingId, startDate);
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
  const result = await Slot.rescheduleBooking(session.idToken, bookingId, startDate, newDates);
  revalidatePath("/reservations");
  return result;
}

export async function getSlots(startDate: string, endDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/login", locale });
  }
  return await Slot.getSlots(session.idToken, startDate, endDate);
}
