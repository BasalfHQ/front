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
      <div className="flex flex-wrap gap-4">
        <Card
          href={
            isProd ? baseUrl.replace("//", "//cms.") : "http://localhost:3001/"
          }
        >
          <CardHeader>{t("cms.title")}</CardHeader>
          <p className="text-sm text-muted-foreground">
            {t("cms.description")}
          </p>
        </Card>
        <Card
          href={
            isProd ? baseUrl.replace("//", "//host.") : "http://localhost:3002"
          }
        >
          <CardHeader>{t("host.title")}</CardHeader>
          <p className="text-sm text-muted-foreground">
            {t("host.description")}
          </p>
        </Card>
        <Card
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
