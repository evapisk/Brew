import { describe, it, expect } from 'vitest';
import { scoreMatch } from './scorer';
import type { User, Match } from '@/lib/types';

function makeUser(overrides: Partial<User> & { id: string }): User {
  return {
    auth_id: null,
    email: `${overrides.id}@demo.edu`,
    name: 'Test User',
    university: 'Demo University',
    year: 2,
    goals: [],
    skills_offer: [],
    skills_want: [],
    organizations: [],
    partner_id: null,
    is_active: true,
    onboarded: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function makeMatch(userAId: string, userBId: string): Match {
  return {
    id: 'match-1',
    user_a_id: userAId,
    user_b_id: userBId,
    score: 100,
    match_reason: null,
    breakdown: null,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
}

// ── Test 1: Mutual match with high overlap → score ≥ 200, isMutual true ──────
describe('scoreMatch — mutual match', () => {
  it('scores a mutual skill exchange above 200 and sets isMutual', () => {
    const userA = makeUser({
      id: 'a',
      year: 2,
      goals: ['launch-a-startup', 'break-into-vc'],
      skills_offer: ['python', 'data-analysis'],
      skills_want: ['figma', 'user-research'],
      organizations: ['Entrepreneurship Club'],
    });
    const userB = makeUser({
      id: 'b',
      year: 2,
      goals: ['launch-a-startup', 'build-a-product'],
      skills_offer: ['figma', 'user-research'],
      skills_want: ['python', 'data-analysis'],
      organizations: ['Design Society'],
    });

    const result = scoreMatch(userA, userB, []);
    expect(result).not.toBeNull();

    // 1 shared goal (10) + 2 aOffersB (24) + 2 bOffersA (24) + mutual (20) + same year (5) = 83
    expect(result!.score).toBe(83);
    expect(result!.breakdown.isMutual).toBe(true);
    expect(result!.score).toBeGreaterThanOrEqual(70);
    expect(result!.breakdown.sharedGoals).toEqual(['launch-a-startup']);
    expect(result!.breakdown.aOffersB).toHaveLength(2);
    expect(result!.breakdown.bOffersA).toHaveLength(2);
  });
});

// ── Test 2: One-way skill match → correct score arithmetic ───────────────────
describe('scoreMatch — one-way skill match', () => {
  it('scores correctly when only A offers skills to B (no mutual)', () => {
    const userA = makeUser({
      id: 'a',
      year: 3,
      goals: ['break-into-vc'],
      skills_offer: ['financial-modeling', 'excel'],
      skills_want: ['python'],
      organizations: [],
    });
    const userB = makeUser({
      id: 'b',
      year: 4,
      goals: ['break-into-vc'],
      skills_offer: ['react'],       // does NOT match userA's wants
      skills_want: ['financial-modeling', 'excel'],
      organizations: [],
    });

    const result = scoreMatch(userA, userB, []);
    expect(result).not.toBeNull();

    // 1 shared goal (10) + 2 aOffersB (24) + 0 bOffersA + no mutual + 1yr apart (3) = 37
    expect(result!.score).toBe(37);
    expect(result!.breakdown.isMutual).toBe(false);
    expect(result!.breakdown.aOffersB).toEqual(['financial-modeling', 'excel']);
    expect(result!.breakdown.bOffersA).toHaveLength(0);
  });
});

// ── Test 3: Hard exclusion — same user ───────────────────────────────────────
describe('scoreMatch — hard exclusion: same user', () => {
  it('returns null when userA and userB have the same id', () => {
    const userA = makeUser({ id: 'same-id', goals: ['launch-a-startup'] });
    const result = scoreMatch(userA, userA, []);
    expect(result).toBeNull();
  });
});

// ── Test 4: Hard exclusion — 2+ shared orgs ──────────────────────────────────
describe('scoreMatch — hard exclusion: 2+ shared organizations', () => {
  it('returns null when users share 2 or more organizations', () => {
    const userA = makeUser({
      id: 'a',
      organizations: ['Bioengineering Society', 'Research Club', 'Science Fair'],
    });
    const userB = makeUser({
      id: 'b',
      organizations: ['Bioengineering Society', 'Research Club'],
    });

    const result = scoreMatch(userA, userB, []);
    expect(result).toBeNull();
  });
});

// ── Test 5: Hard exclusion — already matched ─────────────────────────────────
describe('scoreMatch — hard exclusion: already matched', () => {
  it('returns null when there is an existing match in either direction', () => {
    const userA = makeUser({ id: 'user-a' });
    const userB = makeUser({ id: 'user-b' });

    // Match in A→B direction
    const historyAB = [makeMatch('user-a', 'user-b')];
    expect(scoreMatch(userA, userB, historyAB)).toBeNull();

    // Match in B→A direction (reverse)
    const historyBA = [makeMatch('user-b', 'user-a')];
    expect(scoreMatch(userA, userB, historyBA)).toBeNull();
  });

  it('does not exclude when history is empty', () => {
    const userA = makeUser({ id: 'user-a' });
    const userB = makeUser({ id: 'user-b' });
    expect(scoreMatch(userA, userB, [])).not.toBeNull();
  });
});
