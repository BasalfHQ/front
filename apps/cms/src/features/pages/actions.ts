"use server";

import { auth } from "@repo/auth-ui";
import { Locales, updateLocales as updateLocalesApi } from "@repo/apis";

export async function updateLocales(locales: Locales) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await updateLocalesApi(locales, session.idToken).catch((error) => {
    console.error("Error updating locales", error);
    throw new Error(error.message);
  });
}
