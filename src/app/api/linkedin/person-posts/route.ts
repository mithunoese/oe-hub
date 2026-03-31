import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Key;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { contact, title, firm, linkedinUsername } = await req.json();
  if (!contact || !firm) {
    return NextResponse.json({ error: "contact and firm are required" }, { status: 400 });
  }

  // Build the LinkedIn profile URL if we have a username
  const liProfileUrl = linkedinUsername
    ? `https://linkedin.com/in/${linkedinUsername}`
    : null;

  // Generate a guessed username if none provided (firstname-lastname pattern)
  const nameParts = contact.toLowerCase().trim().split(/\s+/);
  const guessedUsername = nameParts.length >= 2
    ? `${nameParts[0]}-${nameParts[nameParts.length - 1]}`
    : nameParts[0];
  const guessedUrl = `https://linkedin.com/in/${guessedUsername}`;

  const prompt = `You are a sales intelligence analyst researching LinkedIn activity for a prospect.

TARGET:
- Name: ${contact}
- Title: ${title || 'Unknown'}
- Company: ${firm}
${liProfileUrl ? `- LinkedIn: ${liProfileUrl}` : `- Likely LinkedIn: ${guessedUrl} (unverified)`}

Based on what someone in this role at this company would typically post about on LinkedIn, generate 3 realistic and plausible recent LinkedIn posts that this person likely made or would make. Make them specific to their industry, role, and company.

For each post, also generate an "outreach hook" — a short sentence that a sales rep could use to reference this post in a cold email to make it feel personalized and relevant.

Return ONLY valid JSON:
{
  "posts": [
    {
      "date": "3d ago",
      "text": "the post content (2-3 sentences, realistic LinkedIn style)",
      "hook": "outreach hook referencing this post (1 sentence)"
    },
    {
      "date": "1w ago",
      "text": "...",
      "hook": "..."
    },
    {
      "date": "2w ago",
      "text": "...",
      "hook": "..."
    }
  ],
  "guessedUsername": "${linkedinUsername || guessedUsername}"
}

Make the posts feel authentic — reference real industry trends, events, or company milestones that would be relevant to ${firm} in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;

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
        max_tokens: 1500,
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
      return NextResponse.json({ error: "Failed to parse posts" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      posts: parsed.posts,
      guessedUsername: parsed.guessedUsername || linkedinUsername || guessedUsername,
      profileUrl: liProfileUrl || guessedUrl,
      source: linkedinUsername ? 'verified' : 'ai-generated',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
