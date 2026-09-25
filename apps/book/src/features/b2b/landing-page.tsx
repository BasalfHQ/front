import { getB2bTranslations } from "./pricing";
import type { ArticleSummary, LandingContent } from "./content";
import { absoluteUrl } from "./paths";
import { ArticleCards } from "./article-page";
import type { Crumb } from "./components/breadcrumbs";
import { CmsHtml, Hero } from "./components/hero";
import { PhoneProfileMock } from "./components/phone-profile-mock";
import { SellingPoints } from "./components/selling-points";
import { ServicesTable } from "./components/services-table";
import { GuideSection } from "./components/guide-section";
import { FeatureSections } from "./components/feature-sections";
import { HowItWorks } from "./components/how-it-works";
import { PricingSection } from "./components/pricing-section";
import { FaqSection } from "./components/faq-section";
import { Container, Section, SectionTitle } from "./components/section";
import {
  JsonLd,
  breadcrumbListSchema,
  faqPageSchema,
  softwareApplicationSchema,
} from "./components/json-ld";

// Sales page shared by occupations and categories: the template is the same,
// the CMS content (pitch, services, guide, FAQ) makes each one specific.
export async function LandingPage({
  locale,
  content,
  crumbs,
  audience,
  mockLabel,
  articles,
  articleHref,
  afterHero,
  children,
}: {
  locale: string;
  content: LandingContent;
  // Last crumb is this page
  crumbs: Crumb[];
  // Plural audience: "barbers", "beauty & wellness pros"
  audience: string;
  // Trade shown on the phone mockup: "Barber", "Beauty & Wellness"
  mockLabel: string;
  articles: ArticleSummary[];
  articleHref: (articleSlug: string) => string;
  afterHero?: React.ReactNode;
  // Last sections (internal links)
  children?: React.ReactNode;
}) {
  const t = await getB2bTranslations(locale, "b2b");
  const path = crumbs[crumbs.length - 1]?.href ?? "";
  const serviceNames = (count?: number) =>
    content.services.length
      ? content.services
          .slice(0, count)
          .map((s) => s.name)
          .join(", ")
      : null;

  return (
    <Container>
      <JsonLd
        data={softwareApplicationSchema({
          locale,
          description: content.seo.description,
          url: absoluteUrl(path),
          audience,
          features: (["i1", "i2", "i3", "i4", "i5"] as const).map((key) =>
            t(`pricing.${key}`),
          ),
        })}
      />
      <JsonLd data={breadcrumbListSchema(crumbs)} />
      {content.faq.length > 0 && <JsonLd data={faqPageSchema(content.faq)} />}

      <Hero
        id="hero"
        locale={locale}
        crumbs={crumbs}
        title={t("hero.title", { occupations: audience })}
        pitch={<CmsHtml html={content.pitch} />}
        visual={
          <PhoneProfileMock
            locale={locale}
            occupation={mockLabel}
            services={content.services}
          />
        }
      />
      {afterHero}
      <SellingPoints
        locale={locale}
        occupations={audience}
        services={serviceNames()}
      />
      <ServicesTable
        locale={locale}
        occupations={audience}
        services={content.services}
      />
      <FeatureSections locale={locale} />
      <HowItWorks locale={locale} services={serviceNames(3)} />
      <GuideSection slices={content.guide} />
      <PricingSection locale={locale} />
      <FaqSection
        title={t("faq.title", { occupations: audience })}
        faq={content.faq}
      />
      {articles.length > 0 && (
        <Section className="gap-4 lg:gap-5">
          <SectionTitle>
            {t("articles.listTitle", { occupations: audience })}
          </SectionTitle>
          <ArticleCards articles={articles} href={articleHref} />
        </Section>
      )}
      {children}
    </Container>
  );
}
