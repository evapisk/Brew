import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs: Array<{ name: string; value: string; options?: Record<string, unknown> }>) =>
          cs.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: me } = await admin
    .from("users")
    .select("id, name, university, year, onboarded, is_active, goals, skills_offer, skills_want")
    .eq("auth_id", user.id)
    .single();

  const { data: candidates } = await admin
    .from("users")
    .select("id, name, university, onboarded, is_active, goals, skills_offer, skills_want")
    .eq("university", me?.university ?? "")
    .eq("onboarded", true)
    .neq("id", me?.id ?? "");

  const { data: allUsers } = await admin
    .from("users")
    .select("id, name, university, onboarded, is_active")
    .limit(20);

  return NextResponse.json({
    me,
    candidateCount: candidates?.length ?? 0,
    candidates: candidates?.map(c => ({ name: c.name, university: c.university, onboarded: c.onboarded, is_active: c.is_active })),
    allUsers: allUsers?.map(u => ({ name: u.name, university: u.university, onboarded: u.onboarded, is_active: u.is_active })),
  });
}
