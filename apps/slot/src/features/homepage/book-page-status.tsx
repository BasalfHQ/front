import { getTranslations } from "@repo/i18n";
import { Card, CardHeader, Button } from "@repo/ui";
import { ExternalLink } from "@repo/ui/icons";

// Mirrors book app's own getBaseUrl() (apps/book/src/lib/seo.ts) - can't
// import it directly, it's app-internal, not a shared package.
function getBookBaseUrl(): string {
  return process.env.NEXT_PUBLIC_STAGE === "prod"
    ? "https://book.basalf.com"
    : "http://localhost:3100";
}

export async function BookPageStatus({
  live,
  locale,
  orgId,
}: {
  live: boolean;
  locale: string;
  orgId: string;
}) {
  const t = await getTranslations("homepage.bookPage");
  const bookUrl = `${getBookBaseUrl()}/${locale}/service-provider/${orgId}`;

  if (!live) {
    return (
      <Card variant="warning" className="w-full lg:w-80 lg:shrink-0">
        <CardHeader>
          <p className="font-medium">{t("notLiveTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("notLiveDescription")}</p>
        </CardHeader>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>{t("missingServiceProvider")}</li>
        </ul>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-80 lg:shrink-0">
      <CardHeader>
        <p className="font-medium">{t("liveTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("liveDescription")}</p>
      </CardHeader>
      <Button variant="outline" asChild className="w-fit">
        <a href={bookUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("openBookingPage")}
        </a>
      </Button>
      {/* scale doesn't affect layout flow, so the clipping box needs its own
          fixed height at the post-scale size - the iframe itself is sized at
          its pre-scale (1/0.6) dimensions so it still fills that box. */}
      <div className="mt-2 h-64 overflow-hidden rounded-md border">
        <iframe
          src={bookUrl}
          title={t("previewTitle")}
          className="origin-top-left scale-[0.6] border-0"
          style={{ width: "166.67%", height: "426px" }}
        />
      </div>
    </Card>
  );
}
