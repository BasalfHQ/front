import { getPages, getPage } from "./api";

class CMS {
  private readonly token: string;
  constructor(basalf_token: string) {
    this.token = basalf_token;
  }

  async getPages() {
    return await getPages(this.token);
  }

  async getPage(pageId: string) {
    return await getPage(pageId, this.token);
  }
}

export default CMS;

export type {
  Page,
  AllPages,
  Block,
  PageSeo,
  Schemas,
} from "./client";
