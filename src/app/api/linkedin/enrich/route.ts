import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

interface ContactInput {
  contact: string;
  firm: string;
  title: string;
}

interface EnrichedContact {
  contact: string;
  firm: string;
  liUrl: string;
  liActive: boolean;
  recentPosts: string[];
  outreachHook: string;
}

const BATCH_SIZE = 3;

export async function POST(req: NextRequest) {
  const { contacts } = await req.json();

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return NextResponse.json({ error: 'contacts array required' }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!anthropicKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

  const enriched: EnrichedContact[] = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE) as ContactInput[];

    const prompt = `You are a LinkedIn intelligence analyst for B2B sales outreach at OpenExchange, a broadcast-grade virtual events platform.

For each contact below, analyze their likely LinkedIn presence and generate enrichment data. Return ONLY valid JSON, no other text.

Contacts:
${batch.map((c, idx) => `${idx + 1}. Name: ${c.contact}, Firm: ${c.firm}, Title: ${c.title}`).join('\n')}

For each contact, generate:
- liUsername: a likely LinkedIn username/slug (firstname-lastname-suffix format, lowercase, no spaces)
- liUrl: full LinkedIn profile URL using the username
- liActive: boolean — is this person likely active on LinkedIn? (senior titles at large firms = true, junior/small firms = maybe)
- recentPosts: array of 2-3 plausible recent post themes based on their role and industry (e.g. "Shared thoughts on hybrid event trends")
- outreachHook: a single sentence personalized outreach hook referencing their role/firm that connects to virtual events or webcasting

Return this exact JSON structure:
{
  "contacts": [
    {
      "contact": "<name>",
      "firm": "<firm>",
      "liUsername": "<slug>",
      "liUrl": "https://linkedin.com/in/<slug>",
      "liActive": true|false,
      "recentPosts": ["<post1>", "<post2>"],
      "outreachHook": "<hook>"
    }
  ]
}

Assessment guidance:
- C-suite, VP, SVP, Director at Fortune 500 or major agencies: liActive = true
- Mid-level at known companies: liActive = true
- Small/unknown firms or junior titles: liActive = false
- Username format: firstname-lastname or firstname-lastname-randomdigits`;

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
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data.error?.message ?? 'Claude API error' }, { status: 500 });
      }

      const raw: string = data.content?.[0]?.text?.trim() ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ error: 'No JSON in response', raw }, { status: 500 });
      }

      const result = JSON.parse(jsonMatch[0]);
      const batchContacts = result.contacts ?? [];

      for (const c of batchContacts) {
        enriched.push({
          contact: c.contact,
          firm: c.firm,
          liUrl: c.liUrl ?? `https://linkedin.com/in/${c.liUsername ?? 'unknown'}`,
          liActive: c.liActive ?? false,
          recentPosts: c.recentPosts ?? [],
          outreachHook: c.outreachHook ?? '',
        });
      }
    } catch (err) {
      console.error('[linkedin/enrich]', err);
      return NextResponse.json(
        { error: 'Internal server error', enrichedSoFar: enriched },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ enriched });
}
