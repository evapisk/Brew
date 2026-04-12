"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { LogOut, Check, X, Plus } from "lucide-react";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";

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

function TagSection({
  label, sublabel, tags, all, color, onChange,
}: {
  label: string; sublabel: string; tags: string[];
  all: string[]; color: string; onChange: (next: string[]) => void;
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
            <button onClick={() => remove(tag)} className="opacity-70 hover:opacity-100 transition" aria-label={`Remove ${tag}`}>
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
            <button key={tag} onClick={() => add(tag)} className="tag-pill tag-pill-inactive text-xs">
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState(1);
  const [industry, setIndustry] = useState("");
  const [categories, setCategories] = useState<Categories>({ goals: [], skills_offer: [], skills_want: [] });
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
      setEmail(user.email ?? "");
      // Try with industry first, fall back without it if column doesn't exist yet
      let { data, error: fetchError } = await supabase
        .from("users")
        .select("name, university, year, industry, goals, skills_offer, skills_want")
        .eq("auth_id", user.id)
        .single();
      if (fetchError?.code === "42703" || fetchError?.message?.includes("industry")) {
        ({ data } = await supabase
          .from("users")
          .select("name, university, year, goals, skills_offer, skills_want")
          .eq("auth_id", user.id)
          .single());
      }
      if (data) {
        setName(data.name ?? "");
        setUniversity(data.university ?? "");
        setYear(data.year ?? 1);
        setIndustry(data.industry ?? "");
        setCategories({
          goals: data.goals ?? [],
          skills_offer: data.skills_offer ?? [],
          skills_want: data.skills_want ?? [],
        });
      }
      setLoading(false);
    });
  }, [router]);

  const updateCategory = useCallback((field: keyof Categories, next: string[]) => {
    setCategories((c) => ({ ...c, [field]: next }));
    setSaved(false);
  }, []);

  async function handleSave() {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, university, year, industry,
          goals: categories.goals,
          skills_offer: categories.skills_offer,
          skills_want: categories.skills_want,
          organizations: [], favorite_cafes: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
            setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally { setSaving(false); }
  }

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/");
  }

  const avatarLetters = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* Header */}
      <div className="brew-header px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white animate-fade-in" style={{ letterSpacing: "-0.01em" }}>profile</h1>
        <p className="text-xs font-lora text-white/50 mt-0.5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          your account
        </p>
      </div>

      {loading ? (
        <div className="flex-1 px-6 pt-6 space-y-4 animate-fade-in">
          <div className="h-20 skeleton rounded-2xl" />
          {[1,2,3,4].map((i) => <div key={i} className="h-14 skeleton rounded-xl" style={{ animationDelay: `${i*0.08}s` }} />)}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scroll-smooth-ios px-6 pt-6 pb-6 space-y-5">

            {/* Avatar card */}
            <div
              className="flex items-center gap-4 rounded-2xl px-5 py-4 animate-fade-in-up"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 6px 20px rgba(61,31,13,0.09)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-lg font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4A2C17, #3D1F0D)", boxShadow: "0 3px 12px rgba(61,31,13,0.28)" }}
              >
                {avatarLetters}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-brew-walnut truncate" style={{ letterSpacing: "-0.01em" }}>
                  {name || "Your name"}
                </p>
                <p className="text-xs text-brew-khaki truncate mt-0.5">{email}</p>
              </div>
            </div>

            {/* Basic fields */}
            <div
              className="rounded-2xl px-5 py-5 space-y-4 animate-fade-in-up"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 6px 20px rgba(61,31,13,0.09)", animationDelay: "0.08s" }}
            >
              <div>
                <p className="section-label">NAME</p>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }}
                  placeholder="Your full name" className="brew-input" />
              </div>
              <div>
                <p className="section-label">INDUSTRY</p>
                <input type="text" value={industry} onChange={(e) => { setIndustry(e.target.value); setSaved(false); }}
                  placeholder="e.g. Tech, Finance, Healthcare…" className="brew-input" />
              </div>
              <div>
                <p className="section-label">YEAR</p>
                <select value={year} onChange={(e) => { setYear(Number(e.target.value)); setSaved(false); }} className="brew-input">
                  {[1,2,3,4,5,6].map((y) => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
                </select>
              </div>
              <div>
                <p className="section-label">COLLEGE</p>
                <input type="text" value={university} onChange={(e) => { setUniversity(e.target.value); setSaved(false); }}
                  placeholder="e.g. NYU, UCLA, MIT…" className="brew-input" />
              </div>
            </div>

            {/* Tag sections */}
            <div
              className="rounded-2xl px-5 py-5 space-y-6 animate-fade-in-up"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 6px 20px rgba(61,31,13,0.09)", animationDelay: "0.12s" }}
            >
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
                sublabel="What you're working toward"
                tags={categories.goals}
                all={ALL_GOALS}
                color="bg-brew-accent"
                onChange={(next) => updateCategory("goals", next)}
              />
              <div className="border-t border-[#EAE6DF]" />
              <TagSection
                label="SKILLS YOU WANT TO LEARN"
                sublabel="What you want from a match"
                tags={categories.skills_want}
                all={ALL_SKILLS}
                color="bg-[#4A6B9B]"
                onChange={(next) => updateCategory("skills_want", next)}
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-600 animate-scale-in"
                style={{ background: "rgba(220,60,60,0.06)", border: "1px solid rgba(220,60,60,0.15)" }}>
                {error}
              </div>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold w-full transition-all active:scale-[0.98] animate-fade-in-up"
              style={{ animationDelay: "0.2s", background: "rgba(220,60,60,0.06)", color: "#C0383A", border: "1px solid rgba(220,60,60,0.15)" }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>

          {/* Save bar — outside scroll container so it doesn't fight the nav */}
          <div
            className="shrink-0 px-6 py-4"
            style={{ background: "rgba(232,228,220,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(212,207,198,0.5)" }}
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              style={{
                background: saved ? "linear-gradient(135deg, #2E6B3A, #3A8A4A)" : "linear-gradient(135deg, #4A2C17, #3D1F0D)",
                color: "#fff",
                boxShadow: saved ? "0 4px 16px rgba(46,107,58,0.32)" : "0 4px 16px rgba(61,31,13,0.28)",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {saved ? <><Check size={18} /> Saved</> : saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
