'use client';

import { useEffect, useState } from 'react';
import type { MatchCandidate, MatchStrength } from '@/lib/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const STRENGTH_STYLES: Record<MatchStrength, string> = {
  'Exceptional Match': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Strong Match': 'bg-blue-100 text-blue-800 ring-blue-200',
  'Good Match': 'bg-violet-100 text-violet-800 ring-violet-200',
};

const AVATAR_COLORS = [
  'bg-amber-200 text-amber-800',
  'bg-rose-200 text-rose-800',
  'bg-sky-200 text-sky-800',
];

function ordinal(n: number): string {
  return ['', '1st', '2nd', '3rd', '4th', '5th', '6th'][n] ?? `${n}th`;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-amber-50 shadow-sm border border-amber-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-amber-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-amber-200 rounded w-32" />
          <div className="h-3 bg-amber-200 rounded w-24" />
        </div>
        <div className="h-6 bg-amber-200 rounded-full w-32" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-amber-200 rounded w-full" />
        <div className="h-3 bg-amber-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// ── Match card ────────────────────────────────────────────────────────────────

function MatchCard({
  match,
  index,
  requestingUserId,
  onChatRequested,
}: {
  match: MatchCandidate;
  index: number;
  requestingUserId: string;
  onChatRequested: (matchId: string) => void;
}) {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const { user, score, breakdown, match_reason, strength } = match;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const strengthStyle = STRENGTH_STYLES[strength];

  async function handleRequestChat() {
    setRequesting(true);
    try {
      const res = await fetch('/api/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAId: requestingUserId,
          userBId: user.id,
          score,
          breakdown,
          matchReason: match_reason,
        }),
      });
      if (res.ok) setRequested(true);
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div className="rounded-2xl bg-amber-50 shadow-sm border border-amber-100 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${avatarColor}`}
        >
          {initials(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-800 text-lg leading-tight">{user.name}</p>
          <p className="text-stone-500 text-sm">{ordinal(user.year)} year</p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ring-1 whitespace-nowrap ${strengthStyle}`}
        >
          {strength}
        </span>
      </div>

      {/* AI match reason */}
      {match_reason && (
        <p className="text-stone-700 text-sm leading-relaxed">{match_reason}</p>
      )}

      {/* Why you match */}
      <div className="bg-white rounded-xl p-4 flex flex-col gap-3 border border-amber-100">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Why you match
        </p>

        {breakdown.sharedGoals.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {breakdown.sharedGoals.map((goal) => (
              <span
                key={goal}
                className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        )}

        {breakdown.aOffersB.length > 0 && (
          <p className="text-sm text-stone-600">
            <span className="font-medium text-stone-800">You can teach them:</span>{' '}
            {breakdown.aOffersB.join(', ')}
          </p>
        )}

        {breakdown.bOffersA.length > 0 && (
          <p className="text-sm text-stone-600">
            <span className="font-medium text-stone-800">They can teach you:</span>{' '}
            {breakdown.bOffersA.join(', ')}
          </p>
        )}

        {breakdown.isMutual && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
            <span>⇄</span> Mutual exchange
          </span>
        )}
      </div>

      {/* Match reason bullets */}
      {match_reason && match_reason.length > 0 && (
        <div className="border border-amber-100 rounded-xl p-4">
          <h4 className="text-sm font-medium text-stone-700 mb-3">Why this match?</h4>
          <ul className="space-y-2">
            {match_reason.map((bullet: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600">
                <span className="font-semibold text-amber-500 shrink-0">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Request chat button */}
      <button
        onClick={handleRequestChat}
        disabled={requesting || requested}
        className={`mt-1 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
          requested
            ? 'bg-emerald-100 text-emerald-700 cursor-default'
            : 'bg-stone-800 text-white hover:bg-stone-700 active:bg-stone-900 disabled:opacity-60'
        }`}
      >
        {requested ? 'Chat requested ✓' : requesting ? 'Requesting…' : 'Request Chat'}
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function MatchReveal({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/matches/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load matches');
        return res.json();
      })
      .then((data) => setMatches(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <p className="text-stone-500 text-sm text-center mb-6">Finding your best matches…</p>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-rose-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 text-stone-500 text-sm text-center">
          No matches found yet. Check back after more students join!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Your Matches</h2>
      <p className="text-stone-500 text-sm mb-6">
        {matches.length} student{matches.length !== 1 ? 's' : ''} picked just for you
      </p>
      <div className="space-y-4">
        {matches.map((match, i) => (
          <MatchCard
            key={match.user.id}
            match={match}
            index={i}
            requestingUserId={userId}
            onChatRequested={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
