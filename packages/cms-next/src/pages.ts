import "server-only";
import type { AllPages, Page } from "@basalf/cms";
import { getClient } from "./client";

export async function getAllPages(locale?: string): Promise<AllPages> {
  const client = getClient();
  const pages = await client.getPages();
  if (!locale) return pages;
  return pages.filter((p) => p.locale === locale);
}

export async function getPageBySlug(
  slug: string,
  locale: string,
): Promise<Page | undefined> {
  const client = getClient();
  const pages = await client.getPages();

  const urlToMatch = slug.startsWith("/") ? slug : `/${slug}`;

  let match = pages.find((p) => p.url === urlToMatch && p.locale === locale);
  if (!match) {
    match = pages.find((p) => p.url === urlToMatch);
  }
  if (!match) return undefined;

  return client.getPage(match.pageId);
}
