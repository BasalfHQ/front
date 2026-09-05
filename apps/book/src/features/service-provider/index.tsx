import { Book } from "@repo/apis";
import { notFound } from "next/navigation";
import { addMonths } from "date-fns";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { locale, orgId } = await params;
  const now = new Date();
  const inTwoMonths = addMonths(now, 2);
  const [org, sps, slots, services] = await Promise.all([
    Book.getOrganization(orgId),
    Book.getServiceProviders(orgId),
    Book.getSlots(orgId, now.toISOString(), inTwoMonths.toISOString()),
    Book.getServices(orgId),
  ]);
  if (!org || !sps || sps.length === 0) {
    notFound();
  }
  return (
    <div className="text-red-500">
      {JSON.stringify(org)}
      <br /> <br /> <br />
      {JSON.stringify(sps)}
      <br /> <br /> <br />
      {JSON.stringify(slots)}
      <br /> <br /> <br />
      {JSON.stringify(services)}
    </div>
  );
}
