import {
  getTranslations,
  I18nClientProvider,
  Link,
  redirect,
} from "@repo/i18n";
import { auth, Button } from "@repo/auth-ui";
import { baseUrl } from "@repo/config";
import { Cms } from "@repo/apis";
import { LocalesModale } from "./components/locale-modale";
import { PageTitle } from "@repo/ui";
import { CreatePageWithAIButton } from "./components/create-page-with-ai";
import { PagesList } from "./components/pages-list";

export async function Pages({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [t, session, { locale }] = await Promise.all([
    getTranslations("pages"),
    auth(),
    params,
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: baseUrl, locale });
  }

  const [pages, locales] = await Promise.all([
    Cms.getPages(session.idToken),
    Cms.getLocales(session.idToken),
  ]);
  pages.sort((a, b) => a.url.localeCompare(b.url));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-2">
          <PageTitle>{t("title")}</PageTitle>
          <div className="flex gap-2">
            <Link href="/create-page">
              <Button>{t("createPage")}</Button>
            </Link>
            <CreatePageWithAIButton locales={locales} pages={pages} />
          </div>
        </div>
        <I18nClientProvider namespace="pages">
          <LocalesModale locales={locales} />
        </I18nClientProvider>
      </div>
      {pages.length === 0 && <p className="text-gray-500">{t("noPages")}</p>}
      {pages.length > 0 && (
        <I18nClientProvider namespace="pages">
          <PagesList pages={pages} />
        </I18nClientProvider>
      )}
    </div>
  );
}
