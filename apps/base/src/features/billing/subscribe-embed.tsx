"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Button } from "@repo/ui";
import { env } from "@repo/config";
import { createSubscribeCheckoutSession } from "./actions";

export function SubscribeEmbed() {
  const t = useTranslations("billing");
  const publishableKey = env.stripePublishableKey();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // Bumping this remounts EmbeddedCheckoutProvider, forcing it to call
  // fetchClientSecret again - the provider only calls it once per mount.
  const [attempt, setAttempt] = useState(0);
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  const fetchClientSecret = useCallback(async () => {
    const result = await createSubscribeCheckoutSession();
    setIsLoading(false);
    if ("error" in result) {
      setError(true);
      throw new Error(result.error);
    }
    return result.clientSecret;
  }, []);

  const retry = () => {
    setError(false);
    setIsLoading(true);
    setAttempt((n) => n + 1);
  };

  if (!publishableKey) {
    return (
      <p role="alert" aria-live="polite" className="text-sm text-red-600">
        {t("checkoutConfigError")}
      </p>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="polite" className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-red-600">{t("checkoutFailed")}</p>
        <Button variant="outline" onClick={retry}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px]">
      {isLoading && (
        <p aria-live="polite" className="text-sm text-gray-500 text-center py-12">
          {t("loadingPayment")}
        </p>
      )}
      <EmbeddedCheckoutProvider
        key={attempt}
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
