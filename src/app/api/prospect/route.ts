import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export interface ProspectCompany {
  name: string;
  industry: string;
  description: string;
  size: string;
  hq: string;
  eventTypes: string[];
  similarTo: string;
  whyItFits: string;
  targetRoles: string[];
  outreachAngle: string;
}

interface ProspectResponse {
  prospects: ProspectCompany[];
  generatedAt: string;
  searchMode: "ai-knowledge" | "web-search";
  seeds: string[];
}

// Tavily web search — only runs if TAVILY_API_KEY is set
async function tavilySearch(query: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: 6,
      include_answer: true,
    }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  const answer = data.answer ? `Summary: ${data.answer}\n\n` : "";
  const snippets = (data.results || [])
    .slice(0, 5)
    .map((r: { title: string; content: string; url: string }) => `${r.title} — ${r.content}`)
    .join("\n\n");
  return answer + snippets;
}

// Build extra context from web searches when Tavily key is present
async function buildSearchContext(seeds: string[], tavilyKey: string): Promise<string> {
  const queries = [
    `companies similar to ${seeds.join(", ")} with recurring webinars training events`,
    "enterprise SaaS companies large-scale learning development virtual events programs",
    "law firms professional services firms recurring client webinars thought leadership events",
    "HRIS HR technology companies recurring training enablement events",
    "B2B SaaS companies customer education programs virtual summits recurring webinars",
  ];

  const results = await Promise.all(queries.map((q) => tavilySearch(q, tavilyKey)));
  return results.filter(Boolean).join("\n\n---\n\n");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const seeds: string[] = body.seeds ?? ["Intuit", "Siena AI", "Gibson Dunn"];
  const extraCriteria: string = body.criteria ?? "";
  const tavilyKey = process.env.TAVILY_API_KEY ?? "";
  const useWebSearch = Boolean(tavilyKey);

  // Build web search context if Tavily is available
  let searchContext = "";
  if (useWebSearch) {
    searchContext = await buildSearchContext(seeds, tavilyKey);
  }

  const systemPrompt = `You are a senior sales intelligence analyst at Open Exchange — a live event production company specializing in corporate webinars, tech summits, virtual training sessions, expert panel series, and internal enablement events. We are a Zoom Premier Partner.

Our ideal clients:
- Run recurring events: quarterly webinars, annual summits, ongoing training programs, partner enablement sessions
- Have dedicated events teams or heavy event needs across departments
- Use Zoom or are in the Zoom ecosystem
- Have 200+ employees
- Operate in SaaS, HRIS/HR Tech, professional services, fintech, legal, consulting, or enterprise software

You produce dense, actionable sales intelligence — not fluffy lists. Every company you identify must have specific reasons why they'd buy event production services.`;

  const userPrompt = `Identify 22 companies that are strong lookalikes for our best clients: ${seeds.join(", ")}.

${extraCriteria ? `Additional criteria from the sales team: ${extraCriteria}\n\n` : ""}${searchContext ? `Web research context:\n${searchContext}\n\n` : ""}

For each company, return a JSON object with these fields:
- name: Company name
- industry: Specific vertical (e.g., "Enterprise HCM / HRIS", "AmLaw 200 Firm", "Fintech SaaS")
- description: 1-sentence description of the company
- size: Employee range (e.g., "1,000–5,000")
- hq: City, State/Country
- eventTypes: Array of 3-4 specific event types they run (be specific: "annual customer summit", "quarterly partner enablement webinar", not just "webinars")
- similarTo: Which seed client they most resemble — must be one of: ${seeds.map((s) => `"${s}"`).join(", ")}
- whyItFits: 2–3 sentences explaining why they're a strong OE prospect. Reference their actual event needs.
- targetRoles: Array of 3–4 exact job titles to reach for outreach at this specific company (e.g., "Director of Corporate Events", "VP of Customer Success", "Head of Revenue Enablement") — make them specific to the company type
- outreachAngle: A single punchy hook sentence that would resonate with this company's events team

Spread companies across all three seed profiles. Prioritize companies that actually run events at scale, not just hypothetically.

Return ONLY a valid JSON array — no markdown, no explanation, no code fences:
[
  { "name": "...", "industry": "...", "description": "...", "size": "...", "hq": "...", "eventTypes": [...], "similarTo": "...", "whyItFits": "...", "targetRoles": [...], "outreachAngle": "..." },
  ...
]`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 6000, temperature: 0.4 },
      }),
    }
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return NextResponse.json({ error: `Gemini API error: ${err}` }, { status: 500 });
  }

  const geminiData = await geminiRes.json();
  const raw: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Extract JSON array from Claude's response
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse prospects from Claude response" }, { status: 500 });
  }

  let prospects: ProspectCompany[];
  try {
    prospects = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "Invalid JSON in Claude response" }, { status: 500 });
  }

  const result: ProspectResponse = {
    prospects,
    generatedAt: new Date().toISOString(),
    searchMode: useWebSearch ? "web-search" : "ai-knowledge",
    seeds,
  };

  return NextResponse.json(result);
}
