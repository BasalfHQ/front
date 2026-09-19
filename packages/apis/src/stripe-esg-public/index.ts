import createClient from "openapi-fetch";
import { paths } from "./types";
import { env } from "@repo/config";

export type PublicPlanId = NonNullable<
  paths["/checkout-session"]["post"]["requestBody"]
>["content"]["application/json"]["planId"];

export const client = createClient<paths>({
  baseUrl: env.api.stripeEsgPublicUrl(),
});

export { createSignupCheckoutSession } from "./api";
