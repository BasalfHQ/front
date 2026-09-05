import { env } from "@repo/config";
import { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Booking = components["schemas"]["Booking"];
export type Service = components["schemas"]["Service"];
export type ServiceProvider = components["schemas"]["ServiceProvider"];
export type Slot = components["schemas"]["Slot"];

export const client = createClient<paths>({
  baseUrl: env.api.bookMgtBffUrl(),
});

export {
  getServices,
  getServiceProviders,
  getSlots,
  getBookings,
  createBooking,
} from "./api";
