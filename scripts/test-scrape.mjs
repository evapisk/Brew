// Run with: node --env-file=.env.local scripts/test-scrape.mjs
import { LinkupClient } from "linkup-sdk";
import Anthropic from "@anthropic-ai/sdk";

const linkup = new LinkupClient({ apiKey: process.env.LINKUP_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Edit these to test different URLs ─────────────────────────────────────────
const TEST_URLS = [
  "https://github.com/evapisk",           // GitHub profile
  "https://www.linkedin.com/in/test",     // LinkedIn (likely blocked)
];
// ─────────────────────────────────────────────────────────────────────────────

const GOAL_TAGS = [
  "break-into-consulting","break-into-finance","break-into-tech","break-into-vc",
  "find-research-position","land-first-internship","get-into-grad-school",
  "launch-a-startup","find-a-cofounder","ship-a-side-project","start-a-club",
  "improve-my-gpa","ace-technical-interviews","build-my-network",
  "improve-public-speaking","find-my-career-direction",
];

const SKILL_TAGS = [
  "python","javascript","sql","r","machine-learning","data-analysis",
  "financial-modeling","excel","figma","graphic-design","video-editing",
  "writing","content-creation","brand-design","public-speaking","pitch-decks",
  "cold-outreach","linkedin-optimization","resume-writing","case-interviews",
  "venture-capital","investment-banking","product-management",
  "consulting-frameworks","pre-med-advice","law-school-prep",
];

async function scrape(url) {
  try {
    const result = await linkup.fetch({ url, outputType: "markdown" });
    const markdown = result?.markdown ?? "";
    if (markdown.trim().length < 100) return null;
    return markdown;
  } catch (e) {
    return null;
  }
}

async function parseWithClaude(content) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: "You are a profile parser for a college student networking app. Respond only with JSON.",
    messages: [{
      role: "user",
      content: `Parse the following student profile and return structured data.

Available goal tags: ${GOAL_TAGS.join(", ")}
Available skill tags: ${SKILL_TAGS.join(", ")}

From the profile, infer:
- university: short form (e.g. "NYU", "MIT")
- year: integer 1-6
- goals: up to 5 matching goal tags
- skills_offer: matching skill tags the student has
- skills_want: skill tags they'd benefit from
- organizations: clubs/orgs mentioned (free text)

Respond in this JSON format:
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
    }],
  });

  const raw = message.content[0].text;
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned);
}

for (const url of TEST_URLS) {
  console.log("\n" + "─".repeat(60));
  console.log(`URL: ${url}`);
  console.log("─".repeat(60));

  console.log("Scraping with Linkup...");
  const scraped = await scrape(url);

  if (!scraped) {
    console.log("SCRAPE RESULT: blocked / login wall / empty");
    console.log("Falling back to URL-only parsing...");
    const content = `Profile URL (page could not be scraped — infer what you can from the URL itself): ${url}`;
    try {
      const parsed = await parseWithClaude(content);
      console.log("\nClaude output (URL-only fallback):");
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log("Parse failed");
    }
    continue;
  }

  console.log(`SCRAPE RESULT: ${scraped.length} chars of markdown`);
  console.log("\nFirst 400 chars of scraped content:");
  console.log(scraped.slice(0, 400) + "...\n");

  try {
    const parsed = await parseWithClaude(`Profile page content (scraped from ${url}):\n\n${scraped}`);
    console.log("Claude parsed output:");
    console.log(JSON.stringify(parsed, null, 2));
  } catch {
    console.log("Parse failed");
  }
}
