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
    <main className="flex min-h-screen flex-col items-center justify-center bg-brew-walnut px-6 py-12 text-center">
      {/* Overlapping avatar circles */}
      <div className="relative flex items-center justify-center mb-8 h-24 w-36">
        {/* Me */}
        <div className="absolute left-0 w-20 h-20 rounded-full bg-[#C4A882] border-4 border-brew-walnut flex items-center justify-center z-10">
          <span className="text-xl font-bold text-brew-walnut">ME</span>
        </div>
        {/* Match */}
        <div className="absolute right-0 w-20 h-20 rounded-full bg-white/20 border-4 border-brew-walnut flex items-center justify-center z-10">
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
          className="w-full rounded-full bg-white py-4 text-base font-semibold text-brew-walnut hover:bg-brew-offwhite active:scale-[0.98] transition"
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
