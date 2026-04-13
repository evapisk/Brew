import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";

export async function POST(req: Request) {
  const client = new Anthropic();
  const { resumeText, goalsDescription } = await req.json();

  if (!resumeText && !goalsDescription) {
    return NextResponse.json({}, { status: 200 });
  }

  const allGoals = Object.values(GOAL_TAGS).flat().join(", ");
  const allSkills = Object.values(SKILL_TAGS).flat().join(", ");

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are a profile parser for a college student networking app.
Extract structured data from two separate inputs:
1. A resume (for skills and background)
2. A goals description (for goals and what they want to learn)

Always respond only with valid JSON — no markdown, no preamble.`,
      messages: [
        {
          role: "user",
          content: `Parse the following student inputs and return structured data.

Available goal tags (pick from ONLY these): ${allGoals}

Available skill tags (pick from ONLY these): ${allSkills}

Instructions:
- skills_offer: skills the student already has, extracted from the RESUME
- goals: tags that best match their GOALS DESCRIPTION (up to 5)
- skills_want: skills they would likely need to achieve their stated goals (inferred from goals description, picked from skill tags)
- university: extract from resume if present (short form, e.g. "NYU", "MIT")
- year: extract from resume as integer 1-6 (1=freshman … 6=phd), omit if unclear
- organizations: clubs or orgs mentioned in resume (free text array)

Omit any field you cannot determine with confidence.

Respond with this exact JSON shape:
{
  "skills_offer": ["tag1", "tag2"],
  "goals": ["tag1", "tag2"],
  "skills_want": ["tag1", "tag2"],
  "university": "...",
  "year": 2,
  "organizations": ["Club A"]
}

--- RESUME ---
${resumeText || "(not provided)"}

--- GOALS DESCRIPTION ---
${goalsDescription || "(not provided)"}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[onboard/import]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
