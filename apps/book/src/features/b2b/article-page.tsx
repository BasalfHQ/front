import Link from "next/link";
import { notFound } from "next/navigation";
import type { CmsPage } from "@basalf/cms-next";
import { getB2bTranslations } from "./pricing";
import { SliceRenderer } from "@/features/blog";
import {
  getCategoryIdBySlug,
  getOccupationIdBySlug,
  getOccupationLabels,
} from "@/lib/occupation-slug";
import {
  getCategoryArticle,
  getCategoryArticles,
  getCategoryContent,
  getOccupationArticle,
  getOccupationArticles,
  getOccupationContent,
  type ArticleSummary,
} from "./content";
import { getCategoryAudience } from "./audience";
import { getLandingCrumbs } from "./crumbs";
import {
  absoluteUrl,
  articlePath,
  categoryArticlePath,
  categoryPath,
  occupationPath,
} from "./paths";
import { matchOccupationId, resolveCategoryId } from "./resolve";
import { Breadcrumbs, type Crumb } from "./components/breadcrumbs";
import { CtaLink } from "./components/cta-link";
import { Container, SectionTitle } from "./components/section";
import {
  JsonLd,
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
} from "./components/json-ld";

const MORE_ARTICLES = 3;

type RelatedLink = { href: string; label: string };

