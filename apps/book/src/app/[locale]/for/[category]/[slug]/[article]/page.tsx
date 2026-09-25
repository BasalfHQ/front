import type { Metadata } from "next";
import { setRequestLocale } from "@repo/i18n";
import {
  OccupationArticlePage,
  getOccupationArticleMetadata,
} from "@/features/b2b";

type Props = {
  params: Promise<{
    locale: string;
    category: string;
    slug: string;
    article: string;
  }>;
};

// Rendered on first request, then cached and revalidated (ISR).
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, article } = await params;
  return getOccupationArticleMetadata(locale, slug, article);
}

export default async function Page({ params }: Props) {
  const { locale, category, slug, article } = await params;
  setRequestLocale(locale);
  return (
    <OccupationArticlePage
      locale={locale}
      category={category}
      slug={slug}
      articleSlug={article}
    />
  );
}
