import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Book } from "@repo/apis";
import { getAllArticlesWithFallback } from "@/features/blog";
import { getBaseUrl } from "@/lib/seo";
import { getTranslations } from "@repo/i18n";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orgId } = await params;
  const [org, sps] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
  ]);

  if (!org || !sps || sps.length === 0) return {};

  const sp = sps[0];
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const localePath = locale === "en" ? "" : `/${locale}`;
  const url = `${getBaseUrl()}${localePath}/service-provider/${orgId}/blog`;

  return {
    title: `Blog | ${providerName}`,
    description: `Articles and insights from ${providerName}`,
    openGraph: {
      title: `Blog | ${providerName}`,
      description: `Articles and insights from ${providerName}`,
      type: "website",
      images: [
        {
          url: `${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `Blog - ${providerName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${url}/opengraph-image`],
    },
  };
}

export default async function BlogIndex({ params }: Props) {
  const { locale, orgId } = await params;
  const [org, sps, articles, t] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    getAllArticlesWithFallback(orgId, locale),
    getTranslations("homepage"),
  ]);

  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const sp = sps[0];
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const localePath = locale === "en" ? "" : `/${locale}`;

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto mb-10">
      <Link
        href={`${localePath}/service-provider/${orgId}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {t("back")}</Link>
      <header className="mb-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Articles and insights from {providerName}
        </p>
      </header>

      <div className="space-y-6">
        {articles.map((article) => {
          const articleSchema = article.seo.schemas.find(
            (s) => s.type === "article",
          );
          const articleLocalePath =
            article.locale === "en" ? "" : `/${article.locale}`;
          const langFlag =
            article.locale === "fr" ? "🇫🇷" : article.locale === "en" ? "🇬🇧" : "";
          return (
            <Link
              key={article.pageId}
              href={`${articleLocalePath}/service-provider/${orgId}/blog${article.url}`}
              className="block p-6 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                {article.isOtherLocale && (
                  <span title={article.locale}>{langFlag}</span>
                )}
                {articleSchema && articleSchema.type === "article" && (
                  <>
                    <time dateTime={articleSchema.date}>
                      {new Date(articleSchema.date).toLocaleDateString(
                        article.locale,
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </time>
                    <span>•</span>
                    <span>{articleSchema.readingTime} min</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {article.seo.title}
              </h2>
              <p className="text-muted-foreground">{article.seo.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
