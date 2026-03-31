import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export interface EmailSequence {
  type: "initial" | "followup1" | "followup2" | "followup3" | "followup4";
  day: number;
  subject: string;
  body: string;
  channel: "email" | "linkedin";
  framework: string;
}

export interface LinkedInTouch {
  type: "li_connect" | "li_engage" | "li_dm";
  day: number;
  action: string;
  message?: string;
}

export interface OutreachPlan {
  emails: EmailSequence[];
  linkedin: LinkedInTouch[];
  abTests: { subject: string; opening: string }[];
  readinessScore: number;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured." }, { status: 500 });
  }

  const { companyName, industry, size, hq, eventTypes, targetRole, outreachAngle, contactName, contactNote, linkedinActivity } =
    await req.json();

  const name = contactName ? contactName.split(" ")[0] : `the ${targetRole}`;

  const systemPrompt = `You are a senior sales development rep at Open Exchange, a Zoom Premier Partner that produces world-class virtual events for enterprises.

Write a 5-email + LinkedIn multi-channel outreach sequence. Each touch builds on the last.

EMAIL 1 — THE HOOK (Day 0):
Framework: Observation → Connection → Ask
- Subject: specific, under 8 words, references something real about the company
- Opener: address ${name} by first name${contactNote ? `, reference: "${contactNote}"` : ""}${linkedinActivity ? `. Tie in their recent LinkedIn activity: "${linkedinActivity}"` : ""}. One sentence.
- Body: what Open Exchange does better for their specific situation — use proof, not adjectives. 1-2 sentences max.
- Ask: one 15-minute call, low-friction.
- Sign-off: Kristen at Open Exchange
- Total: under 120 words

EMAIL 2 — THE VALUE ADD (Day 3):
Framework: Problem → Proof → Ask
- Short. 3-4 sentences total.
- Reference the initial email briefly ("I reached out earlier this week about…")
- Add ONE new proof point or stat (e.g. "We run 200+ events/month for teams like yours" or a specific client result)
- Same ask: 15 min
- Under 80 words

EMAIL 3 — THE SOCIAL PROOF (Day 7):
Framework: Trigger Event
- Lead with a relevant case study or client win in their industry
- Be specific: name the client type (not the actual client), the event type, and the outcome
- Tie it back to their situation
- Under 80 words

EMAIL 4 — THE DIFFERENT ANGLE (Day 14):
Framework: Problem → Proof → Ask (different angle)
- Shift perspective — address a different pain point or stakeholder concern
- E.g. if Email 1 was about event quality, this one is about cost/efficiency or scale
- Fresh subject line, feels like a new conversation
- Under 70 words

EMAIL 5 — THE BREAKUP (Day 21):
Framework: Observation → Connection → Ask (soft close)
- Acknowledge they're busy, no pressure
- Leave the door open with a specific reason to reconnect later
- Respectful close — "If the timing isn't right, no worries at all"
- Under 50 words

LINKEDIN TOUCHES (interleaved):
- Day 0: Connection request (personalized note, under 300 chars, reference shared industry/interest)
- Day 5: Engage with their recent content (like + thoughtful comment — write the comment)
- Day 10: LinkedIn DM (different from email — shorter, more casual, reference the connection)

A/B TESTS:
- Provide 2 alternative subject lines for Email 1
- Provide 2 alternative opening lines for Email 1

OUTREACH READINESS SCORE (0-100):
Score based on: personalization depth, proof point strength, ask clarity, multi-channel coordination, timing cadence

Quality gate — REJECT if any email:
- Contains "I hope this email finds you well" or similar filler
- Uses adjectives without proof ("innovative", "cutting-edge", "best-in-class")
- Has a vague subject line
- Has more than one ask per email
- Sounds like a template

Return ONLY valid JSON:
{
  "emails": [
    {"type": "initial", "day": 0, "subject": "...", "body": "...", "channel": "email", "framework": "Observation → Connection → Ask"},
    {"type": "followup1", "day": 3, "subject": "...", "body": "...", "channel": "email", "framework": "Problem → Proof → Ask"},
    {"type": "followup2", "day": 7, "subject": "...", "body": "...", "channel": "email", "framework": "Trigger Event"},
    {"type": "followup3", "day": 14, "subject": "...", "body": "...", "channel": "email", "framework": "Different Angle"},
    {"type": "followup4", "day": 21, "subject": "...", "body": "...", "channel": "email", "framework": "Soft Close"}
  ],
  "linkedin": [
    {"type": "li_connect", "day": 0, "action": "Send connection request", "message": "..."},
    {"type": "li_engage", "day": 5, "action": "Comment on their post", "message": "..."},
    {"type": "li_dm", "day": 10, "action": "Send DM", "message": "..."}
  ],
  "abTests": [
    {"subject": "alt subject line 1", "opening": "alt opening 1"},
    {"subject": "alt subject line 2", "opening": "alt opening 2"}
  ],
  "readinessScore": 85
}`;

  const userPrompt = `Write a full 5-email + LinkedIn multi-channel sequence for ${name} — ${targetRole} at ${companyName}.

Company context:
- Industry: ${industry}
- Size: ${size}
- HQ: ${hq}
- Events they run: ${eventTypes.join(", ")}
- Why they fit: ${outreachAngle}${contactNote ? `\n- Contact context: ${contactNote}` : ""}${linkedinActivity ? `\n- Recent LinkedIn activity: ${linkedinActivity}` : ""}

Every touch must feel written specifically for this person. The LinkedIn messages should complement the emails, not repeat them.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 4000 },
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

    const parsed = JSON.parse(jsonMatch[0]) as OutreachPlan;
    // Support legacy callers expecting { email }
    const initial = parsed.emails.find((e) => e.type === "initial");
    return NextResponse.json({
      email: initial ? { subject: initial.subject, body: initial.body } : null,
      sequence: parsed.emails,
      linkedin: parsed.linkedin ?? [],
      abTests: parsed.abTests ?? [],
      readinessScore: parsed.readinessScore ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
