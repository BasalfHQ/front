import { getTranslations, Link } from "@repo/i18n";
import { Button, Card, CardHeader, PageDescription, PageTitle } from "@repo/ui";
import { Section } from "./section";

const PRODUCTS = ["book", "slot", "cms"] as const;
const STEPS = [1, 2, 3, 4] as const;

export async function PublicHome() {
  const t = await getTranslations("homepage");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("public.title")}</PageTitle>
        <PageDescription className="max-w-xl">{t("public.subtitle")}</PageDescription>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap gap-2">
          <Button size="lg" asChild>
            <Link href="/checkout">{t("public.getStarted")}</Link>
          </Button>
          {/* Same ?login=true trigger NavAuthSlot uses - NavLoginModal picks it up. */}
          <Button size="lg" variant="outline" asChild>
            <Link href={{ pathname: "/", query: { login: "true" } }}>{t("public.login")}</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t("public.noCharge")}</p>
      </div>

      <Section title={t("public.includedTitle")}>
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Card key={product} className="w-full justify-start">
              <CardHeader>
                <p className="font-medium">{t(`${product}.title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${product}.description`)}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("public.howTitle")}>
        <ol className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-accent text-sm font-semibold">
                {step}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-medium">{t(`public.step${step}Title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`public.step${step}Description`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
