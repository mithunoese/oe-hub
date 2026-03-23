import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  const { name, title, firm, score, status, li } = await req.json();

  const prompt = `You are a BD strategist at Open Exchange, a Zoom Premier Partner that produces enterprise-grade virtual events.

Write a sharp, specific, actionable outreach brief for the following contact. 2-3 sentences MAX. No fluff, no adjectives without proof. Sound like a thoughtful senior rep, not a chatbot.

Contact: ${name}
Title: ${title}
Firm: ${firm}
ICP Score: ${score}/100
Outreach Status: ${status === 'replied' ? 'Replied to outreach' : status === 'emailed' ? 'Emailed — no reply yet' : 'Not yet contacted'}
LinkedIn Verified: ${li ? 'Yes' : 'No'}

Instructions based on status:
- If replied: focus on what to say in the next conversation (discovery call prep, key questions to ask)
- If emailed no reply: suggest a specific follow-up angle different from the initial email
- If not contacted: recommend the strongest opening hook specific to their role and firm

Be concrete. Reference the firm by name. Mention something specific about their likely use case. Suggest exactly what to do next.

Return ONLY the brief text (no JSON, no labels, no preamble).`;

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
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message ?? 'Claude API error' }, { status: 500 });
    const brief: string = data.content?.[0]?.text?.trim() ?? '';
    if (!brief) return NextResponse.json({ error: 'Empty response from Claude' }, { status: 500 });
    return NextResponse.json({ brief });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
