import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email?.endsWith(".edu")) {
    return NextResponse.json({ error: "A .edu email address is required." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const authId = data.user?.id;
  if (!authId) return NextResponse.json({ error: "Signup failed" }, { status: 500 });

  // Extract university from email domain (e.g. nyu.edu → NYU)
  const domain = email.split("@")[1].replace(".edu", "").toUpperCase();

  // Create profile row (minimal — onboarding fills the rest)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: profileError } = await admin.from("users").insert({
    auth_id: authId,
    email,
    name,
    university: domain,
    year: 1,
  });

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
