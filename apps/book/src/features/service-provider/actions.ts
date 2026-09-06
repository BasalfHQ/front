"use server";

import { Book } from "@repo/apis";
import { revalidatePath } from "next/cache";

export type CreateBookingInput = {
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
};

export type CreateBookingResult =
  | { success: true; data: Awaited<ReturnType<typeof Book.createBooking>> }
  | { success: false; error: string };

export async function createBooking(
  organizationId: string,
  booking: CreateBookingInput,
): Promise<CreateBookingResult> {
  try {
    const data = await Book.createBooking(organizationId, booking);
    revalidatePath(`/${organizationId}`);
    return { success: true, data };
  } catch (error) {
    revalidatePath(`/${organizationId}`);
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("capacity")
    ) {
      return { success: false, error: "SLOT_CAPACITY_EXCEEDED" };
    }
    return { success: false, error: "BOOKING_FAILED" };
  }
}
