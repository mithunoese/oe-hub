"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Theme {
  title: string;
  text: string;
}

interface LookAhead {
  title: string;
  text: string;
}

interface Meeting {
  title: string;
  summary: string;
}

interface DayData {
  day: string;
  date: string;
  meetingCount: number;
  meetings: Meeting[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-3";

// ─── Themes Data ──────────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    title: "Migration Pipeline Is Getting Real",
    text: "IFRS is the anchor project. Joe laid out the full AWS pipeline \u2014 list assets, metadata workers, download, transform, Zoom upload \u2014 and began building it. Dry run target: first week of April. March 24 shifts to a progress check-in.",
  },
  {
    title: "Migration Pricing Now Structured",
    text: "36\u201372 dev hours per migration, $40\u201350/hr blended cost, $12\u201317\u00a2/GB infrastructure. Revenue at $300/hr, ~80\u201385% gross margin. Zoom\u2019s reference pricing: ~$2.10/recording \u2014 OE is competitive. Client one-pager and internal sheet go to Zoom early next week.",
  },
  {
    title: "SE Function Taking Shape",
    text: "First in-person meetup with Devin on Thursday. ROI Value Calculator reviewed and improved. Recurring syncs established: Tuesdays 3pm + Fridays 11am.",
  },
  {
    title: "Cross-Functional Visibility Increasing",
    text: "First meaningful contributions beyond shadow mode: Salesforce/billing (Ali), Zoom partnership sales (Kara, Kristen, Peter), engineering (Joe, Max, Connor). Amgen Workato was the first client strategy conversation Mithun contributed to directly.",
  },
];

// ─── Look Ahead Data ──────────────────────────────────────────────────────────

const lookAheadItems: LookAhead[] = [
  {
    title: "Kaltura Authentication Guide",
    text: "Step-by-step guide with screenshots for app token authentication so client contacts can generate their own tokens (Alan flagged as a needed artifact).",
  },
  {
    title: "AI Prospecting Agent with Kristen",
    text: "Build agent to identify companies similar to Intuit, Sienna, and Gibson Dunn for the Zoom sales team \u2014 focus on L&D platforms, HRIS systems, professional services.",
  },
  {
    title: "Tyler Brubach Intro",
    text: "Get introduced to Emilia\u2019s main Zoom contact. He\u2019s ready \u2014 first formal step into the Zoom partnership relationship.",
  },
  {
    title: "Zoom CMS Product Enablement Docs",
    text: "Get product enablement documentation on the Zoom CMS hub UI from Max or the delivery team before any client-facing conversations.",
  },
  {
    title: "SE Ops Power BI Report",
    text: "Scope call with Ali \u2014 opportunity-level view between discovery call scheduled and proposal stage for Mithun and Devin.",
  },
];

// ─── Meeting Data ─────────────────────────────────────────────────────────────

