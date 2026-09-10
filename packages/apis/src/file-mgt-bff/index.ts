import createClient from "openapi-fetch";
import { paths, components } from "./types";
import { env } from "@repo/config";

export type File = components["schemas"]["File"];
export type UploadUrl = components["schemas"]["UploadUrl"];
export type Usage = components["schemas"]["Usage"];

export const client = createClient<paths>({
  baseUrl: env.api.fileMgtBffUrl(),
});

export {
  getUploadUrl,
  getFiles,
  deleteFile,
  getUsage,
} from "./api";

export function serviceProviderPictureKey(serviceProviderId: string): string {
  return `service-provider/${serviceProviderId}/profile`;
}

// Files are served publicly straight off the CDN - no auth needed to read one.
export function publicFileUrl(organizationId: string, key: string): string {
  return `${env.fileDomain()}/${organizationId}/${key}`;
}
