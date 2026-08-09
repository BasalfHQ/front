import { auth } from "@repo/auth-ui";
import { getTranslations, redirect } from "@repo/i18n";

export async function Homepage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [t, session, { locale }] = await Promise.all([
    getTranslations("homepage"),
    auth(),
    params,
  ]);

  if (session) {
    return redirect({ href: "/pages", locale });
  }

  return <div>{t("title")}</div>;
}
