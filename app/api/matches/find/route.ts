import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/supabase/client';
import { scoreMatch } from '@/lib/scorer';
import type { User, Match, MatchCandidate, MatchStrength, ScoreResult } from '@/supabase/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function matchStrength(score: number, isMutual: boolean): MatchStrength {
  if (score >= 200 && isMutual) return 'Exceptional Match';
  if (score >= 130) return 'Strong Match';
  return 'Good Match';
}

function buildUserMessage(
  userA: User,
  userB: User,
  result: ScoreResult
): string {
  const { sharedGoals, aOffersB, bOffersA } = result.breakdown;
  const ordinal = (n: number) =>
    ['', '1st', '2nd', '3rd', '4th', '5th', '6th'][n] ?? `${n}th`;

  return `Generate 2-3 short, straight-to-the-point bullets about why Student B would want to connect with Student A.

Student A: ${userA.name}, ${ordinal(userA.year)} year
Goals: ${userA.goals.join(', ')}
Offers: ${userA.skills_offer.join(', ')}
Wants: ${userA.skills_want.join(', ')}

Student B: ${userB.name}, ${ordinal(userB.year)} year
Goals: ${userB.goals.join(', ')}
Offers: ${userB.skills_offer.join(', ')}
Wants: ${userB.skills_want.join(', ')}

Shared goals: ${sharedGoals.join(', ') || 'none'}
${userA.name} can teach ${userB.name}: ${aOffersB.join(', ') || 'nothing specific'}

Each bullet should be concise and specific. Focus on what Student A brings to the table.

Respond ONLY with this JSON structure:
{
  "match_reason": ["bullet 1", "bullet 2", "bullet 3"]
}`;
}

async function generateMatchContent(
  userA: User,
  userB: User,
  result: ScoreResult
): Promise<{ match_reason: string[] | null }> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system:
        'You are a peer matching assistant for college students. You write warm, specific, useful content. Never use corporate jargon or generic phrases like "synergy" or "leverage". Always respond in valid JSON only, with no markdown, no preamble, no explanation.',
      messages: [{ role: 'user', content: buildUserMessage(userA, userB, result) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(raw);

    return {
      match_reason: Array.isArray(parsed.match_reason) ? parsed.match_reason : null,
    };
  } catch {
    return { match_reason: null };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const supabase = createServerClient();

  // 1. Fetch requesting user
  const { data: user, error: userErr } = await (supabase
    .from('users')
    .select('*')
    .eq('id', body.userId)
    .single() as any);

  if (userErr || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // 2. Fetch all active users at the same university (excluding the requester)
  const { data: candidates } = await (supabase
    .from('users')
    .select('*')
    .eq('university', user.university)
    .eq('is_active', true)
    .neq('id', user.id) as any);

  // 3. Fetch all previous matches involving the requester
  const { data: matchHistoryA } = await (supabase
    .from('matches')
    .select('*')
    .eq('user_a_id', user.id) as any);

  const { data: matchHistoryB } = await (supabase
    .from('matches')
    .select('*')
    .eq('user_b_id', user.id) as any);

  const matchHistory: Match[] = [...(matchHistoryA ?? []), ...(matchHistoryB ?? [])];

  // 4. Score every candidate, filter nulls
  const scored = ((candidates as any) ?? [])
    .map((candidate: User) => {
      const result = scoreMatch(user as User, candidate, matchHistory);
      if (!result) return null;
      return { candidate, result };
    })
    .filter((x: any): x is { candidate: User; result: ScoreResult } => x !== null);

  // 5. Sort descending, take top 3
  scored.sort((a: any, b: any) => {
    if (!a?.result || !b?.result) return 0;
    return b.result.score - a.result.score;
  });
  const top3 = scored.slice(0, 3);

  // 6. Fire all Claude calls in parallel
  const enriched = await Promise.all(
    top3.map(async ({ candidate, result }: { candidate: User; result: ScoreResult }) => {
      const { match_reason } = await generateMatchContent(user, candidate, result);

      const candidate_match: MatchCandidate = {
        user: candidate,
        score: result.score,
        breakdown: result.breakdown,
        match_reason,
        strength: matchStrength(result.score, result.breakdown.isMutual),
      };
      return candidate_match;
    })
  );

  return NextResponse.json(enriched);
}
