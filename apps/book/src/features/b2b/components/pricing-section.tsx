import { formatPrice, getB2bTranslations } from "../pricing";
import { Check } from "@repo/ui/icons";
import { CtaLink } from "./cta-link";
import { Section, SectionTitle } from "./section";

const INCLUDED = ["i1", "i2", "i3", "i4", "i5"] as const;

export async function PricingSection({ locale }: { locale: string }) {
  const t = await getB2bTranslations(locale, "b2b");

  // Mobile: price, list, terms, CTA. Desktop: price/terms/CTA left, list right.
  return (
    <Section>
      <SectionTitle>{t("pricing.title")}</SectionTitle>
      <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-12 lg:gap-y-5 lg:p-12">
        <p className="m-0 flex items-baseline gap-2 lg:col-start-1 lg:row-start-1 lg:gap-2.5">
          <span className="text-7xl font-bold leading-none tracking-[-0.03em] lg:text-[120px] lg:leading-[0.9] lg:tracking-[-0.035em]">
            {formatPrice(locale)}
          </span>
          <span className="text-xl font-semibold lg:text-[26px]">
            {t("hero.perMonth")}
          </span>
        </p>
        <ul className="m-0 flex list-none flex-col gap-3 p-0 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:gap-4 lg:border-l lg:border-border lg:pl-12">
          {INCLUDED.map((key) => (
            <li
              key={key}
              className="flex items-start gap-2.5 leading-6 lg:gap-3 lg:leading-[26px]"
            >
              <Check
                className="mt-1 size-4 shrink-0 text-success"
                aria-hidden
              />
              <span>{t(`pricing.${key}`)}</span>
            </li>
          ))}
        </ul>
        <p className="m-0 border-t border-border pt-4 font-semibold leading-6 lg:col-start-1 lg:row-start-2 lg:border-0 lg:pt-0 lg:leading-7">
          <span className="lg:block">{t("pricing.terms1")}</span>{" "}
          <span className="lg:block">{t("pricing.terms2")}</span>
        </p>
        <CtaLink
          locale={locale}
          label={t("cta")}
          className="lg:col-start-1 lg:row-start-3 lg:justify-self-start"
        />
      </div>
    </Section>
  );
}
