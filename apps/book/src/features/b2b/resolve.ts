import { notFound, permanentRedirect } from "next/navigation";
import {
  getCategoryIdBySlug,
  getCategorySlugLocale,
  getOccupationCategory,
  getOccupationIdBySlug,
  getOccupationSlugLocale,
} from "@/lib/occupation-slug";
import { localePrefix, occupationPath } from "./paths";

// Redirects to another locale always prefix it (even the default "en"): the
// i18n middleware then updates the NEXT_LOCALE cookie, otherwise it would
// bounce back to /fr. `rest`: path after the resolved segment, kept.

function redirectToOccupation(
  requestLocale: string,
  locale: string,
  occupationId: string,
  rest: string,
): never {
  const path = occupationPath(locale, occupationId);
  if (!path) notFound();
  permanentRedirect(
    locale === requestLocale
      ? `${path}${rest}`
      : `/${locale}${path.slice(localePrefix(locale).length)}${rest}`,
  );
}

// /for/{slug}: a category of this locale. A category slug from another
// translation switches locale; an occupation slug (flat URL /for/{occupation})
// moves under its category.
export function resolveCategoryId(
  locale: string,
  slug: string,
  rest = "",
): string {
  const categoryId = getCategoryIdBySlug(locale, slug);
  if (categoryId) return categoryId;

  const categoryLocale = getCategorySlugLocale(slug);
  if (categoryLocale) permanentRedirect(`/${categoryLocale}/for/${slug}${rest}`);

  const occupationLocale = getOccupationSlugLocale(slug);
  const occupationId =
    occupationLocale && getOccupationIdBySlug(occupationLocale, slug);
  if (occupationLocale && occupationId) {
    redirectToOccupation(locale, occupationLocale, occupationId, rest);
  }
  notFound();
}

// /for/{category}/{slug}: the occupation it names, if any. Occupations always
// win over category articles. An occupation filed under the wrong category or
// from another translation redirects to its URL. Null: not an occupation.
export function matchOccupationId(
  locale: string,
  categoryId: string,
  slug: string,
  rest = "",
): string | null {
  const ownId = getOccupationIdBySlug(locale, slug);
  const occupationLocale = ownId ? locale : getOccupationSlugLocale(slug);
  const occupationId =
    ownId ?? (occupationLocale && getOccupationIdBySlug(occupationLocale, slug));
  if (!occupationLocale || !occupationId) return null;

  if (
    occupationLocale === locale &&
    getOccupationCategory(occupationId)?.id === categoryId
  ) {
    return occupationId;
  }
  redirectToOccupation(locale, occupationLocale, occupationId, rest);
}
