import { MetadataRoute } from "next";
import { Book } from "@repo/apis";
import { getBaseUrl } from "@/lib/seo";
import { isBlockedOrg } from "@/lib/blocked-orgs";
import {
  absoluteUrl,
  categoryPath,
  folderArticlePath,
  forHubPath,
  getFolderArticles,
  getLiveCategoryIds,
  getLiveOccupationIds,
  occupationPath,
  type Folder,
} from "@/features/b2b";

const BASE_URL = getBaseUrl();
const LOCALES = ["en", "fr"];

function getLocalePath(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

// Same page in every locale where it exists: one entry per locale, all
// sharing the hreflang alternates.
function withAlternates(
  paths: Record<string, string | null>,
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(paths).flatMap(([locale, path]) =>
      path ? [[locale, absoluteUrl(path)]] : [],
    ),
  );
  // No lastModified: the CMS doesn't expose one, and "now" on every crawl
  // teaches search engines to ignore the field.
  return Object.values(languages).map((url) => ({
    url,
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages },
  }));
}

// B2B pages: /for hub, and only live category + occupation pages and
// their articles.
async function getB2bPages(): Promise<MetadataRoute.Sitemap> {
  const live = Object.fromEntries(
    await Promise.all(
      LOCALES.map(
        async (locale) =>
          [
            locale,
            {
              occupations: await getLiveOccupationIds(locale),
              categories: await getLiveCategoryIds(locale),
            },
          ] as const,
      ),
    ),
  );
  const perLocale = (path: (locale: string) => string | null) =>
    Object.fromEntries(LOCALES.map((locale) => [locale, path(locale)]));

  const occupationIds = new Set(
    LOCALES.flatMap((locale) => [...live[locale].occupations]),
  );
  const categoryIds = new Set(
    LOCALES.flatMap((locale) => [...live[locale].categories]),
  );

  // Articles per locale, keyed "{kind}/{folderId}/{articleSlug}".
  type Article = { folder: Folder; slug: string; locales: Set<string> };
  const articles = new Map<string, Article>();
  for (const locale of LOCALES) {
    const folders: Folder[] = [
      ...[...live[locale].occupations].map(
        (id): Folder => ({ kind: "occupation", id }),
      ),
      ...[...live[locale].categories].map(
        (id): Folder => ({ kind: "category", id }),
      ),
    ];
    for (const folder of folders) {
      for (const { slug } of await getFolderArticles(locale, folder)) {
        const key = `${folder.kind}/${folder.id}/${slug}`;
        const article = articles.get(key) ?? {
          folder,
          slug,
          locales: new Set<string>(),
        };
        article.locales.add(locale);
        articles.set(key, article);
      }
    }
  }

  return [
    ...withAlternates(perLocale(forHubPath), 0.9),
    ...[...categoryIds].flatMap((id) =>
      withAlternates(
        perLocale((locale) =>
          live[locale].categories.has(id) ? categoryPath(locale, id) : null,
        ),
        0.9,
      ),
    ),
    ...[...occupationIds].flatMap((id) =>
      withAlternates(
        perLocale((locale) =>
          live[locale].occupations.has(id) ? occupationPath(locale, id) : null,
        ),
        0.9,
      ),
    ),
    ...[...articles.values()].flatMap(({ folder, slug, locales }) =>
      withAlternates(
        perLocale((locale) =>
          locales.has(locale) ? folderArticlePath(locale, folder, slug) : null,
        ),
        0.7,
      ),
    ),
  ];
}

// Every indexable URL of the app, in Next's sitemap format.
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const b2bPages = await getB2bPages();

  let organizations: Book.Organization[] = [];
  try {
    organizations = await Book.getOrganizations();
  } catch {
    return b2bPages;
  }

  const availableOrgs = organizations.filter(
    (org) => org.isOnBookWebsite && !isBlockedOrg(org.organizationId),
  );

  const serviceProviderPages = availableOrgs.flatMap((org) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}${getLocalePath(locale)}/service-provider/${org.organizationId}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  const blogData = await Promise.all(
    availableOrgs.map(async (org) => {
      try {
        const pages = await Book.getPages(org.organizationId);
        if (!pages || pages.length === 0) return { orgId: org.organizationId, pages: [] };
        return { orgId: org.organizationId, pages };
      } catch {
        return { orgId: org.organizationId, pages: [] };
      }
    }),
  );

  const blogIndexPages = blogData
    .filter((data) => data.pages.length > 0)
    .flatMap((data) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}${getLocalePath(locale)}/service-provider/${data.orgId}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );

  const blogArticlePages = blogData.flatMap((data) =>
    // Posts are served strictly in the locale they were written in: only
    // that locale's URL is indexable.
    data.pages.map((page) => ({
      url: `${BASE_URL}${getLocalePath(page.locale)}/service-provider/${data.orgId}/blog${page.url}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [
    ...b2bPages,
    ...serviceProviderPages,
    ...blogIndexPages,
    ...blogArticlePages,
  ];
}
