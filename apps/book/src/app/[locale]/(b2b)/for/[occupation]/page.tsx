import { OccupationPage } from "@/features/b2b";

type Props = {
  params: Promise<{ locale: string; occupation: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, occupation } = await params;
  return <OccupationPage locale={locale} slug={occupation} />;
}
