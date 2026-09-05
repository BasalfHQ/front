import ServiceProvider from "@/features/service-provider";
import { Book } from "@repo/apis";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { orgId } = await params;
  const [org, sps] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
  ]);
  if (!org || !sps || sps.length === 0) {
    notFound();
  }
  return {
    title: `${org.name}`,
  };
}

export default ServiceProvider;
