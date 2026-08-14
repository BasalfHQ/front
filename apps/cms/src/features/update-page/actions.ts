"use server";

import {
  updatePage as updatePageApi,
  deletePage as deletePageApi,
  Page,
} from "@repo/apis";
import { auth } from "@repo/auth-ui";
import { revalidatePath } from "next/cache";

export async function updatePage(page: Page) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await updatePageApi(page, session.idToken);
  revalidatePath("/pages");
  revalidatePath(`/pages/${page.pageId}`);
}

export async function deletePage(pageId: string) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  await deletePageApi(pageId, session.idToken);
  revalidatePath("/pages");
}
