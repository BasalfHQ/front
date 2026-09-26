import { Book } from "@repo/apis";

// Org blog posts (service-provider pages), fetched through book-mgt-bff.
// Strict locale: a post is served only in the locale it was written in —
// never another translation under a localized URL.
export async function getPost(
  organizationId: string,
  slug: string,
  locale: string,
): Promise<Book.Page | undefined> {
  const pages = await Book.getPages(organizationId);
  if (!pages) return undefined;

  const urlToMatch = slug.startsWith("/") ? slug : `/${slug}`;
  const match = pages.find((p) => p.url === urlToMatch && p.locale === locale);
  if (!match) return undefined;
  return Book.getPage(organizationId, match.pageId);
}

export async function getAllPosts(
  organizationId: string,
  locale?: string,
): Promise<Book.AllPages> {
  const pages = await Book.getPages(organizationId);
  if (!pages) return [];
  if (!locale) return pages;
  return pages.filter((p) => p.locale === locale);
}

// Blog index: one entry per url, preferring the requested locale; posts only
// written in another locale are listed too, flagged isOtherLocale.
export async function getAllPostsWithFallback(
  organizationId: string,
  preferredLocale: string,
): Promise<Array<Book.AllPages[number] & { isOtherLocale: boolean }>> {
  const pages = await Book.getPages(organizationId);
  if (!pages || !Array.isArray(pages)) return [];

  const byUrl = new Map<string, Book.AllPages[number]>();

  for (const page of pages) {
    const existing = byUrl.get(page.url);
    if (!existing) {
      byUrl.set(page.url, page);
    } else if (page.locale === preferredLocale && existing.locale !== preferredLocale) {
      byUrl.set(page.url, page);
    }
  }

  return Array.from(byUrl.values()).map((page) => ({
    ...page,
    isOtherLocale: page.locale !== preferredLocale,
  }));
}
