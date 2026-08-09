import { CreatePage } from "@/features/create-page";
import { getTranslations } from "@repo/i18n";

export default CreatePage;

export async function generateMetadata() {
  const [t] = await Promise.all([getTranslations("createPage")]);
  return {
    title: t("title"),
  };
}
