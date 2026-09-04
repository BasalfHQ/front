import { client, Slot, SlotRepeatInterval, Service, ServiceProvider } from ".";
import { headers } from "../utils";

export async function getServices(idToken: string): Promise<Service[]> {
  const response = await client.GET("/service", {
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to get services");
  }
  return response.data ?? [];
}

export async function createService(
  idToken: string,
  name: string,
  description?: string,
): Promise<Service | null> {
  const response = await client.POST("/service", {
    body: { name, description },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to create service");
  }
  return response.data ?? null;
}

export async function updateService(
  idToken: string,
  serviceId: string,
  name: string,
  description?: string,
) {
  const response = await client.PATCH("/service/{serviceId}", {
    params: { path: { serviceId } },
    body: { name, description },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to update service");
  }
  return response.data;
}

export async function deleteService(idToken: string, serviceId: string) {
  const response = await client.DELETE("/service/{serviceId}", {
    params: { path: { serviceId } },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to delete service");
  }
  return response.data;
}

export async function getSlots(
  idToken: string,
  startDate: string,
  endDate: string,
) {
  const response = await client.GET("/slots/{startDate}/{endDate}/{serviceId}", {
    params: {
      path: { startDate, endDate, serviceId: "all" },
    },
    headers: headers({ idToken }),
  });

  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get slots");
  }
  return response.data;
}

export async function getSlot(idToken: string, slotId: string) {
  const response = await client.GET("/slot/{slotId}", {
    params: {
      path: { slotId: slotId },
    },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get slot");
  }
  return response.data;
}

export async function createSlot(
  idToken: string,
  slot: {
    maxCapacity: number;
    startDate: string;
    endDate: string;
    serviceId: string;
  },
) {
  const response = await client.POST("/slot", {
    body: slot,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to create slot");
  }
  return response.data;
}

export async function createSlots(
  idToken: string,
  capacity: number,
  startDate: string,
  endDate: string,
  intervals: SlotRepeatInterval,
  serviceId: string,
) {
  const response = await client.POST("/slots/batch", {
    body: { serviceId, capacity, startDate, endDate, intervals },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to create slots");
  }
  return response.data;
}

export async function updateSlot(
  idToken: string,
  slot: {
    slotId: string;
    serviceId: string;
    maxCapacity: number;
    startDate: string;
    endDate: string;
  },
) {
  const response = await client.PATCH("/slot", {
    body: slot,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to update slot");
  }
  return response.data;
}

export async function deleteSlot(
  idToken: string,
  slotId: string,
  startDate: string,
  serviceId: string,
) {
  const response = await client.DELETE("/slot/{slotId}/{startDate}", {
    params: {
      path: { slotId, startDate },
      query: { serviceId },
    },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to delete slot");
  }
  return response.data;
}

export async function deleteSlots(
  idToken: string,
  startDate: string,
  endDate: string,
  serviceId: string,
  sameHour?: boolean,
) {
  const response = await client.DELETE(
    "/slots/batch/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { startDate, endDate, serviceId },
        query: { sameHour: sameHour ? "true" : undefined },
      },
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to delete slots");
  }
  return response.data;
}

export async function createBooking(
  idToken: string,
  booking: {
    slotId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    additionalInfo?: string;
    startDate: string;
    endDate: string;
    numberOfPerson: number;
    serviceId: string;
  },
) {
  const response = await client.POST("/booking", {
    body: booking,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to create booking");
  }
  return response.data;
}

export async function getBookings(
  idToken: string,
  startDate: string,
  endDate: string,
) {
  const response = await client.GET(
    "/booking/range/{startDate}/{endDate}/{serviceId}",
    {
      params: {
        path: { startDate, endDate, serviceId: "all" },
      },
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    console.log(response);

    console.log(response.data);
    throw new Error("Failed to get bookings");
  }
  return response.data || [];
}

export async function getBooking(idToken: string, bookingId: string) {
  const response = await client.GET("/booking/{bookingId}", {
    params: { path: { bookingId } },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get booking");
  }
  return response.data;
}

export async function cancelBooking(
  idToken: string,
  bookingId: string,
  startDate: string,
) {
  const response = await client.PATCH(
    "/booking/{bookingId}/{startDate}/cancel",
    {
      params: { path: { bookingId, startDate } },
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to cancel booking");
  }
  return response.data;
}

export async function rescheduleBooking(
  idToken: string,
  bookingId: string,
  startDate: string,
  newDates: { startDate: string; endDate: string; slotId?: string },
) {
  const response = await client.PATCH(
    "/booking/{bookingId}/{startDate}/reschedule",
    {
      params: { path: { bookingId, startDate } },
      body: newDates,
      headers: headers({ idToken }),
    },
  );
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to reschedule booking");
  }
  return response.data;
}

export async function getSlotToken(idToken: string) {
  const response = await client.GET("/token", {
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    console.log(response);
    console.log(response.data);
    throw new Error("Failed to get slot token");
  }
  return response.data;
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

export async function createServiceProvider(
  idToken: string,
  body: { firstName: string; lastName: string; occupationId: string; email?: string; description?: string },
): Promise<ServiceProvider | null> {
  const response = await client.POST("/service-provider", {
    body,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to create service provider");
  }
  return response.data ?? null;
}

export async function updateServiceProvider(
  idToken: string,
  serviceProviderId: string,
  body: { firstName: string; lastName: string; occupationId: string; email?: string; description?: string },
) {
  const response = await client.PATCH("/service-provider/{serviceProviderId}", {
    params: { path: { serviceProviderId } },
    body,
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to update service provider");
  }
  return response.data;
}

export async function deleteServiceProvider(
  idToken: string,
  serviceProviderId: string,
) {
  const response = await client.DELETE("/service-provider/{serviceProviderId}", {
    params: { path: { serviceProviderId } },
    headers: headers({ idToken }),
  });
  if (response.response.status !== 200) {
    throw new Error("Failed to delete service provider");
  }
  return response.data;
}
