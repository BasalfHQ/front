import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Book } from "@repo/apis";
import { Blog, getAllArticles, type PageSummary } from "@/features/blog";
import { getArticle } from "@/features/blog/articles";
import { getBaseUrl } from "@/lib/seo";

export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string; orgId: string; slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orgId, slug } = await params;
  const slugPath = slug.join("/");
  const page = await getArticle(orgId, slugPath, locale);

  if (!page) return {};

  const articleSchema = page.seo.schemas.find((s) => s.type === "article");
  const localePath = locale === "en" ? "" : `/${locale}`;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${localePath}/service-provider/${orgId}/blog/${slugPath}`;
  const ogImageUrl = `${baseUrl}${localePath}/service-provider/${orgId}/blog-image/${slugPath}`;

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      type: "article",
      publishedTime:
        articleSchema?.type === "article" ? articleSchema.date : undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { orgId } = await params;
  try {
    const pages = await getAllArticles(orgId);
    return pages.map((page) => ({
      slug: page.url.replace(/^\//, "").split("/"),
    }));
  } catch {
    return [];
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, orgId, slug } = await params;
  const slugPath = slug.join("/");

  const [org, sps] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
  ]);

  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const sp = sps[0];
  const providerName = `${sp.firstName} ${sp.lastName}`;

  return (
    <Blog
      orgId={orgId}
      locale={locale}
      slug={slugPath}
      providerName={providerName}
    />
  );
}
