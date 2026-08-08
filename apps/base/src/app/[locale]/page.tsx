import { Button } from "@repo/auth-ui";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { use } from "react";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <HomeContent />;
}

async function HomeContent() {
  const t = await getTranslations("common");

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">base</h1>
      <Button>{t("save")}</Button>
    </main>
  );
}
