import { getSession } from "@repo/auth-ui";
import { getTranslations } from "@repo/i18n";
import { PageDescription, PageTitle } from "@repo/ui";

export default async function Reservations() {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations("reservations"),
  ]);
  return (
    <div className="flex flex-col gap-1">
      <PageTitle>{t("title")}</PageTitle>
      <PageDescription>{t("description")}</PageDescription>
    </div>
  );
}
