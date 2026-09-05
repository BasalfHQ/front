import { client, Booking, Service, ServiceProvider, Slot } from ".";
import { headers } from "../utils";

export async function getServices(
  idToken: string,
): Promise<Service[]> {
  const response = await client.GET("/service", {
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get services");
  }
  return response.data ?? [];
}

export async function getServiceProviders(
  idToken: string,
): Promise<ServiceProvider[]> {
  const response = await client.GET("/service-provider", {
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get service providers");
  }
  return response.data ?? [];
}

export async function getSlots(
  idToken: string,
  startDate: string,
  endDate: string,
  serviceId: string = "all",
): Promise<Slot[]> {
  const response = await client.GET(
    "/slots/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { startDate, endDate, serviceId },
      },
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    throw new Error("Failed to get slots");
  }
  return response.data ?? [];
}

export async function getBookings(
  idToken: string,
  startDate: string,
  endDate: string,
  serviceId: string = "all",
): Promise<Booking[]> {
  const response = await client.GET(
    "/booking/range/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { startDate, endDate, serviceId },
      },
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    throw new Error("Failed to get bookings");
  }
  return response.data ?? [];
}

export async function createBooking(
  idToken: string,
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
) {
  const response = await client.POST("/booking", {
    body: booking,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to create booking");
  }
  return response.data;
}
