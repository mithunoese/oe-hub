import { NextRequest, NextResponse } from "next/server";
import type { PipelineRow } from "@/data/pipelines";

// Kept for backward compat with /agents/prospecting page
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

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const seeds: string[] = body.seeds ?? ["Edelman", "Kekst CNC", "Weber Shandwick"];
  const extraCriteria: string = body.criteria ?? "";
  const pipelineName: string = body.pipelineName ?? "Corp Comms";

  const prompt = `You are a sales intelligence analyst at Open Exchange, a Zoom Premier Partner specializing in enterprise virtual events — town halls, investor days, executive webcasts, and hybrid events.

OpenExchange ICP:
- Corporate comms agencies, PR/IR firms, in-house Fortune 500 comms teams
- VP/Director/C-level in Corporate Communications, Investor Relations, Events, Marketing Comms
- 200+ employees, high event volume, broadcast-grade needs

Generate 10 real prospect contacts similar to: ${seeds.join(", ")}.${extraCriteria ? ` Focus: ${extraCriteria}` : ""}

For EACH prospect, provide ONE specific named contact — a real person likely to be at that firm in a relevant role.

Return ONLY a JSON array, no markdown, no explanation:
[
  {
    "firm": "exact company name",
    "contact": "First Last (real person name at this firm)",
    "title": "exact job title",
    "group": "industry category (e.g. Corp Comms Agency, PR Firm, In-house Comms)",
    "hq": "City, State/Country",
    "score": <ICP score 0-100 based on firmographic fit, event volume likelihood, title seniority>,
    "outreachAngle": "one punchy hook sentence for cold outreach",
    "li": false,
    "status": "none",
    "by": "—",
    "lastAct": "—"
  }
]

Scoring guidance (return integer 0-100):
- 85-100: perfect ICP fit — right firm type, right title, high event volume
- 65-84: strong fit — good firm, senior title, likely event needs
- 40-64: moderate fit — adjacent industry or mid-level title
- under 40: stretch — worth including for diversity

Spread contacts across different firm types. Use real, verifiable people where possible. If unsure of a specific name, use a realistic placeholder like "Jennifer Walsh" with note "(verify on LinkedIn)" in the title field.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Claude API error" }, { status: 500 });
    }

    const raw: string = data.content?.[0]?.text?.trim() ?? "";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse prospects from Claude" }, { status: 500 });
    }

    let rows: PipelineRow[];
    try {
      rows = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: "Invalid JSON in Claude response" }, { status: 500 });
    }

    return NextResponse.json({
      rows,
      generatedAt: new Date().toISOString(),
      seeds,
      pipelineName,
    });
  } catch (err) {
    console.error('[prospect]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
