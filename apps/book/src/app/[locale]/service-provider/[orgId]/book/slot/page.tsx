export const dynamic = "force-dynamic";

import BookSlotPage from "@/features/service-provider/book-slot-page";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
  searchParams: Promise<{ serviceId?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { orgId, locale } = await params;
  const { serviceId } = await searchParams;

  return <BookSlotPage orgId={orgId} locale={locale} serviceId={serviceId} />;
}
