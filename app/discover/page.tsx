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

// Deterministic warm color per name
const AVATAR_GRADIENTS = [
  ["#5C2E0E", "#9B6A3C"],
  ["#3D1F0D", "#7A4A2A"],
  ["#6B3A1F", "#C4A882"],
  ["#2E1608", "#9B7350"],
  ["#4A2C17", "#C4A882"],
];
function avatarGradient(name: string) {
  const i = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[i];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cardVisible, setCardVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/match").then((r) => r.json())
      .then((d) => { if (!d.error) setMatches(d.matches ?? []); else setError(d.error); })
      .catch(() => setError("Failed to load matches"))
      .finally(() => setLoading(false));
  }, []);

  const current = matches[index];

  async function swipe(direction: "left" | "right") {
    if (!current || swiping) return;
    setSwiping(direction);
    setShowInfo(false);
    if (current.matchId) {
      fetch(`/api/match/${current.matchId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: direction === "right" ? "accepted" : "declined" }),
      }).catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 340));
    setSwiping(null);
    setCardVisible(false);
    if (direction === "right" && current.matchId) {
      router.push(`/matches/celebrate?name=${encodeURIComponent(current.user.name)}&matchId=${current.matchId}`);
    } else {
      setIndex((i) => i + 1);
      setTimeout(() => setCardVisible(true), 30);
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-brew-offwhite">
      <div className="text-center animate-fade-in">
        <div className="text-4xl mb-3" style={{ animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>☕</div>
        <p className="text-sm text-brew-midbrown font-lora italic">Finding your best matches…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-brew-offwhite px-6">
      <div className="text-center animate-fade-in-up">
        <p className="mb-5 text-brew-midbrown text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-pill" style={{ width: "auto", padding: "0.75rem 2rem" }}>Retry</button>
      </div>
    </div>
  );

  if (!current) return (
    <div className="flex min-h-screen flex-col bg-brew-offwhite">
      <div className="relative overflow-hidden shrink-0" style={{ minHeight: 116 }}>
        <video src="/brew-hero.mp4" autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.72)", transform: "scale(1.5)", transformOrigin: "center 20%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(30,10,4,0.35) 0%, rgba(30,10,4,0.55) 100%)" }} />
        <div className="relative px-6 pt-10 pb-4">
          <h1 className="text-3xl font-rova text-white" style={{ letterSpacing: "-0.01em" }}>brew</h1>
          <p className="text-xs font-lora text-white/50 mt-0.5">find your next coffee chat</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center animate-fade-in-up">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-xl font-bold text-brew-walnut mb-2">You&apos;ve seen everyone</h2>
        <p className="text-sm font-lora text-brew-midbrown mb-8">Come back tomorrow for fresh matches.</p>
        <a href="/matches" className="btn-pill" style={{ display: "block", maxWidth: 260, margin: "0 auto" }}>View my matches →</a>
      </div>
    </div>
  );

  const cardAnim = swiping === "left" ? "animate-swipe_left" : swiping === "right" ? "animate-swipe_right" : "";
  const matchPct = Math.min(99, Math.round((current.score / 300) * 100));
  const [g1, g2] = avatarGradient(current.user.name);
  const interestTags = [...current.breakdown.sharedGoals, ...current.breakdown.aOffersB].slice(0, 6);

  return (
    <main className="flex min-h-screen flex-col bg-brew-offwhite relative">
      {/* ── Video header ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ minHeight: 116 }}>
        <video
          src="/brew-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.72)", transform: "scale(1.5)", transformOrigin: "center 20%" }}
        />
        {/* Gradient overlay so text reads cleanly */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(30,10,4,0.35) 0%, rgba(30,10,4,0.15) 50%, rgba(30,10,4,0.55) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative h-full flex flex-col justify-between px-6 pt-10 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-rova text-white" style={{ letterSpacing: "-0.01em", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
                brew
              </h1>
              <p className="text-xs font-lora text-white/70 mt-0.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                find your next coffee chat
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{
                background: "rgba(0,0,0,0.30)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {matches.length - index} left
            </span>
          </div>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scroll-smooth-ios">
        <div
          ref={cardRef}
          className={cardAnim}
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#fff",
              boxShadow: "0 2px 6px rgba(61,31,13,0.07), 0 12px 36px rgba(61,31,13,0.13)",
            }}
          >
            {/* Gradient accent bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#5C2E0E 0%,#9B6A3C 55%,#C4A882 100%)" }} />
            {/* ── Avatar band ── */}
            <div
              className="px-5 pt-9 pb-6 flex flex-col items-center relative"
              style={{
                background: "linear-gradient(160deg, #EDE8E0 0%, #E4DDD4 100%)",
              }}
            >
              {/* Match badge */}
              <div
                className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #4A2C17, #3D1F0D)",
                  boxShadow: "0 2px 10px rgba(61,31,13,0.30)",
                  letterSpacing: "0.01em",
                }}
              >
                {matchPct}% match
              </div>

              {/* Avatar */}
              <div
                className="w-22 h-22 rounded-full flex items-center justify-center"
                style={{
                  width: 88,
                  height: 88,
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                  boxShadow: "0 4px 20px rgba(61,31,13,0.28), 0 0 0 4px rgba(255,255,255,0.7)",
                }}
              >
                <span className="text-2xl font-bold text-white" style={{ letterSpacing: "0.04em" }}>
                  {initials(current.user.name)}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-brew-walnut" style={{ letterSpacing: "-0.01em" }}>
                {current.user.name}
              </h2>
              <p className="text-sm font-lora italic text-brew-midbrown mt-0.5">
                {YEAR_LABELS[current.user.year]} · {current.user.university}
              </p>
            </div>

            {/* ── ABOUT ── */}
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(240,237,232,1)" }}>
              <p className="section-label">ABOUT</p>
              <p className="text-sm text-brew-body leading-relaxed">
                {current.match_reason}
              </p>
              {interestTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {interestTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-medium text-brew-midbrown"
                      style={{
                        background: "rgba(196,168,130,0.12)",
                        border: "1px solid rgba(196,168,130,0.35)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── WHY YOU'D VIBE ── */}
            <div className="px-5 py-4">
              <p className="section-label">WHY YOU&apos;D VIBE</p>
              <div
                className="rounded-xl px-4 py-3.5 mt-1"
                style={{
                  background: "linear-gradient(135deg, #F7F3ED, #F2EDE5)",
                  borderLeft: "3px solid var(--brew-accent)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <p className="text-sm font-lora italic text-brew-body leading-relaxed">
                  {current.strength.reason}
                </p>
              </div>
            </div>

            {/* ── Expandable skills / agenda ── */}
            {showInfo && (
              <div
                className="px-5 pb-5 pt-1 space-y-4 animate-slide-up"
                style={{ borderTop: "1px solid rgba(240,237,232,1)" }}
              >
                {current.breakdown.aOffersB.length > 0 && (
                  <div>
                    <p className="section-label">THEY CAN TEACH YOU</p>
                    <div className="flex flex-wrap gap-1.5">
                      {current.breakdown.aOffersB.map((s) => (
                        <span key={s} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: "#EFF7F1", border: "1px solid #C2DEC8", color: "#2E6B3A" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {current.breakdown.bOffersA.length > 0 && (
                  <div>
                    <p className="section-label">YOU CAN TEACH THEM</p>
                    <div className="flex flex-wrap gap-1.5">
                      {current.breakdown.bOffersA.map((s) => (
                        <span key={s} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: "#EEF2FA", border: "1px solid #C5D3EE", color: "#3A5A9B" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {current.agenda.length > 0 && (
                  <div>
                    <p className="section-label">CHAT AGENDA</p>
                    <div className="rounded-xl px-4 py-3 space-y-2"
                      style={{ background: "var(--brew-offwhite)", border: "1px solid rgba(212,207,198,0.6)" }}>
                      {current.agenda.map((q, i) => (
                        <p key={i} className="text-sm text-brew-body leading-snug">
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
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-5 px-8 py-4 pointer-events-none">
        {/* Pass */}
        <button
          onClick={() => swipe("left")}
          disabled={!!swiping}
          className="pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-40"
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px rgba(61,31,13,0.08), 0 8px 24px rgba(61,31,13,0.10)",
            border: "1.5px solid rgba(212,207,198,0.7)",
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,60,60,0.18), 0 2px 8px rgba(61,31,13,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(61,31,13,0.08), 0 8px 24px rgba(61,31,13,0.10)")}
        >
          <X size={26} strokeWidth={2.2} style={{ color: "#C47070" }} />
        </button>

        {/* Info */}
        <button
          onClick={() => setShowInfo((v) => !v)}
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
          style={{
            background: showInfo ? "var(--brew-walnut)" : "#fff",
            boxShadow: showInfo
              ? "0 4px 16px rgba(61,31,13,0.28)"
              : "0 2px 8px rgba(61,31,13,0.08), 0 4px 16px rgba(61,31,13,0.08)",
            border: "1.5px solid rgba(212,207,198,0.7)",
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {showInfo
            ? <ChevronUp size={18} strokeWidth={2.2} color="#fff" />
            : <Info size={18} strokeWidth={1.8} style={{ color: "var(--brew-khaki)" }} />
          }
        </button>

        {/* Connect */}
        <button
          onClick={() => swipe("right")}
          disabled={!!swiping}
          className="pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #4A2C17, #3D1F0D)",
            boxShadow: "0 4px 16px rgba(61,31,13,0.35), 0 8px 28px rgba(61,31,13,0.22)",
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(61,31,13,0.45), 0 4px 16px rgba(61,31,13,0.30)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,31,13,0.35), 0 8px 28px rgba(61,31,13,0.22)")}
        >
          <Heart size={26} fill="#fff" color="#fff" />
        </button>
      </div>
    </main>
  );
}
