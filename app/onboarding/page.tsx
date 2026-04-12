"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";
import { X } from "lucide-react";

const ALL_SKILLS = Object.values(SKILL_TAGS).flat();
type Step = "import" | "goals" | "skills" | "orgs" | "cafes";

interface Cafe { name: string; description: string; url: string; }
interface Profile {
  university: string; year: number; goals: string[];
  skills_offer: string[]; skills_want: string[];
  organizations: string[]; favorite_cafes: string[];
}

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior",
  4: "Senior", 5: "Master's", 6: "PhD",
};
const STEPS: Step[] = ["import", "goals", "skills", "orgs", "cafes"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("import");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [profile, setProfile] = useState<Profile>({
    university: "", year: 1, goals: [],
    skills_offer: [], skills_want: [], organizations: [], favorite_cafes: [],
  });
  const [orgInput, setOrgInput] = useState("");
  const [cafeSuggestions, setCafeSuggestions] = useState<Cafe[]>([]);
  const [cafesLoading, setCafesLoading] = useState(false);

  useEffect(() => {
    if (step !== "cafes" || !profile.university) return;
    setCafesLoading(true);
    fetch(`/api/linkup/cafes?university=${encodeURIComponent(profile.university)}`)
      .then((r) => r.json()).then((d) => setCafeSuggestions(d.cafes ?? []))
      .catch(() => {}).finally(() => setCafesLoading(false));
  }, [step, profile.university]);

  async function handleImport() {
    if (!profileUrl && !resumeText) { setStep("goals"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/onboard/import", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setProfile((p) => ({
        ...p,
        university: data.university ?? p.university, year: data.year ?? p.year,
        goals: data.goals ?? p.goals, skills_offer: data.skills_offer ?? p.skills_offer,
        skills_want: data.skills_want ?? p.skills_want, organizations: data.organizations ?? p.organizations,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally { setLoading(false); setStep("goals"); }
  }

  async function handleFinish() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/discover");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally { setLoading(false); }
  }

  function toggleTag(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => {
      const cur = p[field];
      return { ...p, [field]: cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag] };
    });
  }

  function toggleCafe(name: string) {
    setProfile((p) => ({
      ...p,
      favorite_cafes: p.favorite_cafes.includes(name)
        ? p.favorite_cafes.filter((c) => c !== name)
        : [...p.favorite_cafes, name],
    }));
  }

  function addOrg() {
    const org = orgInput.trim();
    if (org && !profile.organizations.includes(org))
      setProfile((p) => ({ ...p, organizations: [...p.organizations, org] }));
    setOrgInput("");
  }

  const stepIndex = STEPS.indexOf(step);
  const stepTitles: Record<Step, { h: string; sub: string }> = {
    import: { h: "Hey there.", sub: "Tell us a bit about yourself so we can find your best matches." },
    goals:  { h: "What are you working toward?", sub: "Pick up to 5 goals — these drive your matches." },
    skills: { h: "Skill swap.", sub: "What can you teach? What do you want to learn?" },
    orgs:   { h: "Clubs & organizations.", sub: "Helps us avoid matching people who already know each other." },
    cafes:  { h: "Favorite spots ☕", sub: "Pick 1–2 go-to cafes near campus for meetups." },
  };

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Green header ── */}
      <div className="bg-brew-walnut px-6 pt-14 pb-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-bold text-lg">brew</span>
          <span className="text-white/50 text-xs">{stepIndex + 1} / {STEPS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-white/20">
          <div
            className="h-1 rounded-full bg-white transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        <h2 className="text-2xl font-bold text-brew-walnut">{stepTitles[step].h}</h2>
        <p className="mt-1 mb-6 text-sm text-brew-midbrown">{stepTitles[step].sub}</p>

        {/* ── STEP 1: Import ── */}
        {step === "import" && (
          <div className="space-y-5">
            <div>
              <p className="section-label">PROFILE URL</p>
              <input
                type="url" value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="linkedin.com/in/you or github.com/you"
                className="brew-input"
              />
              <p className="mt-1 text-xs text-brew-khaki">LinkedIn, GitHub, or portfolio — optional</p>
            </div>
            <div>
              <p className="section-label">OR PASTE YOUR RESUME / BIO</p>
              <textarea
                rows={5} value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text from your resume..."
                className="brew-input resize-none"
              />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          </div>
        )}

        {/* ── STEP 2: Goals ── */}
        {step === "goals" && (
          <div className="space-y-6">
            <div>
              <p className="section-label">YOUR DETAILS</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="section-label">SCHOOL</p>
                  <input
                    type="text" required value={profile.university}
                    onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                    placeholder="e.g. NYU"
                    className="brew-input"
                  />
                </div>
                <div className="w-32">
                  <p className="section-label">YEAR</p>
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile((p) => ({ ...p, year: Number(e.target.value) }))}
                    className="brew-input"
                  >
                    {[1,2,3,4,5,6].map((y) => (
                      <option key={y} value={y}>{YEAR_LABELS[y]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {Object.entries(GOAL_TAGS).map(([category, tags]) => (
              <div key={category}>
                <p className="section-label">{category.toUpperCase()}</p>
                <div className="flex flex-wrap gap-2">
                  {(tags as string[]).map((tag) => (
                    <button key={tag} onClick={() => toggleTag("goals", tag)}
                      className={`tag-pill ${profile.goals.includes(tag) ? "tag-pill-active" : "tag-pill-inactive"}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 3: Skills ── */}
        {step === "skills" && (
          <div className="space-y-6">
            <div>
              <p className="section-label">I CAN TEACH / OFFER</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((tag) => (
                  <button key={tag} onClick={() => toggleTag("skills_offer", tag)}
                    className={`tag-pill ${profile.skills_offer.includes(tag) ? "bg-[#7A4A2A] text-white border-transparent" : "tag-pill-inactive"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="section-label">I WANT TO LEARN</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((tag) => (
                  <button key={tag} onClick={() => toggleTag("skills_want", tag)}
                    className={`tag-pill ${profile.skills_want.includes(tag) ? "bg-[#4A6B9B] text-white border-transparent" : "tag-pill-inactive"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Orgs ── */}
        {step === "orgs" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text" value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOrg())}
                placeholder="e.g. Finance Club, Hackathon Team…"
                className="brew-input flex-1"
              />
              <button onClick={addOrg}
                className="rounded-lg bg-brew-walnut px-4 text-white text-sm font-semibold hover:bg-brew-body transition shrink-0">
                Add
              </button>
            </div>
            {profile.organizations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.organizations.map((org) => (
                  <span key={org} className="flex items-center gap-1.5 rounded-full bg-white border border-[#D4CFC6] px-3 py-1.5 text-sm text-brew-body">
                    {org}
                    <button onClick={() => setProfile((p) => ({ ...p, organizations: p.organizations.filter((o) => o !== org) }))}
                      className="text-brew-khaki hover:text-brew-walnut transition">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 5: Cafes ── */}
        {step === "cafes" && (
          <div className="space-y-3">
            {cafesLoading && (
              <p className="animate-pulse text-sm text-brew-khaki py-4">Finding cafes near {profile.university}…</p>
            )}
            {!cafesLoading && cafeSuggestions.map((cafe) => {
              const sel = profile.favorite_cafes.includes(cafe.name);
              return (
                <button key={cafe.name} onClick={() => toggleCafe(cafe.name)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    sel ? "border-brew-walnut bg-white" : "border-[#D4CFC6] bg-white hover:border-brew-walnut/50"
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brew-walnut text-sm">{cafe.name}</p>
                      <p className="mt-0.5 text-xs text-brew-khaki line-clamp-2">{cafe.description}</p>
                    </div>
                    <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      sel ? "border-brew-walnut bg-brew-walnut" : "border-[#D4CFC6]"
                    }`}>
                      {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}
            {!cafesLoading && cafeSuggestions.length === 0 && (
              <p className="rounded-lg bg-white border border-[#D4CFC6] px-4 py-3 text-sm text-brew-khaki">
                No cafes found — you can skip this and update later.
              </p>
            )}
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="sticky bottom-0 bg-brew-offwhite border-t border-[#D4CFC6] px-6 py-4 shrink-0">
        {step === "import" && (
          <button onClick={handleImport} disabled={loading} className="btn-primary">
            {loading ? "Analyzing with AI…" : (profileUrl || resumeText) ? "Auto-fill my profile →" : "Skip, fill it in manually →"}
          </button>
        )}
        {step === "goals" && (
          <button onClick={() => setStep("skills")} disabled={!profile.university || profile.goals.length === 0} className="btn-primary">
            Next →
          </button>
        )}
        {step === "skills" && (
          <button onClick={() => setStep("orgs")} disabled={profile.skills_offer.length === 0 && profile.skills_want.length === 0} className="btn-primary">
            Next →
          </button>
        )}
        {step === "orgs" && (
          <button onClick={() => setStep("cafes")} className="btn-primary">Next →</button>
        )}
        {step === "cafes" && (
          <button onClick={handleFinish} disabled={loading} className="btn-primary">
            {loading ? "Saving…" : "Find my matches"}
          </button>
        )}
      </div>
    </main>
  );
}
