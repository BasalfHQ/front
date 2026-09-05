"use server";

import {
  createSlot as createSlotApi,
  getSlots as getSlotsApi,
  createSlots as createSlotsApi,
  updateSlot as updateSlotApi,
  deleteSlot as deleteSlotApi,
  deleteSlots as deleteSlotsApi,
  createBooking as createBookingApi,
  SlotRepeatInterval,
} from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import { addYears } from "date-fns";
import { revalidatePath } from "next/cache";

export async function createSlot(
  startDate: string,
  endDate: string,
  maxCapacity: number,
  serviceId: string,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const slot = await createSlotApi(session.idToken, {
    serviceId,
    startDate,
    endDate,
    maxCapacity,
  });
  revalidatePath("/slots");
  return slot;
}

export async function createSlots(
  startDate: string,
  endDate: string,
  maxCapacity: number,
  interval: SlotRepeatInterval,
  serviceId: string,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const slots = await createSlotsApi(
    session.idToken,
    maxCapacity,
    startDate,
    endDate,
    interval,
    serviceId,
  );
  revalidatePath("/slots");
  return slots;
}

export async function getSlots(startDate: string, endDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const slots = await getSlotsApi(session.idToken, startDate, endDate);
  return slots;
}

export async function updateSlot(slot: {
  slotId: string;
  serviceId: string;
  maxCapacity: number;
  usedCapacity: number;
  startDate: string;
  endDate: string;
}) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await updateSlotApi(session.idToken, slot);
  revalidatePath("/slots");
  return result;
}

export async function deleteSlot(
  slotId: string,
  startDate: string,
  serviceId: string,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await deleteSlotApi(
    session.idToken,
    slotId,
    startDate,
    serviceId,
  );
  revalidatePath("/slots");
  return result;
}

export async function deleteSlotsAtSameHour(
  startDate: string,
  endDate: string,
  serviceId: string,
  sameHour?: boolean,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await deleteSlotsApi(
    session.idToken,
    startDate,
    addYears(new Date(endDate), 4).toISOString(),
    serviceId,
    sameHour,
  );
  revalidatePath("/slots");
  return result;
}

export async function createBooking(booking: {
  serviceId: string;
  slotId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  additionalInfo?: string;
  startDate: string;
  endDate: string;
  numberOfPerson: number;
}) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await createBookingApi(session.idToken, booking);
  revalidatePath("/slots");
  return result;
}
