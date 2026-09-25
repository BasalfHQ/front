import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, routing, setRequestLocale } from "@repo/i18n";
import { getBaseUrl } from "@/lib/seo";
import "../globals.css";

// Root layout: under [locale] so <html lang> matches the page language.
export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Book",
  description: "Book your appointment",
  verification: { google: "04sp6e87avP2LDhrjVzY6xmJMEgOEtJNGqtTnWgviWQ" },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // Unknown first segment (e.g. /foo.txt): 404 instead of a duplicate page.
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="min-h-full flex flex-col align-middle">{children}</body>
    </html>
  );
}
