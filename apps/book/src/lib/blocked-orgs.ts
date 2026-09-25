// Orgs that are never shown as service providers on the Book website.
// gtalzRTE: Book's own org — its CMS pages are the B2B pages under /for,
// served there only (never as /service-provider/gtalzRTE/blog/...).
const BLOCKED_ORG_IDS = new Set(["gtalzRTE"]);

export function isBlockedOrg(organizationId: string): boolean {
  return BLOCKED_ORG_IDS.has(organizationId);
}
