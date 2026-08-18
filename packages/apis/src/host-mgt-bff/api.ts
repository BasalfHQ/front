import { client, Website } from ".";
import { headers } from "../utils";

export async function getWebsite(
  idToken: string,
): Promise<Website | undefined> {
  const response = await client.GET("/website", {
    headers: headers({ idToken }),
  });
  return response.data;
}

export async function getUploadUrl(
  idToken: string,
): Promise<string | undefined> {
  const response = await client.GET("/upload-url", {
    headers: headers({ idToken }),
  });
  return response.data;
}

export async function getDomainAvailability(
  domain: string,
  idToken: string,
): Promise<boolean | undefined> {
  const response = await client.GET("/domain/{domain}", {
    params: { path: { domain } },
    headers: headers({ idToken }),
  });
  return response.data?.available;
}

export async function changeDomain(
  baseDomain: string,
  newDomain: string,
  idToken: string,
): Promise<void> {
  const response = await client.PATCH("/domain/{baseDomain}", {
    params: { path: { baseDomain } },
    headers: headers({ idToken }),
    body: { newDomain },
  });
  if (response.response.status !== 200) {
    throw new Error(response.data?.message ?? "Failed to change domain");
  }
}
