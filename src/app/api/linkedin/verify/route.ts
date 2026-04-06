import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { contact, title, firm } = await req.json();
  if (!contact || !firm) {
    return NextResponse.json({ error: "contact and firm required" }, { status: 400 });
  }

  // Use Claude to generate the most likely LinkedIn username
  const prompt = `You are a LinkedIn profile matching assistant. Given a person's name, title, and company, predict their most likely LinkedIn username (the part after linkedin.com/in/).

PERSON:
- Name: ${contact}
- Title: ${title || 'Unknown'}
- Company: ${firm}

LinkedIn usernames typically follow these patterns:
- firstname-lastname (most common)
- firstnamelastname
- firstname-lastname-suffix (e.g., -cpa, -mba, numbers)
- first initial + lastname

Return ONLY valid JSON:
{
  "guessedUsernames": ["most-likely-username", "second-guess", "third-guess"],
  "profileUrl": "https://linkedin.com/in/most-likely-username",
  "confidence": "high" | "medium" | "low"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Claude API error" }, { status: 500 });
    }

    const raw: string = data.content?.[0]?.text?.trim() ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[linkedin/verify]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
