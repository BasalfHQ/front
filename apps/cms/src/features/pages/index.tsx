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
import { Badge, PageTitle } from "@repo/ui";
import { CreatePageWithAIButton } from "./components/create-page-with-ai";

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
      <div className="flex flex-col gap-1 rounded-md bg-accent/20 border w-fit md:min-w-[400px]">
        {pages.map((page) => (
          <PageItem key={page.pageId} page={page} />
        ))}
      </div>
    </div>
  );
}

function PageItem({ page }: { page: Cms.AllPages[number] }) {
  return (
    <Link
      href={`/pages/${page.pageId}`}
      className="flex gap-4 py-2 px-4 hover:bg-accent items-center"
    >
      <p>{page.seo.title}</p>

      <div className="flex gap-1">
        <p className="text-sm text-gray-500">{page.locale}</p>
        <p className="text-sm text-gray-500">{page.url}</p>
      </div>

      {page.seo.schemas.length > 0 && (
        <div className="flex gap-2">
          {page.seo.schemas.map((schema) => (
            <Badge key={schema.type} variant="outline">
              {schema.type}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
