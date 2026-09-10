import { client, File, UploadUrl, Usage } from "./index";
import { headers } from "../utils";

export async function getUploadUrl(
  name: string,
  size: number,
  idToken: string,
  contentType?: string,
  key?: string,
): Promise<UploadUrl | null> {
  try {
    const response = await client.POST("/upload-url", {
      body: { name, size, contentType, key },
      headers: headers({ idToken }),
    });
    return response.data ?? null;
  } catch (error) {
    console.error("Error getting upload url:", error);
    return null;
  }
}

export async function getFiles(idToken: string): Promise<File[]> {
  try {
    const response = await client.GET("/file", {
      headers: headers({ idToken }),
    });
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function deleteFile(
  fileId: string,
  idToken: string,
): Promise<boolean> {
  try {
    const { error } = await client.DELETE("/file", {
      params: { query: { fileId } },
      headers: headers({ idToken }),
    });
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

export async function getUsage(idToken: string): Promise<Usage | null> {
  try {
    const response = await client.GET("/usage", {
      headers: headers({ idToken }),
    });
    return response.data ?? null;
  } catch (error) {
    console.error("Error fetching usage:", error);
    return null;
  }
}