// CMS url ("/barber", "/barber/reduce-no-shows", "/beauty-wellness",
// "/beauty-wellness/some-article") -> public path in `locale`, only when that
// page is live. For "related" slices.
async function cmsUrlToPath(locale: string, cmsUrl: string): Promise<RelatedLink | null> {
  const [enSlug, articleSlug, ...extra] = cmsUrl.replace(/^\//, "").split("/");
  if (!enSlug || extra.length) return null;

  const occupationId = getOccupationIdBySlug("en", enSlug);
  if (occupationId) {
    if (articleSlug) {
      const article = await getOccupationArticle(locale, occupationId, articleSlug);
      const href = articlePath(locale, occupationId, articleSlug);
      return article && href ? { href, label: article.seo.title } : null;
    }
    const content = await getOccupationContent(locale, occupationId);
    const href = occupationPath(locale, occupationId);
    return content && href ? { href, label: content.seo.title } : null;
  }

  const categoryId = getCategoryIdBySlug("en", enSlug);
  if (!categoryId) return null;
  if (articleSlug) {
    const article = await getCategoryArticle(locale, categoryId, articleSlug);
    const href = categoryArticlePath(locale, categoryId, articleSlug);
    return article && href ? { href, label: article.seo.title } : null;
  }
  const content = await getCategoryContent(locale, categoryId);
  const href = categoryPath(locale, categoryId);
  return content && href ? { href, label: content.seo.title } : null;
}

// The landing page an article belongs to (occupation or category).
type Folder = {
  // Breadcrumbs down to the landing page
  crumbs: Crumb[];
  landing: string;
  // Plural audience, e.g. "barbers"
  audience: string;
  articles: ArticleSummary[];
  href: (articleSlug: string) => string;
};

// /for/{category}/{occupation}/{article}
export async function OccupationArticlePage({
  locale,
  category,
  slug,
  articleSlug,
}: {
  locale: string;
  category: string;
  slug: string;
  articleSlug: string;
}) {
  const rest = `/${articleSlug}`;
  const categoryId = resolveCategoryId(locale, category, `/${slug}${rest}`);
  const occupationId = matchOccupationId(locale, categoryId, slug, rest);
  if (!occupationId) notFound();

  const page = await getOccupationArticle(locale, occupationId, articleSlug);
  const labels = getOccupationLabels(locale, occupationId);
  if (!page || !labels) notFound();

  return (
    <ArticlePage
      locale={locale}
      page={page}
      articleSlug={articleSlug}
      folder={{
        crumbs: await getLandingCrumbs(locale, { occupationId }),
        landing: occupationPath(locale, occupationId) ?? "",
        audience: labels.other,
        articles: await getOccupationArticles(locale, occupationId),
        href: (s) => articlePath(locale, occupationId, s) ?? "",
      }}
    />
  );
}

// /for/{category}/{article} — only reached once {article} is known not to be
// an occupation.
export async function CategoryArticlePage({
  locale,
  categoryId,
  articleSlug,
}: {
  locale: string;
  categoryId: string;
  articleSlug: string;
}) {
  const page = await getCategoryArticle(locale, categoryId, articleSlug);
  if (!page) notFound();

  return (
    <ArticlePage
      locale={locale}
      page={page}
      articleSlug={articleSlug}
      folder={{
        crumbs: await getLandingCrumbs(locale, { categoryId }),
        landing: categoryPath(locale, categoryId) ?? "",
        audience: await getCategoryAudience(locale, categoryId),
        articles: await getCategoryArticles(locale, categoryId),
        href: (s) => categoryArticlePath(locale, categoryId, s) ?? "",
      }}
    />
  );
}

async function ArticlePage({
  locale,
  page,
  articleSlug,
  folder,
}: {
  locale: string;
  page: CmsPage;
  articleSlug: string;
  folder: Folder;
}) {
  const t = await getB2bTranslations(locale, "b2b");
  const path = folder.href(articleSlug);
  const schema = page.seo.schemas.find((s) => s.type === "article");
  const meta = schema?.type === "article" ? schema : null;

  const related = page.slices.find(
    (s): s is Extract<CmsPage["slices"][number], { type: "related" }> =>
      s.type === "related",
  );
  const relatedLinks = related
    ? (await Promise.all(related.content.map((u) => cmsUrlToPath(locale, u))))
        .filter((l): l is RelatedLink => l !== null)
    : [];
  const moreArticles = folder.articles
    .filter((a) => a.slug !== articleSlug)
    .slice(0, MORE_ARTICLES);
  const faq = page.slices.flatMap((s) => (s.type === "faq" ? s.content : []));

  const crumbs = [...folder.crumbs, { label: page.seo.title, href: path }];

  return (
    <Container>
      <JsonLd
        data={articleSchema({
          locale,
          title: page.seo.title,
          description: page.seo.description,
          url: absoluteUrl(path),
          date: meta?.date ?? null,
          keywords: meta?.keywords ?? page.seo.keywords ?? [],
          audience: folder.audience,
        })}
      />
      <JsonLd data={breadcrumbListSchema(crumbs)} />
      {faq.length > 0 && <JsonLd data={faqPageSchema(faq)} />}

      <article className="mx-auto max-w-[720px] pb-16 pt-4 lg:pt-8">
        <Breadcrumbs label={t("breadcrumb.label")} crumbs={crumbs} />
        <header className="mb-8 mt-4 flex flex-col gap-4">
          <h1 className="m-0 text-balance text-4xl font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            {page.seo.title}
          </h1>
          <p className="m-0 leading-7 text-muted-foreground">
            {page.seo.description}
          </p>
          {meta && (
            <p className="m-0 flex gap-2 text-sm text-muted-foreground">
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>
                {t("articles.readingTime", { minutes: meta.readingTime })}
              </span>
            </p>
          )}
        </header>

        <div className="space-y-4 leading-7">
          {page.slices.map((slice, i) => (
            <SliceRenderer key={i} slice={slice} />
          ))}
        </div>

        {relatedLinks.length > 0 && (
          <ul className="mt-10 flex list-none flex-col gap-2 p-0">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-info hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <aside className="mt-12 flex flex-col gap-4 rounded-lg border border-border bg-card p-6 lg:p-8">
          <p className="m-0 text-2xl font-bold leading-tight">
            <Link
              href={folder.landing}
              className="text-foreground no-underline hover:underline"
            >
              {t("articles.backToLanding", { occupations: folder.audience })}
            </Link>
          </p>
          <p className="m-0 leading-6 text-muted-foreground">
            {t("articles.ctaText")}
          </p>
          <CtaLink
            locale={locale}
            label={t("cta")}
            className="self-stretch lg:self-start"
          />
        </aside>

        {moreArticles.length > 0 && (
          <section className="mt-12 flex flex-col gap-4">
            <SectionTitle>
              {t("articles.listTitle", { occupations: folder.audience })}
            </SectionTitle>
            <ArticleCards articles={moreArticles} href={folder.href} />
          </section>
        )}
      </article>
    </Container>
  );
}

// Article cards of one folder.
export function ArticleCards({
  articles,
  href,
}: {
  articles: ArticleSummary[];
  href: (articleSlug: string) => string;
}) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={href(article.slug)}
            className="block rounded-lg border border-border bg-card p-5 text-foreground no-underline hover:border-foreground/40"
          >
            <span className="block text-lg font-semibold leading-6">
              {article.title}
            </span>
            <span className="mt-1 block leading-6 text-muted-foreground">
              {article.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
