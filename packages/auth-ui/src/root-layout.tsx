import { Base } from "@repo/apis";
import { getSession, isAdmin } from "@repo/auth";
import { AuthProvider } from "@repo/auth/provider";
import { I18nProvider } from "@repo/i18n";
import { RootLayout as BaseRootLayout, Nav, type NavItem } from "@repo/ui";
import { NavAuthSlot } from "./nav-client";
import type { AbstractIntlMessages } from "next-intl";

export { type NavItem };

export interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
  lang?: string;
  navItems?: NavItem[];
  locale?: string;
  messages?: AbstractIntlMessages;
}

export async function RootLayout({
  children,
  className,
  lang,
  navItems,
  locale,
  messages,
}: RootLayoutProps) {
  const session = await getSession();

  const userIsAdmin = isAdmin(session?.user?.email);
  const filteredNavItems = navItems?.filter(
    (item) =>
      (!item.adminOnly || userIsAdmin) && (!item.authOnly || !!session)
  );

  const organizations = session?.idToken
    ? await Base.getOrganizationsByEmail(session.idToken)
    : [];

  const authSlot = (
    <NavAuthSlot isLoggedIn={!!session} organizations={organizations} />
  );

  const content = (
    <AuthProvider>
      <Nav navItems={filteredNavItems} authSlot={authSlot} />
      <main className="flex-1 w-full flex p-8 flex-col">{children}</main>
    </AuthProvider>
  );

  return (
    <BaseRootLayout className={className} lang={lang}>
      {locale && messages ? (
        <I18nProvider locale={locale} messages={messages}>
          {content}
        </I18nProvider>
      ) : (
        content
      )}
    </BaseRootLayout>
  );
}
