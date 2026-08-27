import type { ApiClient } from "./client";

export const getPages = async (client: ApiClient, token: string) => {
  const response = await client.GET("/", {
    headers: { Token: token },
  });
  return response.data ?? [];
};

export const getPage = async (client: ApiClient, pageId: string, token: string) => {
  const response = await client.GET("/{pageId}", {
    params: {
      path: { pageId },
    },
    headers: { Token: token },
  });
  return response.data;
};
