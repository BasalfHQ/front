import { Book } from "@repo/apis";
import { notFound } from "next/navigation";
import { addMonths } from "date-fns";
import { BookAppointment } from "./components/book";
import { getTranslations, getLocale, I18nClientProvider } from "@repo/i18n";
import bookingData from "@repo/esco/data/booking-occupations.json";
import type { BookingCategory } from "@repo/esco";
import { MapPin } from "@repo/ui/icons";

function getOccupationLabel(
  categories: BookingCategory[],
  occupationId: string,
  locale: string,
): string | null {
  for (const cat of categories) {
    const occ = cat.occupations.find((o) => o.id === occupationId);
    if (occ) return occ.labels[locale] ?? occ.labels["en"] ?? null;
  }
  return null;
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
  const [org, sps, slots, services, locale] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getSlots(orgId, now.toISOString(), inTwoMonths.toISOString()),
    Book.getServices(orgId),
    getLocale(),
  ]);
  if (!org || !sps || sps.length === 0) {
    notFound();
  }
  const sp = sps[0];

  const address = () => {
    const adr = org.address;
    if (!adr) return null;

    const formattedAddress = [
      [adr.streetNumber, adr.streetAddress].filter(Boolean).join(" "),
      [adr.postalCode, adr.addressLocality].filter(Boolean).join(" "),
      adr.addressCountry,
    ]
      .filter(Boolean)
      .join(", ");

    if (!formattedAddress) return null;

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      formattedAddress,
    )}`;

    return (
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {formattedAddress}
      </a>
    );
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-10 mx-10 xl:mx-0">
      <div className="text-center md:text-left flex flex-col w-full gap-2">
        <h1 className="text-4xl font-bold">
          {sp.firstName} {sp.lastName}
        </h1>
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin size={16} className="flex-shrink-0" />
          <p>{address()}</p>
        </div>
        <p
          className="text-lg text-gray-600 mb-4"
          dangerouslySetInnerHTML={{ __html: sp.description ?? "" }}
        />
      </div>
      {services
        .map((service) => ({
          service,
          slots: slots.filter((s) => s.serviceId === service.serviceId),
        }))
        .sort((a, b) => {
          if (a.slots.length === 0 && b.slots.length > 0) return 1;
          if (a.slots.length > 0 && b.slots.length === 0) return -1;
          return 0;
        })
        .map(({ service, slots: serviceSlots }) => {
          const defaultPattern = `${orgId}- Service`;
          const serviceName =
            service.name === defaultPattern
              ? (getOccupationLabel(
                  bookingData.categories,
                  sp.occupationId,
                  locale,
                ) ?? service.name)
              : service.name;

          return (
            <div key={service.serviceId} className="w-full flex flex-col gap-4">
              <h3 className="text-2xl font-bold">
                {serviceName} - {t("takeAnAppointment")}
              </h3>
              {service.description && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: service.description ?? "",
                  }}
                />
              )}
              <I18nClientProvider namespace="booking">
                <BookAppointment
                  organization={org}
                  slots={serviceSlots}
                  services={[service]}
                  serviceProvider={sp}
                  categories={bookingData.categories}
                  locale={locale}
                />
              </I18nClientProvider>
            </div>
          );
        })}
    </div>
  );
}
