import {
  Badge,
  Button,
  Card,
  PageDescription,
  PageTitle,
  Copy,
} from "@repo/ui";
import { getTranslations, I18nClientProvider, Link } from "@repo/i18n";
import { getWebsite } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { CreateWebsiteForm } from "./components/create-website-form";
import { getWebsiteStatus } from "./utils";
import { DeconnectConfirm } from "./components/deconnect-confirm";
import { Check, Loader2 } from "@repo/ui/icons";
import { ChangeDomain } from "./components/change-domain";
import { AutoRefresh } from "./components/auto-refresh";

export async function Homepage() {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations("homepage"),
  ]);
  if (!session || !session.idToken) {
    return <p>{t("youMustBeLoggedIn")}</p>;
  }
  const website = await getWebsite(session.idToken);
  if (!website) {
    return <p>{t("error.websiteNotFound")}</p>;
  }

  const websiteStatus = await getWebsiteStatus(website);

  const shouldPoll = !websiteStatus.uploaded && website.domainId;

  console.log("iframe URL:", websiteStatus.url);

  return (
    <div className="flex flex-col gap-4">
      {shouldPoll && <AutoRefresh />}
      <I18nClientProvider namespace="homepage">
        {!websiteStatus.uploaded ? (
          <div className="flex flex-col gap-8">
            <PageTitleDescription />
            {website.domainId ? (
              <div className="flex flex-col gap-4">
                <Card className="p-4 max-w-[400px] text-wrap">
                  {t("isYourWebsiteNotHereYet")}
                </Card>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <CreateWebsiteForm />
            )}
          </div>
        ) : (
          <div className="flex gap-4 justify-between md:flex-row flex-col w-full">
            <div className="flex flex-col gap-4">
              <PageTitleDescription />

              <div className="flex flex-col border rounded-md p-0 md:w-[400px] w-full">
                <div className="flex justify-between border-b p-2 py-2">
                  <p className="text-sm text-text-secondary py-2">
                    {t("yourWebsite")}
                  </p>
                  <Badge variant="success" className="h-full flex gap-2">
                    <Check className="size-4" />
                    {t("online")}
                  </Badge>
                </div>
                <div className="flex p-2 justify-between items-center">
                  <Link
                    href={websiteStatus.url ?? ""}
                    target="_blank"
                    className="text-sm text-blue-500 underline"
                  >
                    {(websiteStatus.url || "").replace("https://", "")}
                  </Link>
                  <Copy text={websiteStatus.url ?? ""} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:items-end items-start">
              <iframe
                src={websiteStatus.url}
                className="h-[300px] w-full max-h-[500px] md:max-w-[500px] border rounded-md"
                title="Website preview"
              />
              <Link
                href={websiteStatus.url ?? ""}
                target="_blank"
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  {t("visitWebsite")}
                </Button>
              </Link>
              <ChangeDomain website={website} />
              <DeconnectConfirm />
            </div>
          </div>
        )}
      </I18nClientProvider>
    </div>
  );
}

async function PageTitleDescription() {
  const t = await getTranslations("homepage");
  return (
    <div className="flex flex-col gap-1">
      <PageTitle>{t("title")}</PageTitle>
      <PageDescription>{t("description")}</PageDescription>
    </div>
  );
}
