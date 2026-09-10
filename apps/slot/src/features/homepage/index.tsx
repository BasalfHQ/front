import { PageDescription, PageTitle } from "@repo/ui";
import { Button } from "@repo/ui/button";
import { getLocale, getTranslations } from "@repo/i18n";
import {
  getServices,
  getServiceProviders,
  getServiceProviderPicture,
} from "./actions";
import { ServiceList } from "./service-list";
import { ServiceProviderProfile } from "./service-provider-list";
import { LoginPrompt } from "./login-prompt";
import bookingData from "@repo/esco/data/booking-occupations.json";
import Link from "next/link";

export async function Homepage() {
  const [t, services, providers, locale] = await Promise.all([
    getTranslations("homepage"),
    getServices(),
    getServiceProviders(),
    getLocale(),
  ]);

  const isLoggedIn = services !== null && providers !== null;
  const provider = isLoggedIn ? (providers[0] ?? null) : null;
  const picture = provider
    ? await getServiceProviderPicture(provider.serviceProviderId)
    : null;

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
            provider={provider}
            picture={picture}
            categories={bookingData.categories}
            locale={locale}
          />
          <ServiceList services={services} />
          <div>
            <Button variant="outline" asChild className="max-w-md w-full">
              <Link href="/calendar">{t("calendarSubscription")}</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
