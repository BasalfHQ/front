import { auth } from "@repo/auth-ui";
import { getTranslations, I18nClientProvider, Link, redirect } from "@repo/i18n";
import { baseUrl } from "@repo/config";
import { CreatePageForm } from "./components/form";
import { getLocales, getPages } from "@repo/apis";

export async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [t, session, { locale }] = await Promise.all([
    getTranslations("createPage"),
    auth(),
    params,
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: baseUrl, locale });
  }
  const [Locales, pages] = await Promise.all([
    getLocales(session!.idToken),
    getPages(session!.idToken),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <Link href="/pages" className="text-sm text-gray-500 hover:underline">
        ← {t("backToPages")}
      </Link>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <I18nClientProvider namespace={["createPage", "BlockForm", "SeoForm"]}>
        <CreatePageForm locales={Locales} pages={pages} />
      </I18nClientProvider>
    </div>
  );
}
