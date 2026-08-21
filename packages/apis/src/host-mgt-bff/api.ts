import { client, UploadUrl, Website } from ".";
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
  domainId: string | undefined,
): Promise<UploadUrl | undefined> {
  const response = await client.GET("/upload-url/{domainId}", {
    headers: headers({ idToken }),
    params: { path: { domainId: domainId || "none" } },
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get upload url");
  }
  return response.data;
}

export async function getDomainAvailability(
  domain: string,
  idToken: string,
): Promise<
  | { available: boolean; status?: "uploading" | "uploaded" | "failed" }
  | undefined
> {
  const response = await client.GET("/domain/{domain}", {
    params: { path: { domain } },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get domain availability");
  }
  return response.data;
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
    console.log(response.data);
    throw new Error(response.data?.message ?? "Failed to change domain");
  }
}

export async function deleteDeployment(idToken: string): Promise<void> {
  const response = await client.DELETE("/deployment", {
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response.data);
    throw new Error("Failed to delete deployment");
  }
}
