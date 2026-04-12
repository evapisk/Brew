import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  const authId = data.user.id;

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from("users")
    .select("onboarded")
    .eq("auth_id", authId)
    .single();

  return NextResponse.json({ ok: true, onboarded: profile?.onboarded ?? false });
}
