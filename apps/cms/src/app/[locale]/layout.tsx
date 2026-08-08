import {
  hasLocale,
  routing,
  setRequestLocale,
  getMessages,
} from "@repo/i18n";
import { notFound } from "next/navigation";
import { RootLayout, createMetadata } from "@repo/auth-ui";

export const metadata = createMetadata({
  name: "CMS",
  description: "CMS application",
  url: "https://cms.basalf.com",
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

  return (
    <RootLayout lang={locale} locale={locale} messages={messages}>
      {children}
    </RootLayout>
  );
}
