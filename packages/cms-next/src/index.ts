export { Page } from "./page";
export type { PageProps } from "./page";

export { getPageMetadata } from "./metadata";
export type { GetPageMetadataOptions } from "./metadata";

export { getAllPages, getPageBySlug } from "./pages";

export { ArticleSchema, FaqSchema } from "./schema";

export type { GetHref } from "./blocks";

export type {
  AllPages,
  Block,
  Page as CmsPage,
  PageSeo,
  Schemas,
} from "@basalf/cms";
