"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

interface Profile {
  name: string;
  major: string;
  year: number;
  university: string;
  interests: string;
  resumeText: string;
}

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior",
  4: "Senior", 5: "Master's", 6: "PhD",
};

export default function OnboardingPage() {
  const router = useRouter();
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
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="bg-brew-walnut px-6 pt-10 pb-5 shrink-0">
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
          className="w-full rounded-full bg-brew-walnut py-4 text-white font-semibold text-base hover:bg-brew-body active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Setting up your profile…" : "Find my matches ☕"}
        </button>
      </div>
    </main>
  );
}
