import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "@repo/config";

// env.fileDomain() returns a full url (e.g. "https://xxx.cloudfront.net"),
// but remotePatterns needs a bare hostname.
const fileDomainHostname = env.fileDomain()
  ? new URL(env.fileDomain()!).hostname
  : undefined;

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/i18n", "@repo/esco"],
  images: {
    remotePatterns: fileDomainHostname
      ? [{ protocol: "https", hostname: fileDomainHostname }]
      : [],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
