import {
  hasLocale,
  routing,
  setRequestLocale,
  getMessages,
  getTranslations,
} from "@repo/i18n";
import { notFound } from "next/navigation";
import { RootLayout, createMetadata, getSession } from "@repo/auth-ui";
import { hasUpcomingSlots } from "@/features/slots/has-upcoming-slots";

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
  const [{ locale }, messages, t, session] = await Promise.all([
    params,
    getMessages(),
    getTranslations("nav"),
    getSession(),
  ]);
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  // Nudge toward the one setup step that isn't gated behind its own "no
  // subscription"/empty-state redirect - without it, a provider profile
  // with no slots looks identical to one that's fully set up.
  const noSlotsYet = session?.idToken ? !(await hasUpcomingSlots(session.idToken)) : false;

  return (
    <RootLayout
      lang={locale}
      locale={locale}
      messages={messages}
      navItems={[
        { label: t("home"), href: "/" },
        { label: t("slots"), href: "/slots", authOnly: true, badge: noSlotsYet },
        { label: t("reservations"), href: "/reservations", authOnly: true },
        { label: t("api"), href: "/token", authOnly: true },
      ]}
    >
      {children}
    </RootLayout>
  );
}
