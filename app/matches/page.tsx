"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatchStrengthBadge } from "@/components/MatchStrengthBadge";
import { getMatchStrength } from "@/lib/matching";

interface NetworkingEvent {
  title: string;
  description: string;
  url: string;
}

interface StoredMatch {
  id: string;
  score: number;
  breakdown: {
    sharedGoals: string[];
    aOffersB: string[];
    bOffersA: string[];
    isMutual: boolean;
  };
  match_reason: string;
  agenda: string[];
  status: "pending" | "accepted" | "declined" | "completed";
  created_at: string;
  // joined from users table
  other_user: {
    name: string;
    university: string;
    year: number;
    goals: string[];
  };
}

const YEAR_LABELS: Record<number, string> = {
  1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "Master's", 6: "PhD",
};

const STATUS_STYLE: Record<string, string> = {
  accepted:  "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100 text-amber-700",
  declined:  "bg-gray-100 text-gray-500",
  completed: "bg-blue-100 text-blue-700",
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, NetworkingEvent[]>>({});
  const [eventsLoading, setEventsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/match/history")
      .then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleExpand(matchId: string, university: string) {
    const next = expanded === matchId ? null : matchId;
    setExpanded(next);

    // Lazy-load events the first time this card is opened
    if (next && !events[matchId] && !eventsLoading[matchId]) {
      setEventsLoading((v) => ({ ...v, [matchId]: true }));
      try {
        const res = await fetch(`/api/linkup/events?university=${encodeURIComponent(university)}`);
        const data = await res.json();
        setEvents((v) => ({ ...v, [matchId]: data.events ?? [] }));
      } catch {
        setEvents((v) => ({ ...v, [matchId]: [] }));
      } finally {
        setEventsLoading((v) => ({ ...v, [matchId]: false }));
      }
    }
  }

  function calendarUrl(match: StoredMatch) {
    const title = encodeURIComponent(`Coffee chat with ${match.other_user.name} (via Brew)`);
    const details = encodeURIComponent(match.agenda?.join("\n") ?? "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-brew-brown/50 animate-pulse">Loading matches…</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brew-brown">My Matches</h1>
          <p className="text-sm text-brew-brown/50">{matches.length} total</p>
        </div>
        <Link href="/discover" className="rounded-xl bg-brew-brown px-4 py-2 text-sm font-semibold text-brew-cream hover:bg-brew-brown/90">
          + Find More
        </Link>
      </div>

      {matches.length === 0 && (
        <div className="rounded-2xl border border-brew-brown/10 bg-white p-8 text-center">
          <p className="mb-2 text-4xl">☕</p>
          <p className="text-brew-brown/60">No matches yet. Head to Discover to find your first.</p>
        </div>
      )}

      <div className="space-y-3">
        {matches.map((match) => {
          const strength = getMatchStrength(match.score, match.breakdown);
          const isOpen = expanded === match.id;

          return (
            <div key={match.id} className="rounded-2xl bg-white card-shadow overflow-hidden">
              {/* Card header row */}
              <button
                onClick={() => handleExpand(match.id, match.other_user.university)}
                className="flex w-full items-start justify-between px-5 py-4 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-brew-brown">{match.other_user.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[match.status]}`}>
                      {match.status}
                    </span>
                  </div>
                  <p className="text-xs text-brew-brown/50">
                    {YEAR_LABELS[match.other_user.year]} year · {match.other_user.university}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                  <MatchStrengthBadge strength={strength} />
                  <span className="text-xs text-brew-brown/30">{isOpen ? "↑" : "↓"}</span>
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-brew-brown/8 px-5 pb-5 pt-4 space-y-4">
                  {/* AI blurb */}
                  <p className="text-sm leading-relaxed text-brew-brown/80">{match.match_reason}</p>

                  {/* Skill breakdown */}
                  {match.breakdown.aOffersB?.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">They can teach you</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.aOffersB.map((s) => (
                          <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {match.breakdown.bOffersA?.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">You can teach them</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.bOffersA.map((s) => (
                          <span key={s} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agenda */}
                  {match.agenda?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">Chat agenda</p>
                      <div className="rounded-xl bg-brew-steam px-4 py-3 space-y-2">
                        {match.agenda.map((q, i) => (
                          <p key={i} className="text-sm text-brew-brown/80">
                            <span className="mr-2 font-semibold text-brew-latte">{i + 1}.</span>{q}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calendar button */}
                  <a
                    href={calendarUrl(match)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl border border-brew-brown/20 py-2.5 text-center text-sm font-medium text-brew-brown hover:bg-brew-steam transition"
                  >
                    📅 Schedule on Google Calendar
                  </a>

                  {/* Networking events */}
                  {eventsLoading[match.id] && (
                    <p className="text-xs text-brew-brown/40 animate-pulse">Finding events near {match.other_user.university}…</p>
                  )}
                  {events[match.id]?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brew-brown/40">Events to attend together</p>
                      <div className="space-y-2">
                        {events[match.id].map((evt, i) => (
                          <a
                            key={i}
                            href={evt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-xl border border-brew-brown/10 bg-white px-4 py-3 hover:bg-brew-steam transition"
                          >
                            <span className="mt-0.5 shrink-0 text-base">🎟️</span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-brew-brown leading-snug">{evt.title}</p>
                              <p className="mt-0.5 text-xs text-brew-brown/50 line-clamp-2">{evt.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