const meetingData: DayData[] = [
  {
    day: "Monday",
    date: "March 2",
    meetingCount: 5,
    meetings: [
      {
        title: "OE All-Hands Sales Meeting",
        summary:
          "OE delivered 41 events in one day \u2014 the biggest in company history \u2014 driven by weekend geopolitical events (Iran situation). Banks including Citi (530 attendees), RBC (2,344), UBS, JP Morgan, and HSBC all needed rapid-response analyst webcasts. Sales performance: 42 meetings set (above target), $269K closed, quarter at $7M of $11M goal (65%) with four weeks left. Devon and Connor\u2019s Claude AI agent for Computershare shown to the team. Mithun introduced; Andrew called him a \u201cmagician.\u201d",
      },
      {
        title: "OE Intro Joe \u2014 Mithun \u2194 Joe McPherson (VP Engineering)",
        summary:
          "First 1:1 with Joe McPherson. Joe runs all of engineering and designed the entire migration architecture using Claude. He walked through OE\u2019s white glove service \u2014 PMs and operators orchestrate behind the scenes in real time. Mithun demoed his prototype and Joe engaged deeply. Key coaching: isolated infrastructure per project, resumable pipeline with checkpoints, source-quality video (original file, not renditions), ETL framing, 6-week timeline for migration #1 compressing to ~2 weeks by migration #3+.",
      },
      {
        title: "Competitive Analysis \u2014 OE vs. Notified Battle Card",
        summary:
          "Synthesized Michelle\u2019s competitive deep-dive into a full battle card. Notified\u2019s Achilles heel is billing: per-minute pricing, surprise invoices 2\u20133 years late for tens of thousands. Two separate dated players, no unified platform, Studio can\u2019t use a phone conference line. Lost all AV teams when DNXPO was sold to BrandLive. $15K minimum for a dedicated rep; overseas webcast managers with 3\u20137 day response times. No trial, no demo. OE\u2019s advantages: transparent pricing, one platform, backup conference line, dedicated team, trial/demo.",
      },
      {
        title: "Daily Check-In \u2014 Mithun \u2194 Andrew & Emilia",
        summary:
          "Debrief on the Joe 1:1. Andrew noted a positive reception \u2014 the demo landed well. Prototype demo well received. Current Zoom API blocker: ~30 videos at a time; Andrew confirmed Zoom will build it when a big enough client pushes. Direction: go deeper on Zoom this week, shadow Kara on sales calls, show Alan the prototype. Emilia raised CRM integration vision \u2014 visualize how Zoom Events engagement data flows into Salesforce/HubSpot as a second prototype.",
      },
      {
        title: "Joe Product Specifications",
        summary:
          "Documented Joe\u2019s full architecture vision. Core: modular, reusable framework \u2014 same AWS infrastructure (Step Functions, DynamoDB, S3, Lambda, KMS) for every migration; only three small adapters change per source platform. Per-project infrastructure is isolated and ephemeral: all torn down after completion, KMS key deleted so data is unrecoverable. Pipeline has 6 resumable stages with validation checkpoints. Always download original source files, not renditions. \u201c90% of our time is talking about metadata mapping.\u201d",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "March 3",
    meetingCount: 4,
    meetings: [
      {
        title: "Genpact \u2014 Earnings Call Platform Demo",
        summary:
          "Observed Devin and CJ demo to Genpact IR team (Gloria, Blakely, Nisha). Passport showed affiliation-based routing: buy-side to passive webcast, sell-side to Zoom Webinar with Q&A. Podium walkthrough: drag-and-drop analyst queue, real-time operator chat, phone backup. Analyst callback booking introduced as add-on. Next step: IR team briefs Kyle (decision-maker) on pricing.",
      },
      {
        title: "Weekly Zoom CMS / VM Migration Check-In \u2014 IFRS",
        summary:
          "IFRS declared sole migration priority until proven to Zoom. Prototype flagged as demo-only \u2014 must not be positioned as self-serve. Three Zoom API errors escalated to Sunny (Zoom engineering). Dry run = Phase 1 only: extract + validate metadata, don\u2019t push to IFRS live account. Singapore inbound surfaced: 22,600 files, ~26\u201327TB. Action: write Kaltura app token authentication guide with screenshots.",
      },
      {
        title: "AAIM Employers Association \u2014 Discovery Call",
        summary:
          "MRA referral. March 26 hybrid simulcast \u201cSuccession Madness\u201d \u2014 17 in-person + 22 virtual. Current Zoom setup fragmented across multiple people. Production Studio shown \u2014 client reaction: \u201cthat doesn\u2019t look anything like what we do.\u201d Quote for day-of support to follow. Bigger opportunity: September annual event.",
      },
      {
        title: "ROI Value Calculator \u2014 Devin Peer Sync",
        summary:
          "Value Calculator reviewed: maps all OE products to what clients would need to replicate independently. Devin pushed for event-type-specific time buckets (earnings, investor day, town hall). Added key differentiator: the human service layer \u2014 OE\u2019s dedicated PM model vs. self-serve competitors. Best used in large enterprise ELA conversations.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "March 4",
    meetingCount: 4,
    meetings: [
      {
        title: "SF Biweekly Stakeholder Call",
        summary:
          "Capital markets billing change goes live Thursday March 5. A deployment dependency miss caused Carmen\u2019s end-of-month invoicing issue; Ariel manually resolved ~15 affected deals. New process: child-order billing monthly via Power BI. GCS migration finishing end of week. Power BI discrepancy report (SF vs. NetSuite) coming soon. Mithun requested SE ops Power BI report from Ali \u2014 opportunities between discovery call scheduled and proposal stage.",
      },
      {
        title: "OE \u2194 Citi (Velocity Migration) \u2014 Weekly Technical Sync",
        summary:
          "Weekend Iran event drove ~800 viewers across Velocity + Passport. OE spinning up dedicated weekend coverage for research markets. Create Event API v2 confirmed working. Two pass-through API issues surfaced: start date ISO format inconsistency, event type enum mismatch. Return Webcast Events timing out ~20% of calls \u2014 fix: add date range filter. Old events surfacing as live in Velocity queue \u2014 CI Events flag issue; resolves when Veracast is decommissioned.",
      },
      {
        title: "UBS Event Hub Demo & Integration",
        summary:
          "Demo\u2019d Event Hub to Matthew from UBS Live Desk \u2014 \u201cSpotify for research events.\u201d Matthew immediately connected it to the NEO strategy: live events are the strongest way to get buy-side into UBS\u2019s content ecosystem. SSO passthrough confirmed. Live Desk player review: burger menu issue below size threshold, thumbnail inconsistency, limited audio. UBS migrating to next-gen OE player by end of Q1.",
      },
      {
        title: "Daily Check-In \u2014 Emilia + Mithun",
        summary:
          "Singapore: $50\u2013100K over 3\u20136 months, pure labor play, both aligned. Prototype update: thumbnails working, larger video pushed. Kara sent Zoom Events onboarding materials.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "March 5 \u2014 In-Person Day (NYC)",
    meetingCount: 3,
    meetings: [
      {
        title: "Amgen Workato Integration Strategy",
        summary:
          "Amgen asked for API integration directions: Salesforce Marketing Cloud \u2192 website \u2192 Zoom. No native connection exists \u2014 Workato (middleware) recommended. Key open question: OE hosts account (ongoing support obligation) vs. client hosts (OE configures once, exits). Data ownership concern raised given pharma context. Agreed: send Zoom API docs + high-level recommendation, offer configuration. Timeline Q3.",
      },
      {
        title: "Migration Sync \u2014 Joe + Mithun",
        summary:
          "New scope items: chapters and captions now required alongside media files and thumbnails. Joe\u2019s full pipeline: list assets \u2192 parallel metadata workers (S3) \u2192 media download \u2192 transform \u2192 upload to Zoom (media, hub/channel, metadata PATCH, captions). OE does NOT delete from Kaltura \u2014 deletion step removed from prototype. SRT files convertible to VTT programmatically. Joe\u2019s target: 100\u2013200 videos extracted with full metadata by end of next week.",
      },
      {
        title: "Check-In \u2014 Andrew + Mithun (Evening)",
        summary:
          "Debrief on in-person day with Devin. Andrew confirmed migration tool is real \u2014 actual video transfer working, metadata pulling live from Kaltura. Salesforce walkthrough: $11M quarterly goal ($7.6M in), 40 meetings/week goal (at 33), $825K orders/week (at $759K). SE reframe: not just supporting 3 AEs \u2014 supporting OE as a company.",
      },
    ],
  },
  {
    day: "Friday",
    date: "March 6",
    meetingCount: 3,
    meetings: [
      {
        title: "CMS Pricing \u2014 Alan, Max, Joe, Mithun",
        summary:
          "Alan\u2019s directive: build pricing cross sheet so Zoom reps can quote without custom scoping. Joe\u2019s inputs: 36\u201372 dev hours, $40\u201350/hr blended cost, $12\u201317\u00a2/GB infra. Revenue: $300/hr, 80\u201385% margin. Output report is a hard requirement: every Kaltura entry ID must map to a Zoom video ID so clients can regenerate embed links. Pricing sheet due Monday.",
      },
      {
        title: "CMS Pricing \u2014 Max + Mithun Sync",
        summary:
          "Max built pricing artifact with Claude: PM, development, infra tiers. Client-facing one-pager: simple/complex tiers + add-on services (dry run, validation report, link redirect). Rajul\u2019s Zoom reference pricing ~$2.10/recording \u2014 OE is competitive. Mithun introduced Max to Claude Code (CLI, agents, MCP). Max granted Mithun access to Zoom sandbox hub \u2014 confirmed and accessible for demo prep.",
      },
      {
        title: "Zoom Sales Weekly",
        summary:
          "At $822K, 66% of quarterly goal. $344K in contracting (majority Sienna). Meetings below weekly goal of 20 \u2014 called out as top priority. Teams/Microsoft flag: tread carefully given Zoom partnership; leadership must be looped in. ON24 explicitly not supported. Mithun to work with Kristen on AI prospecting agent (Intuit / Sienna / Gibson Dunn comps). CMS update: $5\u201325K per project, Zoom projects up to 1,000 migrations, Zoom pays for first 1\u20132.",
      },
    ],
  },
];

// ─── TTS Script (for Kokoro TTS) ─────────────────────────────────────────────

const ttsScript = `Week 3 Report. March 2 through 6, 2026. ... Week 3 marked the shift from orientation into active contribution across 22 meetings. The week opened Monday March 2 with OE's biggest single-day delivery ever — 41 events driven by geopolitical events — and a first 1:1 with Joe McPherson. ... Theme 1: Migration Pipeline Is Getting Real. IFRS is the anchor project. Joe laid out the full AWS pipeline and began building it. Dry run target: first week of April. ... Theme 2: Migration Pricing Now Structured. 36 to 72 dev hours per migration, 40 to 50 dollars per hour blended cost. Revenue at 300 dollars per hour, 80 to 85 percent gross margin. OE is competitive with Zoom's reference pricing of about 2 dollars and 10 cents per recording. ... Theme 3: SE Function Taking Shape. First in-person meetup with Devin on Thursday. ROI Value Calculator reviewed and improved. Recurring syncs established: Tuesdays at 3pm and Fridays at 11am. ... Theme 4: Cross-Functional Visibility Increasing. First meaningful contributions beyond shadow mode across Salesforce, Zoom partnership sales, and engineering. Amgen Workato was the first client strategy conversation Mithun contributed to directly. ... Monday, March 2nd. 5 meetings. ... OE All-Hands Sales Meeting. 41 events in one day, the biggest in company history. Banks including Citi, RBC, UBS, JP Morgan, and HSBC all needed rapid-response analyst webcasts. Quarter at 7 million of 11 million dollar goal, 65 percent with four weeks left. Mithun introduced; Andrew called him a magician. ... First 1:1 with Joe McPherson, VP Engineering. Joe designed the entire migration architecture. Key coaching: isolated infrastructure per project, resumable pipeline with checkpoints, always original source files not renditions, 6-week timeline for migration 1 compressing to 2 weeks by migration 3. ... Synthesized the competitive battle card against Notified. Their Achilles heel: per-minute pricing, surprise invoices 2 to 3 years late. OE's advantages: transparent pricing, one platform, backup conference line, dedicated team. ... Daily check-in debrief with Andrew and Emilia. Prototype well received. Emilia raised CRM integration vision for Zoom Events engagement data into Salesforce. ... Documented Joe's full architecture vision: modular AWS framework, ephemeral per-project infrastructure, 6 resumable pipeline stages. 90 percent of our time is talking about metadata mapping. ... Tuesday, March 3rd. 4 meetings. ... Observed Genpact earnings call demo with Devin and CJ. Affiliation-based routing: buy-side to passive webcast, sell-side to Zoom Webinar. Analyst callback booking as add-on. Next step: IR team briefs Kyle. ... IFRS declared sole migration priority. Dry run equals Phase 1 only: extract and validate metadata. Singapore inbound: 22,600 files, 26 to 27 terabytes. ... AAIM Employers Association discovery call. March 26 hybrid simulcast, 17 in-person plus 22 virtual. Bigger opportunity: September annual event. ... ROI Value Calculator peer sync with Devin. Added event-type-specific time buckets and the human service layer differentiator. Best used in large enterprise ELA conversations. ... Wednesday, March 4th. 4 meetings. ... SF Biweekly Stakeholder Call. Capital markets billing change goes live Thursday. Mithun requested SE ops Power BI report from Ali for the discovery to proposal pipeline view. ... Citi Velocity weekly technical sync. Iran event drove 800 viewers. Create Event API v2 confirmed working. Two pass-through API issues surfaced. ... UBS Event Hub demo to Matthew from UBS Live Desk. Spotify for research events. SSO passthrough confirmed. UBS migrating to next-gen OE player by end of Q1. ... Midday check-in with Emilia. Singapore opportunity: 50 to 100K over 3 to 6 months, pure labor play. ... Thursday, March 5th. In-person day in New York City. 3 meetings. ... Amgen Workato integration strategy. Salesforce Marketing Cloud to website to Zoom. Workato recommended as middleware. Data ownership concern given pharma context. Timeline Q3. ... Migration sync with Joe. Chapters and captions now required. Full pipeline confirmed. Joe's target: 100 to 200 videos extracted with full metadata by end of next week. ... Evening check-in with Andrew. Migration tool is real — actual video transfer working. SE reframe: not just supporting 3 AEs, supporting OE as a company. ... Friday, March 6th. 3 meetings. ... CMS pricing meeting with Alan, Max, and Joe. Build a pricing cross sheet so Zoom reps can quote without custom scoping. Output report hard requirement: every Kaltura entry ID must map to a Zoom video ID. ... CMS pricing sync with Max. Client-facing one-pager with simple and complex tiers plus add-on services. Mithun introduced Max to Claude Code. Max granted Zoom sandbox hub access. ... Zoom Sales Weekly. At 822K, 66 percent of quarterly goal. Meetings below goal of 20 — top priority. AI prospecting agent work with Kristen coming up. CMS: 5 to 25K per project. ... Looking Ahead to Week 4. ... Kaltura Authentication Guide with screenshots for client contacts. ... AI Prospecting Agent with Kristen — target companies similar to Intuit, Sienna, and Gibson Dunn. ... Tyler Brubach intro — first formal step into the Zoom partnership. ... Zoom CMS Product Enablement Docs before any client-facing conversations. ... And SE Ops Power BI report scope call with Ali.`;

// ─── Comments Component ───────────────────────────────────────────────────────

function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (stored) setComments(JSON.parse(stored));
    const storedName = localStorage.getItem("oe-hub-comment-name");
    if (storedName) setAuthorName(storedName);
  }, []);

  return (
    <div style={{ marginTop: 48 }}>
      <div style={{ borderTop: "2px solid #008285", paddingTop: 24 }}>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Comments
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            marginBottom: 24,
          }}
        >
          Leave feedback, questions, or notes. Stored in your browser.
        </p>

        {comments.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "16px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Georgia', serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {comment.author}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#c0c0c0",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {comment.timestamp}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.7,
                        color: "#374151",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {comment.text}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const filtered = comments.filter(
                        (c) => c.id !== comment.id
                      );
                      setComments(filtered);
                      localStorage.setItem(
                        COMMENTS_STORAGE_KEY,
                        JSON.stringify(filtered)
                      );
                    }}
                    style={{
                      fontSize: 11,
                      color: "#d1d5db",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                      fontFamily: "system-ui, sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            padding: "20px 24px",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 4,
              }}
            >
              Name
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 14,
                fontFamily: "'Georgia', serif",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 4,
              }}
            >
              Comment
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment or question..."
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 14,
                fontFamily: "'Georgia', serif",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                outline: "none",
                resize: "vertical",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => {
              if (!authorName.trim() || !commentText.trim()) return;
              const newComments: Comment[] = [
                ...comments,
                {
                  id: Date.now().toString(),
                  author: authorName.trim(),
                  text: commentText.trim(),
                  timestamp: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                },
              ];
              setComments(newComments);
              localStorage.setItem(
                COMMENTS_STORAGE_KEY,
                JSON.stringify(newComments)
              );
              localStorage.setItem(
                "oe-hub-comment-name",
                authorName.trim()
              );
              setCommentText("");
            }}
            disabled={!authorName.trim() || !commentText.trim()}
            style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              color:
                authorName.trim() && commentText.trim()
                  ? "#fff"
                  : "#9ca3af",
              background:
                authorName.trim() && commentText.trim()
                  ? "#008285"
                  : "#f3f4f6",
              border: "none",
              borderRadius: 6,
              padding: "8px 20px",
              cursor:
                authorName.trim() && commentText.trim()
                  ? "pointer"
                  : "default",
              transition: "all 0.15s",
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TextToSpeech Component ───────────────────────────────────────────────────

