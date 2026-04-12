"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { Upload, X } from "lucide-react";

interface Profile {
  name: string;
  major: string;
  year: number;
  university: string;
  interests: string;
  resumeText: string;
}
=======
import { X, Plus } from "lucide-react";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";

const ALL_GOALS = Object.values(GOAL_TAGS).flat() as string[];
const ALL_SKILLS = Object.values(SKILL_TAGS).flat() as string[];
>>>>>>> c740b2f (ai resume extraction)

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior",
  4: "Senior", 5: "Master's", 6: "PhD",
};

interface Profile {
  university: string;
  year: number;
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
}

type Step = "upload" | "review";

// ── Editable tag section ──────────────────────────────────────────────────────
function TagSection({
  label, sublabel, tags, all, color, onRemove, onAdd,
}: {
  label: string;
  sublabel: string;
  tags: string[];
  all: string[];
  color: string;       // tailwind bg class for active chips
  onRemove: (t: string) => void;
  onAdd: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const remaining = all.filter((t) => !tags.includes(t));

  return (
    <div className="rounded-xl bg-white card-shadow p-4 space-y-3">
      <div>
        <p className="section-label">{label}</p>
        <p className="text-xs text-brew-khaki mt-0.5">{sublabel}</p>
      </div>

      {/* Active chips */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {tags.length === 0 && (
          <p className="text-xs text-brew-khaki italic">None selected — tap + to add</p>
        )}
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1.5 rounded-full ${color} text-white px-3 py-1 text-xs font-medium`}
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
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

      {/* Picker dropdown */}
      {open && remaining.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#EAE6DF]">
          {remaining.map((tag) => (
            <button
              key={tag}
              onClick={() => { onAdd(tag); if (remaining.length === 1) setOpen(false); }}
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
export default function OnboardingPage() {
  const router = useRouter();
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "", major: "", year: 1,
    university: "", interests: "", resumeText: "",
  });

  function set(field: keyof Profile, value: string | number) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => set("resumeText", ev.target?.result as string ?? "");
    reader.readAsText(file);
  }

  async function handleSubmit() {
    if (!profile.name || !profile.university) {
      setError("Please fill in your name and college.");
      return;
    }
=======
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stage 1 inputs
  const [resumeText, setResumeText] = useState("");
  const [goalsDescription, setGoalsDescription] = useState("");
  const [fileName, setFileName] = useState("");

  // Stage 2 profile
  const [profile, setProfile] = useState<Profile>({
    university: "", year: 1, goals: [], skills_offer: [], skills_want: [],
  });

  // ── File upload handler ───────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  // ── Stage 1 → AI extraction ───────────────────────────────────────────────
  async function handleAnalyze() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, goalsDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setProfile({
        university: data.university ?? "",
        year: data.year ?? 1,
        goals: data.goals ?? [],
        skills_offer: data.skills_offer ?? [],
        skills_want: data.skills_want ?? [],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed. Try pasting your resume text.");
    } finally {
      setLoading(false);
      setStep("review");
    }
  }

  // ── Stage 2 → Save ────────────────────────────────────────────────────────
  async function handleSave() {
    if (!profile.university) { setError("Please enter your university."); return; }
>>>>>>> c740b2f (ai resume extraction)
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        body: JSON.stringify({
          name: profile.name,
          major: profile.major,
          year: profile.year,
          university: profile.university,
          interests: profile.interests,
          resumeText: profile.resumeText,
          goals: profile.interests.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean),
          skills_offer: [],
          skills_want: [],
          organizations: [],
          favorite_cafes: [],
        }),
=======
        body: JSON.stringify(profile),
>>>>>>> c740b2f (ai resume extraction)
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

<<<<<<< HEAD
  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="brew-header px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white">brew</h1>
        <p className="mt-1 text-sm font-lora text-white/60">let&apos;s set up your profile</p>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-36 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-brew-walnut">Hey there.</h2>
          <p className="mt-1 text-sm font-lora text-brew-midbrown">Tell us about yourself so we can find your best matches.</p>
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

        {/* College */}
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

        {/* Interests & Goals */}
        <div>
          <p className="section-label">INTERESTS &amp; GOALS</p>
          <textarea
            rows={4}
            value={profile.interests}
            onChange={(e) => set("interests", e.target.value)}
            placeholder="What are you working toward? What do you love? (e.g. startups, product design, finance, coffee…)"
            className="brew-input resize-none"
          />
        </div>

        {/* Resume upload */}
        <div>
          <p className="section-label">RESUME <span className="normal-case font-normal tracking-normal text-brew-khaki">(optional)</span></p>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-[#D4CFC6] bg-white px-5 py-5 flex flex-col items-center gap-2 hover:border-brew-walnut/50 hover:bg-brew-offwhite transition"
          >
            {resumeFileName ? (
              <>
                <div className="flex items-center gap-2 text-brew-walnut">
                  <Upload size={18} />
                  <span className="text-sm font-medium truncate max-w-[200px]">{resumeFileName}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFileName(""); set("resumeText", ""); }}
                    className="text-brew-khaki hover:text-brew-walnut"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-brew-khaki">Tap to replace</p>
              </>
            ) : (
              <>
                <Upload size={20} className="text-brew-khaki" />
                <p className="text-sm font-medium text-brew-midbrown">Upload your resume</p>
                <p className="text-xs text-brew-khaki">.txt, .pdf, .doc — helps AI find your best match</p>
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="sticky bottom-0 bg-brew-offwhite border-t border-[#D4CFC6] px-6 py-5 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={loading || !profile.name || !profile.university}
          className="btn-pill"
        >
          {loading ? "Setting up your profile…" : "Find my matches ☕"}
        </button>
=======
  // ── Tag helpers ───────────────────────────────────────────────────────────
  function remove(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => ({ ...p, [field]: p[field].filter((t) => t !== tag) }));
  }
  function add(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => ({ ...p, [field]: [...p[field], tag] }));
  }

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* Header */}
      <div className="bg-brew-walnut px-6 pt-14 pb-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-bold text-lg">brew</span>
          <span className="text-white/50 text-xs">{step === "upload" ? "1" : "2"} / 2</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/20">
          <div
            className="h-1 rounded-full bg-white transition-all duration-500"
            style={{ width: step === "upload" ? "50%" : "100%" }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 space-y-5">

        {/* ── STAGE 1: Upload ────────────────────────────────────────────── */}
        {step === "upload" && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-brew-walnut">Hey there.</h2>
              <p className="mt-1 text-sm text-brew-midbrown">
                Upload your resume and describe your goals — we'll build your profile automatically.
              </p>
            </div>

            {/* Resume upload */}
            <div className="space-y-2">
              <p className="section-label">RESUME</p>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
                  fileName
                    ? "border-brew-walnut bg-white"
                    : "border-[#D4CFC6] hover:border-brew-accent"
                }`}
              >
                {fileName ? (
                  <div>
                    <p className="text-sm font-semibold text-brew-walnut">📄 {fileName}</p>
                    <p className="text-xs text-brew-khaki mt-1">Tap to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-brew-midbrown">Tap to upload resume</p>
                    <p className="text-xs text-brew-khaki mt-1">.txt, .pdf, .doc supported</p>
                  </div>
                )}
              </button>
              <p className="text-xs text-brew-khaki">Or paste your resume text below:</p>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text here…"
                className="brew-input resize-none"
              />
            </div>

            {/* Goals description */}
            <div className="space-y-2">
              <p className="section-label">WHAT ARE YOU WORKING TOWARD?</p>
              <textarea
                rows={4}
                value={goalsDescription}
                onChange={(e) => setGoalsDescription(e.target.value)}
                placeholder="e.g. I want to break into VC, launch a startup, and improve my Python skills before graduation…"
                className="brew-input resize-none"
              />
              <p className="text-xs text-brew-khaki">Write freely — we'll extract the right tags for you.</p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
          </>
        )}

        {/* ── STAGE 2: Review ────────────────────────────────────────────── */}
        {step === "review" && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-brew-walnut">Here's your profile.</h2>
              <p className="mt-1 text-sm text-brew-midbrown">
                We built this from your resume and goals. Add or remove anything that doesn't fit.
              </p>
            </div>

            {/* University + year */}
            <div className="rounded-xl bg-white card-shadow p-4 space-y-3">
              <p className="section-label">YOUR DETAILS</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-brew-khaki mb-1">School</p>
                  <input
                    type="text"
                    value={profile.university}
                    onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                    placeholder="e.g. NYU"
                    className="brew-input"
                  />
                </div>
                <div className="w-32">
                  <p className="text-xs text-brew-khaki mb-1">Year</p>
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile((p) => ({ ...p, year: Number(e.target.value) }))}
                    className="brew-input"
                  >
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <option key={y} value={y}>{YEAR_LABELS[y]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills I offer */}
            <TagSection
              label="SKILLS YOU OFFER"
              sublabel="Extracted from your resume — what you can teach others"
              tags={profile.skills_offer}
              all={ALL_SKILLS}
              color="bg-brew-walnut"
              onRemove={(t) => remove("skills_offer", t)}
              onAdd={(t) => add("skills_offer", t)}
            />

            {/* Goals */}
            <TagSection
              label="YOUR GOALS"
              sublabel="Generated from your goals description"
              tags={profile.goals}
              all={ALL_GOALS}
              color="bg-brew-accent"
              onRemove={(t) => remove("goals", t)}
              onAdd={(t) => add("goals", t)}
            />

            {/* Skills I want */}
            <TagSection
              label="SKILLS YOU WANT TO LEARN"
              sublabel="Inferred from your goals — what will help you get there"
              tags={profile.skills_want}
              all={ALL_SKILLS}
              color="bg-[#4A6B9B]"
              onRemove={(t) => remove("skills_want", t)}
              onAdd={(t) => add("skills_want", t)}
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-brew-offwhite border-t border-[#D4CFC6] px-6 py-4 shrink-0">
        {step === "upload" && (
          <button
            onClick={handleAnalyze}
            disabled={loading || (!resumeText && !goalsDescription)}
            className="btn-primary"
          >
            {loading ? "Analyzing…" : "Build my profile →"}
          </button>
        )}
        {step === "review" && (
          <div className="space-y-2">
            <button onClick={handleSave} disabled={loading} className="btn-primary">
              {loading ? "Saving…" : "Looks good, find my matches →"}
            </button>
            <button
              onClick={() => { setStep("upload"); setError(""); }}
              className="w-full text-center text-xs text-brew-khaki hover:text-brew-midbrown transition py-1"
            >
              ← Go back and re-analyze
            </button>
          </div>
        )}
>>>>>>> c740b2f (ai resume extraction)
      </div>
    </main>
  );
}
