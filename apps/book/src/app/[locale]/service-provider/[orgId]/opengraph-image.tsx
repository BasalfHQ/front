import { ImageResponse } from "next/og";
import { Book } from "@repo/apis";
import bookingData from "@repo/esco/data/booking-occupations.json";
import { getOccupationLabel, getCategoryLabel } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Book an appointment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; orgId: string }>;
};

export default async function Image({ params }: Props) {
  const { locale, orgId } = await params;

  let providerName = "Book an appointment";
  let occupation: string | null = null;
  let category: string | null = null;

  try {
    const [org, sps] = await Promise.all([
      Book.getOrganization(orgId),
      Book.getServiceProviders(orgId),
    ]);

    if (org && sps && sps.length > 0) {
      const sp = sps[0];
      providerName = `${sp.firstName} ${sp.lastName}`;
      occupation = getOccupationLabel(
        bookingData.categories,
        sp.occupationId,
        locale,
      );
      category = getCategoryLabel(
        bookingData.categories,
        sp.occupationId,
        locale,
      );
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
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              background: "#8b7355",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
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

          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#3d3229",
              lineHeight: 1.2,
            }}
          >
            {providerName}
          </div>

          {occupation && (
            <div
              style={{
                fontSize: "32px",
                color: "#6b5d4d",
              }}
            >
              {occupation}
            </div>
          )}

          {category && (
            <div
              style={{
                fontSize: "20px",
                color: "#8b7355",
                background: "#ffffff",
                padding: "8px 24px",
                borderRadius: "20px",
              }}
            >
              {category}
            </div>
          )}

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
            <span>📅</span>
            <span>Book an appointment</span>
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
