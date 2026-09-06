import Link from "next/link";
import { MoveLeft } from "@repo/ui/icons";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/seo";
import { getArticle, getAllArticles } from "./articles";
import { Description, Text, Heading } from "./components/text";
import { List } from "./components/list";
import { Image } from "./components/image";
import { Faq } from "./components/faq";
import { Related } from "./components/related";
import {
  ArticleSchema,
  FaqSchema,
  BreadcrumbSchema,
} from "./components/schema";
import type { Block } from "./types";

function Space() {
  return <div className="h-6" aria-hidden="true" />;
}

function SliceRenderer({ slice }: { slice: Block }) {
  switch (slice.type) {
    case "description":
      return <Description content={slice.content} />;
    case "text":
      return <Text content={slice.content} />;
    case "heading":
      return <Heading level={slice.level}>{slice.content}</Heading>;
    case "list":
      return <List list={slice.content} />;
    case "image":
      return <Image image={slice.content} />;
    case "faq":
      return <Faq items={slice.content} />;
    case "space":
      return <Space />;
    case "related":
      return null;
  }
}

type BlogProps = {
  orgId: string;
  locale: string;
  slug: string;
  providerName: string;
};

export async function Blog({ orgId, locale, slug, providerName }: BlogProps) {
  const page = await getArticle(orgId, slug, locale);
  if (!page) return notFound();

  const { slices, seo } = page;
  const articleSchema = seo.schemas.find((s) => s.type === "article");

  const relatedSlice = slices.find(
    (s): s is Extract<Block, { type: "related" }> => s.type === "related",
  );
  const allPages = relatedSlice ? await getAllArticles(orgId, locale) : [];

  const faqItems = slices
    .filter((s): s is Extract<Block, { type: "faq" }> => s.type === "faq")
    .flatMap((s) => s.content);

  const localePath = locale === "en" ? "" : `/${locale}`;
  const baseUrl = getBaseUrl();
  const articleUrl = `${baseUrl}${localePath}/service-provider/${orgId}/blog/${slug}`;
  const imageUrl = `${baseUrl}${localePath}/service-provider/${orgId}/blog-image/${slug}`;
  const blogUrl = `${baseUrl}${localePath}/service-provider/${orgId}/blog`;
  const homeUrl = `${baseUrl}${localePath}/service-provider/${orgId}`;

  return (
    <>
      <ArticleSchema
        page={page}
        url={articleUrl}
        imageUrl={imageUrl}
        authorName={providerName}
        authorUrl={homeUrl}
      />
      {faqItems.length > 0 && <FaqSchema items={faqItems} />}
      <BreadcrumbSchema
        articleTitle={seo.title}
        articleUrl={articleUrl}
        blogUrl={blogUrl}
        homeUrl={homeUrl}
      />
      <article className="max-w-2xl mx-auto mb-10">
        <Link
          href={homeUrl}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-fit mb-6 group"
        >
          <MoveLeft size={16} />
          <span className="text-sm border-b border-transparent group-hover:border-border">
            Book an appointment
          </span>
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            {articleSchema && articleSchema.type === "article" && (
              <>
                <time dateTime={articleSchema.date}>
                  {new Date(articleSchema.date).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{articleSchema.readingTime} min read</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{seo.title}</h1>
          <p className="text-lg text-muted-foreground">{seo.description}</p>
        </header>

        <div className="space-y-4">
          {slices.map((slice, index) => (
            <SliceRenderer key={index} slice={slice} />
          ))}
        </div>

        {relatedSlice && (
          <Related
            urls={relatedSlice.content}
            allPages={allPages}
            orgId={orgId}
            locale={locale}
          />
        )}

        <footer className="mt-12 pt-8 border-t border-border">
          <div className="bg-muted rounded-lg p-6 text-center">
            <p className="text-foreground mb-4">
              Ready to book an appointment?
            </p>
            <Link
              href={homeUrl}
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Book now
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}

export { getAllArticles, getAllArticlesWithFallback } from "./articles";
export type { PageSummary } from "./types";
