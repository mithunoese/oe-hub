import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not configured.' }, { status: 500 });

  const { pipelines, pipelineRows } = await req.json() as {
    pipelines: Array<{ name: string }>;
    pipelineRows: Record<number, Array<{ firm: string; contact: string; title: string; score: number; status: string; by: string; lastAct: string }>>;
  };

  // Build a compact summary for the prompt
  const allRows = Object.values(pipelineRows).flat();
  const total = allRows.length;
  const emailed = allRows.filter(r => r.status === 'emailed' || r.status === 'replied').length;
  const replied = allRows.filter(r => r.status === 'replied').length;
  const untouched = allRows.filter(r => r.status === 'none' && r.score >= 75).length;

  const topContacts = allRows
    .filter(r => r.status === 'none' && r.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => `${r.contact} at ${r.firm} (score ${r.score}, owned by ${r.by})`)
    .join('; ');

  const recentReplies = allRows
    .filter(r => r.status === 'replied')
    .slice(0, 3)
    .map(r => `${r.contact} at ${r.firm}`)
    .join(', ');

  const pipelineBreakdown = Object.entries(pipelineRows).map(([idx, rows]) => {
    const name = pipelines[Number(idx)]?.name ?? `Pipeline ${idx}`;
    const rep = rows.filter(r => r.status === 'replied').length;
    const em = rows.filter(r => r.status === 'emailed').length;
    return `${name}: ${rows.length} contacts, ${em} emailed, ${rep} replied`;
  }).join('\n');

  const prompt = `You are writing the morning BD standup digest for the Open Exchange sales team. Be brief, direct, and energizing. 4-6 bullet points max. Write in plain text (no markdown headers). Each bullet should be 1-2 sentences.

Pipeline data:
- Total contacts: ${total}
- Emailed: ${emailed} | Replied: ${replied}
- High-fit, untouched (score 75+): ${untouched}
- Recent replies: ${recentReplies || 'none yet'}
- Top priority untouched: ${topContacts || 'none — great coverage!'}

By pipeline:
${pipelineBreakdown}

Write the standup digest now. Focus on: what's working, who to prioritize today, and one specific action item for the team. Sound like a real sales manager, not a template.

Return ONLY the bullet points (use • as bullet character). No title, no preamble.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message ?? 'Gemini API error' }, { status: 500 });

    const digest: string = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    return NextResponse.json({ digest });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
