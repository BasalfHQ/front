import { cache } from "react";
import CMS from "@basalf/cms";
import type { AllPages, CmsPage } from "@basalf/cms-next";
import { env } from "@repo/config";
import {
  getAllOccupationSlugs,
  getCategories,
  getCategorySlug,
  getOccupationSlug,
  getOccupationSlugLocale,
} from "@/lib/occupation-slug";
import { devOccupationPages } from "./dev-fixtures";

// Content of a B2B landing page (occupation or category), from its CMS page.
export type ExampleService = { name: string; duration: string; price: string };

export type LandingContent = {
  seo: { title: string; description: string };
  // Hero pitch, HTML (CMS "description" slice)
  pitch: string;
  // Example services (CMS "table" slice: name | duration | price rows)
  services: ExampleService[];
  // CMS "faq" slice, answers are HTML
  faq: { question: string; answer: string }[];
  // Every other content slice (heading, text, list, image, extra table), in
  // order: the long-form, page-specific part of the page.
  guide: GuideSlice[];
};

export type GuideSlice = Extract<
  CmsPage["slices"][number],
  { type: "heading" | "text" | "list" | "image" | "table" }
>;

const GUIDE_TYPES = new Set(["heading", "text", "list", "image", "table"]);

// CMS urls are the same key in every locale, one folder per landing page,
// keyed by English slug (category and occupation slugs never collide, see
// packages/esco/scripts/generate_occupation_slugs.py):
//   "/{occupationEnSlug}"               occupation landing page
//   "/{occupationEnSlug}/{articleSlug}" articles of that occupation
//   "/{categoryEnSlug}"                 category landing page
//   "/{categoryEnSlug}/{articleSlug}"   articles of that category — never an
//                                       occupation slug: occupations own
//                                       /for/{category}/{slug}
export function getOccupationCmsUrl(occupationId: string): string | null {
  const enSlug = getOccupationSlug("en", occupationId);
  return enSlug ? `/${enSlug}` : null;
}

export function getCategoryCmsUrl(categoryId: string): string | null {
  const enSlug = getCategorySlug("en", categoryId);
  return enSlug ? `/${enSlug}` : null;
}

export const ARTICLE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// A category article slug shares /for/{category}/{slug} with occupations:
// any occupation slug (any locale) is reserved for the occupation.
export function isCategoryArticleSlug(slug: string): boolean {
  return ARTICLE_SLUG.test(slug) && !getOccupationSlugLocale(slug);
}

export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  date: string | null;
};

// ── CMS access ──
// Token of the Book website: BASALF_{STAGE}_BOOK_CMS_TOKEN (server-only, see
// @repo/config). Without it, dev falls back to ./dev-fixtures.

type PageSummary = AllPages[number];

let client: CMS | undefined;
function getClient(): CMS {
  const token = env.bookCmsToken();
  if (!token) {
    throw new Error(
      `BASALF_${env.stage.toUpperCase()}_BOOK_CMS_TOKEN environment variable is required`,
    );
  }
  client ??= new CMS(token);
  return client;
}

const useFixtures = () => !env.bookCmsToken() && env.stage === "dev";

// The CMS only lists every page of every locale at once: fetch that list once
// and share it (all locales, the sitemap, the pages) for a minute. React
// cache() alone isn't enough: it doesn't dedupe in route handlers
// (/sitemap.xml), which call this hundreds of times.
const SUMMARIES_TTL_MS = 60_000;

type Snapshot = {
  at: number;
  byLocale: Promise<Map<string, Map<string, PageSummary>>>;
};
let snapshot: Snapshot | undefined;

async function indexByLocale(
  pages: Promise<AllPages>,
): Promise<Map<string, Map<string, PageSummary>>> {
  const byLocale = new Map<string, Map<string, PageSummary>>();
  for (const page of await pages) {
    if (!byLocale.has(page.locale)) byLocale.set(page.locale, new Map());
    byLocale.get(page.locale)!.set(page.url, page);
  }
  return byLocale;
}

function getSnapshot(): Snapshot["byLocale"] {
  if (snapshot && Date.now() - snapshot.at < SUMMARIES_TTL_MS) {
    return snapshot.byLocale;
  }
  const byLocale = indexByLocale(
    useFixtures()
      ? Promise.resolve(devOccupationPages)
      : getClient().getPages(),
  );
  const current = { at: Date.now(), byLocale };
  snapshot = current;
  // A failed fetch isn't kept: the next call retries.
  byLocale.catch(() => {
    if (snapshot === current) snapshot = undefined;
  });
  return byLocale;
}

// Summaries (url + seo, no slices) of every page in this locale, by url.
async function getSummariesByUrl(
  locale: string,
): Promise<Map<string, PageSummary>> {
  return (await getSnapshot()).get(locale) ?? new Map();
}

// Full page, only in this exact locale: never another translation served as
// if it were live.
const getCmsPage = cache(
  async (locale: string, url: string): Promise<CmsPage | null> => {
    const summary = (await getSummariesByUrl(locale)).get(url);
    if (!summary) return null;
    const page = useFixtures()
      ? devOccupationPages.find((p) => p.pageId === summary.pageId)
      : await getClient().getPage(summary.pageId);
    return page?.locale === locale ? page : null;
  },
);

