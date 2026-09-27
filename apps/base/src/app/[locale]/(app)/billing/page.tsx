import { getLocale, redirect } from "@repo/i18n";

// Billing now lives in settings. Kept because stripe-esg's customer portal returns to /billing.
export default async function Page() {
  redirect({ href: "/settings", locale: await getLocale() });
}
