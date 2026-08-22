"use server";

import {
  createSlot as createSlotApi,
  getSlots as getSlotsApi,
  createSlots as createSlotsApi,
  updateSlot as updateSlotApi,
  deleteSlot as deleteSlotApi,
  deleteSlots as deleteSlotsApi,
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
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const slot = await createSlotApi(session.idToken, {
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

export async function deleteSlot(slotId: string, startDate: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await deleteSlotApi(session.idToken, slotId, startDate);
  revalidatePath("/slots");
  return result;
}

export async function deleteSlotsAtSameHour(
  startDate: string,
  endDate: string,
  sameHour: boolean,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await deleteSlotsApi(
    session.idToken,
    startDate,
    addYears(new Date(endDate), 4).toISOString(),
    sameHour,
  );
  revalidatePath("/slots");
  return result;
}
