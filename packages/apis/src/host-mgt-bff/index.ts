import { env } from "@repo/config";
import { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Website = components["schemas"]["Website"];

export const client = createClient<paths>({
  baseUrl: env.api.hostMgtBffUrl(),
});
