import type { Page, Block } from "../types";

type FaqBlock = Extract<Block, { type: "faq" }>;

type ArticleSchemaProps = {
  page: Page;
  url: string;
  imageUrl: string;
  authorName: string;
  authorUrl: string;
};

export function ArticleSchema({
  page,
  url,
  imageUrl,
  authorName,
  authorUrl,
}: ArticleSchemaProps) {
  const articleSchema = page.seo.schemas.find((s) => s.type === "article");
  if (!articleSchema || articleSchema.type !== "article") return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleSchema.title,
    description: articleSchema.description,
    image: imageUrl,
    datePublished: `${articleSchema.date}T00:00:00+00:00`,
    dateModified: `${articleSchema.date}T00:00:00+00:00`,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: articleSchema.keywords.join(", "),
    wordCount: articleSchema.readingTime * 200,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type FaqSchemaProps = {
  items: FaqBlock["content"];
};

export function FaqSchema({ items }: FaqSchemaProps) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type BreadcrumbSchemaProps = {
  articleTitle: string;
  articleUrl: string;
  blogUrl: string;
  homeUrl: string;
};

export function BreadcrumbSchema({
  articleTitle,
  articleUrl,
  blogUrl,
  homeUrl,
}: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: blogUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: articleUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
