import { getMessages, I18nProvider } from "@repo/i18n";
import { RootLayout } from "@repo/ui";
import { CheckoutHeader } from "@/features/checkout/components/checkout-header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// No nav items, no auth - the checkout funnel is public (first-ever signup,
// no session yet) and deliberately skips (app)'s chrome so the payment step
// isn't competing with the rest of the app for attention. Keeps the same
// logo header as (app) though, so it doesn't feel like a different site.
export default async function CheckoutLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <RootLayout lang={locale} className="bg-gray-50">
      <I18nProvider locale={locale} messages={messages}>
        <CheckoutHeader />
        <main className="flex-1 w-full flex flex-col">{children}</main>
      </I18nProvider>
    </RootLayout>
  );
}
