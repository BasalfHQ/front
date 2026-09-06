import type { BookingCategory } from "@repo/esco";
import type { Book } from "@repo/apis";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_STAGE === "dev") {
    return "http://localhost:3100";
  }
  return "https://book.basalf.com";
}

export type SchemaOrgType =
  | "MedicalBusiness"
  | "HealthAndBeautyBusiness"
  | "SportsActivityLocation"
  | "EducationalOrganization"
  | "LegalService"
  | "FinancialService"
  | "HomeAndConstructionBusiness"
  | "ProfessionalService"
  | "PetStore"
  | "AutoRepair"
  | "RealEstateAgent"
  | "EntertainmentBusiness"
  | "FoodEstablishment"
  | "LocalBusiness";

const CATEGORY_TO_SCHEMA: Record<string, SchemaOrgType> = {
  "health-medical": "MedicalBusiness",
  "beauty-wellness": "HealthAndBeautyBusiness",
  "fitness-sport": "SportsActivityLocation",
  "education-tutoring": "EducationalOrganization",
  "legal-financial": "LegalService",
  "home-services": "HomeAndConstructionBusiness",
  "consulting-coaching": "ProfessionalService",
  "pet-services": "PetStore",
  automotive: "AutoRepair",
  "real-estate": "RealEstateAgent",
  "creative-media": "ProfessionalService",
  "events-entertainment": "EntertainmentBusiness",
  "food-hospitality": "FoodEstablishment",
  "technology-it": "ProfessionalService",
  "other-services": "LocalBusiness",
};

export function getSchemaType(
  categories: BookingCategory[],
  occupationId: string,
): SchemaOrgType {
  for (const cat of categories) {
    if (cat.occupations.some((o) => o.id === occupationId)) {
      return CATEGORY_TO_SCHEMA[cat.id] ?? "LocalBusiness";
    }
  }
  return "LocalBusiness";
}

export function getOccupationLabel(
  categories: BookingCategory[],
  occupationId: string,
  locale: string,
): string | null {
  for (const cat of categories) {
    const occ = cat.occupations.find((o) => o.id === occupationId);
    if (occ) return occ.labels[locale] ?? occ.labels["en"] ?? null;
  }
  return null;
}

export function getCategoryLabel(
  categories: BookingCategory[],
  occupationId: string,
  locale: string,
): string | null {
  for (const cat of categories) {
    if (cat.occupations.some((o) => o.id === occupationId)) {
      return cat.labels[locale] ?? cat.labels["en"] ?? null;
    }
  }
  return null;
}

export function formatAddress(address?: Book.Address): string | null {
  if (!address) return null;
  return [
    [address.streetNumber, address.streetAddress].filter(Boolean).join(" "),
    [address.postalCode, address.addressLocality].filter(Boolean).join(" "),
    address.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");
}

export function generateJsonLd({
  schemaType,
  provider,
  organization,
  occupation,
  category,
  address,
  url,
}: {
  schemaType: SchemaOrgType;
  provider: Book.ServiceProvider;
  organization: Book.Organization;
  occupation: string | null;
  category: string | null;
  address: string | null;
  url: string;
}) {
  const name = `${provider.firstName} ${provider.lastName}`;

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name,
    description: provider.description ?? undefined,
    url,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: [
          organization.address?.streetNumber,
          organization.address?.streetAddress,
        ]
          .filter(Boolean)
          .join(" "),
        addressLocality: organization.address?.addressLocality,
        postalCode: organization.address?.postalCode,
        addressCountry: organization.address?.addressCountry,
      },
    }),
    ...(occupation && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: category ?? "Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: occupation,
            },
          },
        ],
      },
    }),
  };
}
