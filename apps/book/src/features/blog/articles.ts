import { Book } from "@repo/apis";

export async function getArticle(
  organizationId: string,
  slug: string,
  locale: string,
): Promise<Book.Page | undefined> {
  const pages = await Book.getPages(organizationId);
  if (!pages) return undefined;

  const urlToMatch = slug.startsWith("/") ? slug : `/${slug}`;

  // Try to find in requested locale first
  let match = pages.find((p) => p.url === urlToMatch && p.locale === locale);

  // Fallback to any locale if not found
  if (!match) {
    match = pages.find((p) => p.url === urlToMatch);
  }

  if (!match) return undefined;
  return Book.getPage(organizationId, match.pageId);
}

export async function getAllArticles(
  organizationId: string,
  locale?: string,
): Promise<Book.AllPages> {
  const pages = await Book.getPages(organizationId);
  if (!pages) return [];
  if (!locale) return pages;
  return pages.filter((p) => p.locale === locale);
}

export async function getAllArticlesWithFallback(
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
