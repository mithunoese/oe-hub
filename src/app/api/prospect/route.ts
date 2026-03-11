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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
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

  const systemPrompt = `You are a sales intelligence analyst at Open Exchange, a Zoom Premier Partner specializing in corporate webinars, tech summits, training events, and expert panel series. Produce dense, actionable prospect lists.`;

  const userPrompt = `Find 12 companies similar to ${seeds.join(", ")} for our event production sales pipeline.${extraCriteria ? ` Focus: ${extraCriteria}` : ""}${searchContext ? `\n\nContext:\n${searchContext}` : ""}

Return ONLY a JSON array, no markdown:
[{"name":"","industry":"","description":"","size":"","hq":"","eventTypes":[],"similarTo":"","whyItFits":"","targetRoles":[],"outreachAngle":""}]

Rules:
- similarTo must be one of: ${seeds.map((s) => `"${s}"`).join(", ")}
- eventTypes: 3 specific types (e.g. "annual customer summit", "quarterly partner webinar")
- targetRoles: 3 exact titles to reach (e.g. "Director of Events", "VP of L&D")
- whyItFits: 2 sentences on why they need event production
- outreachAngle: one punchy hook sentence
- Spread evenly across all seed profiles`;

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 3500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.text();
    return NextResponse.json({ error: `Groq API error: ${err}` }, { status: 500 });
  }

  const groqData = await groqRes.json();
  const raw: string = groqData.choices?.[0]?.message?.content ?? "";

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
