import Image from "next/image";
import Link from "next/link";
import { getB2bTranslations } from "../pricing";
import { forHubPath } from "../paths";
import { CtaLink } from "./cta-link";

// No login: every button of the B2B pages goes to the checkout.
export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getB2bTranslations(locale, "b2b");

  return (
    <nav className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
      <Link href={forHubPath(locale)} aria-label={t("nav.trades")} className="block">
        <Image src="/logo.png" alt="Basalf" width={60} height={60} priority />
      </Link>
      <CtaLink locale={locale} label={t("cta")} size="sm" />
    </nav>
  );
}
