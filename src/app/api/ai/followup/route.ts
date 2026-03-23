import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;

  const { name, title, firm, score, lastActivity } = await req.json();
  const firstName = name?.split(' ')[0] ?? name;

  const prompt = `You are a BD rep at Open Exchange, a Zoom Premier Partner for enterprise virtual events.

Write a follow-up email for ${firstName} (${title} at ${firm}) who hasn't replied to the initial outreach.
ICP Score: ${score}/100. Last contact: ${lastActivity || 'initial email'}.

Rules:
- Subject: specific, under 8 words, fresh angle
- Body: 3 sentences max. No "just following up" or "I hope this finds you well"
- Reference something specific about ${firm} or their role
- End with a soft, low-pressure ask
- Sign off as: Open Exchange team

Respond in exactly this format (no extra text, no JSON brackets):
SUBJECT: [your subject line here]
BODY: [your email body here]`;

  const parseResponse = (raw: string) => {
    const subjectMatch = raw.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
    const bodyMatch = raw.match(/BODY:\s*([\s\S]+)/i);
    if (!subjectMatch || !bodyMatch) {
      const lines = raw.split('\n').filter(l => l.trim());
      return {
        subject: lines[0]?.replace(/^(subject:|SUBJECT:)\s*/i, '').trim() || 'Following up on virtual events',
        body: lines.slice(1).join('\n').trim() || raw,
      };
    }
    return { subject: subjectMatch[1].trim(), body: bodyMatch[1].trim() };
  };

  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

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
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message ?? 'Claude API error' }, { status: 500 });
    const raw: string = data.content?.[0]?.text?.trim() ?? '';
    if (!raw) return NextResponse.json({ error: 'Empty response from Claude' }, { status: 500 });
    return NextResponse.json(parseResponse(raw));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