// ── Landing pages ──

// Null when the occupation has no CMS page in this locale: the page isn't live.
export async function getOccupationContent(
  locale: string,
  occupationId: string,
): Promise<LandingContent | null> {
  const url = getOccupationCmsUrl(occupationId);
  const page = url ? await getCmsPage(locale, url) : null;
  return page ? toLandingContent(page) : null;
}

// Null when the category has no CMS page in this locale: the page isn't live.
export async function getCategoryContent(
  locale: string,
  categoryId: string,
): Promise<LandingContent | null> {
  const url = getCategoryCmsUrl(categoryId);
  const page = url ? await getCmsPage(locale, url) : null;
  return page ? toLandingContent(page) : null;
}

// Occupations with a live page in this locale.
export async function getLiveOccupationIds(
  locale: string,
): Promise<Set<string>> {
  const pages = await getSummariesByUrl(locale);
  return new Set(
    getAllOccupationSlugs()
      .filter(({ slugs }) => pages.has(`/${slugs.en}`))
      .map(({ occupationId }) => occupationId),
  );
}

// Categories with a live page in this locale.
export async function getLiveCategoryIds(
  locale: string,
): Promise<Set<string>> {
  const pages = await getSummariesByUrl(locale);
  return new Set(
    getCategories()
      .map((c) => c.id)
      .filter((id) => {
        const url = getCategoryCmsUrl(id);
        return url !== null && pages.has(url);
      }),
  );
}

// Locales in which a page is live — for hreflang alternates.
export async function getLiveLocales(
  kind: "occupation" | "category",
  id: string,
  locales: readonly string[],
): Promise<string[]> {
  const getLive =
    kind === "occupation" ? getLiveOccupationIds : getLiveCategoryIds;
  const live = await Promise.all(
    locales.map(async (locale) => (await getLive(locale)).has(id)),
  );
  return locales.filter((_, i) => live[i]);
}

function toLandingContent(page: CmsPage): LandingContent {
  const slices = page.slices;
  const description = slices.find((s) => s.type === "description");
  const table = slices.find((s) => s.type === "table");
  const faq = slices.find((s) => s.type === "faq");

  return {
    seo: { title: page.seo.title, description: page.seo.description },
    pitch: description?.type === "description" ? description.content : "",
    services:
      table?.type === "table"
        ? table.content.rows
            .filter((row) => row[0])
            .map(([name, duration = "", price = ""]) => ({
              name,
              duration,
              price,
            }))
        : [],
    faq: faq?.type === "faq" ? faq.content : [],
    guide: slices.filter(
      (s): s is GuideSlice => s !== table && GUIDE_TYPES.has(s.type),
    ),
  };
}

// ── Articles ──
// Live only when their landing page is live in the same locale: the article
// lives in its folder and links back to it.

function articleDate(page: PageSummary): string | null {
  const schema = page.seo.schemas.find((s) => s.type === "article");
  return schema?.type === "article" ? schema.date : null;
}

// Articles of the folder at `url`, newest first.
async function getFolderArticles(
  locale: string,
  url: string | null,
  isSlug: (slug: string) => boolean,
): Promise<ArticleSummary[]> {
  const pages = await getSummariesByUrl(locale);
  if (!url || !pages.has(url)) return [];

  return [...pages.values()]
    .flatMap((page) => {
      const slug = page.url.startsWith(`${url}/`)
        ? page.url.slice(url.length + 1)
        : null;
      return slug && isSlug(slug)
        ? [
            {
              slug,
              title: page.seo.title,
              description: page.seo.description,
              date: articleDate(page),
            },
          ]
        : [];
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

async function getFolderArticle(
  locale: string,
  url: string | null,
  articleSlug: string,
): Promise<CmsPage | null> {
  if (!url) return null;
  if (!(await getSummariesByUrl(locale)).has(url)) return null;
  return getCmsPage(locale, `${url}/${articleSlug}`);
}

export async function getOccupationArticles(
  locale: string,
  occupationId: string,
): Promise<ArticleSummary[]> {
  return getFolderArticles(
    locale,
    getOccupationCmsUrl(occupationId),
    (slug) => ARTICLE_SLUG.test(slug),
  );
}

export async function getOccupationArticle(
  locale: string,
  occupationId: string,
  articleSlug: string,
): Promise<CmsPage | null> {
  if (!ARTICLE_SLUG.test(articleSlug)) return null;
  return getFolderArticle(
    locale,
    getOccupationCmsUrl(occupationId),
    articleSlug,
  );
}

export async function getCategoryArticles(
  locale: string,
  categoryId: string,
): Promise<ArticleSummary[]> {
  return getFolderArticles(
    locale,
    getCategoryCmsUrl(categoryId),
    isCategoryArticleSlug,
  );
}

export async function getCategoryArticle(
  locale: string,
  categoryId: string,
  articleSlug: string,
): Promise<CmsPage | null> {
  if (!isCategoryArticleSlug(articleSlug)) return null;
  return getFolderArticle(locale, getCategoryCmsUrl(categoryId), articleSlug);
}
