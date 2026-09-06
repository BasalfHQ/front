import { MetadataRoute } from "next";
import { Book } from "@repo/apis";
import { getBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const BASE_URL = getBaseUrl();
const LOCALES = ["en", "fr"];

function getLocalePath(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let organizations: Book.Organization[] = [];
  try {
    organizations = await Book.getOrganizations();
  } catch {
    return [];
  }

  const availableOrgs = organizations.filter((org) => org.isOnBookWebsite);

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
    data.pages.flatMap((page) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}${getLocalePath(locale)}/service-provider/${data.orgId}/blog${page.url}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
  );

  return [...serviceProviderPages, ...blogIndexPages, ...blogArticlePages];
}
