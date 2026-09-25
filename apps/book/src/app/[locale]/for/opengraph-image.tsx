import { getTranslations } from "@repo/i18n";
import { renderOgImage, ogImageSize } from "@/features/b2b/og-image";

export const size = ogImageSize;
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string }> };

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b" });
  return renderOgImage(locale, t("hub.title"));
}
