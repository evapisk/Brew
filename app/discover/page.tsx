"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, Info, ChevronUp } from "lucide-react";

interface MatchUser {
  id: string; name: string; university: string; year: number;
  goals: string[]; skills_offer: string[]; skills_want: string[];
}
interface MatchResult {
  user: MatchUser; score: number;
  breakdown: { sharedGoals: string[]; aOffersB: string[]; bOffersA: string[]; isMutual: boolean };
  match_reason: string; agenda: string[];
  strength: { label: string; color: string; reason: string };
  matchId?: string;
}

const YEAR_LABELS: Record<number, string> = {
  1: "Freshman", 2: "Sophomore", 3: "Junior", 4: "Senior", 5: "Master's", 6: "PhD",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DiscoverPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/match").then((r) => r.json())
      .then((d) => { if (!d.error) setMatches(d.matches ?? []); else setError(d.error); })
      .catch(() => setError("Failed to load matches"))
      .finally(() => setLoading(false));
  }, []);

  const current = matches[index];

  async function swipe(direction: "left" | "right") {
    if (!current) return;
    setSwiping(direction);
    setShowInfo(false);
    if (current.matchId) {
      await fetch(`/api/match/${current.matchId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: direction === "right" ? "accepted" : "declined" }),
      }).catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 320));
    setSwiping(null);
    if (direction === "right" && current.matchId) {
      router.push(`/matches/celebrate?name=${encodeURIComponent(current.user.name)}&matchId=${current.matchId}`);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-brew-offwhite">
      <div className="text-center">
        <div className="text-3xl mb-2 animate-pulse">☕</div>
        <p className="text-sm text-brew-midbrown">Finding your best matches…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-brew-offwhite px-6">
      <div className="text-center">
        <p className="mb-4 text-brew-midbrown text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ width: "auto", padding: "0.75rem 2rem" }}>Retry</button>
      </div>
    </div>
  );

  if (!current) return (
    <div className="flex min-h-screen flex-col bg-brew-offwhite">
      <div className="bg-brew-walnut px-6 pt-10 pb-5">
        <h1 className="text-3xl font-rova text-white">brew</h1>
        <p className="text-sm font-lora text-white/60 mt-0.5">find your next coffee chat</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="text-xl font-bold text-brew-walnut mb-1">You&apos;ve seen everyone</h2>
        <p className="text-sm text-brew-midbrown mb-6">Come back tomorrow for fresh matches.</p>
        <a href="/matches" className="btn-primary" style={{ display: "block", maxWidth: 280, margin: "0 auto" }}>View my matches →</a>
      </div>
    </div>
  );

  const cardAnim = swiping === "left" ? "animate-swipe_left" : swiping === "right" ? "animate-swipe_right" : "";
  const matchPct = Math.round(current.score * 100);

  // Collect tags to show (interests = shared goals + their skills)
  const interestTags = [
    ...current.breakdown.sharedGoals,
    ...current.breakdown.aOffersB,
  ].slice(0, 6);

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="bg-brew-walnut px-6 pt-10 pb-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-rova text-white">brew</h1>
            <p className="text-xs font-lora text-white/50 mt-0.5">find your next coffee chat</p>
          </div>
          <span className="text-white/40 text-xs">{matches.length - index} left</span>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto">
        <div ref={cardRef} className={cardAnim}>
          <div className="rounded-2xl bg-white card-shadow overflow-hidden">

            {/* Avatar band */}
            <div className="bg-[#EDE8E0] px-5 pt-8 pb-5 flex flex-col items-center relative">
              {/* Match % badge */}
              <div className="absolute top-4 right-4 rounded-full bg-brew-walnut px-3 py-1 text-xs font-bold text-white">
                {matchPct}% match
              </div>
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full bg-brew-walnut flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{initials(current.user.name)}</span>
              </div>
              <h2 className="mt-3 text-lg font-bold text-brew-walnut">{current.user.name}</h2>
              <p className="text-sm text-brew-midbrown font-lora mt-0.5">
                {YEAR_LABELS[current.user.year]} · {current.user.university}
              </p>
            </div>

            {/* ABOUT */}
            <div className="px-5 pt-5 pb-4 border-b border-[#F0EDE8]">
              <p className="section-label">ABOUT</p>
              <p className="text-sm text-brew-body leading-relaxed mt-1">
                {current.match_reason}
              </p>
              {interestTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {interestTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#D4CFC6] px-3 py-1 text-xs text-brew-midbrown">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* WHY YOU'D VIBE */}
            <div className="px-5 py-4">
              <p className="section-label">WHY YOU&apos;D VIBE</p>
              <div className="mt-2 rounded-lg bg-[#F5F1EB] border-l-4 border-brew-accent px-4 py-3">
                <p className="text-sm font-lora italic text-brew-body leading-relaxed">
                  {current.strength.reason}
                </p>
              </div>
            </div>

            {/* Expandable detail */}
            {showInfo && (
              <div className="border-t border-[#F0EDE8] px-5 py-4 space-y-3">
                {current.breakdown.aOffersB.length > 0 && (
                  <div>
                    <p className="section-label">THEY CAN TEACH YOU</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {current.breakdown.aOffersB.map((s) => (
                        <span key={s} className="rounded-full bg-[#EFF6F1] border border-[#C9E4D0] px-2.5 py-0.5 text-xs font-medium text-[#3A7A4A]">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {current.breakdown.bOffersA.length > 0 && (
                  <div>
                    <p className="section-label">YOU CAN TEACH THEM</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {current.breakdown.bOffersA.map((s) => (
                        <span key={s} className="rounded-full bg-[#EEF2FA] border border-[#C5D3EE] px-2.5 py-0.5 text-xs font-medium text-[#3A5A9B]">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {current.agenda.length > 0 && (
                  <div>
                    <p className="section-label">CHAT AGENDA</p>
                    <div className="rounded-lg bg-brew-offwhite border border-[#D4CFC6] px-4 py-3 space-y-2 mt-1">
                      {current.agenda.map((q, i) => (
                        <p key={i} className="text-sm text-brew-body">
                          <span className="font-bold text-brew-accent mr-2">{i + 1}.</span>{q}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="fixed bottom-16 left-0 right-0 flex items-center justify-center gap-6 px-8 py-4 md:absolute md:bottom-0">
        {/* Pass */}
        <button
          onClick={() => swipe("left")}
          className="w-16 h-16 rounded-full bg-white card-shadow flex items-center justify-center hover:bg-red-50 active:scale-95 transition border border-[#E8E4DC]"
        >
          <X size={28} className="text-brew-khaki" />
        </button>

        {/* Info toggle */}
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="w-12 h-12 rounded-full bg-white card-shadow flex items-center justify-center hover:bg-brew-offwhite active:scale-95 transition border border-[#E8E4DC]"
        >
          {showInfo ? <ChevronUp size={20} className="text-brew-khaki" /> : <Info size={20} className="text-brew-khaki" />}
        </button>

        {/* Connect */}
        <button
          onClick={() => swipe("right")}
          className="w-16 h-16 rounded-full bg-brew-walnut card-shadow flex items-center justify-center hover:bg-brew-body active:scale-95 transition"
        >
          <Heart size={28} className="text-white" />
        </button>
      </div>
    </main>
  );
}
