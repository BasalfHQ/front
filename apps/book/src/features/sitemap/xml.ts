import type { MetadataRoute } from "next";

// Stylesheet at public/sitemap.xsl: browsers render the sitemap as a table
// instead of raw text; crawlers ignore it.
const STYLESHEET = "/sitemap.xsl";

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toUrl(entry: MetadataRoute.Sitemap[number]): string {
  const lastModified =
    entry.lastModified instanceof Date
      ? entry.lastModified.toISOString()
      : entry.lastModified;
  const lines = [
    `<loc>${escape(entry.url)}</loc>`,
    ...Object.entries(entry.alternates?.languages ?? {}).map(
      ([lang, href]) =>
        `<xhtml:link rel="alternate" hreflang="${escape(lang)}" href="${escape(String(href))}" />`,
    ),
    lastModified && `<lastmod>${escape(lastModified)}</lastmod>`,
    entry.changeFrequency && `<changefreq>${entry.changeFrequency}</changefreq>`,
    entry.priority !== undefined && `<priority>${entry.priority}</priority>`,
  ].filter(Boolean);
  return `<url>\n${lines.join("\n")}\n</url>`;
}

// Same output as Next's sitemap.ts convention, plus the stylesheet line
// (not supported by the convention).
export function toSitemapXml(entries: MetadataRoute.Sitemap): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<?xml-stylesheet type="text/xsl" href="${STYLESHEET}"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...entries.map(toUrl),
    `</urlset>`,
    "",
  ].join("\n");
}
