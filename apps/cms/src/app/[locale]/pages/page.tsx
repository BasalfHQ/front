import { Pages } from "@/features/pages";
import { getTranslations } from "@repo/i18n";

export default Pages;

export async function generateMetadata() {
  const [t] = await Promise.all([getTranslations("pages")]);
  return {
    title: t("title"),
  };
}
