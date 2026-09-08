import { MapPin } from "@repo/ui/icons";

// Compact provider identity shown on every booking-funnel step, mirroring
// the org home page header (centered on mobile, left-aligned on desktop).
export function ProviderHeader({
  providerName,
  occupationLabel,
  address,
}: {
  providerName: string;
  occupationLabel: string | null;
  address: string | null;
}) {
  const googleMapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;
  return (
    <div className="flex w-full flex-col gap-2 text-center md:text-left">
      <h1 className="text-[26px] font-bold tracking-[-0.02em] md:text-4xl">
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
          className="mx-auto flex w-fit items-center gap-1 text-sm text-info hover:underline md:mx-0"
        >
          <MapPin size={16} className="shrink-0" />
          <span>{address}</span>
        </a>
      )}
    </div>
  );
}
