"use server";

import { getUploadUrl, getDomainAvailability, changeDomain as changeDomainApi } from "@repo/apis";
import { getSession } from "@repo/auth-ui";

export async function getSignedUrl(domainId: string | undefined) {
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  const uploadUrl = await getUploadUrl(session.idToken, domainId);
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
  const domainAvailability = await getDomainAvailability(
    domain,
    session.idToken,
  );
  return domainAvailability;
}

export async function changeDomain(baseDomain: string, newDomain: string) {
  const session = await getSession();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await changeDomainApi(baseDomain, newDomain, session.idToken);
}
