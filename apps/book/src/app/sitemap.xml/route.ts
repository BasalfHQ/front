import { getSitemapEntries, toSitemapXml } from "@/features/sitemap";

// Route handler instead of the sitemap.ts convention: it can't reference an
// XSL stylesheet.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(toSitemapXml(await getSitemapEntries()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
