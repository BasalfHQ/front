import { hasLocale, routing, setRequestLocale } from "@repo/i18n";
import { notFound } from "next/navigation";
import { createMetadata } from "@repo/auth-ui";

export const metadata = createMetadata({
  name: "Base",
  description: "Base application",
  url: "https://base.basalf.com",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Thin on purpose: (app) and (checkout) render their own <html>/<body> (via
// @repo/auth-ui's RootLayout and @repo/ui's RootLayout respectively) so the
// checkout funnel can skip the app nav entirely. This layout only validates
// the locale segment - see each group's own layout.tsx for the rest.
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return children;
}
