import { auth } from "@repo/auth-ui";
import { getTranslations, I18nClientProvider, redirect } from "@repo/i18n";
import { baseUrl } from "@repo/config";
import { CreatePageForm } from "./components/form";

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
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <I18nClientProvider namespace="createPage">
        <CreatePageForm />
      </I18nClientProvider>
    </div>
  );
}
