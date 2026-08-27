import type { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Service = components["schemas"]["Service"];
export type Slot = components["schemas"]["Slot"];
export type Booking = components["schemas"]["Booking"];
export type ApiClient = ReturnType<typeof createClient<paths>>;

export function createApiClient(token: string): ApiClient {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (!payload.apiId) {
    throw new Error("Token missing apiId");
  }
  return createClient<paths>({
    baseUrl: `https://${payload.apiId}.execute-api.eu-central-1.amazonaws.com`,
  });
}
