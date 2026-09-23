import { getTranslations } from "@repo/i18n";
import { Link } from "@repo/i18n";
import { PageTitle, PageDescription, Button } from "@repo/ui";
import { baseUrl } from "@repo/config";
import { ClearDraftOnMount } from "./components/clear-draft-on-mount";

// Book is the only product today - once other products exist this "what to
// configure next" block will need to be product-aware instead of hardcoding
// Slot (service provider + slots setup) and CMS (optional blog).
const isProd = process.env.NEXT_PUBLIC_STAGE === "prod";

export async function CheckoutSuccessStep() {
  const t = await getTranslations("checkout");
  const slotUrl = isProd ? baseUrl.replace("//", "//slot.") : "http://localhost:3003";
  const cmsUrl = isProd ? baseUrl.replace("//", "//cms.") : "http://localhost:3001";

  return (
    <div className="w-full px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      <ClearDraftOnMount />
      <PageTitle className="mb-4">{t("successTitle")}</PageTitle>
      <PageDescription className="mb-8">{t("successDescription")}</PageDescription>

      <div className="w-full max-w-md text-left mb-8">
        <p className="text-sm font-medium text-gray-700">{t("successNextStepsTitle")}</p>
        <ol className="mt-2 space-y-1.5 text-sm text-gray-500 list-decimal list-inside">
          <li>{t("successNextStepsEmail")}</li>
          <li>
            {t("successNextStepsSlot")}{" "}
            <a
              href={slotUrl}
              className="font-medium text-gray-700 underline hover:text-gray-900"
            >
              {t("successNextStepsSlotCta")}
            </a>
          </li>
        </ol>
        <p className="mt-3 text-xs text-gray-400">
          {t("successNextStepsCms")}{" "}
          <a href={cmsUrl} className="underline hover:text-gray-500">
            {t("successNextStepsCmsCta")}
          </a>
        </p>
      </div>

      <Button asChild>
        <Link href="/">{t("goToDashboard")}</Link>
      </Button>
    </div>
  );
}
