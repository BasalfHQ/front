import type { Metadata } from "next";
import { setRequestLocale } from "@repo/i18n";
import { ForHubPage, getForHubMetadata } from "@/features/b2b";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getForHubMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForHubPage locale={locale} />;
}
