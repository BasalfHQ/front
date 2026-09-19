import { client, Organization, Address } from "./index";

export async function createDraftOrganization(input: {
  name: string;
  timezone: string;
  language?: string;
  email?: string;
  currency?: string;
  isOnBookWebsite?: boolean;
  address?: Address;
}): Promise<Organization | null> {
  try {
    const response = await client.POST("/organization", { body: input });
    if (response.response.status !== 201) {
      return null;
    }
    return response.data ?? null;
  } catch (error) {
    console.error("Error creating draft organization:", error);
    return null;
  }
}