type TTSState = "idle" | "loading" | "playing" | "paused" | "error";

function TextToSpeech() {
  const [status, setStatus] = useState<TTSState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsInstanceRef = useRef<any>(null);

  const handlePlayPause = useCallback(async () => {
    if (status === "playing" && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }

    if (status === "paused" && audioRef.current) {
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // @ts-expect-error - kokoro-js is loaded dynamically at runtime via CDN/wasm
      const { KokoroTTS } = await import(/* webpackIgnore: true */ "kokoro-js");

      if (!ttsInstanceRef.current) {
        ttsInstanceRef.current = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-v1.0-ONNX",
          { dtype: "q8", device: "wasm" }
        );
      }

      const audio = await ttsInstanceRef.current.generate(ttsScript, {
        voice: "am_michael",
      });
      const blob = audio.toBlob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audioElement = new Audio(url);
      audioRef.current = audioElement;

      audioElement.onended = () => setStatus("idle");
      audioElement.onerror = () => {
        setStatus("error");
        setErrorMessage("Audio playback failed");
      };

      await audioElement.play();
      setStatus("playing");
    } catch (err: any) {
      console.error("TTS failed:", err);
      setStatus("error");
      setErrorMessage(err?.message || "Unknown error");
    }
  }, [status]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("idle");
  }, []);

  const buttonLabel: Record<TTSState, string> = {
    idle: "Listen",
    loading: "Loading voice...",
    playing: "Pause",
    paused: "Resume",
    error: "Retry",
  };

  const buttonIcon: Record<TTSState, string> = {
    idle: "\u25B6",
    loading: "\u23F3",
    playing: "\u23F8",
    paused: "\u25B6",
    error: "\u26A0",
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {errorMessage && status === "error" && (
        <span
          style={{
            fontSize: 11,
            color: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={errorMessage}
        >
          {errorMessage}
        </span>
      )}
      <button
        onClick={
          status === "error"
            ? () => {
                setStatus("idle");
                setErrorMessage("");
              }
            : handlePlayPause
        }
        disabled={status === "loading"}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color:
            status === "error"
              ? "#ef4444"
              : status === "playing" || status === "paused"
              ? "#fff"
              : "#008285",
          background:
            status === "error"
              ? "#fef2f2"
              : status === "playing" || status === "paused"
              ? "#008285"
              : "#f0fafa",
          border:
            status === "error"
              ? "1px solid #fecaca"
              : status === "playing" || status === "paused"
              ? "1px solid #008285"
              : "1px solid #e0f0f0",
          borderRadius: 6,
          padding: "7px 16px",
          cursor: status === "loading" ? "wait" : "pointer",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        <span style={{ fontSize: 11 }}>{buttonIcon[status]}</span>{" "}
        {buttonLabel[status]}
      </button>
      {(status === "playing" || status === "paused") && (
        <button
          onClick={handleStop}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#9ca3af",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "7px 12px",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Stop
        </button>
      )}
    </div>
  );
}

// ─── Analytics Component ──────────────────────────────────────────────────────

function Analytics() {
  const [isExpanded, setIsExpanded] = useState(true);

  const statsCards = [
    { value: "28", label: "People Met" },
    { value: "5", label: "Clients Touched" },
    { value: "5", label: "Departments" },
    { value: "2", label: "Key Deals" },
  ];

  const meetingsByDay = [
    { day: "Mon", count: 5 },
    { day: "Tue", count: 4 },
    { day: "Wed", count: 4 },
    { day: "Thu", count: 3 },
    { day: "Fri", count: 3 },
  ];

  const meetingTypes = [
    { type: "1:1 Calls", count: 6, color: "#008285" },
    { type: "Client / Discovery", count: 4, color: "#0ea5e9" },
    { type: "Internal Sync", count: 8, color: "#8b5cf6" },
    { type: "Partner / Strategic", count: 2, color: "#f59e0b" },
    { type: "Debriefs", count: 2, color: "#ec4899" },
  ];

  return (
    <div style={{ marginBottom: 48 }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: isExpanded ? 20 : 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Week 3 Analytics
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          {isExpanded ? "collapse" : "expand"}
        </span>
      </div>

      {isExpanded && (
        <div>
          {/* Stats Cards */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            {statsCards.map((card) => (
              <div
                key={card.label}
                style={{
                  flex: "1 1 100px",
                  minWidth: 80,
                  background: "#f0fafa",
                  border: "1px solid #e0f0f0",
                  borderRadius: 8,
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#008285",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    fontFamily: "system-ui, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: 2,
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Meetings by Day Bar Chart */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              Meetings by Day
            </div>
            {meetingsByDay.map((item) => (
              <div
                key={item.day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 30,
                    fontSize: 12,
                    color: "#9ca3af",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "right",
                  }}
                >
                  {item.day}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    background: "#f3f4f6",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.count / 5) * 100}%`,
                      height: "100%",
                      background: "#008285",
                      borderRadius: 4,
                      opacity: 0.6 + (item.count / 5) * 0.4,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          {/* Meeting Types */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              Meeting Types
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {meetingTypes.map((item) => (
                <div
                  key={item.type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 20,
                    padding: "6px 14px",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {item.type}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#111827",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DaySection Component ─────────────────────────────────────────────────────

function DaySection({ data }: { data: DayData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: "pointer",
          padding: "16px 0",
          borderBottom: isExpanded ? "none" : "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#008285",
                letterSpacing: "-0.02em",
              }}
            >
              {data.day}
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                fontFamily: "'Georgia', serif",
                marginLeft: 10,
              }}
            >
              {data.date}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                color: "#008285",
                background: "#f0fafa",
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {data.meetingCount} meetings
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#d1d5db",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                transition: "transform 0.15s ease",
                fontFamily: "serif",
              }}
            >
              ›
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{ paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}
        >
          {data.meetings.map((meeting, index) => (
            <div
              key={index}
              style={{
                padding: "14px 0",
                borderTop: index > 0 ? "1px solid #f9fafb" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {meeting.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#6b7280",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {meeting.summary}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function WeekThreeReport() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "56px 24px 96px",
        }}
      >
        {/* Header Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Link
            href="/reports"
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            &larr; Back to Reports
          </Link>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <TextToSpeech />
            <span
              style={{
                fontSize: 10,
                color: "#c0c0c0",
                fontFamily: "system-ui, sans-serif",
                maxWidth: 90,
                lineHeight: 1.3,
              }}
            >
              First load downloads ~80MB voice model
            </span>
            <a
              href="/weekly_report_week3.pdf"
              download="Weekly_Report_Week3_final.pdf"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#008285",
                background: "#f0fafa",
                border: "1px solid #e0f0f0",
                borderRadius: 6,
                padding: "7px 16px",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 14 }}>&darr;</span> Download PDF
            </a>
          </div>
        </div>

        {/* Title Section */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c0c0c0",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 16,
            }}
          >
            Weekly Report
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px 0",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Week 3
          </h1>
          <div style={{ fontSize: 15, color: "#9ca3af", marginBottom: 4 }}>
            March 2&ndash;6, 2026
          </div>
          <div style={{ fontSize: 14, color: "#b0b0b0" }}>
            Mithun Manjunatha &mdash; Sales Engineer
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#008285",
              borderRadius: 2,
              marginTop: 20,
            }}
          />
        </div>

        {/* Summary Stats */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Meetings", value: "22" },
            { label: "Days", value: "5" },
            { label: "Themes", value: "4" },
            { label: "Onboarding Week", value: "3 of 6" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#f9fafb",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "14px 20px",
                flex: "1 1 120px",
                minWidth: 100,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontFamily: "system-ui, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics */}
        <Analytics />

        {/* Overview + Themes */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Overview
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#374151",
              marginBottom: 24,
            }}
          >
            Week 3 marked the shift from orientation into active contribution
            across 22 meetings. The week opened Monday March 2 with OE&rsquo;s
            biggest single-day delivery ever (41 events driven by geopolitical
            events) and a first 1:1 with Joe McPherson. From there: migration
            engineering moved from prototype to production architecture, CMS
            pricing was formally structured, first client demos were observed,
            and SE cadence with Devin was established.
          </p>

          {themes.map((theme, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                {theme.title}
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: "#6b7280",
                }}
              >
                {theme.text}
              </div>
            </div>
          ))}

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: "#9ca3af",
              marginTop: 24,
              fontStyle: "italic",
            }}
          >
            Note: Created in tandem with AI to summarize meeting notes. Every
            line read and verified.
          </p>
        </div>

        {/* Day by Day */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Day by Day
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 20,
            }}
          >
            Click a day to expand meeting details.
          </p>
          {meetingData.map((day) => (
            <DaySection key={day.day} data={day} />
          ))}
        </div>

        {/* Looking Ahead */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Looking Ahead &mdash; Week 4
          </h2>
          {lookAheadItems.map((item, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#6b7280",
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* AI Disclaimer */}
        <div
          style={{
            fontSize: 12,
            color: "#b0b0b0",
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
            marginBottom: 8,
            lineHeight: 1.6,
          }}
        >
          Note: This report was created in tandem with AI to help summarize
          and organize meeting notes. I have read every line and verified its
          accuracy. Please feel free to reach out with any questions.
        </div>

        {/* Comments */}
        <Comments />

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 20,
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10.5,
            color: "#c0c0c0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span>Open Exchange &middot; Confidential</span>
          <span>Week 3 &middot; Mar 2&ndash;6, 2026</span>
        </div>
      </div>
    </div>
  );
}
