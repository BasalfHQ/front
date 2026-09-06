"use server";

import { Slot } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import { revalidatePath } from "next/cache";

export async function getServices() {
  const session = await getSession();
  if (!session || !session.idToken) {
    return null;
  }
  return await Slot.getServices(session.idToken);
}

export async function createService(name: string, description?: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await Slot.createService(session.idToken, name, description);
  revalidatePath("/");
  return result;
}

export async function updateService(
  serviceId: string,
  name: string,
  description?: string,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await Slot.updateService(session.idToken, serviceId, name, description);
  revalidatePath("/");
}

export async function deleteService(serviceId: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await Slot.deleteService(session.idToken, serviceId);
  revalidatePath("/");
}

export async function getServiceProviders() {
  const session = await getSession();
  if (!session || !session.idToken) {
    return null;
  }
  return await Slot.getServiceProviders(session.idToken);
}

export async function createServiceProvider(body: {
  firstName: string;
  lastName: string;
  occupationId: string;
  email?: string;
  description?: string;
}) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await Slot.createServiceProvider(session.idToken, body);
  revalidatePath("/");
  return result;
}

export async function updateServiceProvider(
  serviceProviderId: string,
  body: {
    firstName: string;
    lastName: string;
    occupationId: string;
    email?: string;
    description?: string;
  },
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await Slot.updateServiceProvider(session.idToken, serviceProviderId, body);
  revalidatePath("/");
}

export async function deleteServiceProvider(serviceProviderId: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await Slot.deleteServiceProvider(session.idToken, serviceProviderId);
  revalidatePath("/");
}
