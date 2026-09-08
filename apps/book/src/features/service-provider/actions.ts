"use server";

import { Book } from "@repo/apis";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const CONFIRMATION_COOKIE = "book_confirmation";

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

    // Carries the confirmation across the redirect to /book/success — the
    // success page is a server component and can't otherwise see the result
    // of this action. Short-lived and httpOnly since it holds the
    // customer's contact info.
    const store = await cookies();
    store.set(
      CONFIRMATION_COOKIE,
      JSON.stringify({ organizationId, booking: data }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 15,
      },
    );

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

export async function clearBookingConfirmation() {
  const store = await cookies();
  store.delete(CONFIRMATION_COOKIE);
}

export async function readBookingConfirmation(): Promise<{
  organizationId: string;
  booking: Book.Booking;
} | null> {
  const store = await cookies();
  const raw = store.get(CONFIRMATION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
