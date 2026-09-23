import { PageDescription, PageTitle } from "@repo/ui";
import { Button } from "@repo/ui/button";
import { getLocale, getTranslations } from "@repo/i18n";
import { getSession } from "@repo/auth-ui";
import {
  getServices,
  getServiceProviders,
  getServiceProviderPicture,
} from "./actions";
import { ServiceList } from "./service-list";
import { ServiceProviderProfile } from "./service-provider-list";
import { LoginPrompt } from "./login-prompt";
import { BookPageStatus } from "./book-page-status";
import bookingData from "@repo/esco/data/booking-occupations.json";
import Link from "next/link";

export async function Homepage() {
  const [t, services, providers, locale, session] = await Promise.all([
    getTranslations("homepage"),
    getServices(),
    getServiceProviders(),
    getLocale(),
    getSession(),
  ]);

  const isLoggedIn = services !== null && providers !== null;
  const provider = isLoggedIn ? (providers[0] ?? null) : null;
  const picture = provider
    ? await getServiceProviderPicture(provider.serviceProviderId)
    : null;
  const orgId = session?.user?.currentOrganization;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      {!isLoggedIn ? (
        <LoginPrompt />
      ) : (
        // col-reverse on mobile puts BookPageStatus (last in DOM) first,
        // right below the description; row on desktop puts it on the right
        // instead, without duplicating the component for each breakpoint.
        <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-6">
          <div className="flex flex-1 flex-col gap-6">
            <ServiceProviderProfile
              provider={provider}
              picture={picture}
              categories={bookingData.categories}
              locale={locale}
            />
            <ServiceList services={services} />
            <div>
              <Button
                variant="outline"
                asChild
                className="h-auto w-full max-w-md whitespace-normal text-center"
              >
                <Link href="/calendar">{t("calendarSubscription")}</Link>
              </Button>
            </div>
          </div>
          {orgId && <BookPageStatus live={provider !== null} locale={locale} orgId={orgId} />}
        </div>
      )}
    </div>
  );
}
