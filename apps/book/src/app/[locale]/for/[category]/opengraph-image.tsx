import { renderOgImage, ogImageSize, getCategoryOgTitle } from "@/features/b2b/og-image";

export const size = ogImageSize;
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string; category: string }> };

export default async function Image({ params }: Props) {
  const { locale, category } = await params;
  return renderOgImage(locale, await getCategoryOgTitle(locale, category));
}
