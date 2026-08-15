import { getTranslations, I18nClientProvider, redirect } from "@repo/i18n";
import { auth } from "@repo/auth-ui";
import { PageTitle, PageDescription } from "@repo/ui";
import { TokenCopy } from "./token-copy";
import { getToken } from "@repo/apis";

export async function Token({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [t, session, { locale }] = await Promise.all([
    getTranslations("token"),
    auth(),
    params,
  ]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }

  const token = await getToken(session.idToken);
  console.log("token", token);
  if (!token) {
    return redirect({ href: "/", locale });
  }

  return (
    <div className="flex flex-col gap-2">
      <PageTitle>{t("title")}</PageTitle>
      <PageDescription>{t("description")}</PageDescription>

      <I18nClientProvider namespace={["token"]}>
        <TokenCopy token={token} />
      </I18nClientProvider>
    </div>
  );
}
