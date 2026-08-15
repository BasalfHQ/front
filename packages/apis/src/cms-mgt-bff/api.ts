import { AllPages, client, Locales, Page, Website } from ".";
import { headers } from "../utils";

export async function getPages(idToken: string): Promise<AllPages> {
  const response = await client.GET("/page", {
    headers: headers({ idToken }),
  });
  return response.data ?? [];
}

export async function getPage(
  pageId: string,
  idToken: string,
): Promise<Page | null> {
  const response = await client.GET("/page/{pageId}", {
    params: { path: { pageId } },
    headers: headers({ idToken }),
  });
  return response.data ?? null;
}

export async function createPage(
  page: Omit<Page, "pageId" | "organizationId" | "websiteId">,
  idToken: string,
): Promise<Page | null> {
  const response = await client.POST("/page", {
    headers: headers({ idToken }),
    body: page,
  });
  return response.data ?? null;
}

export async function updatePage(page: Page, idToken: string) {
  const response = await client.PATCH(`/page/{pageId}`, {
    params: {
      path: {
        pageId: page.pageId,
      },
    },
    headers: headers({ idToken }),
    body: page,
  });
  if (response.response.status !== 200) {
    throw new Error(response.data?.message ?? "Failed to update page");
  }
  return null;
}

export async function deletePage(pageId: string, idToken: string) {
  const response = await client.DELETE(`/page/{pageId}`, {
    params: {
      path: {
        pageId,
      },
    },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error(response.data?.message ?? "Failed to delete page");
  }
  return null;
}

export async function getWebsites(idToken: string): Promise<Website[]> {
  const response = await client.GET("/website", {
    headers: headers({ idToken }),
  });
  return response.data ?? [];
}

export async function getLocales(idToken: string): Promise<Locales> {
  const response = await client.GET("/locales", {
    headers: headers({ idToken }),
  });
  return response.data || [];
}

export async function updateLocales(locales: Locales, idToken: string) {
  const response = await client.POST("/locales", {
    headers: headers({ idToken }),
    body: locales,
  });
  if (response.response.status > 201) {
    console.error(response);
    console.error("Error updating locales", response.data);
    throw new Error(response.data?.message ?? "Failed to update locales");
  }
}

export async function getToken(idToken: string) {
  const response = await client.GET("/token", {
    headers: headers({ idToken }),
  });
  return response.data ?? null;
}
