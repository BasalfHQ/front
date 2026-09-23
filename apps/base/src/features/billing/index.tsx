import { redirect } from "next/navigation";
import { auth } from "@repo/auth-ui";
import { getTranslations } from "@repo/i18n";
import { PageDescription, PageTitle } from "@repo/ui";
import { baseUrl } from "@repo/config";
import { getSubscription } from "./actions";
import { SubscriptionCard } from "./subscription-card";
import { SubscribePrompt } from "./subscribe-prompt";
import { isUsableSubscription } from "./needs-subscription";

export async function BillingPage() {
  const session = await auth();

  if (!session?.idToken) {
    return redirect(baseUrl);
  }

  const [t, subscription] = await Promise.all([getTranslations("billing"), getSubscription()]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>
      {isUsableSubscription(subscription) ? (
        <SubscriptionCard subscription={subscription} />
      ) : (
        <SubscribePrompt />
      )}
    </div>
  );
}
