import { getLocale, redirect, getTranslations } from "@repo/i18n";
import { PageTitle } from "@repo/ui";
import { getDraftOrganization } from "./actions";
import { CheckoutEmbed } from "./components/checkout-embed";
import { BackToOrganizationButton } from "./components/back-to-organization-button";

export async function CheckoutPaymentStep() {
  const [draft, locale] = await Promise.all([getDraftOrganization(), getLocale()]);
  if (!draft) {
    redirect({ href: "/checkout", locale });
    return;
  }

  const t = await getTranslations("checkout");

  return (
    <div className="w-full px-4 py-10 sm:py-16">
      <PageTitle className="break-words">{t("step2Title", { name: draft.name })}</PageTitle>
      <div className="mt-2 mb-8">
        <BackToOrganizationButton />
      </div>
      <CheckoutEmbed />
    </div>
  );
}
