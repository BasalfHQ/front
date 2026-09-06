"use server";

import { Cms } from "@repo/apis";
import { auth } from "@repo/auth-ui";
import { revalidatePath } from "next/cache";

export async function updatePage(page: Cms.Page) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await Cms.updatePage(page, session.idToken);
  revalidatePath("/pages");
  revalidatePath(`/pages/${page.pageId}`);
}

export async function deletePage(pageId: string) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await Cms.deletePage(pageId, session.idToken);
  revalidatePath("/pages");
}
