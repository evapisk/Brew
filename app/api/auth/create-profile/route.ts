import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { authId, email, name } = await req.json();

  if (!authId || !email || !name) {
    return NextResponse.json({ error: "authId, email, and name are required" }, { status: 400 });
  }

  const domain = email.split("@")[1].replace(".edu", "").toUpperCase();

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin.from("users").insert({
    auth_id: authId,
    email,
    name,
    university: domain,
    year: 1,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
