import { getTranslations } from "@repo/i18n";
import { Link } from "@repo/i18n";
import { PageTitle, PageDescription, Button } from "@repo/ui";
import { ClearDraftOnMount } from "./components/clear-draft-on-mount";

export async function CheckoutSuccessStep() {
  const t = await getTranslations("checkout");

  return (
    <div className="w-full px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      <ClearDraftOnMount />
      <PageTitle className="mb-4">{t("successTitle")}</PageTitle>
      <PageDescription className="mb-8">{t("successDescription")}</PageDescription>
      <Button asChild>
        <Link href="/">{t("goToDashboard")}</Link>
      </Button>
    </div>
  );
}
