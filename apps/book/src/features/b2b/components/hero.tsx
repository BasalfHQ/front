import { formatPrice, getB2bTranslations } from "../pricing";
import { cn } from "@repo/ui/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { CtaLink } from "./cta-link";

// Hero of the B2B pages: breadcrumbs, H1, pitch, price, CTA, and an optional
// visual on the right (desktop) / below (mobile).
export async function Hero({
  id,
  locale,
  crumbs,
  title,
  pitch,
  visual,
}: {
  id?: string;
  locale: string;
  crumbs?: Crumb[];
  title: string;
  // Rendered as-is: CMS HTML goes through <CmsHtml>.
  pitch: React.ReactNode;
  visual?: React.ReactNode;
}) {
  const t = await getB2bTranslations(locale, "b2b");

  return (
    <header
      id={id}
      className={cn(
        "grid items-center gap-5 pb-12 pt-4 lg:gap-20 lg:pb-20 lg:pt-8",
        visual && "lg:grid-cols-[minmax(0,1fr)_300px]",
      )}
    >
      <div className="flex flex-col gap-5 lg:gap-6">
        {crumbs && (
          <Breadcrumbs label={t("breadcrumb.label")} crumbs={crumbs} />
        )}
        <h1 className="m-0 text-balance text-4xl font-bold leading-[1.1] tracking-[-0.02em] lg:text-[56px] lg:leading-[1.05] lg:tracking-[-0.025em]">
          {title}
        </h1>
        <div className="max-w-[520px] text-pretty leading-7 text-muted-foreground">
          {pitch}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:gap-6">
          <p className="m-0 flex items-baseline gap-2">
            <span className="text-[64px] font-bold leading-none tracking-[-0.03em] lg:text-[88px] lg:leading-[0.9]">
              {formatPrice(locale)}
            </span>
            <span className="text-xl font-semibold lg:text-[22px]">
              {t("hero.perMonth")}
            </span>
          </p>
          <p className="m-0 text-base leading-6 lg:mb-1">
            <span className="lg:block">{t("hero.included")}</span>{" "}
            <span className="lg:block">{t("hero.noCommission")}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
          <CtaLink locale={locale} label={t("cta")} />
          <span className="text-center text-sm text-muted-foreground lg:text-left">
            {t("hero.reassurance")}
          </span>
        </div>
      </div>
      {visual && (
        <div className="flex justify-center pt-4 lg:pt-0">{visual}</div>
      )}
    </header>
  );
}

// CMS rich text (trusted: written through the Basalf CMS).
export function CmsHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={className ?? "[&_p]:m-0 [&_p+p]:mt-3"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
