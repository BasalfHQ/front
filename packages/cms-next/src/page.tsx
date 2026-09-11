import "server-only";
import { notFound } from "next/navigation";
import type { Block } from "@basalf/cms";
import { getAllPages, getPageBySlug } from "./pages";
import {
  Description,
  Faq,
  Heading,
  ImageBlock,
  List,
  Related,
  Space,
  Table,
  Text,
  type GetHref,
} from "./blocks";
import { ArticleSchema, FaqSchema } from "./schema";

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
      return <ImageBlock image={slice.content} />;
    case "faq":
      return <Faq items={slice.content} />;
    case "space":
      return <Space />;
    case "table":
      return <Table table={slice.content} />;
    case "related":
      return null;
  }
}

const defaultGetHref: GetHref = (slug, locale) => `/${locale}/${slug}`;

export type PageProps = {
  /** CMS page slug, e.g. "pricing" or "/pricing" */
  slug: string;
  locale: string;
  /** Canonical URL of this page, used for JSON-LD (mainEntityOfPage). */
  url: string;
  /** Builds the href for a related-page link. Defaults to `/{locale}/{slug}`. */
  getHref?: GetHref;
  /** Image URL used in the Article JSON-LD, if any. */
  imageUrl?: string;
  /** Author used in the Article JSON-LD, if any. */
  author?: { name: string; url?: string };
  /** Extra classes appended to the outer <article> wrapper. */
  className?: string;
};

export async function Page({
  slug,
  locale,
  url,
  getHref = defaultGetHref,
  imageUrl,
  author,
  className,
}: PageProps) {
  const page = await getPageBySlug(slug, locale);
  if (!page) return notFound();

  const { slices, seo } = page;

  const relatedSlice = slices.find(
    (s): s is Extract<Block, { type: "related" }> => s.type === "related",
  );
  const allPages = relatedSlice ? await getAllPages(locale) : [];

  const faqItems = slices
    .filter((s): s is Extract<Block, { type: "faq" }> => s.type === "faq")
    .flatMap((s) => s.content);

  return (
    <article
      className={["mx-auto max-w-2xl px-5 py-8 md:px-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ArticleSchema page={page} url={url} imageUrl={imageUrl} author={author} />
      {faqItems.length > 0 && <FaqSchema items={faqItems} />}

      <header className="mb-8">
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
          locale={locale}
          getHref={getHref}
        />
      )}
    </article>
  );
}
