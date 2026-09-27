"use server";

import { auth, getCognito } from "@repo/auth-ui";

export type ChangePasswordError =
  | "notAuthenticated"
  | "allFieldsRequired"
  | "passwordMismatch"
  | "wrongCurrentPassword"
  | "invalidNewPassword"
  | "tooManyAttempts"
  | "changeFailed";

const ERROR_BY_COGNITO_NAME: Record<string, ChangePasswordError> = {
  NotAuthorizedException: "wrongCurrentPassword",
  InvalidPasswordException: "invalidNewPassword",
  InvalidParameterException: "invalidNewPassword",
  LimitExceededException: "tooManyAttempts",
  TooManyRequestsException: "tooManyAttempts",
};

export async function changePassword(
  formData: FormData,
): Promise<{ success: boolean; error?: ChangePasswordError }> {
  const session = await auth();
  if (!session?.accessToken) {
    return { success: false, error: "notAuthenticated" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "allFieldsRequired" };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "passwordMismatch" };
  }

  try {
    await getCognito().changePassword({
      currentPassword,
      newPassword,
      accessToken: session.accessToken,
    });
    return { success: true };
  } catch (error) {
    const name = (error as Error | undefined)?.name ?? "";
    if (!ERROR_BY_COGNITO_NAME[name]) {
      console.error("Failed to change password:", error);
    }
    return { success: false, error: ERROR_BY_COGNITO_NAME[name] ?? "changeFailed" };
  }
}
