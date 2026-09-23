import { NextResponse } from "next/server";
import { fetchMapboxStaticMap } from "@/features/organization/mapbox";

// Public - both the admin org form and the public checkout funnel use this
// to show a "does this pin look right" confirmation for a resolved address.
// Coordinates are caller-supplied either way (nothing session-scoped to
// protect here); it just proxies a static map image for a lat/lng pair.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const lat = latParam !== null ? Number(latParam) : NaN;
  const lng = lngParam !== null ? Number(lngParam) : NaN;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const image = await fetchMapboxStaticMap(lat, lng);

  if (!image) {
    return NextResponse.json({ error: "Failed to fetch map" }, { status: 502 });
  }

  return new NextResponse(image.body, {
    headers: {
      "Content-Type": image.headers.get("Content-Type") ?? "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
