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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-5";

// ─── Themes Data ──────────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    title: "Q1 Close Sprint — 99% of Goal",
    text: "Monday's all-hands opened with EPAM ($152K new logo) and BMW ($100K+ retention). The team crossed 99% of quarterly goal live during Thursday's Zoom sync. IFRS pricing surfaced as an open issue — no one had formally discussed payment with Zoom. Alan confirmed OE should be paid and asked Mithun and Max to price it against the new structure so a PO can be closed directly with Zoom before quarter end.",
  },
  {
    title: "Zoom API Technical Gaps — Largely Resolved",
    text: "Thursday's technical sync with Fan and Vishnu (Zoom's API engineer) closed out most of the blockers flagged since Week 4. VTT captions, thumbnails, custom metadata, file upload hostname — all resolved. Open items: hub ID and channel ID (Zoom provisioning task) and rate limits (Vishnu's team confirming). Joe can start loading trial assets into the sandbox early next week once production APIs go live Monday.",
  },
  {
    title: "Integration Go-to-Market — Referral Model Confirmed",
    text: "Wednesday's Workato strategy call produced a clear decision: referral-not-MSP. OE recommends middleware (Workato, Zapier, Mulesoft, Boomi), refers clients who don't have it, earns commission, and does implementation inside the client's account. Amgen confirmed as first reference implementation. MemberClicks case surfaced — their API can't push data outward; OE can offer a managed ETL workaround as PS.",
  },
  {
    title: "Prospecting Tools Ship + Marketing Alignment",
    text: "Three tools now functional and demoed to stakeholders: ASCO pharma outreach tracker, Kristen ICP finder, and corp comms prospector. Wednesday's sync with Michael Morales locked in LinkedIn Sales Navigator admin access, Mailchimp access, and a biweekly marketing cadence starting April 1. The outreach vision: tools surface contacts and draft emails → Michael runs Mailchimp blasts for air coverage → reps do refined follow-up.",
  },
];

// ─── Look Ahead Data ──────────────────────────────────────────────────────────

const lookAheadItems: LookAhead[] = [
  {
    title: "March 24 NYC Cocktail Event — Zoom Sales Team",
    text: "Five Zoom salespeople confirmed attending. Alan to introduce Mithun to all of them. Daytime working sessions Tuesday (Mithun + Devin, ~11 AM) and Wednesday (WeWork with Devin, Bettina, Amelia, and other colleagues in town). First major in-person networking moment of the engagement with Zoom's sales team.",
  },
  {
    title: "IFRS Dry Run — April 1 Target",
    text: "Joe loading trial assets into sandbox early next week once March 23 production APIs go live. Hub ID and channel ID provisioning needed from Zoom before any uploads can happen. Best-case: 50–100 test assets loaded and assessed by end of next week. Fan's personal deadline: complete before April 10.",
  },
  {
    title: "Michael Stark + Ren (Zoom) — Integration Introductions",
    text: "Alan to send intro email this week. Mithun, Max, and Alex to set up time. Starting point for OE's integration partnership track at Zoom — understanding what connectors they document, what they've built, and where OE fits as the managed implementation layer.",
  },
  {
    title: "Zoom AE Teaching Session",
    text: "VJ confirmed interest in walking through the migration pricing one-pager with his sales team. Mithun and Max to present; Alan/Kara to intro. This is the moment the one-pager becomes an active selling tool in Zoom's hands.",
  },
  {
    title: "Camden BDR Onboarding",
    text: "Offer going out to Camden — 100% focused on Zoom partnership outreach. Once he starts, Mithun's prospecting tools become his primary target list generation engine. Worth thinking now about what a clean handoff of tool access looks like.",
  },
];

// ─── Meeting Data ─────────────────────────────────────────────────────────────

