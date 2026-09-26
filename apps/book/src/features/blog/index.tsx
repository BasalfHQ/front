import Link from "next/link";
import { MoveLeft } from "@repo/ui/icons";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/seo";
import { SliceRenderer, type Block } from "@/features/cms-slices";
import { getPost, getAllPosts } from "./posts";
import { Related } from "./components/related";
import {
  ArticleSchema,
  FaqSchema,
  BreadcrumbSchema,
} from "./components/schema";

type BlogProps = {
  orgId: string;
  locale: string;
  slug: string;
  providerName: string;
};

export async function Blog({ orgId, locale, slug, providerName }: BlogProps) {
  const page = await getPost(orgId, slug, locale);
  if (!page) return notFound();

  const { slices, seo } = page;
  const articleSchema = seo.schemas.find((s) => s.type === "article");

  const relatedSlice = slices.find(
    (s): s is Extract<Block, { type: "related" }> => s.type === "related",
  );
  const allPages = relatedSlice ? await getAllPosts(orgId, locale) : [];

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
      <article className="mx-auto mb-10 max-w-2xl px-5 py-8 md:px-6">
        <Link
          href={homeUrl}
          className="mb-6 flex min-h-[44px] w-fit items-center gap-2 text-info hover:underline"
        >
          <MoveLeft size={16} />
          <span className="text-sm font-medium">Book an appointment</span>
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
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-info px-6 text-sm font-semibold text-info-foreground hover:bg-info/90"
            >
              Book now
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}

export { getAllPosts, getAllPostsWithFallback } from "./posts";
export type { PageSummary } from "./types";
