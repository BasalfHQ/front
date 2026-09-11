import { client } from ".";
import { headers } from "../utils";

export async function getToken(idToken: string): Promise<string | undefined> {
  const response = await client.GET("/token", {
    headers: headers({ idToken }),
  });
  return response.data;
}
