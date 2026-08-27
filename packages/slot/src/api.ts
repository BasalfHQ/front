import type { ApiClient, Slot } from "./client";

export const getServices = async (client: ApiClient, token: string) => {
  const response = await client.GET("/services", {
    headers: { Token: token },
  });
  return response.data ?? [];
};

export const getSlots = async (
  client: ApiClient,
  token: string,
  startDate: string,
  endDate: string,
  serviceId: string,
) => {
  const response = await client.GET("/slots/{startDate}/{endDate}/{serviceId}", {
    params: {
      path: { startDate, endDate, serviceId },
    },
    headers: { Token: token },
  });
  return response.data ?? [];
};

export const getSlot = async (client: ApiClient, token: string, slotId: string): Promise<Slot | null> => {
  const response = await client.GET("/slot/{slotId}", {
    params: {
      path: { slotId },
    },
    headers: { Token: token },
  });
  return response.data ?? null;
};

export const createBooking = async (
  client: ApiClient,
  token: string,
  booking: {
    serviceId: string;
    slotId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    additionalInfo?: string;
    startDate: string;
    endDate: string;
    numberOfPerson: number;
  },
) => {
  const response = await client.POST("/booking", {
    body: booking,
    headers: { Token: token },
  });
  return response.data ?? null;
};
