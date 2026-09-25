import { getB2bTranslations } from "./pricing";
import { Footer } from "@repo/ui/components/footer";
import { SiteHeader } from "./components/site-header";
import { StickyCta } from "./components/sticky-cta";
import { checkoutUrl, forHubPath } from "./paths";

// Shell of the B2B pages. Each page's hero has id="hero": the mobile sticky
// CTA shows once it is scrolled past.
export async function B2bLayout({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getB2bTranslations(locale, "b2b");

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="w-full flex-1">{children}</main>
      {/* Bottom padding on mobile so the sticky CTA never hides the footer */}
      <div className="bg-neutral-900 pb-[76px] lg:pb-0">
        <Footer
          links={[{ label: t("nav.trades"), href: forHubPath(locale) }]}
        />
      </div>
      <StickyCta href={checkoutUrl(locale)} label={t("cta")} afterId="hero" />
    </>
  );
}
