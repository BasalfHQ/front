import { env } from "@repo/config";
import { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Slot = components["schemas"]["Slot"];
export type SlotRepeatInterval = NonNullable<
  paths["/slots/batch"]["post"]["requestBody"]
  >["content"]["application/json"]["intervals"];
export type Booking = components["schemas"]["Booking"];
export type Service = components["schemas"]["Service"];
export type ServiceProvider = components["schemas"]["ServiceProvider"];

export const client = createClient<paths>({
  baseUrl: env.api.slotMgtBffUrl(),
});

export {
  getServices,
  createService,
  updateService,
  deleteService,
  getSlots,
  getSlot,
  createSlot,
  createSlots,
  updateSlot,
  deleteSlot,
  deleteSlots,
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  rescheduleBooking,
  getSlotToken,
  getCalendarSubscription,
  getServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
} from "./api";
