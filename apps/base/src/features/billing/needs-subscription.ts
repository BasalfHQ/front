import type { Stripe } from "@repo/apis";

// Statuses stripe-esg's webhook can leave a subscription in that Stripe will
// never bring back on their own - "past_due" is still mid-retry so that one
// stays on the manage card (portal handles updating the payment method).
// Anything here, or no Subscription record at all, needs a fresh Checkout
// Session instead of cancel/restart.
const TERMINAL_STATUSES = new Set(["canceled", "unpaid", "incomplete_expired"]);

export function isUsableSubscription(
  subscription: Stripe.Subscription | null,
): subscription is Stripe.Subscription {
  return subscription !== null && !TERMINAL_STATUSES.has(subscription.status);
}
