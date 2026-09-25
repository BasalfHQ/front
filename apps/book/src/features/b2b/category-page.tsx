import { notFound } from "next/navigation";
import { getB2bTranslations } from "./pricing";
import {
  getCategory,
  getCategoryLabel,
  getOccupationLabels,
} from "@/lib/occupation-slug";
import {
  getCategoryArticles,
  getCategoryContent,
  getLiveCategoryIds,
  getLiveOccupationIds,
} from "./content";
import { getCategoryAudience } from "./audience";
import { getLandingCrumbs } from "./crumbs";
import { LandingPage } from "./landing-page";
import { OccupationPage } from "./occupation-page";
import { CategoryArticlePage } from "./article-page";
import { capitalize, categoryArticlePath, categoryPath, occupationPath } from "./paths";
import { matchOccupationId, resolveCategoryId } from "./resolve";
import {
  OccupationChips,
  type OccupationLink,
} from "./components/occupation-chips";
import { Section, SectionTitle } from "./components/section";
import { JsonLd, itemListSchema } from "./components/json-ld";

// Every occupation of the category, linked when its page is live.
async function getTradeLinks(
  locale: string,
  categoryId: string,
): Promise<OccupationLink[]> {
  const live = await getLiveOccupationIds(locale);
  return (getCategory(categoryId)?.occupations ?? [])
    .flatMap(({ id }) => {
      const labels = getOccupationLabels(locale, id);
      return labels
        ? [
            {
              label: capitalize(labels.one, locale),
              href: live.has(id) ? occupationPath(locale, id) : null,
            },
          ]
        : [];
    })
    .sort(
      (a, b) =>
        Number(!a.href) - Number(!b.href) ||
        a.label.localeCompare(b.label, locale),
    );
}

// The other live categories.
async function getOtherCategoryLinks(
  locale: string,
  categoryId: string,
): Promise<OccupationLink[]> {
  return [...(await getLiveCategoryIds(locale))]
    .filter((id) => id !== categoryId)
    .map((id) => ({
      label: getCategoryLabel(locale, id),
      href: categoryPath(locale, id),
    }));
}

// /for/{category}
export async function CategoryPage({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const categoryId = resolveCategoryId(locale, slug);
  const content = await getCategoryContent(locale, categoryId);
  // Live only once its CMS page exists in this locale.
  if (!content) notFound();

  const t = await getB2bTranslations(locale, "b2b.category");
  const trades = await getTradeLinks(locale, categoryId);
  const liveTrades = trades.filter((l): l is { label: string; href: string } =>
    Boolean(l.href),
  );
  const others = await getOtherCategoryLinks(locale, categoryId);

  return (
    <LandingPage
      locale={locale}
      content={content}
      crumbs={await getLandingCrumbs(locale, { categoryId })}
      audience={await getCategoryAudience(locale, categoryId)}
      mockLabel={getCategoryLabel(locale, categoryId)}
      articles={await getCategoryArticles(locale, categoryId)}
      articleHref={(s) => categoryArticlePath(locale, categoryId, s) ?? ""}
      afterHero={
        <Section className="gap-4 lg:gap-5">
          {liveTrades.length > 0 && <JsonLd data={itemListSchema(liveTrades)} />}
          <SectionTitle>{t("tradesTitle")}</SectionTitle>
          <OccupationChips links={trades} />
        </Section>
      }
    >
      {others.length > 0 && (
        <Section className="gap-4 pb-14 lg:gap-5 lg:pb-[88px]">
          <SectionTitle>{t("otherTitle")}</SectionTitle>
          <OccupationChips links={others} />
        </Section>
      )}
    </LandingPage>
  );
}

// /for/{category}/{slug}: an occupation of the category — always first —
// else an article of the category.
export async function CategoryChildPage({
  locale,
  category,
  slug,
}: {
  locale: string;
  category: string;
  slug: string;
}) {
  const categoryId = resolveCategoryId(locale, category, `/${slug}`);
  const occupationId = matchOccupationId(locale, categoryId, slug);
  return occupationId ? (
    <OccupationPage locale={locale} occupationId={occupationId} />
  ) : (
    <CategoryArticlePage
      locale={locale}
      categoryId={categoryId}
      articleSlug={slug}
    />
  );
}
