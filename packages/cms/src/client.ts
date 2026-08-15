import type { CmsComponents, CmsPaths } from "@repo/apis";
import createClient from "openapi-fetch";

export type AllPages = CmsComponents["schemas"]["AllPages"];
export type Page = CmsComponents["schemas"]["Page"];
export type Block = Page["slices"][number];
export type PageSeo = Page["seo"];
export type Schemas = PageSeo["schemas"];

function getBaseUrl(): string {
  const isProd = process.env.NODE_ENV === "production";
  const url = isProd
    ? "https://ipvks3xer0.execute-api.eu-central-1.amazonaws.com"
    : "https://my8vongi38.execute-api.eu-central-1.amazonaws.com";
  return url;
}

let _client: ReturnType<typeof createClient<CmsPaths>> | null = null;

export function getClient() {
  if (!_client) {
    _client = createClient<CmsPaths>({ baseUrl: getBaseUrl() });
  }
  return _client;
}
