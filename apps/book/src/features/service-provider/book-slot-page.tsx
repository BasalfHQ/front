import { Book } from "@repo/apis";
import { addMonths } from "date-fns";
import { notFound } from "next/navigation";
import { getTranslations, I18nClientProvider, Link } from "@repo/i18n";
import { MoveLeft } from "@repo/ui/icons";
import bookingData from "@repo/esco/data/booking-occupations.json";
import { ProviderHeader } from "@/features/service-provider/components/provider-header";
import { SlotSelector, type SlotSelectorService } from "@/features/service-provider/components/slot-selector";
import { StepProgress } from "@/features/service-provider/components/step-progress";
import { formatAddress, getOccupationLabel } from "@/lib/seo";
import { serviceAnchorId } from "@/features/service-provider";

export default async function BookSlotPage({
  orgId,
  locale,
  serviceId,
}: {
  orgId: string;
  locale: string;
  serviceId?: string;
}) {
  const now = new Date();
  const inTwoMonths = addMonths(now, 2);
  const t = await getTranslations("booking");
  const [org, sps, slots, services] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getSlots(orgId, now.toISOString(), inTwoMonths.toISOString()),
    Book.getServices(orgId),
  ]);

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

  const availableSlots = slots.filter((s) => s.usedCapacity < s.maxCapacity);

  const resolveName = (service: Book.Service) =>
    service.name === `${org.name} Service`
      ? (getOccupationLabel(bookingData.categories, sp.occupationId, locale) ??
        service.name)
      : service.name;

  const selected = services.filter(
    (s) => !serviceId || s.serviceId === serviceId,
  );

  const selectorServices: SlotSelectorService[] = selected
    .map((service) => ({
      name: resolveName(service),
      slots: availableSlots.filter((s) => s.serviceId === service.serviceId),
    }))
    .sort((a, b) => {
      if (a.slots.length === 0 && b.slots.length > 0) return 1;
      if (a.slots.length > 0 && b.slots.length === 0) return -1;
      return 0;
    });

  return (
    <I18nClientProvider namespace="booking">
      <div className="flex w-full flex-col gap-6 px-5 py-8 md:px-6">
        <ProviderHeader
          providerName={providerName}
          occupationLabel={occupationLabel}
          address={address}
        />
        <StepProgress currentStep={0} className="mx-auto" />
        <Link
          href={`/service-provider/${orgId}${
            serviceId ? `#${serviceAnchorId(serviceId)}` : ""
          }`}
          className="flex min-h-[44px] w-fit items-center gap-2 text-info hover:underline"
        >
          <MoveLeft size={16} />
          <span className="text-sm font-medium">{t("back")}</span>
        </Link>
        <SlotSelector
          orgId={orgId}
          organization={org}
          services={selectorServices}
        />
      </div>
    </I18nClientProvider>
  );
}
