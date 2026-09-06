"use server";

import { Host } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { revalidatePath } from "next/cache";

export async function getSignedUrl(domainId: string | undefined) {
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  const uploadUrl = await Host.getUploadUrl(session.idToken, domainId);
  if (!uploadUrl) {
    throw new Error("Failed to get upload url");
  }
  return uploadUrl;
}

export async function checkDomainAvailability(domain: string) {
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  const domainAvailability = await Host.getDomainAvailability(
    domain,
    session.idToken,
  );
  return domainAvailability;
}

export async function changeDomain(baseDomain?: string, newDomain?: string) {
  if (!baseDomain || !newDomain) {
    throw new Error("Domains are required");
  }
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await Host.changeDomain(baseDomain, newDomain, session.idToken);
  revalidatePath("/");
}

export async function deleteDeployment() {
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await Host.deleteDeployment(session.idToken);
  revalidatePath("/");
}
