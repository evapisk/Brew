import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/supabase/client';
import type { User, Match } from '@/supabase/types';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.userAId || !body?.userBId || body.score == null) {
    return NextResponse.json(
      { error: 'userAId, userBId, and score are required' },
      { status: 400 }
    );
  }

  const { userAId, userBId, score, breakdown, matchReason } = body;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('matches')
    .insert({
      user_a_id: userAId,
      user_b_id: userBId,
      score,
      breakdown: breakdown ?? null,
      match_reason: matchReason ?? null,
      status: 'pending',
    } as any)
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: (data as any)?.id });
}
