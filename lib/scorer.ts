import type { User, Match, ScoreResult } from '@/lib/types';

function intersection(a: string[], b: string[]): string[] {
  const setB = new Set(b.map((s) => s.toLowerCase()));
  return a.filter((s) => setB.has(s.toLowerCase()));
}

function alreadyMatched(userA: User, userB: User, history: Match[]): boolean {
  return history.some(
    (m) =>
      (m.user_a_id === userA.id && m.user_b_id === userB.id) ||
      (m.user_a_id === userB.id && m.user_b_id === userA.id)
  );
}

/**
 * Score a potential match between userA and userB.
 *
 * Returns null when a hard exclusion applies:
 *   - same user
 *   - 2+ shared organizations (friend-group filter)
 *   - already matched in either direction
 *   - userA is already partnered with userB
 */
export function scoreMatch(
  userA: User,
  userB: User,
  matchHistory: Match[]
): ScoreResult | null {
  // ── Hard exclusions ────────────────────────────────────────────────────────
  if (userA.id === userB.id) return null;
  if (userA.partner_id === userB.id) return null;
  if (alreadyMatched(userA, userB, matchHistory)) return null;

  const sharedOrgs = intersection(userA.organizations, userB.organizations);
  if (sharedOrgs.length >= 2) return null;

  // ── Scoring ────────────────────────────────────────────────────────────────
  const sharedGoals = intersection(userA.goals, userB.goals);
  const aOffersB = intersection(userA.skills_offer, userB.skills_want);
  const bOffersA = intersection(userB.skills_offer, userA.skills_want);
  const isMutual = aOffersB.length > 0 && bOffersA.length > 0;

  let score = 0;

  // Shared goals: +10 each (max ~20 for 2 shared goals)
  score += sharedGoals.length * 10;

  // Skills userA offers userB: +12 each (max ~36 for 3 skills)
  score += aOffersB.length * 12;

  // Skills userB offers userA: +12 each (max ~36 for 3 skills)
  score += bOffersA.length * 12;

  // Mutual exchange bonus: +20 flat (both directions non-empty)
  if (isMutual) score += 20;

  // Year proximity
  const yearDiff = Math.abs(userA.year - userB.year);
  if (yearDiff === 0) score += 5;
  else if (yearDiff === 1) score += 3;

  // Exactly 1 shared org (weak-tie bonus): +3
  if (sharedOrgs.length === 1) score += 3;

  // Normalize to 0-100 scale (cap at 100)
  score = Math.min(100, Math.round(score));

  return {
    score,
    breakdown: {
      sharedGoals,
      aOffersB,
      bOffersA,
      isMutual,
      sharedOrgs,
    },
  };
}
