import {
  getTranslations,
  I18nClientProvider,
  Link,
  redirect,
} from "@repo/i18n";
import { auth, Button } from "@repo/auth-ui";
import { baseUrl } from "@repo/config";
import { getLocales, getPages } from "@repo/apis";
import { LocalesModale } from "./components/locale-modale";

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
    getPages(session.idToken),
    getLocales(session.idToken),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Link href="/create-page">
            <Button>{t("createPage")}</Button>
          </Link>
        </div>
        <I18nClientProvider namespace="pages">
          <LocalesModale locales={locales} />
        </I18nClientProvider>
      </div>
      {pages.length === 0 && <p className="text-gray-500">{t("noPages")}</p>}
    </div>
  );
}
