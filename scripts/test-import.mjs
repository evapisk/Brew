// Run with: node --env-file=.env.local scripts/test-import.mjs
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SAMPLE_RESUME = `
Alex Johnson
alex@nyu.edu | linkedin.com/in/alexjohnson

EDUCATION
New York University, Stern School of Business
Bachelor of Science in Finance, Class of 2026 (Junior)

EXPERIENCE
Goldman Sachs — Summer Analyst Intern, Investment Banking (Summer 2024)
- Built financial models for M&A transactions
- Prepared pitch decks for client presentations

NYU Entrepreneurship Club — Vice President (2023–present)
Stern Finance Society — Member

SKILLS
Excel, financial modeling, pitch decks, Python (basic), public speaking

GOALS
Break into investment banking, launch a startup, build my network
`;

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

console.log("\n── AI RESUME IMPORT ──────────────────────────────");
console.log("Parsing sample resume...\n");

const message = await client.messages.create({
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
${SAMPLE_RESUME}`,
  }],
});

const raw = message.content[0].text;
console.log("Raw Claude response:");
console.log(raw);

try {
  const parsed = JSON.parse(raw);
  console.log("\nParsed output:");
  console.log(JSON.stringify(parsed, null, 2));
} catch {
  console.error("\nFailed to parse JSON from response");
}
