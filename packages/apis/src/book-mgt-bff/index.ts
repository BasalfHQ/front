import { env } from "@repo/config";
import { components, paths } from "./types";
import createClient from "openapi-fetch";

export type Booking = components["schemas"]["Booking"];
export type Service = components["schemas"]["Service"];
export type ServiceProvider = components["schemas"]["ServiceProvider"];
export type Organization = components["schemas"]["Organization"];
export type Address = components["schemas"]["Address"];
export type Slot = components["schemas"]["Slot"];
export type Page = components["schemas"]["Page"];
export type AllPages = components["schemas"]["AllPages"];

console.log("url:", env.api.bookMgtBffUrl());

export const client = createClient<paths>({
  baseUrl: env.api.bookMgtBffUrl(),
});

export {
  getOrganizations,
  getOrganization,
  getServices,
  getServiceProviders,
  getSlots,
  getBookings,
  createBooking,
  getPages,
  getPage,
} from "./api";
