import { getSubscription } from "./actions";
import { SubscriptionCard } from "./subscription-card";
import { SubscribePrompt } from "./subscribe-prompt";
import { isUsableSubscription } from "./needs-subscription";

// Rendered inside the settings page, which handles the auth redirect and page title.
export async function SubscriptionSection() {
  const subscription = await getSubscription();

  return isUsableSubscription(subscription) ? (
    <SubscriptionCard subscription={subscription} />
  ) : (
    <SubscribePrompt />
  );
}
