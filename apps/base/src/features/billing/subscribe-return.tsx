import { SubscribeReturnStatus } from "./subscribe-return-status";

// stripe-esg's authenticated /checkout-session route lands here after
// payment (see createCheckoutSession's default returnPath) - the actual
// Subscription write happens async via the webhook, so SubscribeReturnStatus
// polls until it shows up instead of assuming it's already there.
export function SubscribeReturnPage() {
  return (
    <div className="w-full px-4 py-16 sm:py-24 text-center flex flex-col items-center justify-center min-h-[320px]">
      <SubscribeReturnStatus />
    </div>
  );
}
