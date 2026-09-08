export const dynamic = "force-dynamic";

import BookSuccessPage from "@/features/service-provider/book-success-page";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId, locale } = await params;
  return <BookSuccessPage orgId={orgId} locale={locale} />;
}
