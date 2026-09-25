import { B2bLayout } from "@/features/b2b";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  return <B2bLayout locale={locale}>{children}</B2bLayout>;
}
