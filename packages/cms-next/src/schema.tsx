import "server-only";
import type { Page } from "@basalf/cms";

type FaqItem = { question: string; answer: string };

type ArticleSchemaProps = {
  page: Page;
  url: string;
  imageUrl?: string;
  author?: { name: string; url?: string };
};

export function ArticleSchema({
  page,
  url,
  imageUrl,
  author,
}: ArticleSchemaProps) {
  const articleSchema = page.seo.schemas.find((s) => s.type === "article");
  if (!articleSchema || articleSchema.type !== "article") return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleSchema.title,
    description: articleSchema.description,
    datePublished: `${articleSchema.date}T00:00:00+00:00`,
    dateModified: `${articleSchema.date}T00:00:00+00:00`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: articleSchema.keywords.join(", "),
    wordCount: articleSchema.readingTime * 200,
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  if (author) {
    const authorEntity = { "@type": "Person", name: author.name, url: author.url };
    schema.author = authorEntity;
    schema.publisher = authorEntity;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqSchema({ items }: { items: FaqItem[] }) {
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
