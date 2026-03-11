import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json({ error: "GROQ_API_KEY not configured." }, { status: 500 });
  }

  const { companyName, industry, size, hq, eventTypes, targetRole, outreachAngle } =
    await req.json();

  const systemPrompt = `You are a sales development rep at Open Exchange, a company that helps organizations produce world-class virtual events on Zoom Events.

Write short, personalized cold emails following these rules:
- Subject line: specific, under 8 words, references something real about the company
- Opener (1 sentence): acknowledge something specific about their events — name a real event they run if possible
- Value prop (1-2 sentences): what Zoom Events does better for their specific situation — no generic pitches
- Ask (1 sentence): one 15-minute call, low-friction
- Sign-off: from Kristen at Open Exchange
- Total body: under 130 words
- No fluff, no buzzwords, no "I hope this email finds you well"
- Write as if you know exactly who they are and why you're reaching out

Return ONLY valid JSON with this shape:
{"subject": "...", "body": "..."}`;

  const userPrompt = `Write a cold email to the ${targetRole} at ${companyName}.

Company context:
- Industry: ${industry}
- Size: ${size}
- HQ: ${hq}
- Events they run: ${eventTypes.join(", ")}
- Why they fit: ${outreachAngle}

The email should feel like it was written specifically for this person at this company.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Groq API error" }, { status: 500 });
    }

    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse email from response." }, { status: 500 });
    }

    const email = JSON.parse(jsonMatch[0]) as { subject: string; body: string };
    return NextResponse.json({ email });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