const meetingData: DayData[] = [
  {
    day: "Monday",
    date: "March 16",
    meetingCount: 1,
    meetings: [
      {
        title: "All-Hands Sales Kickoff",
        summary:
          "Big team standup to open the final two weeks of Q1. EPAM (~$152K, new logo) and BMW (existing $100K+ client retention) called out as standout events from the prior week. KPIs: 40 meetings set, 42 ops created ($402K total), close-one at $413K. Alan asked Mithun to share the migration pricing two-pager live — 6 open migration opportunities, 1,100 Zoom salespeople to train. Alan and Andrew publicly credited Mithun and Max for producing multiple iterations in ~2 days. Andrew flagged Mithun's corp comms prospecting engine. Kara surfaced ASCO pharma as an outreach opportunity — Alan asked Mithun and Michael Morales to build a target list.",
        angle:
          "Two public mandates from Alan in front of the full team — ASCO pharma list and corp comms prospecting engine. Migration one-pager presented live to 20+ salespeople at 5 weeks in is a significant visibility moment.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "March 17",
    meetingCount: 4,
    meetings: [
      {
        title: "CMS Migration Engineering Standup",
        summary:
          "Joe confirmed Kaltura extraction from trial account complete by EOD Friday — can begin loading into OE sandbox Zoom account early next week. Hub ID and channel ID still not confirmed by Zoom — primary blocker. Zoom walked back access to their staging environment. Anderson scope reduced to 19 videos (ON24 export limitations). Consensus: manual for this one. VJ flagged a pricing doc comment — some standard metadata items listed as extras. Quick fix.",
        angle:
          "Kaltura extraction done by EOD Friday is a major milestone — unblocks Joe to start loading into Zoom as soon as March 23 APIs drop. Hub ID/channel ID is the most concrete blocker.",
      },
      {
        title: "Natai Discovery Call (Shadow — Kristen)",
        summary:
          "Natai hosting a webinar April 9 to brief grantees on state contracting policy in Washington. Webinar format for security reasons. Q&A via written questions. Bilingual English/Spanish — human interpreters on separate audio channel plus Zoom AI captions. ~5 slides total. Recording needed. Dry run April 7. OE scope: 30-min pre-call day of, consultant assigned post-SOW. Key note: someone must be in the Spanish audio channel during the webinar for it to record properly.",
        angle:
          "Clean straightforward intake. Good opportunity to observe Kristen's discovery flow on a simple bilingual webinar engagement.",
      },
      {
        title: "Rental Housing Association Discovery Call (Shadow — Kristen)",
        summary:
          "California Rental Housing Association evaluating upgrade from Webinar 3000 to Events 3000. Two use cases: (1) member-facing virtual events — first mid-May, 4–6 hrs, multi-track, 15–40 sponsor expo booths; (2) online training program — monthly sessions, on-demand playback needed. Salesforce integration required — client works with Ridge Tech (Denver). Production Studio and backstage confirmed as main upgrade value. Pricing to Hillary by Thursday for her proposal deck.",
        angle:
          "Direct OE-Zoom co-sell — Hillary brought OE in as the production/onboarding layer. Salesforce integration requirement maps exactly to the Workato use case OE is developing.",
      },
      {
        title: "Amelia + Andrew Weekly Check-In",
        summary:
          "Andrew demoed the corp comms prospecting tool live — impressed. Needs Anthropic API credits from Alex (still pending). Amelia set explicit priority ordering: (1) corp comms prospecting for Andrew, (2) Zoom BD/migration support, (3) Salesforce/Workato integrations. Workato: Mithun walked through Amgen ask, flagged MCP angle — ~15 minutes per client with near-zero lift. Amelia asked for a proper walkthrough call. Zoom platform gaps: Mithun wants product enablement docs. Amelia: start with Josh (internal OE expert) first, then Tyler Brubach once Mithun is more prepared.",
        angle:
          "Most direct alignment session with leadership so far. Amelia gave explicit priority ordering and set clear expectations on the Tyler Brubach relationship — go prepared, not for Tyler to be educating OE.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "March 18",
    meetingCount: 5,
    meetings: [
      {
        title: "Salesforce/Ops Biweekly",
        summary:
          "Ali ran through everything shipped: capital markets monthly billing off child orders live; GCS trained on same flow; product roll-up removed; Pending Billing Review status now live; Event Run Smoothly changed to checkbox; Barclays Q&A fields added. In progress: NetSuite/Salesforce discrepancy report. Standalone add-on edge case fix coming. Strategic direction from Alan: Ali to shift focus to high-payoff items — NetSuite/Salesforce cleanup and OE Central rebuild. L1 tickets going to Diana and Eric.",
        angle:
          "Pending billing review rollout and GCS child order process directly affects how migration deals will be structured and billed once Anderson and IFRS close.",
      },
      {
        title: "Devin Weekly Check-In",
        summary:
          "Mithun demoed all three prospecting tools live. Mirofish (open-source intelligence swarm) demoed — IROs could dump their earnings script two weeks before results, run it through the swarm with retail investor agents, and preview market reaction. Devin immediately connected it to his retail investor idea. Devin showed Mithun how to add himself as Opportunity Team Member in Salesforce (role = Pre-Sales Engineer). NYC logistics confirmed: Tuesday pre-event meetup ~11 AM near 51 W 52nd St; Wednesday 10 AM–2 PM working session at WeWork. Devin invited Mithun to shadow his noon demo Thursday.",
        angle:
          "Mirofish is the most forward-looking product idea of the engagement — directly adjacent to Devin's retail investor thesis. Wednesday NYC working session is a high-value relationship moment with senior colleagues.",
      },
      {
        title: "Michael Morales Marketing Sync",
        summary:
          "First 1:1. Michael added Mithun as admin on LinkedIn Sales Navigator and user on Mailchimp. Mithun walked through all three prospecting priorities. Andrew's vision: tools surface contacts and draft emails, Michael runs Mailchimp blast for air coverage, reps do refined follow-up. Salesforce integration on hold — Ali is maxed out. Recurring biweekly Wednesday sync set starting April 1 (2 PM ET).",
        angle:
          "Sales Navigator admin access is a meaningful unlock. Mailchimp connection gives the prospecting work a real distribution channel. Michael closes the loop between lead gen tools and actual outreach execution.",
      },
      {
        title: "Workato/Integrations Strategy Call",
        summary:
          "Decision: referral-not-MSP. OE recommends Workato, refers clients, earns commission, does implementation inside client's account — no OE-owned sub-workspaces. Alan asked Mithun to build a middleware matrix (Workato, Zapier, Mulesoft, Boomi). Amgen confirmed as first reference implementation. Tyler responded live — suggested looping in Michael Stark and Ren (Zoom). Alan to intro Mithun, Max, Alex to them. Post-migration KPIs: Amelia flagged contact harvesting. Alan proposed $200 bonus to Mithun and Max per meeting generated from migration client contacts.",
        angle:
          "Referral-not-MSP is clean and correct for this stage. Middleware matrix is the next concrete deliverable. Post-migration contact harvesting monetizes the relationship capital OE builds during migrations.",
      },
      {
        title: "Workato + Integrations Deep Dive",
        summary:
          "Two live client cases. Amgen architecture clarified: OE's gap is website-to-Zoom (via Workato) — Zoom-to-Salesforce Lightning connector may already exist, and Epsilon (Amgen's Salesforce partner) may handle the SFMC layer. Much smaller lift than scoped. MemberClicks case: Zoom's API expects data pushed into it, but MemberClicks can't expose its API to push outward — native integration not possible. OE can offer a managed ETL workaround via Zapier. Both flagged need for a standard integration intake checklist.",
        angle:
          "Amgen is simpler than it looked. The MemberClicks case is a perfect example of why the intake checklist matters — chasing the wrong problem for weeks because the root cause was never surfaced early.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "March 19",
    meetingCount: 6,
    meetings: [
      {
        title: "Zoom Partnership Weekly Sales Sync",
        summary:
          "Team at 98% of quarterly goal at start, hit 99% live during the call. Kristen: $13K committed + upsell play on Conservative Equity Management ($14K–$30K upside). Peter: ~$17K committed. Kara: done for the quarter. IFRS pricing surfaced — no one had formally discussed payment with Zoom. Alan confirmed OE should be paid; Max and Mithun to price against new structure. Zoom partner portal: OE approved, up to 15 seats. CMS training sessions flagged — Orin (Zoom) said clients already asking. BDR hire: offer going out to Camden (Chicago, 100% Zoom partnership outreach); Theo likely full-time in June.",
        angle:
          "Three direct ownership items: (1) price out IFRS, (2) continue ASCO tool with Kara/Kaylee's event-type input, (3) get added to Zoom partner portal. Camden BDR will eventually need Mithun's prospecting tool for target list generation.",
      },
      {
        title: "Zoom API Technical Sync — Fan + Vishnu (Zoom Engineering)",
        summary:
          "Fan brought in Vishnu live — most productive Zoom technical sync of the engagement. Resolved: custom metadata (name-value JSON pairs keyed to Kaltura profile ID); VTT captions (convert everything to WebVTT); thumbnails (if no explicit default in Kaltura, use first frame); empty media entries (captured in ledger with 'no media' reason); file upload hostname (multipart uploads over 2GB use fileapi.zoom.us, all metadata patches use api.zoom.us). Open: hub ID and channel ID — Zoom provisioning task. Rate limits: ~10 requests/minute for some endpoints, up to 30,000/day. Fan's personal deadline: complete before April 10. Vishnu added to Slack channel.",
        angle:
          "This call closed out most API gaps blocking the IFRS dry run. The only true blocker remaining is hub ID/channel ID — a provisioning task, not an engineering problem. Joe's pipeline is further along than the team realized.",
      },
      {
        title: "Kara Discovery — Joe, IT Director (Shadow)",
        summary:
          "Client purchased Webinars Plus after CEO asked why their monthly all-hands couldn't look as polished as a produced event he'd seen. CEO is an audiophile/videophile — wants scene-switched production with lower thirds. Just spent $60K redoing NYC office AV after original install kept failing mid-call. New offices opening in DC, SF, and Seattle — all will get the same all-hands system. Next event March 26, 9 AM PT. Kara confirmed staffing available during call. Quote to go out same day.",
        angle:
          "Classic Production Studio use case. The 'expanding offices with same AV system' detail is a future multi-site opportunity worth flagging for the sales team.",
      },
      {
        title: "Kara Discovery — Learning Series Template Build (Shadow)",
        summary:
          "Returning client already working with OE on a separate May event. Recurring learning series run twice a year (August + fall), 6 sessions of 90 minutes each. April run possible if a pending contract executes. No live event support needed — just Zoom Events template build so they can run it themselves. Each session recorded for on-demand access. Client described OE as the best experience they've had across multiple LMS vendors over the years.",
        angle:
          "Clean repeat client, fast call. The on-demand playback requirement is a Zoom Events CMS-adjacent use case — the same content library infrastructure that enables migration clients also enables this kind of post-event access.",
      },
      {
        title: "Kara Discovery — June 3 Multi-Session Event (Shadow)",
        summary:
          "Client has purchased Zoom Events and done some training with David. June 3 event: 1 day, 4 hours, 8 sessions, most or all pre-recorded, 4 sponsor expo booths, 2 concurrent breakout sessions at start, possible single live keynote. Two quotes requested: (1) OE fully builds out the platform + trains in tandem; (2) OE reviews their own build + day-of support for first 2–2.5 hours. Client leaning toward option 2.",
        angle:
          "Repeat/expansion client. Short call, clean scope. Kara's pattern of quoting fast and committing to timelines is the right move with clients who have already made the platform decision.",
      },
      {
        title: "Kara Post-Call Debrief",
        summary:
          "Brief debrief after the three shadow calls. Kara walked through her quoting math — day-of event support priced at 2 ops × hours × $250/hr. She uses Zoom's AI notetaker to capture call notes. Mithun confirmed he's comfortable shadowing future calls and will serve as technical expert when needed rather than pitching.",
        angle:
          "The $250/hr × ops × hours pricing model is a useful anchor for scoping day-of support. Kara's efficient three-call afternoon is a good model — keep calls short, quote fast, move on.",
      },
    ],
  },
  {
    day: "Friday",
    date: "March 20",
    meetingCount: 1,
    meetings: [
      {
        title: "EDC Brooklyn Marine Terminal Discovery Call (Shadow — Kara)",
        summary:
          "NYC Economic Development Corporation, Brooklyn Marine Terminal project. Del just signed a Zoom Events contract through Zimprect. Two-tier audience: task force stakeholders (panelists) plus general public (observational only). After opening plenary, splits into breakout rooms maintaining the same webinar format. All sessions must be recorded and transcribed (open meetings law). Tentative date March 27, possibly pushed one week. Kara confirmed Zoom Events (multi-session) is the correct platform — cloud recording and transcript available for all sessions. Kara flagged that client already has WXY (external consultant) hired — sensibly noted OE may not be needed at all if WXY covers the full Zoom Events setup.",
        angle:
          "Good example of Kara not overselling — explicitly told the client OE might not be needed if WXY covers it. The open meetings compliance requirement (mandatory cloud recording for all breakout rooms) is exactly what differentiates Zoom Events from a standard webinar setup.",
      },
    ],
  },
];

// ─── TTS Script ───────────────────────────────────────────────────────────────

const ttsScript = `Week 5 report. March 16 through 20, 2026. Mithun Manjunatha, Sales Engineer.

Week 5 was the most operationally dense week of onboarding. Q1 closed at 99 percent with two weeks of pipeline activity compressing into a single sprint, the Zoom API technical gaps blocking the IFRS dry run were largely resolved in a live call with Zoom's engineer Vishnu, and OE's integration go-to-market strategy crystallized around a referral model. Mithun shipped three prospecting tools, got access to LinkedIn Sales Navigator and Mailchimp, established a recurring sync with marketing, and shadowed five client-facing calls across two AEs. The March 24 NYC cocktail event with Zoom's sales team loomed at week's end as the first major in-person networking moment of the engagement.

Theme one: Q1 Close Sprint, 99 percent of goal. Monday's all-hands opened with EPAM at 152 thousand as a new logo and BMW client retention. The team crossed 99 percent of quarterly goal live during Thursday's Zoom sync. IFRS pricing surfaced as an open issue.

Theme two: Zoom API Technical Gaps, largely resolved. Thursday's technical sync with Fan and Vishnu closed out most of the blockers. VTT captions, thumbnails, custom metadata, and file upload hostname all resolved. Open items: hub ID and channel ID.

Theme three: Integration Go-to-Market, Referral Model Confirmed. Wednesday's Workato strategy call produced a clear decision: referral-not-MSP. Amgen confirmed as first reference implementation.

Theme four: Prospecting Tools Ship. Three tools now functional: ASCO pharma outreach tracker, Kristen ICP finder, and corp comms prospector. LinkedIn Sales Navigator admin access and Mailchimp access secured.

Looking ahead: NYC cocktail event March 24, IFRS dry run targeting April 1, Michael Stark and Ren introductions from Alan, Zoom AE teaching session, and Camden BDR onboarding.`;

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
    idle: "▶",
    loading: "⏳",
    playing: "⏸",
    paused: "▶",
    error: "⚠",
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
    { value: "20", label: "Meetings" },
    { value: "20", label: "People Met" },
    { value: "5", label: "Days" },
    { value: "4", label: "Themes" },
  ];

  const meetingsByDay = [
    { day: "Mon", count: 1 },
    { day: "Tue", count: 4 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 6 },
    { day: "Fri", count: 1 },
  ];

  const meetingTypes = [
    { type: "Shadow / Discovery", count: 5, color: "#008285" },
    { type: "Internal Sync", count: 7, color: "#8b5cf6" },
    { type: "1:1 Check-In", count: 4, color: "#0ea5e9" },
    { type: "Engineering", count: 2, color: "#f59e0b" },
    { type: "Strategy", count: 2, color: "#ec4899" },
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
          Week 5 Analytics
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          {isExpanded ? "collapse ▲" : "expand ▼"}
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

          {/* Q1 Sprint callout */}
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
              Q1 Close Snapshot
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.6,
              }}
            >
              99% of quarterly goal hit live on Thursday · 3 prospecting tools shipped ·
              Zoom API unblocked · Referral GTM confirmed
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
              ›
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

export default function WeekFiveReport() {
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
              href="/weekly_report_week5.pdf"
              download="OE_Week5_Report.pdf"
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
            Week 5
          </h1>
          <div style={{ fontSize: 15, color: "#9ca3af", marginBottom: 4 }}>
            March 16&ndash;20, 2026
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
            { label: "Meetings", value: "20" },
            { label: "Days", value: "5" },
            { label: "Themes", value: "4" },
            { label: "Onboarding Week", value: "5 of 6" },
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
            Week 5 was the most operationally dense week of onboarding &mdash; Q1
            closed at 99%+ with two weeks of pipeline activity compressing into a single
            sprint, the Zoom API technical gaps blocking the IFRS dry run were largely
            resolved in a live call with Zoom&rsquo;s engineer Vishnu, and OE&rsquo;s
            integration go-to-market strategy crystallized around a referral-not-MSP
            model. Mithun shipped three prospecting tools, got access to LinkedIn Sales
            Navigator and Mailchimp, established a recurring sync with marketing, and
            shadowed five client-facing calls across two AEs. The March 24 NYC cocktail
            event with Zoom&rsquo;s sales team loomed at week&rsquo;s end as the first
            major in-person networking moment of the engagement.
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
            Looking Ahead &mdash; Week 6
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
          <span>Week 5 &middot; March 2026</span>
        </div>
      </div>
    </div>
  );
}
