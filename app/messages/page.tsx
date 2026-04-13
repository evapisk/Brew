"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, Coffee, Ticket } from "lucide-react";

interface Match {
  id: string;
  other_user: { name: string; university: string };
  last_message?: string;
  last_message_at?: string;
  status: string;
}

interface Cafe {
  name: string;
  address?: string;
  distance?: string;
}

interface Event {
  name: string;
  date?: string;
  location?: string;
}

interface LinkupData {
  cafes: Cafe[];
  events: Event[];
  loading: boolean;
  error?: string;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const AVATAR_COLORS = [
  { bg: "linear-gradient(135deg,#5C2E0E,#9B6A3C)", text: "#fff" },
  { bg: "linear-gradient(135deg,#3D1F0D,#7A4A2A)", text: "#fff" },
  { bg: "linear-gradient(135deg,#6B3A1F,#C4A882)", text: "#fff" },
  { bg: "linear-gradient(135deg,#2E1608,#9B7350)", text: "#fff" },
  { bg: "linear-gradient(135deg,#4A2C17,#C4A882)", text: "#fff" },
];
function avatarStyle(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_COLORS.length];
}

export default function MessagesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [linkup, setLinkup] = useState<Record<string, LinkupData>>({});

  useEffect(() => {
    fetch("/api/match/history").then((r) => r.json())
      .then((d) => setMatches((d.matches ?? []).filter((m: Match) => m.status === "accepted")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function toggleExpand(matchId: string, university: string) {
    if (expanded === matchId) {
      setExpanded(null);
      return;
    }
    setExpanded(matchId);
    if (linkup[matchId]) return; // already loaded

    setLinkup((prev) => ({ ...prev, [matchId]: { cafes: [], events: [], loading: true } }));
    try {
      const [cafesRes, eventsRes] = await Promise.all([
        fetch(`/api/linkup/cafes?university=${encodeURIComponent(university)}`),
        fetch(`/api/linkup/events?university=${encodeURIComponent(university)}`),
      ]);
      const cafesData = cafesRes.ok ? await cafesRes.json() : { cafes: [] };
      const eventsData = eventsRes.ok ? await eventsRes.json() : { events: [] };
      setLinkup((prev) => ({
        ...prev,
        [matchId]: {
          cafes: cafesData.cafes ?? [],
          events: eventsData.events ?? [],
          loading: false,
        },
      }));
    } catch {
      setLinkup((prev) => ({
        ...prev,
        [matchId]: { cafes: [], events: [], loading: false, error: "Failed to load" },
      }));
    }
  }

  const newMatches = matches.filter((m) => !m.last_message);
  const conversations = matches.filter((m) => !!m.last_message);
  const filtered = conversations.filter((m) =>
    m.other_user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="relative brew-header px-6 pt-10 pb-5 shrink-0 overflow-hidden">
        <h1 className="text-3xl font-rova text-white animate-fade-in" style={{ letterSpacing: "-0.01em" }}>
          messages
        </h1>
        <p className="text-xs font-playfair text-white/50 mt-0.5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          helping each other on campus
        </p>
        <div className="absolute right-0 bottom-0 pointer-events-none">
          <Image src="/coffee-landing.png" alt="" width={110} height={110} style={{ mixBlendMode: "screen" }} />
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-4 pb-1 shrink-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="relative">
          <Search
            size={15}
            className="absolute top-1/2 -translate-y-1/2 text-brew-khaki pointer-events-none"
            style={{ left: "0.9rem" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="brew-input"
            style={{ paddingLeft: "2.3rem" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth-ios pb-24">
        {/* ── New Matches horizontal scroll ── */}
        {newMatches.length > 0 && (
          <div className="pt-5 pb-1">
            <p className="section-label px-4 mb-3">NEW MATCHES</p>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-smooth-ios">
              {newMatches.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/messages/${m.id}`)}
                  className="flex flex-col items-center gap-2 shrink-0 w-[60px] animate-fade-in-up active:scale-95 transition-transform"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: avatarStyle(m.other_user.name).bg,
                      color: avatarStyle(m.other_user.name).text,
                      boxShadow: "0 3px 10px rgba(61,31,13,0.22), 0 0 0 2.5px rgba(255,255,255,0.9)",
                    }}
                  >
                    {initials(m.other_user.name)}
                  </div>
                  <p className="text-[10px] font-semibold text-brew-midbrown text-center leading-tight truncate w-full">
                    {m.other_user.name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversations ── */}
        <div className="pt-4">
          {conversations.length > 0 && (
            <p className="section-label px-4 mb-1">MESSAGES</p>
          )}

          {loading && (
            <div className="space-y-3 px-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="w-12 h-12 rounded-full skeleton shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 skeleton w-32 rounded" />
                    <div className="h-2.5 skeleton w-48 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && matches.length === 0 && (
            <div className="text-center py-16 px-6 animate-fade-in-up">
              <p className="text-4xl mb-3">☕</p>
              <p className="text-sm font-semibold text-brew-walnut mb-1">No connections yet</p>
              <p className="text-xs font-lora italic text-brew-khaki mb-5">Connect with someone on the Discover tab.</p>
              <button
                onClick={() => router.push("/discover")}
                className="btn-pill inline-block"
                style={{ width: "auto", padding: "0.75rem 2rem" }}
              >
                Discover people →
              </button>
            </div>
          )}

          {filtered.map((m, i) => {
            const av = avatarStyle(m.other_user.name);
            const isOpen = expanded === m.id;
            const data = linkup[m.id];
            return (
              <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div
                  className="flex items-center gap-4 w-full px-4 py-3.5 text-left"
                  style={{ borderBottom: isOpen ? "none" : "1px solid rgba(240,237,232,0.8)" }}
                >
                  {/* Avatar — taps to open chat */}
                  <button
                    onClick={() => router.push(`/messages/${m.id}`)}
                    className="shrink-0 active:scale-95 transition-transform"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: av.bg, color: av.text, boxShadow: "0 2px 8px rgba(61,31,13,0.14)" }}
                    >
                      {initials(m.other_user.name)}
                    </div>
                  </button>

                  {/* Name + last message — taps to open chat */}
                  <button
                    onClick={() => router.push(`/messages/${m.id}`)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-brew-walnut text-sm" style={{ letterSpacing: "-0.01em" }}>
                        {m.other_user.name}
                      </p>
                      <p className="text-[11px] text-brew-khaki shrink-0 ml-2">{timeAgo(m.last_message_at)}</p>
                    </div>
                    <p className="text-xs text-brew-khaki truncate">{m.last_message}</p>
                  </button>

                  {/* Expand button */}
                  <button
                    onClick={() => toggleExpand(m.id, m.other_user.university)}
                    className="shrink-0 ml-1 p-1.5 rounded-full active:scale-90 transition-transform"
                    style={{ color: "var(--brew-khaki)" }}
                    aria-label="Toggle meet-up suggestions"
                  >
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* ── Linkup dropdown ── */}
                {isOpen && (
                  <div
                    className="mx-4 mb-3 rounded-xl overflow-hidden animate-fade-in-up"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(212,207,198,0.7)",
                      boxShadow: "0 2px 12px rgba(61,31,13,0.08)",
                    }}
                  >
                    {data?.loading && (
                      <div className="px-4 py-4 space-y-2">
                        <div className="h-3 skeleton rounded w-40" />
                        <div className="h-3 skeleton rounded w-52" />
                        <div className="h-3 skeleton rounded w-36" />
                      </div>
                    )}

                    {data && !data.loading && (
                      <>
                        {/* Coffee shops */}
                        {data.cafes.length > 0 && (
                          <div className="px-4 pt-3 pb-2">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Coffee size={13} style={{ color: "var(--brew-accent)" }} />
                              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--brew-accent)" }}>
                                Coffee spots nearby
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              {data.cafes.slice(0, 3).map((c, ci) => (
                                <div key={ci} className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-brew-walnut leading-tight">{c.name}</p>
                                  {c.distance && (
                                    <p className="text-[11px] text-brew-khaki shrink-0">{c.distance}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.cafes.length > 0 && data.events.length > 0 && (
                          <div style={{ height: "1px", background: "rgba(212,207,198,0.5)", margin: "0 1rem" }} />
                        )}

                        {/* Events */}
                        {data.events.length > 0 && (
                          <div className="px-4 pt-2 pb-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Ticket size={13} style={{ color: "var(--brew-accent)" }} />
                              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--brew-accent)" }}>
                                Events on campus
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              {data.events.slice(0, 3).map((e, ei) => (
                                <div key={ei} className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-brew-walnut leading-tight">{e.name}</p>
                                  {e.date && (
                                    <p className="text-[11px] text-brew-khaki shrink-0">{e.date}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {data.cafes.length === 0 && data.events.length === 0 && (
                          <div className="px-4 py-4 text-center">
                            <p className="text-xs text-brew-khaki font-lora italic">No suggestions available right now</p>
                          </div>
                        )}

                        {data.error && (
                          <div className="px-4 py-3 text-center">
                            <p className="text-xs text-brew-khaki">{data.error}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
