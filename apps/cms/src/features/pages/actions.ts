"use server";

import { auth } from "@repo/auth-ui";
import { Cms } from "@repo/apis";
import { revalidatePath } from "next/cache";

export async function updateLocales(locales: Cms.Locales) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await Cms.updateLocales(locales, session.idToken).catch((error) => {
    console.error("Error updating locales", error);
    throw new Error(error.message);
  });
  revalidatePath("/");
}
