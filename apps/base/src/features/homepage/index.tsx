import { getTranslations } from "@repo/i18n";
import { Card, CardHeader, PageDescription, PageTitle } from "@repo/ui";
import { baseUrl } from "@repo/config";

const isProd = process.env.NEXT_PUBLIC_STAGE === "prod";

export async function Homepage() {
  const t = await getTranslations("homepage");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Card
          className="w-full"
          href={
            isProd ? baseUrl.replace("//", "//cms.") : "http://localhost:3001/"
          }
        >
          <CardHeader>{t("cms.title")}</CardHeader>
          <p className="text-sm text-muted-foreground">{t("cms.description")}</p>
        </Card>
        {/* Hidden for now - "Host" (website domain/cert settings) reads as
            unrelated infra next to CMS/Slot and would read to a user as some
            other product entirely, easily confused with Book. Bring back
            once this homepage explains the platform/product split better. */}
        <Card
          className="w-full"
          href={
            isProd ? baseUrl.replace("//", "//slot.") : "http://localhost:3003"
          }
        >
          <CardHeader>{t("slot.title")}</CardHeader>
          <p className="text-sm text-muted-foreground">
            {t("slot.description")}
          </p>
        </Card>
      </div>
    </div>
  );
}
