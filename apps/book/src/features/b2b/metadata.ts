import type { Metadata } from "next";
import type { CmsPage } from "@basalf/cms-next";
import { routing } from "@repo/i18n";
import { getB2bTranslations } from "./pricing";
import {
  getCategoryIdBySlug,
  getOccupationIdBySlug,
} from "@/lib/occupation-slug";
import {
  getCategoryArticle,
  getCategoryContent,
  getLiveLocales,
  getOccupationArticle,
  getOccupationContent,
  isCategoryArticleSlug,
} from "./content";
import {
  absoluteUrl,
  articlePath,
  categoryArticlePath,
  categoryPath,
  forHubPath,
  occupationPath,
} from "./paths";

// Canonical + hreflang alternates from the path of the page in each locale
// where it is live (slugs differ per locale).
function pageMetadata({
  locale,
  title,
  description,
  paths,
}: {
  locale: string;
  title: string;
  description: string;
  paths: Partial<Record<string, string>>;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const [pathLocale, path] of Object.entries(paths)) {
    if (path) languages[pathLocale] = absoluteUrl(path);
  }
  const defaultUrl = languages[routing.defaultLocale];
  if (defaultUrl) languages["x-default"] = defaultUrl;
  const url = languages[locale];

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      locale,
      type: "website",
      siteName: "Book",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function eachLocale(path: (locale: string) => string | null) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, path(locale) ?? undefined]),
  );
}

async function getOccupationMetadata(
  locale: string,
  occupationId: string,
): Promise<Metadata> {
  const content = await getOccupationContent(locale, occupationId);
  if (!content) return {};

  const liveLocales = await getLiveLocales(
    "occupation",
    occupationId,
    routing.locales,
  );
  return pageMetadata({
    locale,
    title: content.seo.title,
    description: content.seo.description,
    paths: Object.fromEntries(
      liveLocales.map((l) => [l, occupationPath(l, occupationId) ?? undefined]),
    ),
  });
}

// /for/{category}
export async function getCategoryMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const categoryId = getCategoryIdBySlug(locale, slug);
  const content = categoryId
    ? await getCategoryContent(locale, categoryId)
    : null;
  if (!categoryId || !content) return {};

  const liveLocales = await getLiveLocales(
    "category",
    categoryId,
    routing.locales,
  );
  return pageMetadata({
    locale,
    title: content.seo.title,
    description: content.seo.description,
    paths: Object.fromEntries(
      liveLocales.map((l) => [l, categoryPath(l, categoryId) ?? undefined]),
    ),
  });
}

// /for/{category}/{slug}: occupation first, else category article (same
// dispatch as the page; redirects are left to the page).
export async function getCategoryChildMetadata(
  locale: string,
  category: string,
  slug: string,
): Promise<Metadata> {
  const occupationId = getOccupationIdBySlug(locale, slug);
  if (occupationId) return getOccupationMetadata(locale, occupationId);

  const categoryId = getCategoryIdBySlug(locale, category);
  if (!categoryId || !isCategoryArticleSlug(slug)) return {};
  return articleMetadata(locale, (l) =>
    getCategoryArticle(l, categoryId, slug).then((page) =>
      page ? { page, path: categoryArticlePath(l, categoryId, slug) } : null,
    ),
  );
}

// /for/{category}/{occupation}/{article}
export async function getOccupationArticleMetadata(
  locale: string,
  slug: string,
  articleSlug: string,
): Promise<Metadata> {
  const occupationId = getOccupationIdBySlug(locale, slug);
  if (!occupationId) return {};
  return articleMetadata(locale, (l) =>
    getOccupationArticle(l, occupationId, articleSlug).then((page) =>
      page ? { page, path: articlePath(l, occupationId, articleSlug) } : null,
    ),
  );
}

export async function getForHubMetadata(locale: string): Promise<Metadata> {
  const t = await getB2bTranslations(locale, "b2b.hub");
  return pageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    paths: eachLocale(forHubPath),
  });
}

// `find`: the article and its path in a locale, null where it isn't live.
async function articleMetadata(
  locale: string,
  find: (locale: string) => Promise<{ page: CmsPage; path: string | null } | null>,
): Promise<Metadata> {
  const translations = await Promise.all(routing.locales.map(find));
  const page = translations[routing.locales.indexOf(locale as never)]?.page;
  if (!page) return {};

  const schema = page.seo.schemas.find((s) => s.type === "article");
  const metadata = pageMetadata({
    locale,
    title: page.seo.title,
    description: page.seo.description,
    paths: Object.fromEntries(
      routing.locales.map((l, i) => [l, translations[i]?.path ?? undefined]),
    ),
  });
  return {
    ...metadata,
    keywords: page.seo.keywords,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      ...(schema?.type === "article" && { publishedTime: schema.date }),
    },
  };
}
