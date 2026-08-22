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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("nav");

  return (
    <RootLayout
      lang={locale}
      locale={locale}
      messages={messages}
      navItems={[
        { label: t("users"), href: "/users", authOnly: true },
        { label: t("organizations"), href: "/organization", adminOnly: true },
      ]}
    >
      {children}
    </RootLayout>
  );
}
