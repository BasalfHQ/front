import {
  renderOgImage,
  ogImageSize,
  getCategoryChildOgTitle,
} from "@/features/b2b/og-image";

export const size = ogImageSize;
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};

export default async function Image({ params }: Props) {
  const { locale, category, slug } = await params;
  return renderOgImage(
    locale,
    await getCategoryChildOgTitle(locale, category, slug),
  );
}
