import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export interface EmailSequence {
  type: "initial" | "followup1" | "followup2";
  day: number;
  subject: string;
  body: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured." }, { status: 500 });
  }

  const { companyName, industry, size, hq, eventTypes, targetRole, outreachAngle, contactName, contactNote } =
    await req.json();

  const name = contactName ? contactName.split(" ")[0] : `the ${targetRole}`;

  const systemPrompt = `You are a sales development rep at Open Exchange, a Zoom Premier Partner that produces world-class virtual events for enterprises.

Write a 3-touch cold outreach sequence. Rules:

INITIAL EMAIL (day 0):
- Subject: specific, under 8 words, references something real about the company
- Opener: address ${name} by first name${contactNote ? `, reference: "${contactNote}"` : ""}. One sentence, no fluff.
- Body: what Open Exchange does better for their specific situation — use proof, not adjectives. 1-2 sentences max.
- Ask: one 15-minute call, low-friction. Be direct.
- Sign-off: Kristen at Open Exchange
- Total: under 120 words

FOLLOW-UP 1 (day 5):
- Short. 3-4 sentences total.
- Reference the initial email briefly
- Add ONE new proof point or stat (e.g. "We run 200+ events/month for teams like yours")
- Same ask: 15 min
- Under 60 words

FOLLOW-UP 2 (day 12):
- Clean close. 2-3 sentences.
- Acknowledge they're busy, leave the door open
- No pressure, just a soft re-ask
- Under 40 words

Quality gate — REJECT if any email:
- Contains "I hope this email finds you well" or similar filler
- Uses adjectives without proof ("innovative", "cutting-edge", "best-in-class")
- Has a vague subject line
- Has more than one ask

Return ONLY valid JSON:
{
  "emails": [
    {"type": "initial", "day": 0, "subject": "...", "body": "..."},
    {"type": "followup1", "day": 5, "subject": "...", "body": "..."},
    {"type": "followup2", "day": 12, "subject": "...", "body": "..."}
  ]
}`;

  const userPrompt = `Write a 3-touch sequence for ${name} — ${targetRole} at ${companyName}.

Company context:
- Industry: ${industry}
- Size: ${size}
- HQ: ${hq}
- Events they run: ${eventTypes.join(", ")}
- Why they fit: ${outreachAngle}${contactNote ? `\n- Contact context: ${contactNote}` : ""}

Every email must feel written specifically for this person, not a template.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2000 },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Gemini API error" }, { status: 500 });
    }

    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse email from response." }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]) as { emails: EmailSequence[] };
    // Support legacy callers expecting { email }
    const initial = parsed.emails.find((e) => e.type === "initial");
    return NextResponse.json({
      email: initial ? { subject: initial.subject, body: initial.body } : null,
      sequence: parsed.emails,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
