"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MatchStrengthBadge } from "@/components/MatchStrengthBadge";
import { getMatchStrength } from "@/lib/matching";
import { CalendarDays, ChevronDown, ChevronUp, Ticket, RotateCcw } from "lucide-react";

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

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  accepted:  { label: "connected",  bg: "rgba(34,122,60,0.08)",  color: "#1E7040" },
  pending:   { label: "pending",    bg: "rgba(180,120,20,0.10)", color: "#8B6010" },
  declined:  { label: "passed",     bg: "rgba(155,115,80,0.10)", color: "#9B7350" },
  completed: { label: "completed",  bg: "rgba(50,80,160,0.08)",  color: "#3A5A9B" },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, NetworkingEvent[]>>({});
  const [eventsLoading, setEventsLoading] = useState<Record<string, boolean>>({});
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/match/history").then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleReset() {
    if (!confirm("Reset all your matches? This cannot be undone.")) return;
    setResetting(true);
    try {
      await fetch("/api/match/reset", { method: "POST" });
      setMatches([]);
    } catch {
      // ignore
    } finally {
      setResetting(false);
    }
  }

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
      <div className="space-y-3 w-full max-w-sm px-4 animate-fade-in">
        {[1,2,3].map((i) => (
          <div key={i} className="h-20 skeleton rounded-2xl" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="relative brew-header px-6 pt-10 pb-5 shrink-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-rova text-white" style={{ letterSpacing: "-0.01em" }}>matches</h1>
            <p className="text-xs font-playfair text-white/50 mt-0.5">
              helping each other on campus
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={resetting || matches.length === 0}
              className="p-2 rounded-full transition-all active:scale-90"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.7)",
              }}
              aria-label="Reset matches"
            >
              <RotateCcw size={15} />
            </button>
            <Link
              href="/discover"
              className="rounded-full px-4 py-2 text-xs font-bold text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              + Discover
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 pointer-events-none">
          <Image src="/coffee-landing.png" alt="" width={110} height={110} style={{ mixBlendMode: "screen" }} />
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto scroll-smooth-ios px-4 pt-4 pb-24 space-y-3">
        {matches.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center animate-fade-in-up"
            style={{ background: "#fff", boxShadow: "0 1px 3px rgba(61,31,13,0.05), 0 4px 14px rgba(61,31,13,0.08)" }}
          >
            <p className="text-4xl mb-3">☕</p>
            <p className="text-sm font-semibold text-brew-walnut mb-1">No matches yet</p>
            <p className="text-xs text-brew-khaki font-lora italic mb-5">Discover someone great to connect with.</p>
            <Link href="/discover" className="btn-pill inline-block" style={{ width: "auto", padding: "0.75rem 2rem" }}>
              Start discovering →
            </Link>
          </div>
        )}

        {matches.map((match, i) => {
          const strength = getMatchStrength(match.score, match.breakdown);
          const isOpen = expanded === match.id;
          const sc = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.pending;

          return (
            <div
              key={match.id}
              className="rounded-2xl overflow-hidden animate-fade-in-up"
              style={{
                background: "#fff",
                boxShadow: isOpen
                  ? "0 2px 6px rgba(61,31,13,0.07), 0 12px 32px rgba(61,31,13,0.12)"
                  : "0 1px 3px rgba(61,31,13,0.05), 0 4px 14px rgba(61,31,13,0.08)",
                animationDelay: `${i * 0.06}s`,
                transition: "box-shadow 0.3s ease",
              }}
            >
              {/* Header row */}
              <button
                onClick={() => handleExpand(match.id, match.other_user.university)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left active:bg-[#FAFAF8] transition-colors"
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #4A2C17, #3D1F0D)" }}
                >
                  {initials(match.other_user.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-brew-walnut text-sm" style={{ letterSpacing: "-0.01em" }}>
                      {match.other_user.name}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-xs text-brew-khaki">
                    {YEAR_LABELS[match.other_user.year]} · {match.other_user.university}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <MatchStrengthBadge strength={strength} />
                  <div style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)", transform: isOpen ? "rotate(0deg)" : "rotate(0deg)" }}>
                    {isOpen
                      ? <ChevronUp size={14} className="text-brew-khaki" />
                      : <ChevronDown size={14} className="text-brew-khaki" />
                    }
                  </div>
                </div>
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div
                  className="px-5 pb-5 pt-1 space-y-4 animate-slide-up"
                  style={{ borderTop: "1px solid rgba(240,237,232,0.8)" }}
                >
                  <p className="text-sm leading-relaxed text-brew-body font-lora italic">
                    {match.match_reason}
                  </p>

                  {match.breakdown.aOffersB?.length > 0 && (
                    <div>
                      <p className="section-label">THEY CAN TEACH YOU</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.aOffersB.map((s) => (
                          <span key={s} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{ background: "#EFF7F1", border: "1px solid #C2DEC8", color: "#2E6B3A" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {match.breakdown.bOffersA?.length > 0 && (
                    <div>
                      <p className="section-label">YOU CAN TEACH THEM</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.breakdown.bOffersA.map((s) => (
                          <span key={s} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{ background: "#EEF2FA", border: "1px solid #C5D3EE", color: "#3A5A9B" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.agenda?.length > 0 && (
                    <div>
                      <p className="section-label">CHAT AGENDA</p>
                      <div
                        className="rounded-xl px-4 py-3 space-y-2"
                        style={{ background: "var(--brew-offwhite)", border: "1px solid rgba(212,207,198,0.5)" }}
                      >
                        {match.agenda.map((q, j) => (
                          <p key={j} className="text-sm text-brew-body">
                            <span className="font-bold text-brew-accent mr-2">{j + 1}.</span>{q}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href={calendarUrl(match)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-brew-walnut transition-all card-shadow-hover"
                    style={{ background: "var(--brew-offwhite)", border: "1px solid rgba(212,207,198,0.5)" }}
                  >
                    <CalendarDays size={15} /> Schedule on Google Calendar
                  </a>

                  {eventsLoading[match.id] && (
                    <div className="h-10 skeleton rounded-xl" />
                  )}
                  {events[match.id]?.length > 0 && (
                    <div>
                      <p className="section-label">EVENTS NEAR CAMPUS</p>
                      <div className="space-y-2">
                        {events[match.id].map((evt, j) => (
                          <a
                            key={j}
                            href={evt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-xl px-4 py-3 transition-all card-shadow-hover"
                            style={{ background: "var(--brew-offwhite)", border: "1px solid rgba(212,207,198,0.5)" }}
                          >
                            <Ticket size={14} className="mt-0.5 shrink-0 text-brew-accent" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-brew-walnut leading-snug">{evt.title}</p>
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
