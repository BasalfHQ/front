import Link from "next/link";
import { notFound } from "next/navigation";
import type { CmsPage } from "@basalf/cms-next";
import { getB2bTranslations } from "./pricing";
import { SliceRenderer } from "@/features/cms-slices";
import { getOccupationLabels } from "@/lib/occupation-slug";
import {
  getFolderArticle,
  getFolderArticles,
  resolveCmsUrl,
  type ArticleSummary,
} from "./content";
import { getCategoryAudience } from "./audience";
import { getLandingCrumbs } from "./crumbs";
import { folderArticlePath, folderPath, type Folder } from "./folder";
import { absoluteUrl } from "./paths";
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

// Plural audience of a folder, e.g. "barbers", "beauty & wellness pros".
async function getFolderAudience(
  locale: string,
  folder: Folder,
): Promise<string | null> {
  return folder.kind === "occupation"
    ? (getOccupationLabels(locale, folder.id)?.other ?? null)
    : getCategoryAudience(locale, folder.id);
}

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

  return (
    <FolderArticlePage
      locale={locale}
      folder={{ kind: "occupation", id: occupationId }}
      articleSlug={articleSlug}
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
  return (
    <FolderArticlePage
      locale={locale}
      folder={{ kind: "category", id: categoryId }}
      articleSlug={articleSlug}
    />
  );
}

async function FolderArticlePage({
  locale,
  folder,
  articleSlug,
}: {
  locale: string;
  folder: Folder;
  articleSlug: string;
}) {
  const page = await getFolderArticle(locale, folder, articleSlug);
  const audience = await getFolderAudience(locale, folder);
  const path = folderArticlePath(locale, folder, articleSlug);
  const landing = folderPath(locale, folder);
  if (!page || !audience || !path || !landing) notFound();

  const t = await getB2bTranslations(locale, "b2b");
  const schema = page.seo.schemas.find((s) => s.type === "article");
  const meta = schema?.type === "article" ? schema : null;

  const related = page.slices.find(
    (s): s is Extract<CmsPage["slices"][number], { type: "related" }> =>
      s.type === "related",
  );
  const relatedLinks = related
    ? (await Promise.all(related.content.map((u) => resolveCmsUrl(locale, u))))
        .filter((l): l is { href: string; label: string } => l !== null)
    : [];
  const moreArticles = (await getFolderArticles(locale, folder))
    .filter((a) => a.slug !== articleSlug)
    .slice(0, MORE_ARTICLES);
  const faq = page.slices.flatMap((s) => (s.type === "faq" ? s.content : []));

  const crumbs: Crumb[] = [
    ...(await getLandingCrumbs(locale, folder)),
    { label: page.seo.title, href: path },
  ];

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
          audience,
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
              href={landing}
              className="text-foreground no-underline hover:underline"
            >
              {t("articles.backToLanding", { occupations: audience })}
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
              {t("articles.listTitle", { occupations: audience })}
            </SectionTitle>
            <ArticleCards
              articles={moreArticles}
              href={(s) => folderArticlePath(locale, folder, s) ?? ""}
            />
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
