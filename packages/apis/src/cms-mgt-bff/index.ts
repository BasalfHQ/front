import createClient from "openapi-fetch";
import { paths, components } from "./types";
import { env } from "@repo/config";

export type Page = components["schemas"]["Page"];
export type AllPages = components["schemas"]["AllPages"];
export type Block = Page["slices"][number];
export type PageSeo = Page["seo"];
export type Website = components["schemas"]["Website"];
export type Locales = components["schemas"]["Locales"];

export const client = createClient<paths>({
  baseUrl: env.api.cmsMgtBffUrl(),
});

export {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  getWebsites,
  getLocales,
  updateLocales,
  getToken,
} from "./api";

export {
  ISO_639_1_CODES,
  ISO_639_1_CODES_WITH_FLAGS,
} from "./locales";
