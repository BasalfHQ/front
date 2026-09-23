import { getLocale, redirect, getTranslations } from "@repo/i18n";
import { DraftOrgForm } from "./components/draft-org-form";
import { getDraftOrganization } from "./actions";

export async function CheckoutOrganizationStep() {
  const [draft, locale] = await Promise.all([getDraftOrganization(), getLocale()]);
  if (draft) {
    redirect({ href: "/checkout/payment", locale });
  }

  const t = await getTranslations("checkout");

  return (
    // Bounded grid tracks + justify-center, not a max-w wrapper - the page
    // itself stays full-bleed, only this content block reads as a normal
    // reading width within it.
    <div className="w-full grid grid-cols-1 justify-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[minmax(0,19rem)_minmax(0,30rem)] lg:gap-16 lg:py-24">
      <aside className="space-y-5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-gray-900" />
          <span className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <p className="text-sm font-medium text-gray-500">{t("stepIndicator")}</p>
        <div>
          <h1 className="text-[28px] sm:text-[30px] font-semibold leading-[1.15] tracking-[-0.025em] text-gray-900 text-balance">
            {t("orgHeading")}
          </h1>
          <p className="mt-2 text-gray-500">{t("orgLede")}</p>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-gray-700">{t("whatNextTitle")}</p>
          <ol className="mt-2 space-y-1.5 text-sm text-gray-500 list-decimal list-inside">
            <li>{t("whatNextItem1")}</li>
            <li>{t("whatNextItem2")}</li>
          </ol>
        </div>
      </aside>

      <div className="w-full border-y sm:border sm:rounded-[18px] bg-white p-5 sm:p-[34px] sm:shadow-[0_1px_2px_rgba(26,27,24,.04),0_18px_40px_-22px_rgba(26,27,24,.22)]">
        <DraftOrgForm />
      </div>
    </div>
  );
}
