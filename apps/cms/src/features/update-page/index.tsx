import { auth } from "@repo/auth-ui";
import {
  getTranslations,
  I18nClientProvider,
  Link,
  redirect,
} from "@repo/i18n";
import { baseUrl } from "@repo/config";
import { UpdatePageForm } from "./components/form";
import { Cms } from "@repo/apis";
import { notFound } from "next/navigation";
import { PageTitle } from "@repo/ui";

export async function UpdatePage({
  params,
}: {
  params: Promise<{ locale: string; pageId: string }>;
}) {
  const [t, session, { locale, pageId }] = await Promise.all([
    getTranslations("updatePage"),
    auth(),
    params,
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: baseUrl, locale });
  }

  const [locales, page] = await Promise.all([
    Cms.getLocales(session.idToken),
    Cms.getPage(pageId, session.idToken),
  ]);

  if (!page) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/pages" className="text-sm text-gray-500 hover:underline">
        ← {t("backToPages")}
      </Link>
      <PageTitle>{t("title")}</PageTitle>
      <I18nClientProvider namespace={["updatePage", "BlockForm", "SeoForm"]}>
        <UpdatePageForm locales={locales} initialPage={page} />
      </I18nClientProvider>
    </div>
  );
}
