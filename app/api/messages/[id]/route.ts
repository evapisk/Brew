import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function getAuth() {
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
  return supabase.auth.getUser();
}

// GET /api/messages/[id] — fetch messages for a match
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: { user }, error: authError } = await getAuth();
  if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await admin
    .from("users").select("id").eq("auth_id", user.id).single();
  if (!profile) return NextResponse.json({ messages: [] });

  // Verify user belongs to this match
  const { data: match } = await admin
    .from("matches").select("user_a_id, user_b_id").eq("id", id).single();
  if (!match || (match.user_a_id !== profile.id && match.user_b_id !== profile.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: messages, error } = await admin
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("match_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: messages ?? [] });
}

// POST /api/messages/[id] — send a message
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: { user }, error: authError } = await getAuth();
  if (authError || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await admin
    .from("users").select("id").eq("auth_id", user.id).single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Verify user belongs to this match
  const { data: match } = await admin
    .from("matches").select("user_a_id, user_b_id").eq("id", id).single();
  if (!match || (match.user_a_id !== profile.id && match.user_b_id !== profile.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: message, error } = await admin
    .from("messages")
    .insert({ match_id: id, sender_id: profile.id, content: content.trim() })
    .select("id, sender_id, content, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message });
}
