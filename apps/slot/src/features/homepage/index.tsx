import { PageDescription, PageTitle } from "@repo/ui";
import { getLocale, getTranslations } from "@repo/i18n";
import { getServices, getServiceProviders } from "./actions";
import { ServiceList } from "./service-list";
import { ServiceProviderProfile } from "./service-provider-list";
import { LoginPrompt } from "./login-prompt";
import bookingData from "@repo/esco/data/booking-occupations.json";

export async function Homepage() {
  const [t, services, providers, locale] = await Promise.all([
    getTranslations("homepage"),
    getServices(),
    getServiceProviders(),
    getLocale(),
  ]);

  const isLoggedIn = services !== null && providers !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      {!isLoggedIn ? (
        <LoginPrompt />
      ) : (
        <>
          <ServiceProviderProfile
            provider={providers[0] ?? null}
            categories={bookingData.categories}
            locale={locale}
          />
          <ServiceList services={services} />
        </>
      )}
    </div>
  );
}
