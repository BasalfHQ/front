import { Book } from "@repo/apis";
import { Link, getTranslations } from "@repo/i18n";
import { cn } from "@repo/ui/lib/utils";
import { Pill } from "./pill";

export type ServiceBookingSummary = {
  service: Book.Service;
  name: string;
  pillLabel: string | null;
  hasSlots: boolean;
  anchorId: string;
};

// Compact, at-a-glance booking widget: one card per service with a
// "Réserver" entry point into the full funnel (or a no-slots notice), so a
// visitor can book without scrolling to each service's own section. Single
// card stays full-width; multiple cards form a two-column grid — same card
// markup either way.
export async function ServicesBooking({
  orgId,
  services,
}: {
  orgId: string;
  services: ServiceBookingSummary[];
}) {
  const t = await getTranslations("booking");

  return (
    <div
      className={cn(
        "grid w-full gap-3",
        services.length > 1 && "sm:grid-cols-2",
      )}
    >
      {services.map(({ service, name, pillLabel, hasSlots, anchorId }) => (
        <div
          key={service.serviceId}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <a href={`#${anchorId}`} className="font-semibold hover:underline">
              {name}
            </a>
            {pillLabel && <Pill>{pillLabel}</Pill>}
          </div>
          {hasSlots ? (
            <Link
              prefetch={true}
              href={`/service-provider/${orgId}/book/slot?serviceId=${service.serviceId}`}
              className="flex min-h-[44px] w-fit items-center justify-center rounded-md bg-info px-6 text-sm font-semibold text-info-foreground hover:bg-info/90"
            >
              {t("book")}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("noSlotsForService")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
