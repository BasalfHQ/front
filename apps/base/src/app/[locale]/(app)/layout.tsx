import { getMessages, getTranslations } from "@repo/i18n";
import { RootLayout } from "@repo/auth-ui";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params;
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
        { label: t("mcp"), href: "/mcp", adminOnly: true },
      ]}
    >
      {children}
    </RootLayout>
  );
}
