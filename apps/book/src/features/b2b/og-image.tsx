import { ImageResponse } from "next/og";
import { formatPrice, getB2bTranslations } from "./pricing";
import {
  getCategoryIdBySlug,
  getOccupationIdBySlug,
  getOccupationLabels,
} from "@/lib/occupation-slug";
import { getCategoryAudience } from "./audience";
import { getFolderArticle } from "./content";

export const ogImageSize = { width: 1200, height: 630 };

// Social card of the B2B pages: page title, price, CTA, in the site's colours.
export async function renderOgImage(locale: string, title: string) {
  const t = await getB2bTranslations(locale, "b2b");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "hsl(40 18% 97%)",
          color: "hsl(30 10% 13%)",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "hsl(186 58% 27%)",
          }}
        >
          Book
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 88, fontWeight: 700 }}>
              {formatPrice(locale)}
            </span>
            <span style={{ fontSize: 32, fontWeight: 600 }}>
              {t("hero.perMonth")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 12,
              background: "hsl(26 32% 30%)",
              color: "hsl(40 20% 98%)",
              padding: "20px 36px",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            {t("cta")}
          </div>
        </div>
      </div>
    ),
    ogImageSize,
  );
}

// /for/{category}
export async function getCategoryOgTitle(
  locale: string,
  slug: string,
): Promise<string> {
  const t = await getB2bTranslations(locale, "b2b");
  const categoryId = getCategoryIdBySlug(locale, slug);
  return categoryId
    ? t("hero.title", {
        occupations: await getCategoryAudience(locale, categoryId),
      })
    : t("hub.title");
}

// /for/{category}/{slug}: occupation first, else category article.
export async function getCategoryChildOgTitle(
  locale: string,
  category: string,
  slug: string,
): Promise<string> {
  const t = await getB2bTranslations(locale, "b2b");
  const occupationId = getOccupationIdBySlug(locale, slug);
  const labels = occupationId && getOccupationLabels(locale, occupationId);
  if (labels) return t("hero.title", { occupations: labels.other });

  const categoryId = getCategoryIdBySlug(locale, category);
  const article = categoryId
    ? await getFolderArticle(locale, { kind: "category", id: categoryId }, slug)
    : null;
  return article?.seo.title ?? t("hub.title");
}
