import { ImageResponse } from "next/og";
import { Book } from "@repo/apis";

export const runtime = "edge";
export const alt = "Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
};

export default async function Image({ params }: Props) {
  const { orgId } = await params;

  let providerName = "Blog";

  try {
    const sps = await Book.getServiceProviders(orgId);
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
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#3d3229",
            }}
          >
            Blog
          </div>

          <div
            style={{
              fontSize: "32px",
              color: "#6b5d4d",
            }}
          >
            Articles & insights from {providerName}
          </div>

          <div
            style={{
              marginTop: "32px",
              fontSize: "24px",
              color: "#8b7355",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>📝</span>
            <span>Read our latest articles</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#6b5d4d",
          }}
        >
          book.basalf.com
        </div>
      </div>
    ),
    { ...size },
  );
}
