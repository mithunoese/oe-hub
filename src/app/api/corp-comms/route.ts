import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

interface Contact {
  name: string;
  title: string;
  linkedin_url: string | null;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } })?.error?.message ||
        `Gemini error ${res.status}`
    );
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    action: "find" | "email";
    firm: string;
    contact?: Contact;
  };
  const { action, firm, contact } = body;

  if (action === "find") {
    if (!firm) return NextResponse.json({ error: "No firm provided" }, { status: 400 });

    const text = await callGemini(
      `You are a sales research assistant. For the corporate communications agency "${firm}", identify the single best person to contact about a broadcast infrastructure technology partnership — specifically for town halls, executive webcasts, and hybrid corporate events.

Focus on VP/Director level in client services, strategy, events, or partnerships.

Return ONLY valid JSON, no markdown, no explanation:
{"name": "string", "title": "string", "linkedin_url": "string or null"}

If you are not confident of a specific person's name, use a realistic title-based placeholder like "Head of Client Services" with name "Unknown — verify on LinkedIn".`
    );

    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse contact" }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as Contact;
      return NextResponse.json({ contact: parsed });
    } catch {
      return NextResponse.json({ error: "Invalid JSON in response" }, { status: 500 });
    }
  }

  if (action === "email") {
    if (!contact || !firm) {
      return NextResponse.json({ error: "Missing contact or firm" }, { status: 400 });
    }

    const firstName = contact.name.split(" ")[0];
    const useFirstName = !contact.name.toLowerCase().includes("unknown");

    const text = await callGemini(
      `Write a cold outreach email to ${useFirstName ? firstName : `the ${contact.title}`} at ${firm}.

Context: You are Mithun, writing on behalf of OpenExchange (OE) — a technology platform that powers executive-grade webcasts, global town halls, and hybrid corporate events via Zoom. OE partners with corporate communications agencies as their broadcast infrastructure layer. Think: the agency handles the strategy and content, OE handles the technology so the event actually runs flawlessly at scale.

Rules:
- Under 150 words
- Warm but direct — no "I hope this email finds you well" or similar filler
- One specific reference to ${firm}'s type of work
- Clear, low-friction ask: a quick 15-minute call
- Sign off: Mithun, OpenExchange

Return only the email body text. No subject line. No extra commentary.`
    );

    return NextResponse.json({ email: text.trim() });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
