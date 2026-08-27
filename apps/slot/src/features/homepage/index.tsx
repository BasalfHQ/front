import { PageDescription, PageTitle } from "@repo/ui";
import { getTranslations } from "@repo/i18n";
import { getServices } from "./actions";
import { ServiceList } from "./service-list";

export async function Homepage() {
  const [t, services] = await Promise.all([
    getTranslations("homepage"),
    getServices(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      <ServiceList services={services} />
    </div>
  );
}
