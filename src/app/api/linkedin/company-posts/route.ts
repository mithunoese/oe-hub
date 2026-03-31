import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const company = req.nextUrl.searchParams.get('company');

  if (!company) {
    return NextResponse.json({ error: 'company query param required' }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  const prompt = `You are a LinkedIn content analyst for B2B sales intelligence at OpenExchange, a broadcast-grade virtual events platform.

Analyze the company "${company}" and predict what they are likely posting about on LinkedIn based on their industry, size, and public presence.

Return ONLY valid JSON, no other text.

{
  "company": "${company}",
  "recentThemes": ["<theme1>", "<theme2>", "<theme3>", "<theme4>", "<theme5>"],
  "outreachAngles": ["<angle1>", "<angle2>", "<angle3>"]
}

Guidelines:
- recentThemes: 3-5 likely content themes the company posts about (e.g. "Leadership thought pieces on corporate governance", "Employee spotlight and culture posts")
- outreachAngles: 2-3 specific angles an OpenExchange sales rep could use to start a conversation, connecting the company's likely interests to virtual events, webcasts, town halls, or investor days
- Be specific to the company's industry and likely communications needs
- Focus on themes relevant to corporate communications, events, and webcasting`;

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
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response', raw }, { status: 500 });

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
