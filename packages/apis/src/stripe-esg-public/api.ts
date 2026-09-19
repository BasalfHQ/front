import { client, PublicPlanId } from "./index";

export async function createSignupCheckoutSession(
  organizationId: string,
  planId: PublicPlanId,
): Promise<{ clientSecret: string | null } | { error: string } | null> {
  try {
    const response = await client.POST("/checkout-session", {
      body: { organizationId, planId },
    });
    if (response.response.status === 403) {
      const errorData = response.error as { message?: string } | undefined;
      return {
        error:
          errorData?.message ??
          "A subscription already exists for this organization",
      };
    }
    if (!response.data) {
      return null;
    }
    return { clientSecret: response.data.clientSecret };
  } catch (error) {
    console.error("Error creating signup checkout session:", error);
    return null;
  }
}
