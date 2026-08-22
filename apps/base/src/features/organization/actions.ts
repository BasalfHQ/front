"use server";

import { auth, isAdmin } from "@repo/auth-ui";
import {
  getOrganizations as apiGetOrganizations,
  createOrganization as apiCreateOrganization,
  type Organization,
} from "@repo/apis";
import { revalidatePath } from "next/cache";

export async function getOrganizations(): Promise<Organization[]> {
  const session = await auth();

  if (!session?.idToken || !isAdmin(session.user?.email)) {
    return [];
  }

  return apiGetOrganizations(session.idToken);
}

export async function createOrganization(
  name: string,
  timezone: string,
): Promise<{ success: boolean; organization?: Organization; error?: string }> {
  const session = await auth();

  if (!session?.idToken || !isAdmin(session.user?.email)) {
    return { success: false, error: "Unauthorized" };
  }

  const org = await apiCreateOrganization(name, timezone, session.idToken);

  if (org) {
    return { success: true, organization: org };
  }

  revalidatePath("/organization");
  return { success: false, error: "Failed to create organization" };
}
