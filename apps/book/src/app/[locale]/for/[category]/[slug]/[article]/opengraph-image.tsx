import { renderOgImage, ogImageSize } from "@/features/b2b/og-image";
import { getOccupationArticle } from "@/features/b2b/content";
import { getOccupationIdBySlug } from "@/lib/occupation-slug";

export const size = ogImageSize;
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; slug: string; article: string }>;
};

export default async function Image({ params }: Props) {
  const { locale, slug, article } = await params;
  const id = getOccupationIdBySlug(locale, slug);
  const page = id ? await getOccupationArticle(locale, id, article) : null;
  return renderOgImage(locale, page?.seo.title ?? "Book");
}
