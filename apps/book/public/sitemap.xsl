<?xml version="1.0" encoding="UTF-8"?>
<!-- Human-readable view of /sitemap.xml in browsers. Crawlers ignore it. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — Book</title>
        <style>
          :root { color-scheme: light dark; --fg: #1c1b19; --muted: #6b6760; --line: #e4e1db; --bg: #faf9f7; --link: #2458c6; }
          @media (prefers-color-scheme: dark) { :root { --fg: #ecebe8; --muted: #a09c94; --line: #33312d; --bg: #161514; --link: #7ea3f2; } }
          body { margin: 0; padding: 32px 16px; background: var(--bg); color: var(--fg); font: 14px/1.5 system-ui, -apple-system, sans-serif; }
          main { max-width: 1100px; margin: 0 auto; }
          h1 { margin: 0 0 4px; font-size: 24px; }
          p { margin: 0 0 24px; color: var(--muted); }
          .scroll { overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
          th { color: var(--muted); font-weight: 500; white-space: nowrap; }
          td.num, th.num { text-align: right; white-space: nowrap; }
          a { color: var(--link); text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .alt { display: block; color: var(--muted); font-size: 12px; }
          .alt a { color: inherit; }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p><xsl:value-of select="count(s:urlset/s:url)"/> URLs. This page is for humans; search engines read the raw XML.</p>
          <div class="scroll">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Change</th>
                  <th class="num">Priority</th>
                  <th>Last modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td>
                      <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                      <xsl:for-each select="xhtml:link">
                        <span class="alt">
                          <xsl:value-of select="@hreflang"/>: <a href="{@href}"><xsl:value-of select="@href"/></a>
                        </span>
                      </xsl:for-each>
                    </td>
                    <td><xsl:value-of select="s:changefreq"/></td>
                    <td class="num"><xsl:value-of select="s:priority"/></td>
                    <td><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
