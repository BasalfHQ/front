"use server";

import { readFile } from "fs/promises";
import { join } from "path";
import {
  getServices as getServicesApi,
  createService as createServiceApi,
  deleteService as deleteServiceApi,
  updateService as updateServiceApi,
} from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import { revalidatePath } from "next/cache";

export interface BookingOccupation {
  id: string;
  labels: Record<string, string>;
}

export interface BookingCategory {
  id: string;
  labels: Record<string, string>;
  occupations: BookingOccupation[];
}

export interface BookingData {
  categories: BookingCategory[];
}

export async function getBookingOccupations(): Promise<BookingData> {
  const dir = join(process.cwd(), "public/esco");
  const raw = await readFile(
    join(dir, "booking-occupations.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export async function getServices() {
  const session = await getSession();
  if (!session || !session.idToken) {
    return null;
  }
  return await getServicesApi(session.idToken);
}

export async function createService(name: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await createServiceApi(session.idToken, name);
  revalidatePath("/");
  return result;
}

export async function updateService(serviceId: string, name: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await updateServiceApi(session.idToken, serviceId, name);
  revalidatePath("/");
}

export async function deleteService(serviceId: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await deleteServiceApi(session.idToken, serviceId);
  revalidatePath("/");
}
