"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatchStrengthBadge } from "@/components/MatchStrengthBadge";
import { getMatchStrength } from "@/lib/matching";
import { CalendarDays, ChevronDown, ChevronUp, Ticket } from "lucide-react";

interface NetworkingEvent { title: string; description: string; url: string; }
interface StoredMatch {
  id: string; score: number;
  breakdown: { sharedGoals: string[]; aOffersB: string[]; bOffersA: string[]; isMutual: boolean };
  match_reason: string; agenda: string[];
  status: "pending" | "accepted" | "declined" | "completed";
  created_at: string;
  other_user: { name: string; university: string; year: number; goals: string[] };
}

const YEAR_LABELS: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "Master's", 6: "PhD" };

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  accepted:  { label: "connected",  cls: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  pending:   { label: "pending",    cls: "bg-amber-50 text-amber-700 border border-amber-100" },
  declined:  { label: "passed",     cls: "bg-[#F5F2ED] text-[#9B7350] border border-[#D4CFC6]" },
  completed: { label: "completed",  cls: "bg-blue-50 text-blue-700 border border-blue-100" },
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, NetworkingEvent[]>>({});
  const [eventsLoading, setEventsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/match/history").then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleExpand(matchId: string, university: string) {
    const next = expanded === matchId ? null : matchId;
    setExpanded(next);
    if (next && !events[matchId] && !eventsLoading[matchId]) {
      setEventsLoading((v) => ({ ...v, [matchId]: true }));
      try {
        const res = await fetch(`/api/linkup/events?university=${encodeURIComponent(university)}`);
        const d = await res.json();
        setEvents((v) => ({ ...v, [matchId]: d.events ?? [] }));
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

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-brew-offwhite">
      <p className="text-sm text-brew-midbrown animate-pulse">Loading matches…</p>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Green header ── */}
      <div className="bg-brew-walnut px-6 pt-14 pb-6 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">brew</h1>
            <p className="text-xs text-white/50">find your next coffee chat</p>
          </div>
          <Link href="/discover"
            className="rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25 transition">
            + Discover
          </Link>
        </div>
        <p className="mt-3 text-sm font-semibold text-white/80">
          My Matches <span className="font-normal text-white/40 ml-1">({matches.length})</span>
        </p>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3">
        {matches.length === 0 && (
          <div className="rounded-xl bg-white card-shadow p-10 text-center">
            <p className="text-3xl mb-2">☕</p>
            <p className="text-sm text-brew-midbrown">No matches yet.</p>
            <Link href="/discover" className="mt-4 inline-block text-sm font-semibold text-brew-walnut underline-offset-2 hover:underline">
              Head to Discover →
            </Link>
          </div>
        )}

        {matches.map((match) => {
          const strength = getMatchStrength(match.score, match.breakdown);
          const isOpen = expanded === match.id;
          const sc = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.pending;

          return (
            <div key={match.id} className="rounded-xl bg-white card-shadow overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => handleExpand(match.id, match.other_user.university)}
                className="flex w-full items-start justify-between px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-brew-walnut">{match.other_user.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.cls}`}>{sc.label}</span>
                  </div>
                  <p className="text-xs text-brew-midbrown">
                    {YEAR_LABELS[match.other_user.year]} year · {match.other_user.university}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                  <MatchStrengthBadge strength={strength} />
                  {isOpen ? <ChevronUp size={14} className="text-brew-khaki" /> : <ChevronDown size={14} className="text-brew-khaki" />}
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-[#F0EDE8] px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm leading-relaxed text-brew-body">{match.match_reason}</p>

                  {match.breakdown.aOffersB?.length > 0 && (
                    <div>
                      <p className="section-label">THEY CAN TEACH YOU</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.aOffersB.map((s) => (
                          <span key={s} className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {match.breakdown.bOffersA?.length > 0 && (
                    <div>
                      <p className="section-label">YOU CAN TEACH THEM</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.bOffersA.map((s) => (
                          <span key={s} className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.agenda?.length > 0 && (
                    <div>
                      <p className="section-label">CHAT AGENDA</p>
                      <div className="rounded-lg bg-brew-offwhite border border-[#D4CFC6] px-4 py-3 space-y-2">
                        {match.agenda.map((q, i) => (
                          <p key={i} className="text-sm text-brew-body">
                            <span className="font-bold text-brew-accent mr-2">{i + 1}.</span>{q}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <a href={calendarUrl(match)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#D4CFC6] bg-brew-offwhite py-3 text-sm font-medium text-brew-walnut hover:bg-white transition">
                    <CalendarDays size={14} /> Schedule on Google Calendar
                  </a>

                  {eventsLoading[match.id] && (
                    <p className="text-xs text-brew-khaki animate-pulse">Finding events near {match.other_user.university}…</p>
                  )}
                  {events[match.id]?.length > 0 && (
                    <div>
                      <p className="section-label">EVENTS TO ATTEND TOGETHER</p>
                      <div className="space-y-2">
                        {events[match.id].map((evt, i) => (
                          <a key={i} href={evt.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-lg border border-[#D4CFC6] bg-brew-offwhite px-4 py-3 hover:bg-white transition">
                            <Ticket size={14} className="mt-0.5 shrink-0 text-brew-accent" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-brew-walnut leading-snug">{evt.title}</p>
                              <p className="mt-0.5 text-xs text-brew-khaki line-clamp-2">{evt.description}</p>
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
