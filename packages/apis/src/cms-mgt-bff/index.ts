import createClient from "openapi-fetch";
import { paths, components } from "./types";
import { env } from "@repo/config";

export type Page = components["schemas"]["Page"];
export type Block = Page["slices"][number];
export type Website = components["schemas"]["Website"];
export type Locales = components["schemas"]["Locales"];

export const client = createClient<paths>({
  baseUrl: env.api.cmsMgtBffUrl(),
});
