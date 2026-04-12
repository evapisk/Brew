import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { findMatches } from "@/lib/matching";

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

  // Fetch requesting user's full profile
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile, error: profileError } = await admin
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (!profile.onboarded) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
  }

  try {
    const matches = await findMatches(profile);
    // Attach the stored match ID from DB for status updates
    const matchesWithIds = await Promise.all(
      matches.map(async (m) => {
        const { data: stored } = await admin
          .from("matches")
          .select("id")
          .or(`and(user_a_id.eq.${profile.id},user_b_id.eq.${m.user.id}),and(user_a_id.eq.${m.user.id},user_b_id.eq.${profile.id})`)
          .single();
        return { ...m, matchId: stored?.id };
      })
    );
    return NextResponse.json({ matches: matchesWithIds });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Matching failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
