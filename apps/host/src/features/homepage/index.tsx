import { PageDescription, PageTitle } from "@repo/ui";
import { getTranslations, I18nClientProvider } from "@repo/i18n";
import { getWebsite, Website } from "@repo/apis";
import { getSession } from "@repo/auth-ui";
import { CreateWebsiteForm } from "./components/create-website-form";

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

  const isWebSiteAvailable = await getWebsiteStatus(website);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      <I18nClientProvider namespace="homepage">
        {isWebSiteAvailable ? (
          <CreateWebsiteForm />
        ) : (
          <p>{t("uploadYourWebsiteSuccess")}</p>
        )}
      </I18nClientProvider>
    </div>
  );
}

const getWebsiteStatus = async (website: Website) => {
  try {
    const baseHostUrl = `https://${website.domainId}${process.env.NEXT_PUBLIC_STAGE === "dev" ? ".dev" : ""}.host.basalf.com`;
    const result = await fetch(baseHostUrl);

    if (!result.ok) {
      return "error";
    }
    const data = await result.json();
    if (!data) {
      return "error";
    }
    return true;
  } catch {
    return false;
  }
};
