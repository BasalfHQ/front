import { Book } from "@repo/apis";
import { addMonths } from "date-fns";
import { notFound } from "next/navigation";
import { I18nClientProvider, redirect } from "@repo/i18n";
import bookingData from "@repo/esco/data/booking-occupations.json";
import { BookingForm } from "@/features/service-provider/components/booking-form";
import { ProviderHeader } from "@/features/service-provider/components/provider-header";
import { StepProgress } from "@/features/service-provider/components/step-progress";
import { formatAddress, getOccupationLabel } from "@/lib/seo";
import { formatPrice } from "@/lib/price";

export default async function BookPage({
  orgId,
  locale,
  serviceId,
  slotId,
}: {
  orgId: string;
  locale: string;
  serviceId: string;
  slotId: string;
}) {
  const now = new Date();
  const inTwoMonths = addMonths(now, 2);
  const [org, sps, slots, services] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getSlots(orgId, now.toISOString(), inTwoMonths.toISOString()),
    Book.getServices(orgId),
  ]);

  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const slot = slots.find(
    (s) => s.slotId === slotId && s.usedCapacity < s.maxCapacity,
  );
  const service = services.find((s) => s.serviceId === serviceId);

  if (!slot || !service) {
    redirect({ href: `/service-provider/${orgId}`, locale });
    return null;
  }

  const priceLabel = formatPrice(service.price, undefined, locale);

  const sp = sps[0];
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const occupationLabel = getOccupationLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const address = formatAddress(org.address);

  return (
    <I18nClientProvider namespace="booking">
      <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-6">
        <ProviderHeader
          providerName={providerName}
          occupationLabel={occupationLabel}
          address={address}
        />
        <StepProgress currentStep={1} className="mx-auto" />
        <BookingForm
          orgId={orgId}
          locale={locale}
          organization={org}
          service={service}
          slot={slot}
          priceLabel={priceLabel}
        />
      </div>
    </I18nClientProvider>
  );
}
