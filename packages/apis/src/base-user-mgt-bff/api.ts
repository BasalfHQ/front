import { client, Organization } from "./index";
import { headers } from "../utils";

export async function getOrganizationsByEmail(
  idToken: string,
): Promise<Organization[]> {
  try {
    const response = await client.GET("/user/my-organizations", {
      headers: headers({ idToken }),
    });

    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

export async function getOrganizations(
  idToken: string,
): Promise<Organization[]> {
  try {
    const response = await client.GET("/organization", {
      headers: headers({ idToken }),
    });
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

export async function createOrganization(
  name: string,
  idToken: string,
): Promise<Organization | null> {
  try {
    const response = await client.POST("/organization", {
      body: { name },
      headers: headers({ idToken }),
    });
    return response.data ?? null;
  } catch (error) {
    console.error("Error creating organization:", error);
    return null;
  }
}
