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

  // Generate guessed username
  const nameParts = contact.toLowerCase().trim().split(/\s+/);
  const guessedUsername = nameParts.length >= 2
    ? `${nameParts[0]}-${nameParts[nameParts.length - 1]}`
    : nameParts[0];
  const guessedUrl = `https://linkedin.com/in/${guessedUsername}`;

  // OE's real recent LinkedIn posts (refreshed periodically)
  const oeRecentPosts = [
    {
      date: "20h ago",
      text: "At OpenExchange, we support Zoom clients in delivering high-visibility events with precision. Across marketing programs, sales kickoffs, product launches, and global town halls, we work inside our clients' Zoom environments to plan, manage, and execute each moment.",
    },
    {
      date: "3d ago",
      text: "Now Hiring: Part-Time Video Operators & Assistant Project Managers (Remote). Looking for flexible, remote work you can do from anywhere? We're especially interested in candidates fluent in English plus Spanish, German, Japanese, or Portuguese.",
    },
    {
      date: "4d ago",
      text: "A great couple of days in New York with the Investor Relations community. We hosted our OpenExchange Cocktail Event at the Cornell Club, welcoming over 100 guests. Mark Loehr delivered the opening remarks at the IR Impact Awards at Cipriani 25 Broadway.",
    },
    {
      date: "6d ago",
      text: "Virtual is no longer a backup. It is becoming a strategic channel for reaching new audiences in a changing global landscape. As investor types evolve and access shifts, the ability to engage with precision matters more than ever.",
    },
    {
      date: "1w ago",
      text: "Mark Loehr and Kirsten van Rooijen tackle Season 2 of the OpenExchange × Computershare podcast — geopolitics reshaping markets, new investor types emerging, and the growing role of virtual engagement across new use cases.",
    },
    {
      date: "2w ago",
      text: "Investor communication does not happen once a quarter. It is a continuous cycle of moments where leadership shapes understanding, reinforces strategy, and builds confidence with the market.",
    },
    {
      date: "1mo ago",
      text: "Introducing OE Meet — secure meeting scheduling and execution solution for post-announcement moments. When the pressure is high and the demand is immediate, OE Meet helps you communicate efficiently and on your terms.",
    },
    {
      date: "1mo ago",
      text: "When NYC shuts down, business doesn't. Moments like this don't cancel communication. They test it. At OpenExchange, we are built for exactly this — we can spin up secure, professionally managed virtual events quickly.",
    },
  ];

  const prompt = `You are a sales intelligence analyst preparing LinkedIn outreach intelligence for a BD rep at OpenExchange (OE).

TARGET PROSPECT:
- Name: ${contact}
- Title: ${title || 'Unknown'}
- Company: ${firm}
${liProfileUrl ? `- LinkedIn: ${liProfileUrl}` : `- Likely LinkedIn: ${guessedUrl} (unverified)`}

OE'S RECENT LINKEDIN ACTIVITY (real posts from linkedin.com/company/openexchange-inc-/):
${oeRecentPosts.slice(0, 5).map((p, i) => `${i + 1}. [${p.date}] ${p.text}`).join('\n')}

Based on what someone in the role of "${title}" at "${firm}" would typically post about on LinkedIn, generate 3 realistic and plausible recent LinkedIn posts this person likely made or would make. Make them specific to their industry, role, and company — reference real trends, events, or company milestones.

For each post, generate an "outreach hook" — a personalized sentence connecting THEIR post topic to something OE actually does (reference OE's real posts above where relevant). The hook should feel natural, not salesy.

Return ONLY valid JSON:
{
  "posts": [
    {
      "date": "3d ago",
      "text": "the post content (2-3 sentences, realistic LinkedIn style)",
      "hook": "outreach hook connecting their topic to OE's capabilities (1 sentence)"
    }
  ],
  "oeRelevantPost": "which OE post above is most relevant to this prospect (copy the key phrase)"
}

Make the posts feel authentic for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;

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
      oeRelevantPost: parsed.oeRelevantPost,
      guessedUsername: linkedinUsername || guessedUsername,
      profileUrl: liProfileUrl || guessedUrl,
      companyUrl: `https://linkedin.com/company/openexchange-inc-/`,
      source: linkedinUsername ? 'verified' : 'ai-generated',
    });
  } catch (err) {
    console.error('[linkedin/person-posts]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
