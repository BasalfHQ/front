"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@repo/auth-ui";
import { Stripe } from "@repo/apis";

// Only plan today - mirrors checkout/actions.ts's DEFAULT_PLAN_ID for the
// signup flow. This is the resub/no-subscription-yet path for an existing,
// logged-in org (see stripe-esg's authenticated /checkout-session route).
const DEFAULT_PLAN_ID = "book" as const;

export async function getSubscription(): Promise<Stripe.Subscription | null> {
  const session = await auth();

  if (!session?.idToken) {
    return null;
  }

  return Stripe.getSubscription(session.idToken);
}

export async function cancelSubscription(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();

  if (!session?.idToken) {
    return { success: false, error: "Unauthorized" };
  }

  const ok = await Stripe.cancelSubscription(session.idToken);
  if (ok) {
    revalidatePath("/billing");
    return { success: true };
  }
  return { success: false, error: "Failed to cancel subscription" };
}

export async function restartSubscription(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();

  if (!session?.idToken) {
    return { success: false, error: "Unauthorized" };
  }

  const ok = await Stripe.restartSubscription(session.idToken);
  if (ok) {
    revalidatePath("/billing");
    return { success: true };
  }
  return { success: false, error: "Failed to restart subscription" };
}

// Portal covers updating payment method / plan and, per stripe-esg's
// portal-session route, undo-cancel natively - the redirect URL is the only
// thing worth returning, the portal itself does the write.
export async function createPortalSession(): Promise<{ url?: string; error?: string }> {
  const session = await auth();

  if (!session?.idToken) {
    return { error: "Unauthorized" };
  }

  const url = await Stripe.createPortalSession(session.idToken);
  if (!url) {
    return { error: "Failed to open billing portal" };
  }
  return { url };
}

// For an org with no subscription (or a lapsed one) - runs through
// stripe-esg's Cognito-authed /checkout-session route, which reuses the
// org's existing Stripe customer if it has one instead of creating a new one.
export async function createSubscribeCheckoutSession(): Promise<
  { clientSecret: string } | { error: string }
> {
  const session = await auth();

  if (!session?.idToken) {
    return { error: "Unauthorized" };
  }

  const clientSecret = await Stripe.createCheckoutSession(session.idToken, DEFAULT_PLAN_ID);
  if (!clientSecret) {
    return { error: "Failed to start checkout" };
  }
  return { clientSecret };
}
