import {
  client,
  Booking,
  Service,
  ServiceProvider,
  Organization,
  Slot,
  Page,
  AllPages,
} from ".";

export async function getOrganizations(): Promise<Organization[]> {
  const response = await client.GET("/organization");
  if (response.response.status !== 200) {
    console.error(response.response.status);
    console.error(response.response.statusText);
    console.error(response.error);
    throw new Error("Failed to get organizations");
  }
  console.log(response.data);
  return response.data ?? [];
}

export async function getOrganization(
  organizationId: string,
): Promise<Organization | undefined> {
  const response = await client.GET("/organization/{organizationId}", {
    params: { path: { organizationId } },
  });
  return response.data;
}

export async function getServices(organizationId: string): Promise<Service[]> {
  const response = await client.GET("/service/{organizationId}", {
    params: { path: { organizationId } },
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get services");
  }
  return response.data ?? [];
}

export async function getServiceProviders(
  organizationId: string,
): Promise<ServiceProvider[]> {
  const response = await client.GET("/service-provider/{organizationId}", {
    params: { path: { organizationId } },
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get service providers");
  }
  return response.data ?? [];
}

export async function getSlots(
  organizationId: string,
  startDate: string,
  endDate: string,
  serviceId: string = "all",
): Promise<Slot[]> {
  // is serviceId all, then return all slots
  const response = await client.GET(
    "/slots/{organizationId}/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { organizationId, startDate, endDate, serviceId },
      },
    },
  );
  if (response.response.status !== 200) {
    throw new Error("Failed to get slots");
  }
  return response.data ?? [];
}

export async function getBookings(
  organizationId: string,
  startDate: string,
  endDate: string,
  serviceId: string = "all",
): Promise<Booking[]> {
  const response = await client.GET(
    "/booking/range/{organizationId}/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { organizationId, startDate, endDate, serviceId },
      },
    },
  );
  if (response.response.status !== 200) {
    throw new Error("Failed to get bookings");
  }
  return response.data ?? [];
}

export async function createBooking(
  organizationId: string,
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
  const response = await client.POST("/booking/{organizationId}", {
    params: { path: { organizationId } },
    body: booking,
  });
  if (response.response.status !== 200) {
    const errorData = response.data as { message?: string } | undefined;
    throw new Error(errorData?.message ?? "Failed to create booking");
  }
  return response.data;
}

export async function getPages(organizationId: string) {
  const response = await client.GET("/page/{organizationId}", {
    params: { path: { organizationId } },
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get pages");
  }
  return response.data;
}

export async function getPage(
  organizationId: string,
  pageId: string,
): Promise<Page | undefined> {
  const response = await client.GET("/page/{organizationId}/{pageId}", {
    params: { path: { organizationId, pageId } },
  });
  if (response.response.status !== 200) {
    return undefined;
  }
  return response.data;
}
