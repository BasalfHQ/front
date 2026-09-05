import { getCalendarSubscription } from "@repo/apis";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const ics = await getCalendarSubscription(orgId);

  if (!ics) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${orgId}.ics"`,
    },
  });
}
