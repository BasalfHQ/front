"use server";

import {
  getServices as getServicesApi,
  createService as createServiceApi,
  deleteService as deleteServiceApi,
  updateService as updateServiceApi,
  getServiceProviders as getServiceProvidersApi,
  createServiceProvider as createServiceProviderApi,
  updateServiceProvider as updateServiceProviderApi,
  deleteServiceProvider as deleteServiceProviderApi,
} from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { getLocale, redirect } from "@repo/i18n";
import { revalidatePath } from "next/cache";

export async function getServices() {
  const session = await getSession();
  if (!session || !session.idToken) {
    return null;
  }
  return await getServicesApi(session.idToken);
}

export async function createService(name: string, description?: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await createServiceApi(session.idToken, name, description);
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
  await updateServiceApi(session.idToken, serviceId, name, description);
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

export async function getServiceProviders() {
  const session = await getSession();
  if (!session || !session.idToken) {
    return null;
  }
  return await getServiceProvidersApi(session.idToken);
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
  const result = await createServiceProviderApi(session.idToken, body);
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
  await updateServiceProviderApi(session.idToken, serviceProviderId, body);
  revalidatePath("/");
}

export async function deleteServiceProvider(serviceProviderId: string) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await deleteServiceProviderApi(session.idToken, serviceProviderId);
  revalidatePath("/");
}
