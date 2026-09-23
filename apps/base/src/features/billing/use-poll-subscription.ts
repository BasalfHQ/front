"use client";

import { useCallback, useState } from "react";
import type { Stripe } from "@repo/apis";
import { getSubscription } from "./actions";

// cancel/restart/checkout all just call Stripe - the local Subscription
// record (what getSubscription reads) is only written by stripe-esg's
// webhook once Stripe calls back, so it can lag the action by a beat. This
// polls until that write actually lands instead of trusting revalidatePath
// to have fresh data immediately - it's money, the user should see the real
// outcome, not an optimistic guess.
export function usePollSubscription() {
  const [isPolling, setIsPolling] = useState(false);

  const poll = useCallback(
    async (
      isDone: (subscription: Stripe.Subscription | null) => boolean,
      { intervalMs = 1500, timeoutMs = 12000 }: { intervalMs?: number; timeoutMs?: number } = {},
    ): Promise<{ confirmed: boolean; subscription: Stripe.Subscription | null }> => {
      setIsPolling(true);
      try {
        const deadline = Date.now() + timeoutMs;
        let subscription = await getSubscription();
        while (!isDone(subscription) && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
          subscription = await getSubscription();
        }
        return { confirmed: isDone(subscription), subscription };
      } finally {
        setIsPolling(false);
      }
    },
    [],
  );

  return { poll, isPolling };
}
