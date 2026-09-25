import { getTranslations } from "@repo/i18n";

// Book's only plan. Change the price here: copy, CTAs and JSON-LD follow.
export const BOOK_PRICE = {
  amount: 5,
  currency: "EUR",
  // ISO 8601 billing period, for JSON-LD
  billingDuration: "P1M",
} as const;

// "€5" (en), "5 €" (fr)
export function formatPrice(locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: BOOK_PRICE.currency,
    minimumFractionDigits: 0,
  }).format(BOOK_PRICE.amount);
}

// getTranslations for the B2B pages: every message can use {price}.
export async function getB2bTranslations(locale: string, namespace: string) {
  const t = await getTranslations({ locale, namespace });
  const price = formatPrice(locale);
  return (key: string, values?: Parameters<typeof t>[1]) =>
    t(key, { price, ...values });
}
