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

// Pastel avatar background colors per initial
const AVATAR_COLORS = [
  "bg-[#C4A882]", "bg-[#B8CFA8]", "bg-[#A8C4CF]",
  "bg-[#CFA8B8]", "bg-[#CFB8A8]", "bg-[#A8AFCF]",
];
function avatarColor(name: string) {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
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
      <div className="bg-brew-walnut px-6 pt-10 pb-5 shrink-0">
        <h1 className="text-3xl font-rova text-white">messages</h1>
        <p className="mt-0.5 text-xs font-lora text-white/50">your coffee chats</p>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-4 shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brew-khaki pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="brew-input"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* ── New Matches ── */}
        {newMatches.length > 0 && (
          <div className="pt-5 shrink-0">
            <p className="section-label px-4 mb-3">NEW MATCHES</p>
            <div className="flex gap-4 overflow-x-auto px-4 pb-2">
              {newMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/messages/${m.id}`)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16"
                >
                  <div className={`w-14 h-14 rounded-full ${avatarColor(m.other_user.name)} flex items-center justify-center ring-2 ring-brew-walnut`}>
                    <span className="text-base font-bold text-brew-walnut">{initials(m.other_user.name)}</span>
                  </div>
                  <p className="text-[10px] text-brew-midbrown font-medium text-center leading-tight truncate w-full">
                    {m.other_user.name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversations ── */}
        <div className="pt-5">
          {conversations.length > 0 && (
            <p className="section-label px-4 mb-2">MESSAGES</p>
          )}

          {loading && (
            <p className="text-sm text-brew-khaki text-center py-10 animate-pulse">Loading…</p>
          )}

          {!loading && matches.length === 0 && (
            <div className="text-center py-16 px-6">
              <p className="text-3xl mb-2">☕</p>
              <p className="text-sm text-brew-midbrown">No matches yet.</p>
              <button onClick={() => router.push("/discover")} className="mt-3 text-sm font-semibold text-brew-walnut underline-offset-2 hover:underline">
                Discover people →
              </button>
            </div>
          )}

          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => router.push(`/messages/${m.id}`)}
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-white transition border-b border-[#F0EDE8] last:border-0"
            >
              <div className={`w-12 h-12 rounded-full ${avatarColor(m.other_user.name)} flex items-center justify-center shrink-0`}>
                <span className="text-sm font-bold text-brew-walnut">{initials(m.other_user.name)}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brew-walnut text-sm">{m.other_user.name}</p>
                  <p className="text-xs text-brew-khaki shrink-0 ml-2">{timeAgo(m.last_message_at)}</p>
                </div>
                <p className="text-xs text-brew-midbrown mt-0.5 truncate">{m.last_message}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
