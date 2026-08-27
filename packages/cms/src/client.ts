import type { components as CmsComponents, paths as CmsPaths } from "./types";
import createClient from "openapi-fetch";

export type AllPages = CmsComponents["schemas"]["AllPages"];
export type Page = CmsComponents["schemas"]["Page"];
export type Block = Page["slices"][number];
export type PageSeo = Page["seo"];
export type Schemas = PageSeo["schemas"];
export type ApiClient = ReturnType<typeof createClient<CmsPaths>>;

export function createApiClient(token: string): ApiClient {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (!payload.apiId) {
    throw new Error("Token missing apiId");
  }
  return createClient<CmsPaths>({
    baseUrl: `https://${payload.apiId}.execute-api.eu-central-1.amazonaws.com`,
  });
}
