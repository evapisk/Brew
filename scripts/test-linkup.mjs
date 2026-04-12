// Run with: node --env-file=.env.local scripts/test-linkup.mjs
import { LinkupClient } from "linkup-sdk";

const client = new LinkupClient({ apiKey: process.env.LINKUP_API_KEY });
const UNIVERSITY = "NYU";

async function testCafes() {
  console.log("\n── CAFES ─────────────────────────────────────────");
  console.log(`Searching for coffee shops near ${UNIVERSITY}...`);

  const { results } = await client.search({
    query: `best coffee shops cafes near ${UNIVERSITY} campus student friendly`,
    depth: "standard",
    outputType: "searchResults",
    maxResults: 6,
  });

  console.log(`\nRaw result count: ${results.length}`);
  results.forEach((r, i) => {
    if (r.type !== "text") return;
    console.log(`\n[${i + 1}] ${r.name}`);
    console.log(`    URL: ${r.url}`);
    console.log(`    Content: ${r.content.slice(0, 120)}...`);
  });
}

async function testEvents() {
  console.log("\n── EVENTS ────────────────────────────────────────");
  console.log(`Searching for networking events near ${UNIVERSITY}...`);

  const { results } = await client.search({
    query: `student networking events career workshops near ${UNIVERSITY} upcoming 2025`,
    depth: "standard",
    outputType: "searchResults",
    maxResults: 5,
  });

  console.log(`\nRaw result count: ${results.length}`);
  results.forEach((r, i) => {
    if (r.type !== "text") return;
    console.log(`\n[${i + 1}] ${r.name}`);
    console.log(`    URL: ${r.url}`);
    console.log(`    Content: ${r.content.slice(0, 140)}...`);
  });
}

(async () => {
  await testCafes().catch((e) => console.error("CAFES ERROR:", e.message));
  await testEvents().catch((e) => console.error("EVENTS ERROR:", e.message));
})();
