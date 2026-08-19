const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function validateDomain(domain: string): string | null {
  if (domain.length < 3 || domain.length > 30) return "domainLength";
  if (!DOMAIN_REGEX.test(domain)) return "domainFormat";
  return null;
}
