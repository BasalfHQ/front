import { getClient } from "./client";

export const getPages = async (Token: string) => {
  const response = await getClient().GET("/", {
    headers: {
      Token,
    },
  });
  return response.data ?? [];
};

export const getPage = async (pageId: string, Token: string) => {
  const response = await getClient().GET("/{pageId}", {
    params: {
      path: {
        pageId,
      },
    },
    headers: {
      Token,
    },
  });
  return response.data;
};
