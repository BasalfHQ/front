import { client, Organization, Address } from "./index";
import { headers } from "../utils";

export async function getOrganizationsByEmail(
  idToken: string,
): Promise<Organization[]> {
  try {
    const response = await client.GET("/user/my-organizations", {
      headers: headers({ idToken }),
    });


    console.log(response.data);
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
  timezone: string,
  email: string,
  language: string,
  idToken: string,
  address?: Address,
  isOnBookWebsite?: boolean,
): Promise<Organization | null> {
  try {
    const response = await client.POST("/organization", {
      body: { name, timezone, email, language, address, isOnBookWebsite },
      headers: headers({ idToken }),
    });
    return response.data ?? null;
  } catch (error) {
    console.error("Error creating organization:", error);
    return null;
  }
}

export async function updateOrganization(
  organization: Organization,
  idToken: string,
): Promise<boolean> {
  try {
    await client.PATCH("/organization", {
      body: organization,
      headers: headers({ idToken }),
    });
    return true;
  } catch (error) {
    console.error("Error updating organization:", error);
    return false;
  }
}
