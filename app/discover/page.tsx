"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MatchStrengthBadge } from "@/components/MatchStrengthBadge";
import { CalendarDays, Coffee, ChevronDown, ChevronUp } from "lucide-react";

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

export default function DiscoverPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [showAgenda, setShowAgenda] = useState(false);
  const [suggestedCafe, setSuggestedCafe] = useState<{ name: string; url: string } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/match").then((r) => r.json())
      .then((d) => { if (!d.error) setMatches(d.matches ?? []); else setError(d.error); })
      .catch(() => setError("Failed to load matches"))
      .finally(() => setLoading(false));
  }, []);

  const fetchCafe = useCallback(async (university: string) => {
    setSuggestedCafe(null);
    try {
      const res = await fetch(`/api/linkup/cafes?university=${encodeURIComponent(university)}`);
      const d = await res.json();
      if (d.cafes?.[0]) setSuggestedCafe({ name: d.cafes[0].name, url: d.cafes[0].url });
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    if (matches[index]?.user.university) fetchCafe(matches[index].user.university);
  }, [index, matches, fetchCafe]);

  const current = matches[index];

  async function swipe(direction: "left" | "right") {
    if (!current) return;
    setSwiping(direction);
    setShowAgenda(false);
    if (current.matchId) {
      await fetch(`/api/match/${current.matchId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: direction === "right" ? "accepted" : "declined" }),
      }).catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 320));
    setSwiping(null);
    setIndex((i) => i + 1);
  }

  function calendarUrl(match: MatchResult) {
    const title = encodeURIComponent(`Coffee chat — Brew match with ${match.user.name}`);
    const details = encodeURIComponent(match.agenda.join("\n"));
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
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
      <div className="bg-brew-walnut px-6 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-white">brew</h1>
        <p className="text-sm text-white/60">find your next coffee chat</p>
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

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Green header ── */}
      <div className="bg-brew-walnut px-6 pt-14 pb-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">brew</h1>
            <p className="text-xs text-white/50">find your next coffee chat</p>
          </div>
          <span className="text-white/50 text-xs">
            {matches.length - index} left
          </span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1 mt-4">
          {matches.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "flex-[2] bg-white" : i < index ? "flex-1 bg-white/30" : "flex-1 bg-white/15"
            }`} />
          ))}
        </div>
      </div>

      {/* ── Card ── */}
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto">
        <div ref={cardRef} className={cardAnim}>
          <div className="rounded-xl bg-white card-shadow overflow-hidden">

            {/* Card header */}
            <div className="px-5 pt-5 pb-4 border-b border-[#F0EDE8]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-brew-walnut">{current.user.name}</h2>
                  <p className="text-sm text-brew-midbrown mt-0.5">
                    {YEAR_LABELS[current.user.year]} · {current.user.university}
                  </p>
                </div>
                <MatchStrengthBadge strength={current.strength} />
              </div>
              <p className="mt-2 text-xs text-brew-khaki italic">{current.strength.reason}</p>
            </div>

            {/* AI blurb */}
            <div className="px-5 py-4 border-b border-[#F0EDE8]">
              <p className="section-label">WHY YOU&apos;LL CLICK</p>
              <p className="text-sm text-brew-body leading-relaxed">{current.match_reason}</p>
            </div>

            {/* Skills */}
            <div className="px-5 py-4 space-y-3 border-b border-[#F0EDE8]">
              {current.breakdown.aOffersB.length > 0 && (
                <div>
                  <p className="section-label">THEY CAN TEACH YOU</p>
                  <div className="flex flex-wrap gap-1.5">
                    {current.breakdown.aOffersB.map((s) => (
                      <span key={s} className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {current.breakdown.bOffersA.length > 0 && (
                <div>
                  <p className="section-label">YOU CAN TEACH THEM</p>
                  <div className="flex flex-wrap gap-1.5">
                    {current.breakdown.bOffersA.map((s) => (
                      <span key={s} className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {current.breakdown.sharedGoals.length > 0 && (
                <div>
                  <p className="section-label">SHARED GOALS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {current.breakdown.sharedGoals.map((g) => (
                      <span key={g} className="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Agenda + cafe */}
            <div className="px-5 py-4 space-y-2">
              <button
                onClick={() => setShowAgenda((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#D4CFC6] bg-brew-offwhite px-4 py-3 text-sm font-medium text-brew-midbrown hover:bg-white transition"
              >
                <span>Chat agenda</span>
                {showAgenda ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showAgenda && (
                <div className="rounded-lg bg-brew-offwhite border border-[#D4CFC6] px-4 py-3 space-y-2">
                  {current.agenda.map((q, i) => (
                    <p key={i} className="text-sm text-brew-body">
                      <span className="font-bold text-brew-accent mr-2">{i + 1}.</span>{q}
                    </p>
                  ))}
                  <a href={calendarUrl(current)} target="_blank" rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white border border-[#D4CFC6] py-2.5 text-sm font-medium text-brew-walnut hover:bg-brew-offwhite transition">
                    <CalendarDays size={14} /> Add to Google Calendar
                  </a>
                </div>
              )}

              {suggestedCafe && (
                <a href={suggestedCafe.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-[#D4CFC6] bg-brew-offwhite px-4 py-3 text-sm text-brew-midbrown hover:bg-white transition">
                  <Coffee size={14} className="text-brew-accent shrink-0" />
                  <span className="flex-1 truncate font-medium">Meet at {suggestedCafe.name}?</span>
                  <span className="text-brew-khaki text-xs shrink-0">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed action buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 bg-white border-t border-[#D4CFC6] px-4 py-4 md:absolute">
        <button onClick={() => swipe("left")}
          className="flex-1 rounded-lg border-2 border-[#D4CFC6] py-3.5 text-brew-khaki font-semibold text-sm hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition active:scale-95">
          Pass
        </button>
        <button onClick={() => swipe("right")}
          className="flex-[2] rounded-lg bg-brew-walnut py-3.5 font-semibold text-white text-sm hover:bg-brew-body transition active:scale-95">
          Connect ☕
        </button>
      </div>
    </main>
  );
}
