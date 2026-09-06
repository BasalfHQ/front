import ServiceProvider from "@/features/service-provider";
import { Book } from "@repo/apis";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import bookingData from "@repo/esco/data/booking-occupations.json";
import {
  getOccupationLabel,
  getCategoryLabel,
  getSchemaType,
  formatAddress,
  generateJsonLd,
} from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orgId } = await params;
  const [org, sps] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
  ]);
  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const sp = sps[0];
  const occupation = getOccupationLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const providerName = `${sp.firstName} ${sp.lastName}`;
  const title = occupation
    ? `${providerName} - ${occupation}`
    : providerName;
  const description = sp.description
    ? sp.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : occupation
      ? `Book an appointment with ${providerName}, ${occupation}`
      : `Book an appointment with ${providerName}`;

  const url = `https://book.basalf.com/${locale}/service-provider/${orgId}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `/en/service-provider/${orgId}`,
        fr: `/fr/service-provider/${orgId}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Basalf Book",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, orgId } = await params;
  const [org, sps] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
  ]);

  if (!org || !sps || sps.length === 0) {
    notFound();
  }

  const sp = sps[0];
  const occupation = getOccupationLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const category = getCategoryLabel(
    bookingData.categories,
    sp.occupationId,
    locale,
  );
  const schemaType = getSchemaType(bookingData.categories, sp.occupationId);
  const address = formatAddress(org.address);
  const url = `https://book.basalf.com/${locale}/service-provider/${orgId}`;

  const jsonLd = generateJsonLd({
    schemaType,
    provider: sp,
    organization: org,
    occupation,
    category,
    address,
    url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceProvider params={params} />
    </>
  );
}
