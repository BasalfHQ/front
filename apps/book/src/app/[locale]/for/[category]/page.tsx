import type { Metadata } from "next";
import { setRequestLocale } from "@repo/i18n";
import { CategoryPage, getCategoryMetadata } from "@/features/b2b";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

// Rendered on first request, then cached and revalidated (ISR).
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  return getCategoryMetadata(locale, category);
}

export default async function Page({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  return <CategoryPage locale={locale} slug={category} />;
}
