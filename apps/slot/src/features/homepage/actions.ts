"use server";

import {
  getServices as getServicesApi,
  createService as createServiceApi,
  deleteService as deleteServiceApi,
  updateService as updateServiceApi,
} from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { redirect } from "@repo/i18n";
import { revalidatePath } from "next/cache";

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
