import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getMatchStrength } from "@/lib/matching";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])),
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await admin
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ matches: [] });

  const { data: rawMatches, error } = await admin
    .rpc("get_match_history", { p_user_id: profile.id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Only show accepted matches
  const accepted = (rawMatches ?? []).filter(
    (m: Record<string, unknown>) => m.status === "accepted"
  );

  // Enrich with other user's profile
  const enriched = await Promise.all(
    accepted.map(async (m: Record<string, unknown>) => {
      const otherId = m.user_a_id === profile.id ? m.user_b_id : m.user_a_id;
      const { data: other } = await admin
        .from("users")
        .select("name, university, year, goals")
        .eq("id", otherId)
        .single();

      const breakdown = (m.breakdown as { isMutual?: boolean }) ?? {};

      return {
        ...m,
        strength: getMatchStrength(m.score as number, breakdown),
        other_user: other,
      };
    })
  );

  return NextResponse.json({ matches: enriched });
}
