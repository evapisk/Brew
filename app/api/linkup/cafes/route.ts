import { NextResponse } from "next/server";
import { getCafesNearUniversity } from "@/lib/linkup";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const university = searchParams.get("university");

  if (!university) {
    return NextResponse.json({ error: "university param required" }, { status: 400 });
  }

  if (!process.env.LINKUP_API_KEY) {
    return NextResponse.json({ cafes: [] }); // graceful degradation
  }

  try {
    const cafes = await getCafesNearUniversity(university);
    return NextResponse.json({ cafes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Linkup fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
