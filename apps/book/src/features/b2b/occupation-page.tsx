import Link from "next/link";
import { notFound } from "next/navigation";
import { getB2bTranslations } from "./pricing";
import {
  getCategoryLabel,
  getOccupationCategory,
  getOccupationLabels,
  getSiblingOccupationIds,
} from "@/lib/occupation-slug";
import {
  getFolderArticles,
  getFolderContent,
  getLiveCategoryIds,
  getLiveOccupationIds,
} from "./content";
import { getCategoryAudience } from "./audience";
import { getLandingCrumbs } from "./crumbs";
import { folderArticlePath } from "./folder";
import { LandingPage } from "./landing-page";
import { capitalize, categoryPath, occupationPath } from "./paths";
import { categoryParams } from "./hub-pages";
import { OccupationChips } from "./components/occupation-chips";
import { Section, SectionTitle } from "./components/section";
import type { OccupationLink } from "./components/occupation-chips";

const MAX_SIBLINGS = 8;

// Live occupations of the same category, as links.
export async function getSiblingLinks(
  locale: string,
  occupationId: string,
): Promise<OccupationLink[]> {
  const live = await getLiveOccupationIds(locale);
  return getSiblingOccupationIds(occupationId)
    .filter((id) => live.has(id))
    .slice(0, MAX_SIBLINGS)
    .flatMap((id) => {
      const href = occupationPath(locale, id);
      const labels = getOccupationLabels(locale, id);
      return href && labels
        ? [{ label: capitalize(labels.one, locale), href }]
        : [];
    });
}

// /for/{category}/{occupation} — occupationId already resolved from the URL.
export async function OccupationPage({
  locale,
  occupationId,
}: {
  locale: string;
  occupationId: string;
}) {
  const folder = { kind: "occupation" as const, id: occupationId };
  const content = await getFolderContent(locale, folder);
  const labels = getOccupationLabels(locale, occupationId);
  // Live only once its CMS page exists in this locale.
  if (!content || !labels) notFound();

  const t = await getB2bTranslations(locale, "b2b");
  const category = getOccupationCategory(occupationId);
  const siblings = await getSiblingLinks(locale, occupationId);
  const categoryHref =
    category && (await getLiveCategoryIds(locale)).has(category.id)
      ? categoryPath(locale, category.id)
      : null;
  const categoryLabel = category ? getCategoryLabel(locale, category.id) : "";

  return (
    <LandingPage
      locale={locale}
      content={content}
      crumbs={await getLandingCrumbs(locale, folder)}
      audience={labels.other}
      mockLabel={capitalize(labels.one, locale)}
      articles={await getFolderArticles(locale, folder)}
      articleHref={(s) => folderArticlePath(locale, folder, s) ?? ""}
    >
      {category && (siblings.length > 0 || categoryHref) && (
        <Section className="gap-4 pb-14 lg:gap-5 lg:pb-[88px]">
          <SectionTitle>
            {t("alsoFor.title", {
              audience: await getCategoryAudience(locale, category.id),
            })}
          </SectionTitle>
          {siblings.length > 0 && <OccupationChips links={siblings} />}
          {categoryHref && (
            <Link
              href={categoryHref}
              className="w-fit font-semibold text-info hover:underline"
            >
              {t("hub.seeCategory", categoryParams(categoryLabel, locale))}
            </Link>
          )}
        </Section>
      )}
    </LandingPage>
  );
}
