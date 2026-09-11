import { env } from "@repo/config";
import { paths } from "./types";
import createClient from "openapi-fetch";

export const client = createClient<paths>({
  baseUrl: env.api.mcpApiUrl(),
});

export { getToken } from "./api";
