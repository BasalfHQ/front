import { createPage as createPageApi, Page } from "@repo/apis";
import { auth } from "@repo/auth-ui";

export async function createPage(page: Page) {
  const session = await auth();
  if (!session || !session.idToken) {
    throw new Error("Unauthorized");
  }
  const newPage = await createPageApi(page, session.idToken).catch((error) => {
    console.error(error);
    throw new Error("Failed to create page");
  });
  return newPage;
}
