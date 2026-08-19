import { Card, PageDescription, PageTitle } from "@repo/ui";
import { getTranslations, I18nClientProvider, redirect } from "@repo/i18n";
import { getWebsite } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { baseUrl } from "@repo/config";
import { CreateWebsiteForm } from "./components/create-website-form";

export async function Homepage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([getSession(), params]);
  if (!session || !session.idToken) {
    return redirect({ href: baseUrl, locale });
  }
  const [t, website] = await Promise.all([
    getTranslations("homepage"),
    getWebsite(session.idToken),
  ]);
  if (!website) {
    return <p>{t("error.websiteNotFound")}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      <I18nClientProvider namespace="homepage">
        <CreateWebsiteForm />
      </I18nClientProvider>
    </div>
  );
}
