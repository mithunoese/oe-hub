import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

// OpenExchange ICP definition for the scoring prompt
const ICP_CONTEXT = `
OpenExchange ICP (Ideal Customer Profile):
- Companies: Corporate comms agencies, PR/IR firms, in-house corporate communications teams at Fortune 500 companies
- Use case: Town halls, investor days, webcasts, hybrid events — high-volume, broadcast-grade
- Company size: 500+ employees (clients), or agencies serving those clients
- Titles: VP/SVP/Director/C-level in Corporate Communications, Investor Relations, Events, Marketing Communications
- LinkedIn: Active presence is a strong positive signal
- NOT a fit: Small events firms, consumer-facing marketing, social media agencies without enterprise comms focus
`;

export async function POST(req: NextRequest) {
  const { firm, contact, title, li, pipelineName, context } = await req.json();

  if (!firm || !contact || !title) {
    return NextResponse.json({ error: 'firm, contact, title required' }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  const prompt = `You are an ICP scoring engine for OpenExchange, a broadcast-grade virtual events platform.

${ICP_CONTEXT}
${context ? `\nFresh intel (use this to boost or adjust scores where relevant):\n"${context}"\n` : ''}
Score the following contact against OpenExchange's ICP. Return ONLY valid JSON, no other text.

Contact:
- Firm: ${firm}
- Name: ${contact}
- Title: ${title}
- LinkedIn verified: ${li ? 'Yes' : 'No'}
- Pipeline context: ${pipelineName || 'Corp Comms'}

Return this exact JSON structure (all scores 0-100):
{
  "score": <overall 0-100>,
  "signals": {
    "firmographic": <0-100>,
    "eventVolume": <0-100>,
    "techStack": <0-100>,
    "linkedin": <0-100>,
    "buyingIntent": <0-100>
  },
  "rationale": "<1 sentence explaining the score>"
}

Scoring guidance:
- firmographic: How well does the firm type and size match OE's ICP?
- eventVolume: Based on firm type/size, how likely are they to run many broadcast-grade events?
- techStack: How likely are they using or evaluating virtual event platforms?
- linkedin: 80+ if LinkedIn verified, 20 if not
- buyingIntent: Based on title seniority and firm's likely event needs
- overall score: weighted average (firmographic 30%, eventVolume 25%, techStack 15%, linkedin 15%, buyingIntent 15%)`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message ?? 'Claude API error' }, { status: 500 });

    const raw: string = data.content?.[0]?.text?.trim() ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response', raw }, { status: 500 });

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
