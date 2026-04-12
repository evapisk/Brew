import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await admin
    .from("users").select("id").eq("auth_id", user.id).single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: match, error } = await admin
    .from("matches").select("*").eq("id", id).single();
  if (error || !match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  const otherId = match.user_a_id === profile.id ? match.user_b_id : match.user_a_id;
  const { data: other } = await admin
    .from("users").select("name, university, year").eq("id", otherId).single();

  return NextResponse.json({ match: { ...match, other_user: other } });
}
