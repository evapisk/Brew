"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";

const ALL_GOALS = Object.values(GOAL_TAGS).flat() as string[];
const ALL_SKILLS = Object.values(SKILL_TAGS).flat() as string[];

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

function TagSection({
  label, sublabel, tags, all, color, onRemove, onAdd,
}: {
  label: string; sublabel: string; tags: string[];
  all: string[]; color: string;
  onRemove: (t: string) => void; onAdd: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const remaining = all.filter((t) => !tags.includes(t));

  return (
    <div
      className="rounded-2xl px-5 py-4 space-y-3"
      style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 6px 20px rgba(61,31,13,0.09)" }}
    >
      <div>
        <p className="section-label">{label}</p>
        <p className="text-xs text-brew-khaki mt-0.5">{sublabel}</p>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {tags.length === 0 && (
          <p className="text-xs text-brew-khaki italic">None selected — tap + to add</p>
        )}
        {tags.map((tag) => (
          <span key={tag} className={`flex items-center gap-1.5 rounded-full ${color} text-white px-3 py-1 text-xs font-medium`}>
            {tag}
            <button onClick={() => onRemove(tag)} className="opacity-70 hover:opacity-100 transition" aria-label={`Remove ${tag}`}>
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
            <button key={tag} onClick={() => { onAdd(tag); if (remaining.length === 1) setOpen(false); }}
              className="tag-pill tag-pill-inactive text-xs">
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resumeText, setResumeText] = useState("");
  const [goalsDescription, setGoalsDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const [profile, setProfile] = useState<Profile>({
    university: "", year: 1, goals: [], skills_offer: [], skills_want: [],
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  async function handleAnalyze() {
    setLoading(true); setError("");
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
      setStep("review");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed. Try pasting your resume text.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!profile.university) { setError("Please enter your university."); return; }
    setLoading(true); setError("");
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

  function remove(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => ({ ...p, [field]: p[field].filter((t) => t !== tag) }));
  }
  function add(field: keyof Pick<Profile, "goals" | "skills_offer" | "skills_want">, tag: string) {
    setProfile((p) => ({ ...p, [field]: [...p[field], tag] }));
  }

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* Header */}
      <div className="relative brew-header px-6 pt-10 pb-5 shrink-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-rova text-white animate-fade-in" style={{ letterSpacing: "-0.01em" }}>brew</h1>
            <p className="text-xs font-playfair text-white/50 mt-0.5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              helping each other on campus
            </p>
          </div>
          <span className="text-white/40 text-xs mr-24">{step === "upload" ? "1" : "2"} / 2</span>
        </div>
        <div className="absolute right-0 bottom-0 pointer-events-none">
          <Image src="/coffee-landing.png" alt="" width={110} height={110} style={{ mixBlendMode: "screen" }} />
        </div>
        <div className="mt-3 h-1 w-full rounded-full bg-white/20">
          <div className="h-1 rounded-full bg-white/70 transition-all duration-500" style={{ width: step === "upload" ? "50%" : "100%" }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-36 space-y-5">

        {/* ── STAGE 1: Upload ─────────────────────────────────────────── */}
        {step === "upload" && (
          <>
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-brew-walnut" style={{ letterSpacing: "-0.01em" }}>Hey there.</h2>
              <p className="mt-1 text-sm font-playfair text-brew-midbrown">
                Upload your resume and describe your goals — we&apos;ll build your profile automatically.
              </p>
            </div>

            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
              <p className="section-label">RESUME</p>
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed px-4 py-6 text-center transition"
                style={{ borderColor: fileName ? "var(--brew-walnut)" : "#D4CFC6", background: "#fff" }}
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
              <textarea rows={4} value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text here…" className="brew-input resize-none" />
            </div>

            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
              <p className="section-label">WHAT ARE YOU WORKING TOWARD?</p>
              <textarea rows={4} value={goalsDescription} onChange={(e) => setGoalsDescription(e.target.value)}
                placeholder="e.g. I want to break into VC, launch a startup, and improve my Python skills before graduation…"
                className="brew-input resize-none" />
              <p className="text-xs text-brew-khaki">Write freely — we&apos;ll extract the right tags for you.</p>
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          </>
        )}

        {/* ── STAGE 2: Review ─────────────────────────────────────────── */}
        {step === "review" && (
          <>
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-brew-walnut" style={{ letterSpacing: "-0.01em" }}>Here&apos;s your profile.</h2>
              <p className="mt-1 text-sm font-playfair text-brew-midbrown">
                We built this from your resume and goals. Tweak anything that doesn&apos;t fit.
              </p>
            </div>

            <div
              className="rounded-2xl px-5 py-4 space-y-3 animate-fade-in-up"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 6px 20px rgba(61,31,13,0.09)", animationDelay: "0.06s" }}
            >
              <p className="section-label">YOUR DETAILS</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-brew-khaki mb-1">School</p>
                  <input type="text" value={profile.university}
                    onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                    placeholder="e.g. NYU" className="brew-input" />
                </div>
                <div className="w-32">
                  <p className="text-xs text-brew-khaki mb-1">Year</p>
                  <select value={profile.year}
                    onChange={(e) => setProfile((p) => ({ ...p, year: Number(e.target.value) }))}
                    className="brew-input">
                    {[1,2,3,4,5,6].map((y) => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <TagSection label="SKILLS YOU OFFER" sublabel="Extracted from your resume — what you can teach others"
              tags={profile.skills_offer} all={ALL_SKILLS} color="bg-brew-walnut"
              onRemove={(t) => remove("skills_offer", t)} onAdd={(t) => add("skills_offer", t)} />

            <TagSection label="YOUR GOALS" sublabel="Generated from your goals description"
              tags={profile.goals} all={ALL_GOALS} color="bg-brew-accent"
              onRemove={(t) => remove("goals", t)} onAdd={(t) => add("goals", t)} />

            <TagSection label="SKILLS YOU WANT TO LEARN" sublabel="Inferred from your goals — what will help you get there"
              tags={profile.skills_want} all={ALL_SKILLS} color="bg-[#4A6B9B]"
              onRemove={(t) => remove("skills_want", t)} onAdd={(t) => add("skills_want", t)} />

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className="sticky bottom-0 px-6 py-5 shrink-0"
        style={{ background: "rgba(232,228,220,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(212,207,198,0.5)" }}
      >
        {step === "upload" && (
          <button onClick={handleAnalyze} disabled={loading || (!resumeText && !goalsDescription)}
            className="w-full rounded-full py-4 text-base font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #4A2C17, #3D1F0D)", boxShadow: "0 4px 16px rgba(61,31,13,0.28)" }}>
            {loading ? "Analyzing your profile…" : "Build my profile →"}
          </button>
        )}
        {step === "review" && (
          <div className="space-y-2">
            <button onClick={handleSave} disabled={loading}
              className="w-full rounded-full py-4 text-base font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4A2C17, #3D1F0D)", boxShadow: "0 4px 16px rgba(61,31,13,0.28)" }}>
              {loading ? "Saving…" : "Looks good, find my matches →"}
            </button>
            <button onClick={() => { setStep("upload"); setError(""); }}
              className="w-full text-center text-xs text-brew-khaki hover:text-brew-midbrown transition py-1">
              ← Go back and re-analyze
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
