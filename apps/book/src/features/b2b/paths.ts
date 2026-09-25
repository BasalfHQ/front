import { baseUrl } from "@repo/config";
import { routing } from "@repo/i18n";
import { getBaseUrl } from "@/lib/seo";
import {
  getCategorySlug,
  getOccupationCategory,
  getOccupationSlug,
} from "@/lib/occupation-slug";

// Final URLs only (never one that redirects): the default locale has no prefix.
export function localePrefix(locale: string): string {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

export function forHubPath(locale: string): string {
  return `${localePrefix(locale)}/for`;
}

// /for/{categorySlug}
export function categoryPath(
  locale: string,
  categoryId: string,
): string | null {
  const slug = getCategorySlug(locale, categoryId);
  return slug ? `${localePrefix(locale)}/for/${slug}` : null;
}

// /for/{categorySlug}/{articleSlug} — article of a category folder.
export function categoryArticlePath(
  locale: string,
  categoryId: string,
  articleSlug: string,
): string | null {
  const path = categoryPath(locale, categoryId);
  return path ? `${path}/${articleSlug}` : null;
}

// /for/{categorySlug}/{occupationSlug}
export function occupationPath(
  locale: string,
  occupationId: string,
): string | null {
  const category = getOccupationCategory(occupationId);
  const parent = category ? categoryPath(locale, category.id) : null;
  const slug = getOccupationSlug(locale, occupationId);
  return parent && slug ? `${parent}/${slug}` : null;
}

// /for/{categorySlug}/{occupationSlug}/{articleSlug}
export function articlePath(
  locale: string,
  occupationId: string,
  articleSlug: string,
): string | null {
  const path = occupationPath(locale, occupationId);
  return path ? `${path}/${articleSlug}` : null;
}

export function absoluteUrl(path: string): string {
  return `${getBaseUrl()}${path === "/" ? "" : path}`;
}

// Every CTA goes to the checkout of the base app (another app: plain <a>).
export function checkoutUrl(locale: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `${locale}/`;
  return `${baseUrl}${prefix}checkout`;
}

// "barbier" -> "Barbier"
export function capitalize(label: string, locale: string): string {
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
}
