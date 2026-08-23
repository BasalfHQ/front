import { client, Slot, SlotRepeatInterval } from ".";
import { headers } from "../utils";

export async function getSlots(
  idToken: string,
  startDate: string,
  endDate: string,
) {
  const response = await client.GET("/slots/{startDate}/{endDate}", {
    params: {
      path: {
        startDate: startDate,
        endDate: endDate,
      },
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

export async function getSlot(
  idToken: string,
  slotId: string,
) {
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
  slot: Omit<Slot, "slotId" | "organizationId" | "websiteId" | "usedCapacity">,
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
) {
  const response = await client.POST("/slots/batch", {
    body: { capacity, startDate, endDate, intervals },
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
    maxCapacity: number;
    usedCapacity: number;
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
) {
  const response = await client.DELETE("/slot/{slotId}/{startDate}", {
    params: { path: { slotId, startDate } },
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
  sameHour: boolean,
) {
  const response = await client.DELETE("/slots/batch/{startDate}/{endDate}", {
    params: {
      path: { startDate, endDate },
      query: { sameHour: sameHour ? "true" : undefined },
    },
    headers: headers({ idToken }),
  });
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
  const response = await client.GET("/booking/range/{startDate}/{endDate}", {
    params: {
      path: { startDate, endDate },
    },
    headers: headers({ idToken }),
  });
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
  const response = await client.PATCH("/booking/{bookingId}/{startDate}/cancel", {
    params: { path: { bookingId, startDate } },
    headers: headers({ idToken }),
  });
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
  const response = await client.PATCH("/booking/{bookingId}/{startDate}/reschedule", {
    params: { path: { bookingId, startDate } },
    body: newDates,
    headers: headers({ idToken }),
  });
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