import { getTranslations, Link } from "@repo/i18n";
import { Button, Card, CardHeader } from "@repo/ui";

export async function SubscribePrompt() {
  const t = await getTranslations("billing");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <p className="font-medium">{t("noSubscription")}</p>
        <p className="text-sm text-muted-foreground">{t("subscribeLede")}</p>
      </CardHeader>
      <Button asChild className="w-fit">
        <Link href="/billing/subscribe">{t("subscribe")}</Link>
      </Button>
    </Card>
  );
}
