import Anthropic from "@anthropic-ai/sdk";
import { getAdminClient } from "./supabase.js";
import { GOAL_TAGS, SKILL_TAGS } from "./tags.js";

export { GOAL_TAGS, SKILL_TAGS };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSharedCategories(sharedGoals, taxonomy) {
  const categories = [];
  for (const [category, tags] of Object.entries(taxonomy)) {
    if (sharedGoals.some((g) => tags.includes(g))) categories.push(category);
  }
  return [...new Set(categories)];
}

// ─── Scoring engine ───────────────────────────────────────────────────────────

export function scoreMatch(userA, userB, matchHistory) {
  // Hard filter: already matched
  const previouslyMatched = (matchHistory ?? []).some(
    (m) =>
      (m.user_a_id === userA.id && m.user_b_id === userB.id) ||
      (m.user_a_id === userB.id && m.user_b_id === userA.id)
  );
  if (previouslyMatched) return null;

  // Normalize arrays to avoid null crashes
  const aOrgs = userA.organizations ?? [];
  const bOrgs = userB.organizations ?? [];
  const aGoals = userA.goals ?? [];
  const bGoals = userB.goals ?? [];
  const aOffer = userA.skills_offer ?? [];
  const bOffer = userB.skills_offer ?? [];
  const aWant = userA.skills_want ?? [];
  const bWant = userB.skills_want ?? [];

  // Hard filter: same friend group (2+ shared orgs)
  const sharedOrgs = aOrgs.filter((o) => bOrgs.includes(o));
  if (sharedOrgs.length >= 2) return null;

  // Hard filter: already accountability partners
  if (userA.partner_id === userB.id) return null;

  // Goal score
  const sharedGoals = aGoals.filter((g) => bGoals.includes(g));
  const sharedGoalCategories = getSharedCategories(sharedGoals, GOAL_TAGS);
  const goalScore = sharedGoals.length * 30 + sharedGoalCategories.length * 15;

  // Skill complementarity score
  const aOffersB = aOffer.filter((s) => bWant.includes(s));
  const bOffersA = bOffer.filter((s) => aWant.includes(s));
  const skillScore = (aOffersB.length + bOffersA.length) * 35;
  const mutualBonus = aOffersB.length > 0 && bOffersA.length > 0 ? 80 : 0;

  // Soft modifiers
  const yearDiff = Math.abs(userA.year - userB.year);
  const yearBonus = yearDiff === 0 ? 15 : yearDiff === 1 ? 8 : 0;
  const sameSchool = userA.university === userB.university ? 10 : 0;
  const weakTieBonus = sharedOrgs.length === 1 ? 10 : 0;

  const totalScore =
    goalScore + skillScore + mutualBonus + yearBonus + sameSchool + weakTieBonus;

  return {
    score: totalScore,
    breakdown: {
      sharedGoals,
      sharedGoalCategories,
      aOffersB,
      bOffersA,
      isMutual: aOffersB.length > 0 && bOffersA.length > 0,
      sharedOrgs,
      yearDiff,
    },
  };
}

// ─── Match strength label ─────────────────────────────────────────────────────

export function getMatchStrength(score, breakdown) {
  if (score >= 200 && breakdown.isMutual) {
    return { label: "Exceptional Match", color: "emerald", reason: "You both have exactly what the other needs" };
  }
  if (score >= 130) {
    return { label: "Strong Match", color: "blue", reason: "Shared goals with real skill overlap" };
  }
  if (score >= 70) {
    return { label: "Good Match", color: "violet", reason: "Common ground worth exploring" };
  }
  return { label: "Potential Match", color: "gray", reason: "Worth a conversation" };
}

// ─── AI explanation (server-side only) ───────────────────────────────────────

export async function generateMatchExplanation(userA, matchResult) {
  const { user: userB, breakdown } = matchResult;
  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system: "You are a peer matching assistant for college students. Respond only with the requested JSON.",
    messages: [
      {
        role: "user",
        content: `Generate two things based on this match data:

1. MATCH_REASON: 2 sentences explaining why these two students are a great match.
   Be specific and warm. Focus on mutual value. No fluff.

2. AGENDA: A focused 20-minute coffee chat agenda with exactly 3 questions:
   - One genuine icebreaker (not "tell me about yourself")
   - One question about their shared goal: ${breakdown.sharedGoals[0] ?? "career growth"}
   - One skill-exchange question about what they can trade (${breakdown.aOffersB[0] ?? "their expertise"} ↔ ${breakdown.bOffersA[0] ?? "their expertise"})

Respond in this exact JSON format:
{
  "match_reason": "...",
  "agenda": ["question 1", "question 2", "question 3"]
}

Match data:
- ${userA.name}: year ${userA.year}, goals: [${userA.goals}], offers: [${userA.skills_offer}], wants: [${userA.skills_want}]
- ${userB.name}: year ${userB.year}, goals: [${userB.goals}], offers: [${userB.skills_offer}], wants: [${userB.skills_want}]
- Shared goals: [${breakdown.sharedGoals}]
- ${userA.name} can teach ${userB.name}: [${breakdown.aOffersB}]
- ${userB.name} can teach ${userA.name}: [${breakdown.bOffersA}]`,
      },
    ],
  });

  const raw = message.content[0].text;
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  return { ...matchResult, match_reason: parsed.match_reason, agenda: parsed.agenda };
}

// ─── Main: find matches for a user (server-side only) ─────────────────────────

export async function findMatches(requestingUser) {
  const db = getAdminClient();

  // 1. All onboarded users at the same university
  const { data: candidates, error: candidatesError } = await db
    .from("users")
    .select("*")
    .eq("university", requestingUser.university)
    .eq("onboarded", true)
    .neq("id", requestingUser.id);

  if (candidatesError) throw candidatesError;

  // 2. Match history for this user
  const { data: matchHistory, error: historyError } = await db
    .rpc("get_match_history", { p_user_id: requestingUser.id });

  if (historyError) throw historyError;

  // 3. Score every candidate
  const scored = candidates
    .map((candidate) => {
      const result = scoreMatch(requestingUser, candidate, matchHistory);
      if (!result || result.score <= 0) return null;
      return { user: candidate, ...result };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 4. Generate AI explanations in parallel
  const withExplanations = await Promise.all(
    scored.map((match) => generateMatchExplanation(requestingUser, match))
  );

  // 5. Persist the matches (upsert to avoid duplicates)
  if (withExplanations.length > 0) {
    await db.from("matches").upsert(
      withExplanations.map((m) => ({
        user_a_id: requestingUser.id,
        user_b_id: m.user.id,
        score: m.score,
        breakdown: m.breakdown,
        match_reason: m.match_reason,
        agenda: m.agenda,
      }))
    );
  }

  return withExplanations.map((m) => ({
    ...m,
    strength: getMatchStrength(m.score, m.breakdown),
  }));
}
