"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function CelebrateContent() {
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get("name") ?? "your match";
  const matchId = params.get("matchId") ?? "";

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, #5C2E0E 0%, #3D1F0D 45%, #1E0A04 100%)",
      }}
    >
      {/* Overlapping avatar circles */}
      <div className="relative flex items-center justify-center mb-8 h-24 w-36">
        {/* Me */}
        <div className="absolute left-0 w-20 h-20 rounded-full border-4 flex items-center justify-center z-10"
          style={{ background: "linear-gradient(135deg,#C4A882,#9B7350)", borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}>
          <span className="text-xl font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>ME</span>
        </div>
        {/* Match */}
        <div className="absolute right-0 w-20 h-20 rounded-full border-4 flex items-center justify-center z-10"
          style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.20),rgba(255,255,255,0.08))", borderColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}>
          <span className="text-xl font-bold text-white">{initials(name)}</span>
        </div>
        {/* Coffee cup overlap hint */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 text-2xl">☕</div>
      </div>

      {/* Text */}
      <p className="font-lora italic text-white/70 text-base mb-1">it&apos;s a match!</p>
      <h1 className="text-3xl font-bold text-white leading-tight">
        You matched with<br />{name}!
      </h1>
      <p className="mt-3 text-sm font-lora text-white/60 leading-relaxed max-w-xs">
        Time to grab a coffee. Send a message to set it up.
      </p>

      {/* Actions */}
      <div className="mt-10 w-full max-w-xs space-y-3">
        <button
          onClick={() => router.push(matchId ? `/messages/${matchId}` : "/messages")}
          className="w-full rounded-full py-4 text-base font-semibold active:scale-[0.98] transition-all"
          style={{ background: "linear-gradient(135deg,#fff 0%,#F5F0E8 100%)", color: "var(--brew-walnut)", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
        >
          Send a message ✉️
        </button>
        <button
          onClick={() => router.push("/matches")}
          className="w-full py-3 text-sm text-white/60 hover:text-white transition"
        >
          Back to matches
        </button>
      </div>
    </main>
  );
}

export default function CelebratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brew-walnut" />}>
      <CelebrateContent />
    </Suspense>
  );
}
