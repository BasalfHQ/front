import { PageDescription, PageTitle } from "@repo/ui";
import { getTranslations, redirect } from "@repo/i18n";
import { getWebsite } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { baseUrl } from "@repo/config";

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
    throw new Error("Website not found");
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
    </div>
  );
}
