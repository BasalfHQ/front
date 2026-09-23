import occupationSlugs from "@repo/esco/data/occupation-slugs.json";

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
