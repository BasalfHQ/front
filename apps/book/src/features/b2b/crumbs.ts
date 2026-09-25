import { getB2bTranslations } from "./pricing";
import {
  getCategoryLabel,
  getOccupationCategory,
  getOccupationLabels,
} from "@/lib/occupation-slug";
import { getLiveCategoryIds } from "./content";
import {
  capitalize,
  categoryPath,
  forHubPath,
  occupationPath,
} from "./paths";
import type { Crumb } from "./components/breadcrumbs";

// Trades › {Category} › {Occupation} (no Home: the home page isn't part of
// the B2B pages). The category crumb only when its
// page is live: never link to a 404.
export async function getLandingCrumbs(
  locale: string,
  target: { categoryId: string } | { occupationId: string },
): Promise<Crumb[]> {
  const t = await getB2bTranslations(locale, "b2b.breadcrumb");
  const crumbs: Crumb[] = [
    { label: t("for"), href: forHubPath(locale) },
  ];

  const occupationId = "occupationId" in target ? target.occupationId : null;
  const categoryId =
    "categoryId" in target
      ? target.categoryId
      : getOccupationCategory(target.occupationId)?.id;

  const categoryHref = categoryId && categoryPath(locale, categoryId);
  if (
    categoryId &&
    categoryHref &&
    (!occupationId || (await getLiveCategoryIds(locale)).has(categoryId))
  ) {
    crumbs.push({
      label: getCategoryLabel(locale, categoryId),
      href: categoryHref,
    });
  }

  const labels = occupationId && getOccupationLabels(locale, occupationId);
  const occupationHref = occupationId && occupationPath(locale, occupationId);
  if (labels && occupationHref) {
    crumbs.push({ label: capitalize(labels.one, locale), href: occupationHref });
  }
  return crumbs;
}
