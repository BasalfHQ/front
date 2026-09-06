import { env } from "@repo/config";
import { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Website = components["schemas"]["Website"];
export type UploadUrl = components["schemas"]["UploadUrl"];

export const client = createClient<paths>({
  baseUrl: env.api.hostMgtBffUrl(),
});

export {
  getWebsite,
  getUploadUrl,
  getDomainAvailability,
  changeDomain,
  deleteDeployment,
} from "./api";
