import {
  hasLocale,
  routing,
  setRequestLocale,
  getMessages,
  getTranslations,
} from "@repo/i18n";
import { notFound } from "next/navigation";
import { RootLayout, createMetadata } from "@repo/auth-ui";

export const metadata = createMetadata({
  name: "Slot",
  description: "Slot application",
  url: "https://slot.basalf.com",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const [{ locale }, messages, t] = await Promise.all([
    params,
    getMessages(),
    getTranslations("nav"),
  ]);
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  return (
    <RootLayout
      lang={locale}
      locale={locale}
      messages={messages}
      navItems={[
        { label: t("home"), href: "/" },
        { label: t("slots"), href: "/slots", authOnly: true },
        { label: t("reservations"), href: "/reservations", authOnly: true },
        { label: t("token"), href: "/token", authOnly: true },
      ]}
    >
      {children}
    </RootLayout>
  );
}
