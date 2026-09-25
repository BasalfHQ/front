import Link from "next/link";
import { getB2bTranslations } from "./pricing";
import {
  getCategories,
  getCategoryLabel,
  getOccupationLabels,
} from "@/lib/occupation-slug";
import { getLiveCategoryIds, getLiveOccupationIds } from "./content";
import {
  capitalize,
  categoryPath,
  forHubPath,
  occupationPath,
} from "./paths";
import { Hero } from "./components/hero";
import { PricingSection } from "./components/pricing-section";
import {
  OccupationChips,
  type OccupationLink,
} from "./components/occupation-chips";
import { Container, Section, SectionTitle } from "./components/section";
import {
  JsonLd,
  itemListSchema,
} from "./components/json-ld";

type LiveCategory = {
  id: string;
  label: string;
  // Null while the category page itself isn't live
  href: string | null;
  occupations: OccupationLink[];
};

// Categories with a live page or at least one live occupation page, with
// those occupations.
export async function getLiveCategories(
  locale: string,
): Promise<LiveCategory[]> {
  const live = await getLiveOccupationIds(locale);
  const liveCategories = await getLiveCategoryIds(locale);
  return getCategories().flatMap((category) => {
    const href = liveCategories.has(category.id)
      ? categoryPath(locale, category.id)
      : null;
    const occupations = category.occupations.flatMap(({ id }) => {
      const occupationHref = live.has(id) ? occupationPath(locale, id) : null;
      const labels = getOccupationLabels(locale, id);
      return occupationHref && labels
        ? [{ label: capitalize(labels.one, locale), href: occupationHref }]
        : [];
    });
    return href || occupations.length
      ? [
          {
            id: category.id,
            label: getCategoryLabel(locale, category.id),
            href,
            occupations,
          },
        ]
      : [];
  });
}

// /for — every category with its live occupations.
export async function ForHubPage({ locale }: { locale: string }) {
  const t = await getB2bTranslations(locale, "b2b");
  const categories = await getLiveCategories(locale);
  const linked = categories.flatMap((c) =>
    c.href ? [{ label: c.label, href: c.href }] : [],
  );

  return (
    <Container>
      {linked.length > 0 && <JsonLd data={itemListSchema(linked)} />}
      <Hero
        id="hero"
        locale={locale}
        title={t("hub.title")}
        pitch={<p className="m-0">{t("hub.intro")}</p>}
      />
      {categories.length === 0 ? (
        <Section>
          <p className="m-0 text-muted-foreground">{t("hub.empty")}</p>
        </Section>
      ) : (
        categories.map((category) => (
          <Section key={category.id} className="gap-4 lg:gap-5">
            <SectionTitle>
              {category.href ? (
                <Link
                  href={category.href}
                  className="text-foreground no-underline hover:underline"
                >
                  {category.label}
                </Link>
              ) : (
                category.label
              )}
            </SectionTitle>
            {category.occupations.length > 0 && (
              <OccupationChips links={category.occupations} />
            )}
          </Section>
        ))
      )}
      <PricingSection locale={locale} />
    </Container>
  );
}

export function categoryParams(label: string, locale: string) {
  return { category: label, categoryLower: label.toLocaleLowerCase(locale) };
}
