import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

interface Contact {
  name: string;
  title: string;
  linkedin_url: string | null;
}

async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
          ...(jsonMode ? { responseMimeType: "application/json" } : {}),
        },
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

    let rawText = "";
    try {
      rawText = await callGemini(
        `You are a sales research assistant. For the corporate communications agency "${firm}", identify the single best person to contact about a broadcast infrastructure technology partnership — specifically for town halls, executive webcasts, and hybrid corporate events.

Focus on VP/Director level in client services, strategy, events, or partnerships.

Return ONLY valid JSON, no markdown, no explanation:
{"name": "string", "title": "string", "linkedin_url": "string or null"}

If you are not confident of a specific person's name, use a realistic title-based placeholder like "Head of Client Services" with name "Unknown — verify on LinkedIn".`,
        true
      );

      // Gemini occasionally embeds literal newlines inside string values even in JSON mode;
      // replace them with spaces so JSON.parse doesn't choke.
      const sanitized = rawText.replace(/\r?\n/g, " ").trim();
      const parsed = JSON.parse(sanitized) as Contact;
      const contact: Contact = {
        name: parsed.name || "Unknown — verify on LinkedIn",
        title: parsed.title || "Senior Leader",
        linkedin_url: parsed.linkedin_url ?? null,
      };
      return NextResponse.json({ contact });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not find contact";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  if (action === "email") {
    if (!contact || !firm) {
      return NextResponse.json({ error: "Missing contact or firm" }, { status: 400 });
    }

    const firstName = contact.name.split(" ")[0];
    const useFirstName = !contact.name.toLowerCase().includes("unknown");

    try {
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not draft email";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
