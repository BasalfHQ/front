import { MetadataRoute } from "next";
import { Book } from "@repo/apis";

export const dynamic = "force-dynamic";

const BASE_URL = "https://book.basalf.com";

function getLocalePath(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let organizations: Book.Organization[] = [];
  try {
    organizations = await Book.getOrganizations();
  } catch (e) {
    console.error("Failed to fetch organizations for sitemap:", e);
    return [];
  }

  const availableOrgs = organizations.filter((org) => org.isOnBookWebsite);
  const locales = ["en", "fr"];

  const serviceProviderPages = availableOrgs.flatMap((org) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${getLocalePath(locale)}/service-provider/${org.organizationId}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return serviceProviderPages;
}
