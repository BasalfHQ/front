import { absoluteUrl, checkoutUrl } from "../paths";
import { BOOK_PRICE } from "../pricing";
import type { Crumb } from "./breadcrumbs";

const BASALF = {
  "@type": "Organization",
  name: "Basalf",
  url: "https://basalf.com",
  logo: absoluteUrl("/logo.png"),
};

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

// Pages listed by a hub (trades of a category, categories of /for).
export function itemListSchema(links: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: links.length,
    itemListElement: links.map((link, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: link.label,
      url: absoluteUrl(link.href),
    })),
  };
}

// Book as a product for sale, pitched to one audience (e.g. "barbers").
// Also typed Product: Google shows the price of a Product offer in results
// (product snippet), a SoftwareApplication alone needs ratings we don't have.
export function softwareApplicationSchema({
  locale,
  description,
  url,
  audience,
  features,
}: {
  locale: string;
  description: string;
  url: string;
  audience?: string;
  features: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Product"],
    name: "Book",
    brand: { "@type": "Brand", name: "Basalf" },
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Online booking",
    operatingSystem: "Web",
    inLanguage: locale,
    description,
    url,
    featureList: features,
    ...(audience && {
      audience: { "@type": "BusinessAudience", audienceType: audience },
    }),
    publisher: BASALF,
    offers: {
      "@type": "Offer",
      price: String(BOOK_PRICE.amount),
      priceCurrency: BOOK_PRICE.currency,
      url: checkoutUrl(locale),
      availability: "https://schema.org/InStock",
      seller: BASALF,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(BOOK_PRICE.amount),
        priceCurrency: BOOK_PRICE.currency,
        billingDuration: BOOK_PRICE.billingDuration,
      },
    },
  };
}

// Answers are HTML: schema.org accepts it in Answer.text.
export function faqPageSchema(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// Articles are signed by Basalf (no invented author).
export function articleSchema({
  locale,
  title,
  description,
  url,
  date,
  keywords,
  audience,
}: {
  locale: string;
  title: string;
  description: string;
  url: string;
  date: string | null;
  keywords: string[];
  audience: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    ...(date && { datePublished: date, dateModified: date }),
    ...(keywords.length && { keywords: keywords.join(", ") }),
    audience: { "@type": "BusinessAudience", audienceType: audience },
    author: BASALF,
    publisher: BASALF,
  };
}
