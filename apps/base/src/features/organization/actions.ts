"use server";

import { auth, isAdmin } from "@repo/auth-ui";
import {
  getOrganizations as apiGetOrganizations,
  createOrganization as apiCreateOrganization,
  updateOrganization as apiUpdateOrganization,
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
  email: string,
  language: string,
): Promise<{ success: boolean; organization?: Organization; error?: string }> {
  const session = await auth();

  if (!session?.idToken || !isAdmin(session.user?.email)) {
    return { success: false, error: "Unauthorized" };
  }

  const org = await apiCreateOrganization(
    name,
    timezone,
    email,
    language,
    session.idToken,
  );

  if (org) {
    revalidatePath("/organization");
    return { success: true, organization: org };
  }

  return { success: false, error: "Failed to create organization" };
}

export async function updateOrganization(
  organization: Organization,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();

  if (!session?.idToken || !isAdmin(session.user?.email)) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await apiUpdateOrganization(organization, session.idToken);

  if (result) {
    revalidatePath("/organization");
    return { success: true };
  }

  return { success: false, error: "Failed to update organization" };
}
