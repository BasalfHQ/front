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
    if (!response.data) {
      console.error("Error fetching subscription:", response.error);
      return null;
    }
    return response.data;
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
    if (response.data?.ok !== true) {
      console.error("Error canceling subscription:", response.error);
      return false;
    }
    return true;
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
    if (response.data?.ok !== true) {
      console.error("Error restarting subscription:", response.error);
      return false;
    }
    return true;
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
    if (!response.data?.url) {
      console.error("Error creating portal session:", response.error);
      return null;
    }
    return response.data.url;
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
    if (!response.data?.clientSecret) {
      console.error("Error creating checkout session:", response.error);
      return null;
    }
    return response.data.clientSecret;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return null;
  }
}
