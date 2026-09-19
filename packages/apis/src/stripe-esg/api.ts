import { client, Subscription, PlanId } from "./index";
import { headers } from "../utils";

export async function getSubscription(
  idToken: string,
): Promise<Subscription | null> {
  try {
    const response = await client.GET("/subscription", {
      headers: headers({ idToken }),
    });
    if (response.response.status === 404) {
      return null;
    }
    return response.data ?? null;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function cancelSubscription(idToken: string): Promise<boolean> {
  try {
    const response = await client.POST("/subscription/cancel", {
      headers: headers({ idToken }),
    });
    return response.data?.ok === true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return false;
  }
}

export async function restartSubscription(idToken: string): Promise<boolean> {
  try {
    const response = await client.POST("/subscription/restart", {
      headers: headers({ idToken }),
    });
    return response.data?.ok === true;
  } catch (error) {
    console.error("Error restarting subscription:", error);
    return false;
  }
}

export async function createPortalSession(
  idToken: string,
): Promise<string | null> {
  try {
    const response = await client.POST("/portal-session", {
      headers: headers({ idToken }),
    });
    return response.data?.url ?? null;
  } catch (error) {
    console.error("Error creating portal session:", error);
    return null;
  }
}

export async function createCheckoutSession(
  idToken: string,
  planId: PlanId,
): Promise<string | null> {
  try {
    const response = await client.POST("/checkout-session", {
      body: { planId },
      headers: headers({ idToken }),
    });
    return response.data?.clientSecret ?? null;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return null;
  }
}
