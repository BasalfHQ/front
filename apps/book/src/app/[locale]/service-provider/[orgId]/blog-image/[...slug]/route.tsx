import { ImageResponse } from "next/og";
import { Book } from "@repo/apis";
import { getArticle } from "@/features/blog/articles";

export const runtime = "edge";

type Props = {
  params: Promise<{ locale: string; orgId: string; slug: string[] }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { locale, orgId, slug } = await params;
  const slugPath = slug.join("/");

  let title = "Article";
  let description = "";
  let providerName = "";
  let date = "";
  let readingTime = 0;

  try {
    const [page, sps] = await Promise.all([
      getArticle(orgId, slugPath, locale),
      Book.getServiceProviders(orgId),
    ]);

    if (page) {
      title = page.seo.title;
      description = page.seo.description;
      const articleSchema = page.seo.schemas.find((s) => s.type === "article");
      if (articleSchema && articleSchema.type === "article") {
        date = articleSchema.date;
        readingTime = articleSchema.readingTime;
      }
    }

    if (sps && sps.length > 0) {
      const sp = sps[0];
      providerName = `${sp.firstName} ${sp.lastName}`;
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #faf7f2 0%, #e8e0d5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "24px",
            maxWidth: "1000px",
          }}
        >
          {(date || readingTime > 0) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "20px",
                color: "#8b7355",
              }}
            >
              {date && (
                <span>
                  {new Date(date).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {date && readingTime > 0 && <span>•</span>}
              {readingTime > 0 && <span>{readingTime} min read</span>}
            </div>
          )}

          <div
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#3d3229",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                fontSize: "24px",
                color: "#6b5d4d",
                lineHeight: 1.4,
              }}
            >
              {description.length > 150
                ? description.slice(0, 150) + "..."
                : description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
          }}
        >
          {providerName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "24px",
                  background: "#8b7355",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#faf7f2",
                  fontWeight: "bold",
                }}
              >
                {providerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span style={{ fontSize: "20px", color: "#3d3229" }}>
                {providerName}
              </span>
            </div>
          )}

          <div style={{ fontSize: "18px", color: "#6b5d4d" }}>
            book.basalf.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
