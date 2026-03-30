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
  angle?: string;
}

interface DayData {
  day: string;
  date: string;
  meetingCount: number;
  meetings: Meeting[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-6";

// ─── Themes Data ──────────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    title: "IFRS Migration Goes Live with the Client",
    text: "The IFRS client team joined a call with OE directly for the first time. Fan confirmed all Zoom APIs released to AEM. Ryan upgraded Max's Kaltura role live on the call. A critical blocker surfaced mid-week: IFRS's Kaltura account (Partner ID 179) is too old to generate an App Token without a Kaltura support ticket from Ryan. Joe's engineering pipeline is internally ahead of schedule with byte-for-byte validation and transformed JSON ready for loading.",
  },
  {
    title: "Migration Pricing Endorsed by Zoom VP",
    text: "Friday's pricing walkthrough with VJ (Zoom VP/GM), Alan, Fan, Farah, Brian Kramer, Ren, and Ryan was the moment the migration practice went from 'thing OE and Fan are building' to 'thing Zoom's sales team knows how to sell.' VJ confirmed the pricing is clear and easy to explain. Key outputs: mark the doc 'Zoom Internal,' add migrations to OE's existing Zoom AE referral funnel, and create a shared living document for customer patterns.",
  },
  {
    title: "Zoom Integrations Education Begins",
    text: "First formal education session with Ren, Zoom's product owner for all connectors (HubSpot, Marketo, Pardot, Eloqua/Salesforce), email builder, page builder, analytics, and AI features. Ren has step-by-step internal guides with screenshots that are legal-approved for sharing. Plan: OE sets up HubSpot dev accounts, schedules deeper recorded training. Ren owns significant AI pipeline for post-event content repurposing and ROI reporting.",
  },
  {
    title: "NYC Networking and Relationship Building",
    text: "The IR Impact Awards cocktail event exceeded expectations with ~150 attendees (venue capacity ~90). Mithun met Mark, Alan, Devin, Amelia, Brian Kramer, Renee, and several Zoom sales team members in person for the first time. Mark expressed strong excitement about the migration practice and AI transcription value-add vision. Wednesday was an internal development day with an in-person WeWork session with Devin.",
  },
];

// ─── Look Ahead Data ──────────────────────────────────────────────────────────

const lookAheadItems: LookAhead[] = [
  {
    title: "IFRS App Token Blocker",
    text: "Ryan must submit a Kaltura support ticket for Partner ID 179 App Token. Ryan is unavailable April 10-17, making this time-sensitive. The playbook for getting it unblocked is clear but execution depends on Kaltura support response time.",
  },
  {
    title: "Veltris Team Onboarding",
    text: "Joe kickoff Monday, Mithun + Max intro Wednesday. This is the moment the migration practice starts scaling beyond Joe. Swim lanes confirmed: Veltris handles execution, Max manages projects, Mithun is the SE layer.",
  },
  {
    title: "HubSpot Developer Accounts",
    text: "Set up free developer accounts, connect to Zoom license, schedule deeper training with Ren. HubSpot is the most common integration, followed by Marketo and Pardot.",
  },
  {
    title: "IFRS Commercial Close",
    text: "Amelia to reach out to Rajul for commercial terms. Peter needs this to close before Q1 ends. Migration pricing ~$10K is in Peter's pipeline.",
  },
  {
    title: "Camden BDR Start",
    text: "Starts April 13th. Prospecting tools become his primary lead generation engine. Worth thinking now about what a clean handoff of tool access looks like.",
  },
  {
    title: "Migration Pricing Distribution",
    text: "Mark as 'Zoom Internal,' add to AE referral funnel, create shared living doc. VJ's endorsement is the unlock for broader Zoom sales adoption.",
  },
];

// ─── Meeting Data ─────────────────────────────────────────────────────────────

