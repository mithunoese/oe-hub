import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

interface AuditDimension {
  dimension: string;
  score: number;
  weight: number;
  signals: string[];
  risks: string[];
}

interface ProspectAudit {
  company: AuditDimension;
  contacts: AuditDimension;
  opportunity: AuditDimension;
  competitive: AuditDimension;
  strategy: AuditDimension;
  compositeScore: number;
  grade: string;
  recommendation: string;
  nextSteps: string[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { firm, contact, title, industry, linkedinActivity, score: icpScore } = await req.json();

  const prompt = `You are a senior sales intelligence analyst at Open Exchange, a Zoom Premier Partner specializing in enterprise virtual events (town halls, investor days, executive webcasts, hybrid events).

Perform a 5-DIMENSION PROSPECT AUDIT for this contact and company. Score each dimension 0-100 and provide specific signals.

TARGET:
- Company: ${firm}
- Contact: ${contact}
- Title: ${title}
- Industry: ${industry || 'Unknown'}
${icpScore ? `- Current ICP Score: ${icpScore}` : ''}
${linkedinActivity ? `- Recent LinkedIn Activity: ${linkedinActivity}` : ''}

DIMENSION 1 — COMPANY (weight 25%):
Evaluate: company size, industry fit for virtual events, growth signals, tech sophistication, event volume likelihood.
Signals to look for: Fortune 500/enterprise, regulated industry (needs compliant webcasting), global workforce, recent funding/IPO, M&A activity.

DIMENSION 2 — CONTACTS (weight 20%):
Evaluate: title seniority, decision-making power, department relevance (Corp Comms, IR, Events, Marketing).
Signals: C-suite/VP/Director level, direct budget authority, events in job description, multiple stakeholders identified.
Classify buying role: Economic Buyer, Champion, Evaluator, End User, or Blocker.

DIMENSION 3 — OPPORTUNITY (weight 20%):
Evaluate: pain points likely for this company type, budget indicators, purchase timeline signals.
BANT assessment: Budget (funding, employee count), Authority (title seniority), Need (event complexity), Timeline (upcoming catalysts).
Signals: upcoming earnings calls, annual meetings, regulatory events, product launches.

DIMENSION 4 — COMPETITIVE (weight 15%):
Evaluate: what they likely use today for virtual events (Teams, Webex, basic Zoom), switching barriers, gaps in current solution.
Signals: visible tech stack, vendor mentions, job postings mentioning platforms, event quality complaints.

DIMENSION 5 — STRATEGY (weight 20%):
Evaluate: best outreach channel, messaging angle, objection risks, timing.
Recommend: lead with value prop X, avoid mentioning Y, best time to reach out, who else to loop in.

SCORING:
- 85-100 (A+): Hot lead — immediate full-court press
- 75-84 (A): Strong prospect — significant effort warranted
- 60-74 (B): Qualified — standard outreach sequence
- 40-59 (C): Nurture — long-term play, light touch
- 0-39 (D): Poor fit — deprioritize

Return ONLY valid JSON:
{
  "company": {"dimension": "Company Fit", "score": <0-100>, "weight": 25, "signals": ["signal1", "signal2"], "risks": ["risk1"]},
  "contacts": {"dimension": "Contact Quality", "score": <0-100>, "weight": 20, "signals": ["signal1"], "risks": ["risk1"]},
  "opportunity": {"dimension": "Opportunity Size", "score": <0-100>, "weight": 20, "signals": ["signal1"], "risks": ["risk1"]},
  "competitive": {"dimension": "Competitive Position", "score": <0-100>, "weight": 15, "signals": ["signal1"], "risks": ["risk1"]},
  "strategy": {"dimension": "Strategy & Timing", "score": <0-100>, "weight": 20, "signals": ["signal1"], "risks": ["risk1"]},
  "compositeScore": <weighted average 0-100>,
  "grade": "<A+|A|B|C|D>",
  "recommendation": "<one sentence action recommendation>",
  "nextSteps": ["step1", "step2", "step3"]
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Claude API error" }, { status: 500 });
    }

    const raw: string = data.content?.[0]?.text?.trim() ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse audit from Claude" }, { status: 500 });
    }

    const audit: ProspectAudit = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      audit,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
