import type { Metadata } from "next";
import { routing } from "@repo/i18n";
import { getB2bTranslations } from "./pricing";
import {
  getCategoryIdBySlug,
  getOccupationIdBySlug,
} from "@/lib/occupation-slug";
import {
  getFolderArticleSummary,
  getFolderContent,
  getLiveFolderLocales,
  isCategoryArticleSlug,
} from "./content";
import { folderArticlePath, folderPath, type Folder } from "./folder";
import { absoluteUrl, forHubPath } from "./paths";

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

// Landing page of a folder (occupation or category).
async function getFolderMetadata(
  locale: string,
  folder: Folder,
): Promise<Metadata> {
  const content = await getFolderContent(locale, folder);
  if (!content) return {};

  const liveLocales = await getLiveFolderLocales(folder, routing.locales);
  return pageMetadata({
    locale,
    title: content.seo.title,
    description: content.seo.description,
    paths: Object.fromEntries(
      liveLocales.map((l) => [l, folderPath(l, folder) ?? undefined]),
    ),
  });
}

// /for/{category}
export async function getCategoryMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const categoryId = getCategoryIdBySlug(locale, slug);
  return categoryId
    ? getFolderMetadata(locale, { kind: "category", id: categoryId })
    : {};
}

// /for/{category}/{slug}: occupation first, else category article (same
// dispatch as the page; redirects are left to the page).
export async function getCategoryChildMetadata(
  locale: string,
  category: string,
  slug: string,
): Promise<Metadata> {
  const occupationId = getOccupationIdBySlug(locale, slug);
  if (occupationId) {
    return getFolderMetadata(locale, { kind: "occupation", id: occupationId });
  }

  const categoryId = getCategoryIdBySlug(locale, category);
  if (!categoryId || !isCategoryArticleSlug(slug)) return {};
  return articleMetadata(locale, { kind: "category", id: categoryId }, slug);
}

// /for/{category}/{occupation}/{article}
export async function getOccupationArticleMetadata(
  locale: string,
  slug: string,
  articleSlug: string,
): Promise<Metadata> {
  const occupationId = getOccupationIdBySlug(locale, slug);
  return occupationId
    ? articleMetadata(locale, { kind: "occupation", id: occupationId }, articleSlug)
    : {};
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

// Article of a folder. Summaries only: no full page fetched in any locale.
async function articleMetadata(
  locale: string,
  folder: Folder,
  articleSlug: string,
): Promise<Metadata> {
  const translations = await Promise.all(
    routing.locales.map(async (l) => {
      const summary = await getFolderArticleSummary(l, folder, articleSlug);
      return summary
        ? { summary, path: folderArticlePath(l, folder, articleSlug) }
        : null;
    }),
  );
  const current = translations[routing.locales.indexOf(locale as never)];
  if (!current) return {};

  const schema = current.summary.seo.schemas.find((s) => s.type === "article");
  const metadata = pageMetadata({
    locale,
    title: current.summary.seo.title,
    description: current.summary.seo.description,
    paths: Object.fromEntries(
      routing.locales.map((l, i) => [l, translations[i]?.path ?? undefined]),
    ),
  });
  return {
    ...metadata,
    keywords: current.summary.seo.keywords,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      ...(schema?.type === "article" && { publishedTime: schema.date }),
    },
  };
}