const meetingData: DayData[] = [
  {
    day: "Monday",
    date: "March 23",
    meetingCount: 2,
    meetings: [
      {
        title: "Weekly GCS Sales Pipeline Review",
        summary:
          "Final Monday standup of Q1 with two weeks left on the clock. GCS at 107% of target \u2014 16 meetings set, $184K added to pipe. Standouts: Jamie (Delivery Hero, Lenovo, Glencore from the beach), Garrett (Global Payments with OE Meet component), CJ (Genius Sports $5K), Kaylee (Albemarle OE Meet $2K), Jacob (Altria \u2014 10-month pursuit finally closed), Jules ($15K EPAM add-on, bringing that engagement to ~$165K total). Total: $108K added. GCS running at ~$1.45M against a $1.35M target with ~$100\u2013150K more expected before Tuesday close. Christian flagged a major new opportunity: Delivery Hero's 15th anniversary employee summit in Berlin \u2014 3,000 on campus, 900 seated across three concurrent stages, OE Studio + Passport, estimated $100K+ deal. Peter: four in contracting \u2014 IFRS migration ~$10K, GSK $7K, French pharmacy $9.3K, plus proposals at $56K, $63K, $6K, $48K. BDR Camden starts April 13th.",
        angle:
          "The IFRS migration appearing in Peter's pipeline as a ~$10K close this week is the moment Mithun and Max's backend work becomes a real revenue line item.",
      },
      {
        title: "Zoom Video SDK Migration & Pricing \u2014 Max Daily Sync",
        summary:
          "IFRS pricing: Max pulled account data \u2014 49TB stored media, relatively simple migration. Pricing model: ~$10\u201310.5K. Agreed on three-step sequencing: (1) internal pricing sync Wednesday, (2) confirm with Zoom who handles pricing (Fan technical, probably Rajul commercial), (3) back to Peter with final number. MemberClicks: discovery call with client first, no promises. Amgen went quiet. Ren from Zoom confirmed for Thursday 5:00 PM ET for integrations call. Anderson: still not formally signed.",
        angle:
          "IFRS three-step process is correct sequencing. MemberClicks conclusion (discovery first) is mature.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "March 24",
    meetingCount: 3,
    meetings: [
      {
        title: "Open Exchange API Dry Run Planning \u2014 IFRS Client Call",
        summary:
          "First formal call with the IFRS client team \u2014 Fan, Ryan, Lindsay, Steve + others, Zoom India engineering. Fan confirmed all Zoom APIs released to AEM. Dry run scope: 11 pieces of content hand-picked by Fan covering every edge case (multiple captions, multiple thumbnails, no captions, long-duration board meetings including 10-hour videos). Ryan upgraded Max's Kaltura role to Publisher Admin live on the call. Categories: IFRS has up to 4-level nested in Kaltura, decision: flatten all to top-level. Player profiles: three Kaltura profiles, document all three, replicate what's possible, flag gaps. Ryan unavailable April 10\u201317.",
        angle:
          "First time IFRS client on a call with OE directly. Key unblocked: Ryan upgraded Max's Kaltura access live. 'Flatten categories' removes major scoping ambiguity.",
      },
      {
        title: "Kaltura-to-Zoom Migration Review \u2014 Internal Debrief",
        summary:
          "Immediate internal debrief after IFRS call. Joe: internally ahead of schedule, pipeline fully observable through AWS-based ledger tracking every entity through stages. Critical new blocker: IFRS's Kaltura Partner ID 179 is so old that App Token creation doesn't exist in their KMC. Ryan needs to submit a Kaltura support ticket. Entitlement flag: any account using access control needs entitled_ prefix. Caption format: upload both WebVTT and SRT. Pricing: 49TB, basic complexity \u2192 $10\u201310.5K.",
        angle:
          "App Token blocker for IFRS (Partner 179 too old) is the new critical path item \u2014 completely outside OE's control.",
      },
      {
        title: "IR Impact Awards Cocktail Event",
        summary:
          "OE-hosted reception at IR Impact Awards. ~150 people attended, venue only held ~90 \u2014 significantly exceeded expectations. Mithun met Mark, Alan, Devin, Amelia, Brian Kramer (Zoom), Renee, and several Zoom sales team members in person for the first time. Mark expressed strong excitement about the migration practice and AI transcription value-add vision.",
        angle:
          "First major in-person networking moment. Mark's excitement about migration + AI transcription validates the strategic direction.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "March 25",
    meetingCount: 1,
    meetings: [
      {
        title: "Zoom Platform Training + Sales Ops Development",
        summary:
          "Internal development day \u2014 Zoom platform training ahead of Friday's calls, continued build-out of sales ops prospecting tools (ASCO pharma tracker, ICP finder, corp comms prospector). In-person WeWork working session with Devin (10 AM\u20132:30 PM) \u2014 cocktail event debrief, Mirofish retail investor concept review.",
        angle:
          "Days like this matter \u2014 the Friday calls were smoother because of the preparation done here.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "March 26",
    meetingCount: 4,
    meetings: [
      {
        title: "Kaltura-to-Zoom Migration Review \u2014 Joe Debrief",
        summary:
          "Full pipeline walkthrough. Internally in fantastic shape \u2014 as long as Zoom's APIs work, they're ready. Ledger: every Kaltura entity tracked through stages with byte-for-byte validation. Transformed JSON ready for loading \u2014 title, tags, flattened categories, caption language codes, thumbnails. Upload flow: upload media \u2192 receive Zoom file ID \u2192 patch metadata separately. Veltris team now onboarded \u2014 tech lead PM + two developers. Joe to do kickoff Monday, Mithun + Max intro Wednesday.",
        angle:
          "Veltris intro next week is the moment the migration practice starts scaling beyond Joe.",
      },
      {
        title: "Sales Team Deal Review",
        summary:
          "Q1 final days review. Kristen: HealthEdge $23K, Christina Care signed, Northwell Health $6,200. Kara: APAC pricing question for Australian nonprofit. Peter: Genius Sports six-pack, French pharmacy ~$10K approved but slow. BDR Camden starts April 13th. Zoom terms of service confirmed finalized.",
        angle:
          "Camden's April 13th start date is when Mithun's prospecting tools get a dedicated outbound user.",
      },
      {
        title: "Opportunity Dashboard & Data Lake Access \u2014 Ali 1:1",
        summary:
          "First 1:1 with Ali (Product, 5.5 years at OE). Two asks: (1) Salesforce opportunity tagging \u2014 Ali to provision Opportunity Team Member self-tagging permission, (2) data lake for prospecting tools. Ali walked through Workbench tool with Claude-generated SOQL queries. Filter for 'not a customer' = accounts with zero orders. Ali enabled SSO on Mithun's Salesforce account. Workflow: Claude generates SOQL \u2192 Workbench \u2192 CSV \u2192 prospecting tools.",
        angle:
          "Workbench + SOQL + Claude workflow unlocks clean prospect lists without needing Ali's time for every query.",
      },
      {
        title: "Zoom Migration Pricing and Partner Portal \u2014 Max Daily Sync",
        summary:
          "App Token blocker confirmed: IFRS Partner ID 179 too old, KMC has no Application Tokens tab. Fix requires Ryan to submit Kaltura support ticket. Mithun re-registered in Zoom partner portal. Migration pricing walkthrough prep aligned. Mark's AI transcription idea from cocktail event surfaced. Zoom MCP flagged: Mithun can MCP into Zoom to manage settings \u2014 Max immediately saw application for delivery ops. Veltris swim lanes confirmed: Veltris handles execution, Max manages projects, Mithun is SE layer.",
        angle:
          "App Token blocker now fully understood and documented. Zoom MCP discovery is tactically interesting for delivery ops.",
      },
    ],
  },
  {
    day: "Friday",
    date: "March 27",
    meetingCount: 2,
    meetings: [
      {
        title: "Zoom Integration Training with Open Exchange",
        summary:
          "First formal education session with Ren, Zoom's product owner for all connectors (HubSpot, Marketo, Pardot, Eloqua/Salesforce), email builder, page builder, analytics, and AI features. HubSpot most common, Marketo second, Pardot third. HubSpot free developer accounts available; Marketo costs ~$2,500/yr via Adobe partner program. Ren has step-by-step internal guides with screenshots \u2014 legal-approved for sharing. Plan: OE sets up HubSpot dev accounts, schedules deeper recorded training. Common friction: authentication, external registration misconfigs, sandbox vs. production confusion. Ren owns significant AI pipeline \u2014 post-event content repurposing and ROI reporting.",
        angle:
          "Ren is the product relationship OE needed. His internal guides will meaningfully upskill the delivery team.",
      },
      {
        title: "OpenExchange Zoom Migration Pricing Review",
        summary:
          "First formal walkthrough of OE migration pricing one-pager with Zoom sales team. Attendees: Max, Mithun, Alan, VJ (Zoom VP/GM), Fan, Farah, Brian Kramer, Ren, Ryan. Mithun opened with moving-van framing. Simple migration starts at $9,600, complex at $21,600, typical range $9K\u2013$25K. VJ confirmed it's clear and easy to explain. Key outputs: mark doc 'Zoom Internal,' add migrations to OE's existing Zoom AE referral funnel, create shared living document for customer patterns. VJ flagged S3-to-S3 migration flow Zoom is building. Content cleansing debate: Alan and Brian both lean toward migrating first, then using AI tools to audit and clean.",
        angle:
          "This call is the moment the migration practice goes from 'thing OE and Fan are building' to 'thing Zoom's sales team knows how to sell.' VJ's endorsement is the unlock.",
      },
    ],
  },
];

// ─── TTS Script ───────────────────────────────────────────────────────────────

const ttsScript = `Week 6 report. March 23 through 27, 2026. Mithun Manjunatha, Sales Engineer.

Week 6 was the week the migration practice became real in three simultaneous ways: Peter was trying to close the IFRS deal from the sales side, the IFRS client team came onto a call with OE directly for the first time, and Joe's engineering pipeline was quietly ahead of schedule. A critical blocker surfaced mid-week: IFRS's Kaltura account, Partner ID 179, is too old to generate an App Token without a Kaltura support ticket from Ryan. By Friday, the migration pricing one-pager had been formally presented to Zoom's sales team with VJ's endorsement, and OE's integration practice got its first real product-level education session with Ren from Zoom's product team.

Theme one: IFRS Migration Goes Live with the Client. The IFRS client team joined a call with OE directly for the first time. Fan confirmed all Zoom APIs released. Ryan upgraded Max's Kaltura role live. A critical blocker surfaced: Partner ID 179 is too old for App Token generation.

Theme two: Migration Pricing Endorsed by Zoom VP. Friday's pricing walkthrough with VJ, Alan, Fan, and the broader Zoom team was the unlock moment. VJ confirmed the pricing is clear and easy to explain. Key outputs: mark the doc Zoom Internal, add to AE referral funnel, create shared living document.

Theme three: Zoom Integrations Education Begins. First formal education session with Ren, Zoom's product owner for all connectors. HubSpot most common, Marketo second. Ren has internal guides legal-approved for sharing.

Theme four: NYC Networking and Relationship Building. The cocktail event exceeded expectations with 150 attendees. Mark expressed strong excitement about the migration practice and AI transcription vision.

Looking ahead: IFRS App Token blocker needs Ryan's Kaltura support ticket. Veltris onboarding starts scaling the migration practice beyond Joe. HubSpot developer accounts and deeper Ren training. Camden BDR starts April 13th. Migration pricing to be marked Zoom Internal and added to AE referral funnel.`;

// ─── Comments Component ───────────────────────────────────────────────────────

function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (stored) setComments(JSON.parse(stored));
    const savedName = localStorage.getItem("oe-hub-comment-name");
    if (savedName) setAuthorName(savedName);
  }, []);

  return (
    <div style={{ marginTop: 40 }}>
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.02em",
          marginBottom: 20,
        }}
      >
        Comments
      </h2>

      {comments.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid #f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {c.author}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#d1d5db",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {c.timestamp}
                </span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#6b7280",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {c.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #f0f0f0",
          borderRadius: 10,
          padding: "20px 24px",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              fontSize: 10,
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
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              fontSize: 10,
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
            localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(newComments));
            localStorage.setItem("oe-hub-comment-name", authorName.trim());
            setCommentText("");
          }}
          disabled={!authorName.trim() || !commentText.trim()}
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "system-ui, sans-serif",
            color: authorName.trim() && commentText.trim() ? "#fff" : "#9ca3af",
            background: authorName.trim() && commentText.trim() ? "#008285" : "#f3f4f6",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            cursor: authorName.trim() && commentText.trim() ? "pointer" : "default",
            transition: "all 0.15s",
          }}
        >
          Post Comment
        </button>
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
  const ttsInstanceRef = useRef<unknown>(null);

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
      // @ts-expect-error - kokoro-js loaded dynamically via CDN/wasm
      const { KokoroTTS } = await import(/* webpackIgnore: true */ "kokoro-js");

      if (!ttsInstanceRef.current) {
        ttsInstanceRef.current = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-v1.0-ONNX",
          { dtype: "q8", device: "wasm" }
        );
      }

      // @ts-expect-error - dynamic instance
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setStatus("error");
      setErrorMessage(msg);
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
            ? () => { setStatus("idle"); setErrorMessage(""); }
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
    { value: "10", label: "Meetings" },
    { value: "25+", label: "People Met" },
    { value: "5", label: "Days" },
    { value: "4", label: "Themes" },
  ];

  const meetingsByDay = [
    { day: "Mon", count: 2 },
    { day: "Tue", count: 3 },
    { day: "Wed", count: 1 },
    { day: "Thu", count: 4 },
    { day: "Fri", count: 2 },
  ];

  const meetingTypes = [
    { type: "Engineering / Migration", count: 3, color: "#008285" },
    { type: "Sales Pipeline", count: 3, color: "#8b5cf6" },
    { type: "1:1 / Daily Sync", count: 2, color: "#0ea5e9" },
    { type: "Networking Event", count: 1, color: "#f59e0b" },
    { type: "Product Training", count: 1, color: "#ec4899" },
  ];

  const maxCount = Math.max(...meetingsByDay.map((d) => d.count));

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
          Week 6 Analytics
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          {isExpanded ? "collapse \u25B2" : "expand \u25BC"}
        </span>
      </div>

      {isExpanded && (
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #f0f0f0",
            borderRadius: 12,
            padding: "24px",
          }}
        >
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
                      width: `${(item.count / maxCount) * 100}%`,
                      height: "100%",
                      background: "#008285",
                      borderRadius: 4,
                      opacity: 0.4 + (item.count / maxCount) * 0.6,
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

          {/* Week Highlight callout */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0f0f0",
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#008285",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 4,
              }}
            >
              Week 6 Highlight
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.6,
              }}
            >
              Migration pricing endorsed by Zoom VP VJ &middot; IFRS client on first
              direct OE call &middot; Ren integration training begins &middot; 150+
              at cocktail event
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
              {data.meetingCount} meeting{data.meetingCount !== 1 ? "s" : ""}
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
              &rsaquo;
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
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
                  marginBottom: meeting.angle ? 8 : 0,
                }}
              >
                {meeting.summary}
              </div>
              {meeting.angle && (
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "#008285",
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic",
                  }}
                >
                  SE angle: {meeting.angle}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function WeekSixReport() {
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
              textDecoration: "none",
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
              href="/weekly_report_week6.pdf"
              download="OE_Week6_Report.pdf"
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
            Week 6
          </h1>
          <div style={{ fontSize: 15, color: "#9ca3af", marginBottom: 4 }}>
            March 23&ndash;27, 2026
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
            { label: "Meetings", value: "10" },
            { label: "Days", value: "5" },
            { label: "Themes", value: "4" },
            { label: "Onboarding Week", value: "6 of 6" },
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
            Week 6 was the week the migration practice became real in three
            simultaneous ways: Peter was trying to close the IFRS deal from the
            sales side, the IFRS client team came onto a call with OE directly
            for the first time, and Joe&rsquo;s engineering pipeline was quietly
            ahead of schedule. A critical blocker surfaced mid-week &mdash;
            IFRS&rsquo;s Kaltura account (Partner ID 179) is too old to generate
            an App Token without a Kaltura support ticket from Ryan &mdash; but
            the playbook for getting it unblocked is clear. By Friday, the
            migration pricing one-pager had been formally presented to
            Zoom&rsquo;s sales team with VJ&rsquo;s endorsement, and
            OE&rsquo;s integration practice got its first real product-level
            education session with Ren from Zoom&rsquo;s product team. The week
            closed with the migration and integration businesses both visibly
            further along than they started.
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
              marginBottom: 4,
            }}
          >
            Day by Day
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 16,
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
            Looking Ahead &mdash; Week 7
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
          Note: This report was created in tandem with AI to help summarize and organize
          meeting notes. I have read every line and verified its accuracy. Please feel
          free to reach out with any questions.
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
          <span>Open Exchange &mdash; Confidential</span>
          <span>Week 6 &middot; March 2026</span>
        </div>
      </div>
    </div>
  );
}
