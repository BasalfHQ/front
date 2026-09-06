import Link from "next/link";
import type { Book } from "@repo/apis";

type PageSummary = Book.AllPages[number];

type RelatedProps = {
  urls: string[];
  allPages: Book.AllPages;
  orgId: string;
  locale: string;
};

export function Related({ urls, allPages, orgId, locale }: RelatedProps) {
  const relatedArticles = urls
    .map((url) => allPages.find((p) => p.url === `/${url}` || p.url === url))
    .filter((p): p is PageSummary => p !== undefined);

  if (relatedArticles.length === 0) return null;

  const localePath = locale === "en" ? "" : `/${locale}`;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold mb-4">Related articles</h2>
      <div className="space-y-4">
        {relatedArticles.map((related) => (
          <Link
            key={related.url}
            href={`${localePath}/service-provider/${orgId}/blog${related.url}`}
            className="block p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium mt-2">{related.seo.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {related.seo.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
