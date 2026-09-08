export function formatPrice(
  amountMinor: number | null | undefined,
  currency: string | null | undefined,
  locale: string,
): string | null {
  if (amountMinor == null || !currency) return null;
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
  // minorUnit from the currency itself — JPY has 0 decimals, EUR 2
  const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
  return fmt.format(amountMinor / 10 ** digits);
}

function minutesBetween(startDate: string, endDate: string): number | null {
  const minutes = Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 60000,
  );
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

function minutesLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function toHHmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDuration(
  startDate: string,
  endDate: string,
): string | null {
  const minutes = minutesBetween(startDate, endDate);
  return minutes == null ? null : minutesLabel(minutes);
}

// Same duration across every slot -> a single label ("1h").
// Slots of different lengths -> a min–max range in HH:mm.
export function formatDurationRange(
  slots: { startDate: string; endDate: string }[],
): string | null {
  const durations = slots
    .map((s) => minutesBetween(s.startDate, s.endDate))
    .filter((m): m is number => m != null);
  if (durations.length === 0) return null;
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  if (min === max) return minutesLabel(min);
  return `${toHHmm(min)} - ${toHHmm(max)}`;
}

export function combinePill(
  durationLabel: string | null,
  priceLabel: string | null,
): string | null {
  if (durationLabel && priceLabel) return `${durationLabel} · ${priceLabel}`;
  return durationLabel ?? priceLabel ?? null;
}
