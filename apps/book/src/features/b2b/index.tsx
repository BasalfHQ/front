import { notFound, redirect } from "next/navigation";
import {
  getOccupationIdBySlug,
  getOccupationSlugLocale,
} from "@/lib/occupation-slug";

// Placeholder until the real B2B collection page is built.
export function OccupationPage({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  if (!getOccupationIdBySlug(locale, slug)) {
    // Slug from another translation (e.g. /fr/for/bricklayer): switch to that locale.
    // Always prefix the locale (even the default "en"): the i18n middleware then
    // updates the NEXT_LOCALE cookie, otherwise it would bounce back to /fr.
    const slugLocale = getOccupationSlugLocale(slug);
    if (slugLocale) {
      redirect(`/${slugLocale}/for/${slug}`);
    }
    notFound();
  }

  return (
    <div className="px-5 py-8">
      <h1 className="text-3xl font-bold">{slug}</h1>
    </div>
  );
}
