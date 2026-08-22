import { PageDescription, PageTitle } from "@repo/ui";
import { getTranslations } from "@repo/i18n";

export async function Homepage() {
  const t = await getTranslations("homepage");
  return (
    <div className="flex flex-col gap-1">
      <PageTitle>{t("title")}</PageTitle>
      <PageDescription>{t("description")}</PageDescription>
    </div>
  );
}
