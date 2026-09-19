import { getLocale, redirect, getTranslations } from "@repo/i18n";
import { PageTitle, PageDescription } from "@repo/ui";
import { getDraftOrganization } from "./actions";
import { DraftOrgForm } from "./components/draft-org-form";

export async function CheckoutOrganizationStep() {
  const [draft, locale] = await Promise.all([getDraftOrganization(), getLocale()]);
  if (draft) {
    redirect({ href: "/checkout/payment", locale });
  }

  const t = await getTranslations("checkout");

  return (
    <div className="w-full px-4 py-10 sm:py-16">
      <PageTitle>{t("step1Title")}</PageTitle>
      <PageDescription className="mb-8">{t("step1Description")}</PageDescription>
      <DraftOrgForm />
    </div>
  );
}
