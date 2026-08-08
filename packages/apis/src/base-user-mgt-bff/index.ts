import createClient from "openapi-fetch";
import { paths, components } from "./types";
import { env } from "@repo/config";

export type Organization = components["schemas"]["Organization"];
export type User = components["schemas"]["User"];

export const client = createClient<paths>({
  baseUrl: env.api.userMgtBffUrl(),
});
