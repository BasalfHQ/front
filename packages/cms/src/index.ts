import { getPages, getPage } from "./api";
import { createApiClient, type ApiClient } from "./client";

class CMS {
  private readonly token: string;
  private readonly client: ApiClient;

  constructor(basalf_token: string) {
    this.token = basalf_token;
    this.client = createApiClient(basalf_token);
  }

  async getPages() {
    return await getPages(this.client, this.token);
  }

  async getPage(pageId: string) {
    return await getPage(this.client, pageId, this.token);
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
