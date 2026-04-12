"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MatchStrengthBadge } from "@/components/MatchStrengthBadge";

interface MatchUser {
  id: string;
  name: string;
  university: string;
  year: number;
  goals: string[];
  skills_offer: string[];
  skills_want: string[];
}

interface MatchResult {
  user: MatchUser;
  score: number;
  breakdown: {
    sharedGoals: string[];
    aOffersB: string[];
    bOffersA: string[];
    isMutual: boolean;
  };
  match_reason: string;
  agenda: string[];
  strength: {
    label: string;
    color: string;
    reason: string;
  };
  matchId?: string;
}

const YEAR_LABELS: Record<number, string> = {
  1: "1st year", 2: "2nd year", 3: "3rd year",
  4: "4th year", 5: "Master's", 6: "PhD",
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
    async function load() {
      try {
        const res = await fetch("/api/match");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load matches");
        setMatches(data.matches ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch a cafe suggestion whenever the current card changes
  const fetchCafe = useCallback(async (university: string) => {
    setSuggestedCafe(null);
    try {
      const res = await fetch(`/api/linkup/cafes?university=${encodeURIComponent(university)}`);
      const data = await res.json();
      const first = data.cafes?.[0];
      if (first) setSuggestedCafe({ name: first.name, url: first.url });
    } catch {
      // silently degrade — cafe suggestion is non-critical
    }
  }, []);

  useEffect(() => {
    if (matches[index]?.user.university) {
      fetchCafe(matches[index].user.university);
    }
  }, [index, matches, fetchCafe]);

  const current = matches[index];

  async function swipe(direction: "left" | "right") {
    if (!current) return;
    setSwiping(direction);
    setShowAgenda(false);

    // Update match status server-side
    if (current.matchId) {
      await fetch(`/api/match/${current.matchId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: direction === "right" ? "accepted" : "declined" }),
      }).catch(() => {});
    }

    await new Promise((r) => setTimeout(r, 350));
    setSwiping(null);
    setIndex((i) => i + 1);
  }

  function calendarUrl(match: MatchResult) {
    const title = encodeURIComponent(`Coffee chat — Brew match with ${match.user.name}`);
    const details = encodeURIComponent(match.agenda.join("\n"));
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-pulse">☕</div>
          <p className="text-brew-brown/60">Finding your best matches…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="mb-4 text-brew-brown/60">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-2xl bg-brew-brown px-6 py-3 font-semibold text-brew-cream">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── No more cards ──────────────────────────────────────────────────────────
  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h2 className="mb-2 text-2xl font-bold text-brew-brown">You&apos;ve seen everyone</h2>
        <p className="mb-6 text-brew-brown/60">Come back tomorrow for fresh matches.</p>
        <a href="/matches" className="rounded-2xl bg-brew-brown px-8 py-4 font-semibold text-brew-cream shadow-md">
          View my matches →
        </a>
      </div>
    );
  }

  const cardClass = `transition-all duration-300 ease-in-out ${
    swiping === "left"  ? "-translate-x-full -rotate-12 opacity-0" :
    swiping === "right" ? "translate-x-full rotate-12 opacity-0"   : ""
  }`;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex w-full max-w-sm items-center justify-between">
        <span className="text-xl font-bold text-brew-brown">☕ brew</span>
        <a href="/matches" className="text-sm text-brew-brown/50 underline">My matches</a>
      </div>

      {/* Stack indicator */}
      <div className="mb-3 flex gap-1.5">
        {matches.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-all ${i === index ? "bg-brew-latte" : i < index ? "bg-brew-brown/30" : "bg-brew-brown/10"}`}
          />
        ))}
      </div>

      {/* Card */}
      <div ref={cardRef} className={`w-full max-w-sm ${cardClass}`}>
        <div className="rounded-3xl bg-white card-shadow overflow-hidden">
          {/* Card header */}
          <div className="bg-brew-steam px-6 py-5">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-brew-brown">{current.user.name}</h3>
                <p className="text-sm text-brew-brown/60">
                  {YEAR_LABELS[current.user.year]} · {current.user.university}
                </p>
              </div>
              <MatchStrengthBadge strength={current.strength} />
            </div>
            <p className="mt-1 text-xs text-brew-brown/50 italic">{current.strength.reason}</p>
          </div>

          {/* AI blurb */}
          <div className="px-6 py-4 border-b border-brew-brown/8">
            <p className="text-sm leading-relaxed text-brew-brown/80">{current.match_reason}</p>
          </div>

          {/* Skill swap summary */}
          <div className="px-6 py-4 space-y-3">
            {current.breakdown.aOffersB.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">They can teach you</p>
                <div className="flex flex-wrap gap-1.5">
                  {current.breakdown.aOffersB.map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {current.breakdown.bOffersA.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">You can teach them</p>
                <div className="flex flex-wrap gap-1.5">
                  {current.breakdown.bOffersA.map((s) => (
                    <span key={s} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {current.breakdown.sharedGoals.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">Shared goals</p>
                <div className="flex flex-wrap gap-1.5">
                  {current.breakdown.sharedGoals.map((g) => (
                    <span key={g} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">{g}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Agenda toggle */}
          <div className="px-6 pb-5">
            <button
              onClick={() => setShowAgenda((v) => !v)}
              className="mb-3 w-full rounded-xl border border-brew-brown/15 py-2.5 text-sm font-medium text-brew-brown/70 hover:bg-brew-steam transition"
            >
              {showAgenda ? "Hide agenda ↑" : "See chat agenda ↓"}
            </button>

            {showAgenda && (
              <div className="mb-3 rounded-xl bg-brew-steam px-4 py-3 space-y-2">
                {current.agenda.map((q, i) => (
                  <p key={i} className="text-sm text-brew-brown/80">
                    <span className="mr-2 font-semibold text-brew-latte">{i + 1}.</span>{q}
                  </p>
                ))}
                <a
                  href={calendarUrl(current)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-medium text-brew-brown border border-brew-brown/20 hover:bg-brew-cream transition"
                >
                  📅 Add to Google Calendar
                </a>
              </div>
            )}

            {/* Cafe suggestion */}
            {suggestedCafe && (
              <a
                href={suggestedCafe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 flex items-center gap-2 rounded-xl border border-brew-brown/15 bg-brew-steam px-4 py-2.5 text-sm text-brew-brown/80 hover:bg-brew-cream transition"
              >
                <span>☕</span>
                <span className="flex-1 font-medium truncate">Meet at {suggestedCafe.name}?</span>
                <span className="text-brew-brown/30 text-xs shrink-0">↗</span>
              </a>
            )}

            {/* Swipe buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => swipe("left")}
                className="flex-1 rounded-2xl border-2 border-brew-brown/20 py-4 text-xl hover:bg-red-50 hover:border-red-200 transition active:scale-95"
                aria-label="Pass"
              >
                ✕
              </button>
              <button
                onClick={() => swipe("right")}
                className="flex-[2] rounded-2xl bg-brew-brown py-4 font-semibold text-brew-cream shadow-md hover:bg-brew-brown/90 transition active:scale-95"
              >
                Connect ☕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining count */}
      <p className="mt-4 text-xs text-brew-brown/30">
        {matches.length - index - 1} more {matches.length - index - 1 === 1 ? "match" : "matches"}
      </p>
    </main>
  );
}
