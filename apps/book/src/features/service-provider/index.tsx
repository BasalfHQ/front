import { Book, File } from "@repo/apis";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { addMonths } from "date-fns";
import { ServiceBookSection } from "./components/service-book-section";
import { ServiceQuickNav } from "./components/service-quick-nav";
import { ServicesBooking } from "./components/services-booking";
import { getTranslations, getLocale, I18nClientProvider } from "@repo/i18n";
import bookingData from "@repo/esco/data/booking-occupations.json";
import { MapPin } from "@repo/ui/icons";
import { ExpandableText } from "@repo/ui/components/expandable-text";
import { getAllArticlesWithFallback } from "@/features/blog";
import { formatAddress, getOccupationLabel } from "@/lib/seo";
import {
  combinePill,
  formatDurationRange,
  formatPrice,
} from "@/lib/price";

export const serviceAnchorId = (serviceId: string) =>
  `service-${serviceId}`;

function servicePillLabel(
  service: Book.Service,
  serviceSlots: Book.Slot[],
  currency: string | undefined,
  locale: string,
) {
  const priceLabel = formatPrice(service.price, currency, locale);
  const durationLabel = formatDurationRange(serviceSlots);
  return combinePill(durationLabel, priceLabel);
}

export default async function Home({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const now = new Date();
  const t = await getTranslations("homepage");
  const inTwoMonths = addMonths(now, 2);
  const currentLocale = await getLocale();
  const [org, sps, slots, services, articles] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getSlots(orgId, now.toISOString(), inTwoMonths.toISOString()),
    Book.getServices(orgId),
    getAllArticlesWithFallback(orgId, currentLocale).catch(() => []),
  ]);
  const locale = currentLocale;
  if (!org || !sps || sps.length === 0) {
    notFound();
  }
  const sp = sps[0];
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const occupationLabel = getOccupationLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const address = formatAddress(org.address);
  const googleMapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;

  const pictureUrl = File.publicFileUrl(
    orgId,
    File.serviceProviderPictureKey(sp.serviceProviderId),
  );
  const hasPicture = await fetch(pictureUrl, { method: "HEAD" })
    .then((r) => r.ok)
    .catch(() => false);

  const availableSlots = slots.filter((s) => s.usedCapacity < s.maxCapacity);

  const orderedServices = services
    .map((service) => ({
      service,
      slots: availableSlots.filter((s) => s.serviceId === service.serviceId),
    }))
    .sort((a, b) => {
      if (a.slots.length === 0 && b.slots.length > 0) return 1;
      if (a.slots.length > 0 && b.slots.length === 0) return -1;
      return 0;
    });

  const serviceName = (service: Book.Service) =>
    service.name === `${org.name} Service`
      ? (getOccupationLabel(bookingData.categories, sp.occupationId, locale) ??
        service.name)
      : service.name;

  const quickNavServices = orderedServices
    .filter(({ slots }) => slots.length > 0)
    .map(({ service }) => ({
      name: serviceName(service),
      anchorId: serviceAnchorId(service.serviceId),
    }));

  const serviceBookingSummaries = orderedServices.map(
    ({ service, slots: serviceSlots }) => ({
      service,
      name: serviceName(service),
      pillLabel: servicePillLabel(service, serviceSlots, org.currency, locale),
      hasSlots: serviceSlots.length > 0,
      nextSlots: [...serviceSlots]
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 3),
      anchorId: serviceAnchorId(service.serviceId),
    }),
  );

  return (
    <I18nClientProvider namespace="common">
      <div className="flex flex-col items-center gap-10 px-5 pb-24 pt-8 md:pb-10 md:px-6">
        {/* Mobile: image beside the compact identity, description full-width below */}
        <div className="flex w-full flex-col gap-4 md:hidden">
          <div className="flex flex-col items-center gap-4 xs:flex-row">
            {hasPicture && (
              <Image
                src={pictureUrl}
                alt={providerName}
                width={192}
                height={240}
                className="w-48 shrink-0 rounded-lg border object-cover"
                style={{ aspectRatio: "4 / 5" }}
              />
            )}
            <div className="flex flex-col items-center gap-1 text-center xs:items-start xs:text-left">
              <h1 className="text-[26px] font-bold tracking-[-0.02em]">
                {providerName}
              </h1>
              {occupationLabel && (
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {occupationLabel}
                </p>
              )}
              {address && (
                <a
                  href={googleMapsUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1 text-sm text-info hover:underline"
                >
                  <MapPin size={16} className="shrink-0" />
                  <span>{address}</span>
                </a>
              )}
            </div>
          </div>
          <ExpandableText
            html={sp.description ?? ""}
            className="mb-0 text-left text-lg text-muted-foreground"
          />
        </div>

        {/* Desktop: image and full identity block in a single row */}
        <div className="hidden w-full md:flex md:flex-row md:items-start md:gap-8">
          {hasPicture && (
            <Image
              src={pictureUrl}
              alt={providerName}
              width={192}
              height={240}
              className="w-48 shrink-0 rounded-lg border object-cover"
              style={{ aspectRatio: "4 / 5" }}
            />
          )}
          <div className="flex w-full flex-col gap-2 text-left">
            <h1 className="text-4xl font-bold tracking-[-0.02em]">
              {providerName}
            </h1>
            {occupationLabel && (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {occupationLabel}
              </p>
            )}
            {address && (
              <a
                href={googleMapsUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1 text-info hover:underline"
              >
                <MapPin size={16} className="shrink-0" />
                <span>{address}</span>
              </a>
            )}
            <ExpandableText
              html={sp.description ?? ""}
              className="mb-0 text-left text-lg text-muted-foreground md:mb-4"
            />
          </div>
        </div>

        <ServicesBooking orgId={orgId} services={serviceBookingSummaries} />

        <I18nClientProvider namespace={["common", "booking"]}>
          {quickNavServices.length > 1 && (
            <ServiceQuickNav services={quickNavServices} />
          )}

          {serviceBookingSummaries.map(
            ({ service, name, pillLabel, nextSlots, anchorId }) => (
              <ServiceBookSection
                key={service.serviceId}
                orgId={orgId}
                service={service}
                heading={`${name} — ${t("takeAnAppointment")}`}
                pillLabel={pillLabel}
                description={service.description ?? null}
                nextSlots={nextSlots}
                locale={locale}
                timezone={org.timezone}
                anchorId={anchorId}
              />
            ),
          )}
        </I18nClientProvider>

        {articles.length > 0 && (
          <div className="mb-10 mt-8 flex w-full flex-col gap-4 border-t border-border pt-8">
            <h2 className="text-2xl font-bold">{t("blogTitle")}</h2>
            <p className="text-muted-foreground">{t("blogDescription")}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {articles.slice(0, 4).map((article) => {
                const articleSchema = article.seo.schemas.find(
                  (s) => s.type === "article",
                );
                const articleLocalePath =
                  article.locale === "en" ? "" : `/${article.locale}`;
                const langFlag =
                  article.locale === "fr"
                    ? "🇫🇷"
                    : article.locale === "en"
                      ? "🇬🇧"
                      : "";
                return (
                  <Link
                    key={article.pageId}
                    href={`${articleLocalePath}/service-provider/${orgId}/blog${article.url}`}
                    className="block rounded-lg border border-border bg-card p-4 shadow-[0_0_0_rgba(0,0,0,0)] transition-all hover:border-info/60 hover:shadow-[0_4px_16px_-4px_hsl(var(--info)/0.25)]"
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      {article.isOtherLocale && (
                        <span title={article.locale}>{langFlag}</span>
                      )}
                      {articleSchema && articleSchema.type === "article" && (
                        <>
                          <time dateTime={articleSchema.date}>
                            {new Date(articleSchema.date).toLocaleDateString(
                              article.locale,
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </time>
                          <span>•</span>
                          <span>{articleSchema.readingTime} min</span>
                        </>
                      )}
                    </div>
                    <h3 className="mb-1 font-semibold">
                      {article.seo.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {article.seo.description}
                    </p>
                  </Link>
                );
              })}
            </div>
            <Link
              href={`${locale === "en" ? "" : `/${locale}`}/service-provider/${orgId}/blog`}
              className="min-h-[44px] w-full rounded-md border border-border text-center leading-[44px] text-foreground hover:bg-accent md:hidden"
            >
              {t("viewAllArticles")}
            </Link>
            <Link
              href={`${locale === "en" ? "" : `/${locale}`}/service-provider/${orgId}/blog`}
              className="hidden w-fit text-sm text-info hover:underline md:block"
            >
              {t("viewAllArticles")}
            </Link>
          </div>
        )}
      </div>
    </I18nClientProvider>
  );
}
