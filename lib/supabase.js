import { createClient } from "@supabase/supabase-js";

// ─── Browser / frontend client (uses anon key + RLS) ───────────────────────
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── Server-only admin client (bypasses RLS — never expose to browser) ──────
export function getAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("getAdminClient() must only be called server-side");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

/** Sign up with .edu gate enforced */
export async function signUp(email, password) {
  if (!email.endsWith(".edu")) {
    throw new Error("A .edu email address is required.");
  }
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ─── User profile helpers ────────────────────────────────────────────────────

/** Fetch a user's full profile by their auth UID */
export async function getProfile(authId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();
  if (error) throw error;
  return data;
}

/** Create a profile row after successful sign-up */
export async function createProfile(authId, profile) {
  const { data, error } = await supabase
    .from("users")
    .insert({ auth_id: authId, ...profile })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update onboarding fields (goals, skills, orgs, etc.) */
export async function updateProfile(authId, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("auth_id", authId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Match helpers ───────────────────────────────────────────────────────────

/** Fetch all matches for the current user */
export async function getMyMatches(userId) {
  const { data, error } = await supabase
    .rpc("get_match_history", { p_user_id: userId });
  if (error) throw error;
  return data;
}

/** Update match status (accept / decline / complete) */
export async function updateMatchStatus(matchId, status) {
  const { data, error } = await supabase
    .from("matches")
    .update({ status })
    .eq("id", matchId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
