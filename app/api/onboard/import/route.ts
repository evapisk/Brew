import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GOAL_TAGS, SKILL_TAGS } from "@/lib/tags";
import { scrapeProfileUrl } from "@/lib/linkup";

export async function POST(req: Request) {
  const client = new Anthropic();
  const { profileUrl, resumeText } = await req.json();

  if (!profileUrl && !resumeText) {
    return NextResponse.json({}, { status: 200 });
  }

  const allGoals = Object.values(GOAL_TAGS).flat().join(", ");
  const allSkills = Object.values(SKILL_TAGS).flat().join(", ");

  // Build profile content: try scraping the URL first, fall back to URL string
  let content: string;
  if (profileUrl) {
    const scraped = await scrapeProfileUrl(profileUrl);
    if (scraped) {
      content = `Profile page content (scraped from ${profileUrl}):\n\n${scraped}`;
    } else {
      // Scrape failed (blocked, login wall, etc.) — tell Claude we only have the URL
      content = `Profile URL (page could not be scraped — infer what you can from the URL itself): ${profileUrl}`;
    }
  } else {
    content = `Resume / profile text:\n${resumeText}`;
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: "You are a profile parser for a college student networking app. Extract structured data. Respond only with JSON.",
      messages: [
        {
          role: "user",
          content: `Parse the following student profile and return structured data.

Available goal tags: ${allGoals}
Available skill tags: ${allSkills}

From the profile, infer:
- university: the university name (short form, e.g. "NYU", "MIT", "Stanford")
- year: academic year as integer 1-6 (1=freshman, 2=sophomore, 3=junior, 4=senior, 5=masters, 6=phd)
- goals: array of up to 5 matching goal tags from the list above
- skills_offer: array of matching skill tags the student likely has
- skills_want: array of matching skill tags they'd benefit from learning
- organizations: array of clubs/orgs mentioned (free text)

If a field can't be determined, omit it.

Respond with this JSON format:
{
  "university": "...",
  "year": 2,
  "goals": ["tag1", "tag2"],
  "skills_offer": ["tag1"],
  "skills_want": ["tag2"],
  "organizations": ["Club A"]
}

Profile:
${content}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "AI import failed" }, { status: 500 });
  }
}
