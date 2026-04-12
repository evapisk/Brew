"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
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
=======
import { LogOut, Check, X, Plus } from "lucide-react";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";
>>>>>>> c740b2f (ai resume extraction)

const ALL_GOALS = Object.values(GOAL_TAGS).flat() as string[];
const ALL_SKILLS = Object.values(SKILL_TAGS).flat() as string[];

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior",
  4: "Senior", 5: "Master's", 6: "PhD",
};

interface Categories {
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
}

// ── Editable tag section (reused from onboarding) ─────────────────────────────
function TagSection({
  label, sublabel, tags, all, color, onChange,
}: {
  label: string;
  sublabel: string;
  tags: string[];
  all: string[];
  color: string;
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const remaining = all.filter((t) => !tags.includes(t));

  function remove(tag: string) { onChange(tags.filter((t) => t !== tag)); }
  function add(tag: string) {
    onChange([...tags, tag]);
    if (remaining.length === 1) setOpen(false);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="section-label">{label}</p>
        <p className="text-xs text-brew-khaki mt-0.5">{sublabel}</p>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {tags.length === 0 && (
          <p className="text-xs text-brew-khaki italic">None — tap + to add</p>
        )}
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1.5 rounded-full ${color} text-white px-3 py-1 text-xs font-medium`}
          >
            {tag}
            <button
              onClick={() => remove(tag)}
              className="opacity-70 hover:opacity-100 transition"
              aria-label={`Remove ${tag}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {remaining.length > 0 && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 rounded-full border border-dashed border-brew-beige text-brew-khaki px-3 py-1 text-xs hover:border-brew-accent hover:text-brew-accent transition"
          >
            <Plus size={11} /> Add
          </button>
        )}
      </div>

      {open && remaining.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EAE6DF]">
          {remaining.map((tag) => (
            <button
              key={tag}
              onClick={() => add(tag)}
              className="tag-pill tag-pill-inactive text-xs"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
<<<<<<< HEAD
  const [profile, setProfile] = useState<ProfileData>({
    name: "", email: "", major: "", university: "", year: 1,
    goals: [], skills_offer: [], skills_want: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
=======
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [university, setUniversity] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [categories, setCategories] = useState<Categories>({
    goals: [], skills_offer: [], skills_want: [],
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
>>>>>>> c740b2f (ai resume extraction)

  // Load profile on mount
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
<<<<<<< HEAD

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
=======
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) return;
      setEmail(authData.user.email ?? null);

      const { data: profile } = await (supabase
        .from("users")
        .select("name, university, year, goals, skills_offer, skills_want")
        .eq("auth_id", authData.user.id)
        .single() as any);

      if (profile) {
        setName(profile.name ?? null);
        setUniversity(profile.university ?? null);
        setYear(profile.year ?? null);
        setCategories({
          goals: profile.goals ?? [],
          skills_offer: profile.skills_offer ?? [],
          skills_want: profile.skills_want ?? [],
        });
      }
    });
  }, []);
>>>>>>> c740b2f (ai resume extraction)

  // Track changes
  const updateCategory = useCallback(
    (field: keyof Categories, next: string[]) => {
      setCategories((c) => ({ ...c, [field]: next }));
      setDirty(true);
      setSaved(false);
    },
    []
  );

  async function handleSaveCategories() {
    setSaving(true);
    try {
      const res = await fetch("/api/users/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      if (!res.ok) throw new Error("Save failed");
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
<<<<<<< HEAD
      {/* ── Header ── */}
      <div className="bg-brew-walnut px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white">profile</h1>
        <p className="text-xs font-lora text-white/50 mt-0.5">your account</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-brew-khaki animate-pulse">Loading…</p>
=======
      {/* Header */}
      <div className="bg-brew-walnut px-6 pt-14 pb-6 shrink-0">
        <h1 className="text-xl font-bold text-white">brew</h1>
        <p className="text-xs text-white/50 mt-0.5">your profile</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 space-y-5">

        {/* Account info */}
        <div className="rounded-xl bg-white card-shadow px-5 py-4 space-y-1">
          <p className="section-label">ACCOUNT</p>
          <p className="text-sm font-semibold text-brew-walnut">{name ?? email ?? "Loading…"}</p>
          {university && year && (
            <p className="text-xs text-brew-khaki">
              {YEAR_LABELS[year]} · {university}
            </p>
          )}
          {!university && (
            <p className="text-xs text-brew-khaki">{email ?? ""}</p>
          )}
        </div>

        {/* Categories card */}
        <div className="rounded-xl bg-white card-shadow px-5 py-5 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-brew-walnut">Your categories</p>
            {dirty && (
              <button
                onClick={handleSaveCategories}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-full bg-brew-walnut text-white text-xs font-semibold px-3 py-1.5 hover:bg-brew-body transition disabled:opacity-50"
              >
                {saving ? "Saving…" : saved ? <><Check size={11} /> Saved</> : "Save changes"}
              </button>
            )}
            {saved && !dirty && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check size={12} /> Saved
              </span>
            )}
          </div>

          <TagSection
            label="SKILLS YOU OFFER"
            sublabel="What you can teach — drives who gets matched to you"
            tags={categories.skills_offer}
            all={ALL_SKILLS}
            color="bg-brew-walnut"
            onChange={(next) => updateCategory("skills_offer", next)}
          />

          <div className="border-t border-[#EAE6DF]" />

          <TagSection
            label="YOUR GOALS"
            sublabel="What you're working toward — used to find aligned matches"
            tags={categories.goals}
            all={ALL_GOALS}
            color="bg-brew-accent"
            onChange={(next) => updateCategory("goals", next)}
          />

          <div className="border-t border-[#EAE6DF]" />

          <TagSection
            label="SKILLS YOU WANT TO LEARN"
            sublabel="What you want from a match — used to find complementary skills"
            tags={categories.skills_want}
            all={ALL_SKILLS}
            color="bg-[#4A6B9B]"
            onChange={(next) => updateCategory("skills_want", next)}
          />
>>>>>>> c740b2f (ai resume extraction)
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
