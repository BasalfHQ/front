import { NextResponse } from "next/server";
import { auth, isAdmin } from "@repo/auth-ui";
import { fetchMapboxStaticMap } from "@/features/organization/mapbox";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.idToken || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      "Cache-Control": "private, max-age=3600",
    },
  });
}
