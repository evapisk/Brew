"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";

// Flatten tag lists for display
const ALL_SKILLS = Object.values(SKILL_TAGS).flat();

type Step = "import" | "goals" | "skills" | "orgs" | "cafes";

interface Cafe {
  name: string;
  description: string;
  url: string;
}

interface Profile {
  university: string;
  year: number;
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
  organizations: string[];
  favorite_cafes: string[];
}

const YEAR_LABELS: Record<number, string> = {
  1: "1st year", 2: "2nd year", 3: "3rd year",
  4: "4th year", 5: "Master's", 6: "PhD",
};

const STEPS: Step[] = ["import", "goals", "skills", "orgs", "cafes"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("import");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Import fields
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeText, setResumeText] = useState("");

  // Profile fields
  const [profile, setProfile] = useState<Profile>({
    university: "",
    year: 1,
    goals: [],
    skills_offer: [],
    skills_want: [],
    organizations: [],
    favorite_cafes: [],
  });

  // Org input
  const [orgInput, setOrgInput] = useState("");

  // Cafe step
  const [cafeSuggestions, setCafeSuggestions] = useState<Cafe[]>([]);
  const [cafesLoading, setCafesLoading] = useState(false);

  // Fetch cafes when entering the cafes step
  useEffect(() => {
    if (step !== "cafes" || !profile.university) return;
    setCafesLoading(true);
    fetch(`/api/linkup/cafes?university=${encodeURIComponent(profile.university)}`)
      .then((r) => r.json())
      .then((d) => setCafeSuggestions(d.cafes ?? []))
      .catch(() => {})
      .finally(() => setCafesLoading(false));
  }, [step, profile.university]);

  // ── Import step ───────────────────────────────────────────────────────────
  async function handleImport() {
    if (!linkedinUrl && !resumeText) {
      setStep("goals");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");

      setProfile((p) => ({
        ...p,
        university: data.university ?? p.university,
        year: data.year ?? p.year,
        goals: data.goals ?? p.goals,
        skills_offer: data.skills_offer ?? p.skills_offer,
        skills_want: data.skills_want ?? p.skills_want,
        organizations: data.organizations ?? p.organizations,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
      setStep("goals");
    }
  }

  // ── Save & finish ──────────────────────────────────────────────────────────
  async function handleFinish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/discover");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => {
      const current = p[field];
      return {
        ...p,
        [field]: current.includes(tag)
          ? current.filter((t) => t !== tag)
          : [...current, tag],
      };
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
    if (org && !profile.organizations.includes(org)) {
      setProfile((p) => ({ ...p, organizations: [...p.organizations, org] }));
    }
    setOrgInput("");
  }

  function removeOrg(org: string) {
    setProfile((p) => ({ ...p, organizations: p.organizations.filter((o) => o !== org) }));
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-10">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brew-brown/50 uppercase tracking-widest">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-brew-brown/40">brew</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-brew-brown/10">
            <div
              className="h-1.5 rounded-full bg-brew-latte transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ── STEP 1: Import ── */}
        {step === "import" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brew-brown">Let&apos;s build your profile</h2>
              <p className="mt-1 text-brew-brown/60">
                Paste your LinkedIn URL or resume and we&apos;ll pre-fill everything. Takes 90 seconds.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brew-brown/80">
                LinkedIn URL <span className="text-brew-brown/30">(optional)</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full rounded-xl border border-brew-brown/20 bg-white px-4 py-3 text-brew-brown placeholder-brew-brown/30 outline-none focus:border-brew-latte focus:ring-2 focus:ring-brew-latte/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brew-brown/80">
                Or paste your resume <span className="text-brew-brown/30">(optional)</span>
              </label>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text from your resume..."
                className="w-full rounded-xl border border-brew-brown/20 bg-white px-4 py-3 text-brew-brown placeholder-brew-brown/30 outline-none focus:border-brew-latte focus:ring-2 focus:ring-brew-latte/20 resize-none"
              />
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <button
              onClick={handleImport}
              disabled={loading}
              className="rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 disabled:opacity-50"
            >
              {loading ? "Analyzing with AI…" : linkedinUrl || resumeText ? "Auto-fill my profile →" : "Skip, I'll fill it in →"}
            </button>
          </div>
        )}

        {/* ── STEP 2: Goals ── */}
        {step === "goals" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brew-brown">What are you working toward?</h2>
              <p className="mt-1 text-brew-brown/60">Pick up to 5. These drive your matches.</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-brew-brown/60 uppercase tracking-widest">University</label>
                <input
                  type="text"
                  required
                  value={profile.university}
                  onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                  placeholder="NYU"
                  className="w-full rounded-xl border border-brew-brown/20 bg-white px-3 py-2.5 text-sm text-brew-brown outline-none focus:border-brew-latte"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-brew-brown/60 uppercase tracking-widest">Year</label>
                <select
                  value={profile.year}
                  onChange={(e) => setProfile((p) => ({ ...p, year: Number(e.target.value) }))}
                  className="rounded-xl border border-brew-brown/20 bg-white px-3 py-2.5 text-sm text-brew-brown outline-none focus:border-brew-latte"
                >
                  {[1, 2, 3, 4, 5, 6].map((y) => (
                    <option key={y} value={y}>{YEAR_LABELS[y]}</option>
                  ))}
                </select>
              </div>
            </div>

            {Object.entries(GOAL_TAGS).map(([category, tags]) => (
              <div key={category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {(tags as string[]).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag("goals", tag)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        profile.goals.includes(tag)
                          ? "bg-brew-brown text-brew-cream"
                          : "bg-white text-brew-brown/70 border border-brew-brown/20 hover:border-brew-latte"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => setStep("skills")}
              disabled={profile.goals.length === 0 || !profile.university}
              className="rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}

        {/* ── STEP 3: Skills ── */}
        {step === "skills" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brew-brown">Skill swap</h2>
              <p className="mt-1 text-brew-brown/60">
                What can you teach? What do you want to learn?
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-brew-brown">I can teach / offer</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag("skills_offer", tag)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      profile.skills_offer.includes(tag)
                        ? "bg-brew-latte text-brew-brown"
                        : "bg-white text-brew-brown/70 border border-brew-brown/20 hover:border-brew-latte"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-brew-brown">I want to learn</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag("skills_want", tag)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      profile.skills_want.includes(tag)
                        ? "bg-brew-brown text-brew-cream"
                        : "bg-white text-brew-brown/70 border border-brew-brown/20 hover:border-brew-latte"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("goals")}
                className="flex-1 rounded-2xl border-2 border-brew-brown/20 py-4 font-semibold text-brew-brown transition hover:bg-white/60"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("orgs")}
                disabled={profile.skills_offer.length === 0 && profile.skills_want.length === 0}
                className="flex-[2] rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Orgs ── */}
        {step === "orgs" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brew-brown">Clubs & organizations</h2>
              <p className="mt-1 text-brew-brown/60">
                We use this to avoid matching people who already know each other well.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOrg())}
                placeholder="e.g. Finance Club, Hackathon Team..."
                className="flex-1 rounded-xl border border-brew-brown/20 bg-white px-4 py-3 text-brew-brown placeholder-brew-brown/30 outline-none focus:border-brew-latte"
              />
              <button
                onClick={addOrg}
                className="rounded-xl bg-brew-brown px-4 py-3 text-sm font-semibold text-brew-cream hover:bg-brew-brown/90"
              >
                Add
              </button>
            </div>

            {profile.organizations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.organizations.map((org) => (
                  <span key={org} className="flex items-center gap-1.5 rounded-full bg-brew-steam px-3 py-1.5 text-sm text-brew-brown">
                    {org}
                    <button onClick={() => removeOrg(org)} className="text-brew-brown/40 hover:text-brew-brown">×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("skills")}
                className="flex-1 rounded-2xl border-2 border-brew-brown/20 py-4 font-semibold text-brew-brown transition hover:bg-white/60"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("cafes")}
                className="flex-[2] rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Cafes ── */}
        {step === "cafes" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-brew-brown">Favorite spots ☕</h2>
              <p className="mt-1 text-brew-brown/60">
                Pick 1–2 go-to cafes near campus. We&apos;ll suggest meetup spots your match will love too.
              </p>
            </div>

            {cafesLoading && (
              <div className="flex items-center gap-2 text-sm text-brew-brown/50 animate-pulse">
                <span>Finding cafes near {profile.university}…</span>
              </div>
            )}

            {!cafesLoading && cafeSuggestions.length > 0 && (
              <div className="flex flex-col gap-3">
                {cafeSuggestions.map((cafe) => (
                  <button
                    key={cafe.name}
                    onClick={() => toggleCafe(cafe.name)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      profile.favorite_cafes.includes(cafe.name)
                        ? "border-brew-brown bg-brew-steam"
                        : "border-brew-brown/15 bg-white hover:border-brew-latte"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-brew-brown">{cafe.name}</p>
                        <p className="mt-0.5 text-xs text-brew-brown/50 line-clamp-2">{cafe.description}</p>
                      </div>
                      <span className={`mt-0.5 shrink-0 text-lg ${profile.favorite_cafes.includes(cafe.name) ? "opacity-100" : "opacity-20"}`}>
                        ✓
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!cafesLoading && cafeSuggestions.length === 0 && (
              <p className="rounded-xl bg-brew-steam px-4 py-3 text-sm text-brew-brown/60">
                No cafe data available — you can add favorites later from your profile.
              </p>
            )}

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("orgs")}
                className="flex-1 rounded-2xl border-2 border-brew-brown/20 py-4 font-semibold text-brew-brown transition hover:bg-white/60"
              >
                ← Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-[2] rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md transition hover:bg-brew-brown/90 disabled:opacity-50"
              >
                {loading ? "Saving…" : "Find My Matches ☕"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
