import "server-only";
import type { Metadata } from "next";
import { getPageBySlug } from "./pages";

export type GetPageMetadataOptions = {
  /** Absolute image URL for openGraph/twitter cards. */
  image?: string;
};

export async function getPageMetadata(
  slug: string,
  locale: string,
  options: GetPageMetadataOptions = {},
): Promise<Metadata> {
  const page = await getPageBySlug(slug, locale);
  if (!page) return {};

  const { image } = options;

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
      images: image ? [image] : undefined,
    },
  };
}
