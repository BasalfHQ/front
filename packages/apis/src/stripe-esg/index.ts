import createClient from "openapi-fetch";
import { paths } from "./types";
import { env } from "@repo/config";

export type PlanId = NonNullable<
  paths["/checkout-session"]["post"]["requestBody"]
>["content"]["application/json"]["planId"];

export type Subscription =
  paths["/subscription"]["get"]["responses"][200]["content"]["application/json"];

export const client = createClient<paths>({
  baseUrl: env.api.stripeEsgUrl(),
});

export {
  getSubscription,
  cancelSubscription,
  restartSubscription,
  createPortalSession,
  createCheckoutSession,
} from "./api";
