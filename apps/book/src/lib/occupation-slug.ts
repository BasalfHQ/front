import type { BookingCategory } from "@repo/esco";
import bookingData from "@repo/esco/data/booking-occupations.json";
import categorySlugs from "@repo/esco/data/category-slugs.json";
import occupationLabels from "@repo/esco/data/occupation-labels.json";
import occupationSlugs from "@repo/esco/data/occupation-slugs.json";

export type OccupationLabels = { one: string; other: string };

const slugToId: Record<string, Record<string, string>> = occupationSlugs;

const idToSlug: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(slugToId).map(([locale, slugs]) => [
    locale,
    Object.fromEntries(Object.entries(slugs).map(([slug, id]) => [id, slug])),
  ]),
);

// ("fr", "barbier") -> "4e0c14d6-..."
export function getOccupationIdBySlug(
  locale: string,
  slug: string,
): string | null {
  return slugToId[locale]?.[slug] ?? null;
}

// ("fr", "4e0c14d6-...") -> "barbier" — for links and hreflang alternates
export function getOccupationSlug(
  locale: string,
  occupationId: string,
): string | null {
  return idToSlug[locale]?.[occupationId] ?? null;
}

// "bricklayer" -> "en": the locale a slug belongs to, when used under the wrong one
export function getOccupationSlugLocale(slug: string): string | null {
  return (
    Object.keys(slugToId).find((locale) => slugToId[locale][slug]) ?? null
  );
}

// Every occupation with its slug per locale: { occupationId, slugs: { en: "barber", fr: "barbier" } }
export function getAllOccupationSlugs(): {
  occupationId: string;
  slugs: Record<string, string>;
}[] {
  const locales = Object.keys(idToSlug);
  return Object.keys(idToSlug[locales[0]]).map((occupationId) => ({
    occupationId,
    slugs: Object.fromEntries(
      locales.map((locale) => [locale, idToSlug[locale][occupationId]]),
    ),
  }));
}

// ── Categories ──

const categorySlugToId: Record<string, Record<string, string>> = categorySlugs;

const categoryIdToSlug: Record<string, Record<string, string>> =
  Object.fromEntries(
    Object.entries(categorySlugToId).map(([locale, slugs]) => [
      locale,
      Object.fromEntries(
        Object.entries(slugs).map(([slug, id]) => [id, slug]),
      ),
    ]),
  );

const categories: BookingCategory[] = bookingData.categories;

// ("fr", "beaute-bien-etre") -> "beauty-wellness"
export function getCategoryIdBySlug(
  locale: string,
  slug: string,
): string | null {
  return categorySlugToId[locale]?.[slug] ?? null;
}

// ("fr", "beauty-wellness") -> "beaute-bien-etre"
export function getCategorySlug(
  locale: string,
  categoryId: string,
): string | null {
  return categoryIdToSlug[locale]?.[categoryId] ?? null;
}

// "beaute-bien-etre" -> "fr"
export function getCategorySlugLocale(slug: string): string | null {
  return (
    Object.keys(categorySlugToId).find(
      (locale) => categorySlugToId[locale][slug],
    ) ?? null
  );
}

export function getCategories(): BookingCategory[] {
  return categories;
}

export function getCategory(categoryId: string): BookingCategory | null {
  return categories.find((c) => c.id === categoryId) ?? null;
}

export function getOccupationCategory(
  occupationId: string,
): BookingCategory | null {
  return (
    categories.find((c) => c.occupations.some((o) => o.id === occupationId)) ??
    null
  );
}

// The other occupations of the same category, in data order.
export function getSiblingOccupationIds(occupationId: string): string[] {
  return (
    getOccupationCategory(occupationId)
      ?.occupations.map((o) => o.id)
      .filter((id) => id !== occupationId) ?? []
  );
}

export function getCategoryLabel(locale: string, categoryId: string): string {
  const labels = getCategory(categoryId)?.labels;
  return labels?.[locale] ?? labels?.en ?? categoryId;
}

// ── Labels ──

const occupationLabelsByLocale: Record<
  string,
  Record<string, OccupationLabels>
> = occupationLabels;

// ("fr", "4e0c14d6-...") -> { one: "barbier", other: "barbiers" }: generic
// masculine, no "/barbière" pair — for copy like "Online booking for barbers".
export function getOccupationLabels(
  locale: string,
  occupationId: string,
): OccupationLabels | null {
  return (
    occupationLabelsByLocale[locale]?.[occupationId] ??
    occupationLabelsByLocale.en?.[occupationId] ??
    null
  );
}
