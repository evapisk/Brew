import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { university, year, goals, skills_offer, skills_want, organizations, favorite_cafes } = body;

  if (!university || !year) {
    return NextResponse.json({ error: "University and year are required." }, { status: 400 });
  }

  // Get authenticated user via session cookie
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

  // Use admin client to update profile
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const updates: Record<string, unknown> = {
    university,
    year,
    goals: goals ?? [],
    skills_offer: skills_offer ?? [],
    skills_want: skills_want ?? [],
    organizations: organizations ?? [],
    favorite_cafes: favorite_cafes ?? [],
    onboarded: true,
  };

  let { error } = await admin.from("users").update(updates).eq("auth_id", user.id);

  // If favorite_cafes column doesn't exist yet (migration not run), retry without it
  if (error?.message?.includes("favorite_cafes")) {
    const { favorite_cafes: _dropped, ...withoutCafes } = updates;
    void _dropped;
    ({ error } = await admin.from("users").update(withoutCafes).eq("auth_id", user.id));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
