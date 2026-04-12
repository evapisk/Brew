import { LinkupClient } from "linkup-sdk";

function getClient() {
  return new LinkupClient({ apiKey: process.env.LINKUP_API_KEY! });
}

export interface Cafe {
  name: string;
  description: string;
  url: string;
}

export interface NetworkingEvent {
  title: string;
  description: string;
  url: string;
}

// ─── Profile scraping ─────────────────────────────────────────────────────────

/**
 * Attempt to scrape a profile URL (LinkedIn, GitHub, personal site, etc.)
 * using Linkup's fetch. Returns the page content as markdown, or null if
 * the fetch fails or is blocked.
 */
export async function scrapeProfileUrl(url: string): Promise<string | null> {
  try {
    const client = getClient();
    const result = await client.fetch({ url, outputType: "markdown" });
    const markdown = result?.markdown ?? "";
    // If the page returned almost nothing (blocked/login wall), treat as failure
    if (markdown.trim().length < 100) return null;
    return markdown;
  } catch {
    return null;
  }
}

// ─── Cafes ────────────────────────────────────────────────────────────────────

export async function getCafesNearUniversity(university: string): Promise<Cafe[]> {
  const client = getClient();

  const { results } = await client.search({
    query: `best coffee shops cafes near ${university} campus student friendly`,
    depth: "standard",
    outputType: "searchResults",
    maxResults: 6,
  });

  return results
    .filter((r) => r.type === "text")
    .slice(0, 5)
    .map((r) => ({
      name: cleanTitle(r.name),
      description: r.type === "text" ? r.content.slice(0, 120).trim() : "",
      url: r.url,
    }));
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getNetworkingEvents(university: string): Promise<NetworkingEvent[]> {
  const client = getClient();

  const { results } = await client.search({
    query: `student networking events career workshops near ${university} upcoming 2025`,
    depth: "standard",
    outputType: "searchResults",
    maxResults: 5,
  });

  return results
    .filter((r) => r.type === "text")
    .slice(0, 4)
    .map((r) => ({
      title: r.name,
      description: r.type === "text" ? r.content.slice(0, 140).trim() : "",
      url: r.url,
    }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanTitle(title: string): string {
  return title.replace(/\s*[-|–]\s*(Yelp|Google|TripAdvisor|Maps|Reviews?|Website).*/i, "").trim();
}
