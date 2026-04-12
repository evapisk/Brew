"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { LogOut, Check } from "lucide-react";

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior",
  4: "Senior", 5: "Master's", 6: "PhD",
};

interface ProfileData {
  name: string;
  email: string;
  major: string;
  university: string;
  year: number;
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: "", email: "", major: "", university: "", year: 1,
    goals: [], skills_offer: [], skills_want: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/signin"); return; }

      const { data } = await supabase
        .from("users")
        .select("name, major, university, year, goals, skills_offer, skills_want")
        .eq("auth_id", user.id)
        .single();

      setProfile({
        name: data?.name ?? "",
        email: user.email ?? "",
        major: data?.major ?? "",
        university: data?.university ?? "",
        year: data?.year ?? 1,
        goals: data?.goals ?? [],
        skills_offer: data?.skills_offer ?? [],
        skills_want: data?.skills_want ?? [],
      });
      setLoading(false);
    });
  }, [router]);

  function set(field: keyof ProfileData, value: string | number) {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          major: profile.major,
          university: profile.university,
          year: profile.year,
          goals: profile.goals,
          skills_offer: profile.skills_offer,
          skills_want: profile.skills_want,
          organizations: [],
          favorite_cafes: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="bg-brew-walnut px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white">profile</h1>
        <p className="text-xs font-lora text-white/50 mt-0.5">your account</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-brew-khaki animate-pulse">Loading…</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-36 space-y-5">

            {/* Avatar / name row */}
            <div className="flex items-center gap-4 rounded-xl bg-white card-shadow px-5 py-4">
              <div className="w-14 h-14 rounded-full bg-brew-walnut flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-white">
                  {profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-brew-walnut truncate">{profile.name || "Your name"}</p>
                <p className="text-xs text-brew-khaki truncate">{profile.email}</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <p className="section-label">NAME</p>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
                className="brew-input"
              />
            </div>

            {/* Major */}
            <div>
              <p className="section-label">MAJOR</p>
              <input
                type="text"
                value={profile.major}
                onChange={(e) => set("major", e.target.value)}
                placeholder="e.g. Computer Science"
                className="brew-input"
              />
            </div>

            {/* Year */}
            <div>
              <p className="section-label">YEAR</p>
              <select
                value={profile.year}
                onChange={(e) => set("year", Number(e.target.value))}
                className="brew-input"
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>{YEAR_LABELS[y]}</option>
                ))}
              </select>
            </div>

            {/* University */}
            <div>
              <p className="section-label">COLLEGE</p>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => set("university", e.target.value)}
                placeholder="e.g. NYU, UCLA, MIT…"
                className="brew-input"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition w-full justify-center"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>

          {/* ── Sticky save ── */}
          <div className="sticky bottom-0 bg-brew-offwhite border-t border-[#D4CFC6] px-6 py-5 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full py-4 text-base font-semibold transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: saved ? "#4A7C4E" : "var(--brew-walnut)", color: "#fff" }}
            >
              {saved ? (
                <><Check size={18} /> Saved</>
              ) : saving ? (
                "Saving…"
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
