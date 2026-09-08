import { Book } from "@repo/apis";
import { notFound } from "next/navigation";
import { I18nClientProvider, redirect } from "@repo/i18n";
import bookingData from "@repo/esco/data/booking-occupations.json";
import { readBookingConfirmation } from "@/features/service-provider/actions";
import { ProviderHeader } from "@/features/service-provider/components/provider-header";
import { Success } from "@/features/service-provider/components/success";
import { StepProgress } from "@/features/service-provider/components/step-progress";
import { formatAddress, getOccupationLabel } from "@/lib/seo";
import { formatDuration, formatPrice } from "@/lib/price";

export default async function BookSuccessPage({
  orgId,
  locale,
}: {
  orgId: string;
  locale: string;
}) {
  const confirmation = await readBookingConfirmation();
  if (!confirmation || confirmation.organizationId !== orgId) {
    redirect({ href: `/service-provider/${orgId}`, locale });
    return null;
  }

  const { booking } = confirmation;

  const [org, sps, services] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getServices(orgId),
  ]);

  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const sp = sps[0];
  const service = services.find((s) => s.serviceId === booking.serviceId);
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const occupationLabel = getOccupationLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const priceLabel = formatPrice(service?.price, undefined, locale);
  const durationLabel = formatDuration(booking.startDate, booking.endDate);

  const address = formatAddress(org.address);

  return (
    <I18nClientProvider namespace="booking">
      <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-6">
        <ProviderHeader
          providerName={providerName}
          occupationLabel={occupationLabel}
          address={address}
        />
        <StepProgress currentStep={2} className="mx-auto" />
        <Success
          orgId={orgId}
          locale={locale}
          organization={org}
          service={service}
          booking={booking}
          providerName={providerName}
          occupationLabel={occupationLabel}
          priceLabel={priceLabel}
          durationLabel={durationLabel}
        />
      </div>
    </I18nClientProvider>
  );
}
