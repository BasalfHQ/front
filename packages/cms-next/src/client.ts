import "server-only";
import CMS from "@basalf/cms";

let instance: CMS | undefined;

export function getClient(): CMS {
  if (instance) return instance;

  const token = process.env.BASALF_CMS_TOKEN;
  if (!token) {
    throw new Error(
      "@basalf/cms-next: missing BASALF_CMS_TOKEN environment variable. " +
        "Set it server-side only (never expose it to the client bundle).",
    );
  }

  instance = new CMS(token);
  return instance;
}
