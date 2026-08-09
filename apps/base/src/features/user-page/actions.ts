"use server";

import { client, User } from "@repo/apis";
import { getAuthHeaders, auth } from "@repo/auth-ui";
import { revalidatePath } from "next/cache";

export async function getUsers(): Promise<User[]> {
  const session = await auth();
  if (!session) {
    return [];
  }

  const { data, error } = await client.GET("/user", {
    headers: getAuthHeaders(session),
  });

  if (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }

  return data ?? [];
}

export async function createUser(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "notAuthenticated" };
  }

  const mail = formData.get("mail") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!mail || !firstName || !lastName) {
    return { success: false, error: "allFieldsRequired" };
  }

  const { error } = await client.POST("/user", {
    headers: getAuthHeaders(session),
    body: { mail, firstName, lastName },
  });

  if (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "createFailed" };
  }

  revalidatePath("/users");
  return { success: true };
}

export async function deleteUser(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "notAuthenticated" };
  }

  const { error } = await client.DELETE("/user/{userId}", {
    headers: getAuthHeaders(session),
    params: { path: { userId } },
  });

  if (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "deleteFailed" };
  }

  revalidatePath("/users");
  return { success: true };
}
