export const dynamic = "force-dynamic";

import { redirect } from "@repo/i18n";
import BookPage from "@/features/service-provider/book-page";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
  searchParams: Promise<{ serviceId?: string; slotId?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { orgId, locale } = await params;
  const { serviceId, slotId } = await searchParams;

  if (!serviceId || !slotId) {
    redirect({ href: `/service-provider/${orgId}`, locale });
    return null;
  }

  return (
    <BookPage
      orgId={orgId}
      locale={locale}
      serviceId={serviceId}
      slotId={slotId}
    />
  );
}
