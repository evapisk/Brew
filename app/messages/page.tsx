"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Match {
  id: string;
  other_user: { name: string; university: string };
  last_message?: string;
  last_message_at?: string;
  status: string;
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

  useEffect(() => {
    fetch("/api/match/history").then((r) => r.json())
      .then((d) => setMatches((d.matches ?? []).filter((m: Match) => m.status === "accepted")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const newMatches = matches.filter((m) => !m.last_message);
  const conversations = matches.filter((m) => !!m.last_message);
  const filtered = conversations.filter((m) =>
    m.other_user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite">
      {/* ── Header ── */}
      <div className="brew-header px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white animate-fade-in" style={{ letterSpacing: "-0.01em" }}>
          messages
        </h1>
        <p className="text-xs font-lora text-white/50 mt-0.5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          your coffee chats
        </p>
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
            return (
              <button
                key={m.id}
                onClick={() => router.push(`/messages/${m.id}`)}
                className="flex items-center gap-4 w-full px-4 py-3.5 text-left active:bg-white transition-colors animate-fade-in-up"
                style={{
                  borderBottom: "1px solid rgba(240,237,232,0.8)",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: av.bg, color: av.text, boxShadow: "0 2px 8px rgba(61,31,13,0.14)" }}
                >
                  {initials(m.other_user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-brew-walnut text-sm" style={{ letterSpacing: "-0.01em" }}>
                      {m.other_user.name}
                    </p>
                    <p className="text-[11px] text-brew-khaki shrink-0 ml-2">{timeAgo(m.last_message_at)}</p>
                  </div>
                  <p className="text-xs text-brew-khaki truncate">{m.last_message}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
