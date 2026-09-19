import createClient from "openapi-fetch";
import { paths, components } from "./types";
import { env } from "@repo/config";

export type Organization = components["schemas"]["Organization"];
export type Address = components["schemas"]["Address"];

export const client = createClient<paths>({
  baseUrl: env.api.userMgtBffPublicUrl(),
});

export { createDraftOrganization } from "./api";
