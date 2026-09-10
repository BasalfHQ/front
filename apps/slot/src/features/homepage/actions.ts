"use server";

import { File, Slot } from "@repo/apis";
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

export async function createService(
  name: string,
  description?: string,
  price?: number,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const result = await Slot.createService(
    session.idToken,
    name,
    description,
    price,
  );
  revalidatePath("/");
  return result;
}

export async function updateService(
  serviceId: string,
  name: string,
  description?: string,
  price?: number,
) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  await Slot.updateService(session.idToken, serviceId, name, description, price);
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

export async function getServiceProviderPicture(serviceProviderId: string) {
  const session = await getSession();
  if (!session || !session.idToken || !session.user.currentOrganization) {
    return null;
  }
  const files = await File.getFiles(session.idToken);
  const fileId = File.serviceProviderPictureKey(serviceProviderId);
  console.log(
    "[getServiceProviderPicture]",
    "fileId:", fileId,
    "files:", files.map((f) => ({ fileId: f.fileId, key: f.key, status: f.status })),
  );
  const file = files.find((f) => f.fileId === fileId && f.status === "uploaded");
  if (!file) {
    console.log("[getServiceProviderPicture] no uploaded file matching fileId", fileId);
    return null;
  }
  const url = File.publicFileUrl(session.user.currentOrganization, fileId);
  console.log("[getServiceProviderPicture] found", { fileId: file.fileId, url });
  return { fileId: file.fileId, url };
}

export async function getFileUploadUrl(input: {
  name: string;
  size: number;
  contentType?: string;
  key?: string;
}) {
  console.log("[getFileUploadUrl] request", input);
  const session = await getSession();
  if (!session || !session.idToken) {
    console.log("[getFileUploadUrl] no session/idToken");
    return null;
  }
  const result = await File.getUploadUrl(
    input.name,
    input.size,
    session.idToken,
    input.contentType,
    input.key,
  );
  console.log("[getFileUploadUrl] result", result);
  return result;
}

export async function deleteServiceProviderPicture(
  fileId: string,
): Promise<boolean> {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }
  const deleted = await File.deleteFile(fileId, session.idToken);
  if (deleted) {
    revalidatePath("/");
  }
  return deleted;
}
