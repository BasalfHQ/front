import { Website } from "@repo/apis";

const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function validateDomain(domain: string): string | null {
  if (domain.length < 3 || domain.length > 30) return "domainLength";
  if (!DOMAIN_REGEX.test(domain)) return "domainFormat";
  return null;
}

export const getWebsiteStatus = async (website: Website) => {
  try {
    if (!website.domainId) {
      return { uploaded: false };
    }
    const baseHostUrl = `https://${website.domainId}${process.env.NEXT_PUBLIC_STAGE === "dev" ? ".dev" : ""}.host.basalf.com`;
    const result = await fetch(baseHostUrl, { cache: "no-store" });
    if (result.status !== 200) {
      return { uploaded: false };
    }
    const html = await result.text();
    if (!html) {
      return { uploaded: false };
    }
    console.log("html:", html);
    return { uploaded: true, url: baseHostUrl };
  } catch {
    return { uploaded: false };
  }
};
