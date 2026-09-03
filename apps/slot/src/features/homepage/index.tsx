import { PageDescription, PageTitle } from "@repo/ui";
import { getTranslations, getLocale } from "@repo/i18n";
import { getServices } from "./actions";
import { ServiceList } from "./service-list";
import { LoginPrompt } from "./login-prompt";

export async function Homepage() {
  const [t, services, locale] = await Promise.all([
    getTranslations("homepage"),
    getServices(),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      {services === null ? (
        <LoginPrompt />
      ) : (
        <ServiceList services={services} locale={locale} />
      )}
    </div>
  );
}
