import type { Metadata } from "next";
import { setRequestLocale } from "@repo/i18n";
import { CategoryChildPage, getCategoryChildMetadata } from "@/features/b2b";

// {slug}: an occupation of the category, else an article of the category.
type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};

// Rendered on first request, then cached and revalidated (ISR).
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  return getCategoryChildMetadata(locale, category, slug);
}

export default async function Page({ params }: Props) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  return <CategoryChildPage locale={locale} category={category} slug={slug} />;
}
