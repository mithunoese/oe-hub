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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-2";

// ─── Themes Data ──────────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    title: "The Zoom Partnership Is the Growth Engine",
    text: "Every team talks about Zoom. The certified partner program is taking shape, the support line pilot is being stood up, and the sales pipeline is building momentum. The SE role plugs in directly here.",
  },
  {
    title: "Migration Is a Repeatable Opportunity",
    text: "Kaltura, ON24, Notified \u2014 clients are coming off legacy platforms and need help getting to Zoom. I built a migration prototype this week and showed it to four people. The reaction was consistently positive. There\u2019s an opportunity to turn migration from a custom project into a scalable service.",
  },
  {
    title: "The Institutional Business Runs on Relationships",
    text: "Almost everyone on the institutional side came from the client side at banks. Gib, Naomi, Britt, Candice \u2014 they\u2019re consultants who became salespeople. The depth of those relationships is what makes OE\u2019s institutional business defensible.",
  },
  {
    title: "AI Adoption Is Happening Organically",
    text: "Joe built 12\u201313 meetings in minutes with Claude. Connor is automating Computershare spreadsheets with Cowork. Power BI templates are scaling. Amelia wants to run AI prompts against 7,000 target companies for prospecting. The appetite is real \u2014 the tooling and governance just need to catch up.",
  },
];

// ─── Look Ahead Data ──────────────────────────────────────────────────────────

const lookAheadItems: LookAhead[] = [
  {
    title: "Zoom Partnership Deep Dive",
    text: "Weeks 3\u20134 shift focus to the Zoom partnership. Looking to get introduced to Tyler Brubach and start shadowing Max and Kara on Zoom sales calls.",
  },
  {
    title: "Migration Prototype \u2014 Live Test",
    text: "Max is working on getting real Kaltura API credentials. Goal is to run the prototype against actual client video content and validate end-to-end.",
  },
  {
    title: "SE Function Build-Out with Devin",
    text: "In-person meetup planned for March 5 in midtown. Starting on the SE Confluence page, golden demo framework, and structured product feedback loops.",
  },
  {
    title: "Relationship Building",
    text: "Following Andrew\u2019s advice: 1\u20132 salespeople per week for intro calls. Starting with Gib Smith on the institutional side.",
  },
];

// ─── Meeting Data ─────────────────────────────────────────────────────────────

const meetingData: DayData[] = [
  {
    day: "Monday",
    date: "February 23",
    meetingCount: 9,
    meetings: [
      {
        title: "Jefferies Reports Check-In with Connor",
        summary:
          "Connor walked through an ongoing Jefferies data issue. Their reporting feed broke because their internal system changed field formatting without notifying OE. The broader issue: OE has no automated validation layer \u2014 when a client\u2019s upstream data changes, OE finds out when reports break, not before.",
      },
      {
        title: "Conor <> Nick \u2014 Integration Status Review",
        summary:
          "Integration status review across multiple clients. Most integration delays come from the client side (credentials, whitelisting, internal approvals) rather than OE\u2019s engineering capacity.",
      },
      {
        title: "Delivery Manager Weekly",
        summary:
          "Busy week for the delivery team with east coast weather disruptions. Grinders earnings event streaming live to CEO\u2019s social media (Robert flagged social media streaming as a potential new product bundle, ~$2K extra). Zoom Backstage being evaluated.",
      },
      {
        title: "Connor 1:1 \u2014 Product Walkthrough",
        summary:
          "Connor clarified his role \u2014 he owns all product development and integration engineering. Walked through the product architecture, how OE Central, Passport, and the backend services connect.",
      },
      {
        title: "OpEx-NRS \u2014 Net Roadshow Partnership Call",
        summary:
          "CEO-driven intro between OE and Net Roadshow. Two companies exploring partnership around investor access events. Early stage but could be a meaningful channel partnership.",
      },
      {
        title: "Andersen Discovery Call",
        summary:
          "Andersen Consulting is coming off ON24 \u2014 contract expires March 31. They want to migrate ~35\u201338 recorded webcasts to Zoom Webinars Plus. Key concern: maintaining existing registration workflow and analytics.",
      },
      {
        title: "March Investor Access \u2014 S&P Integration Walkthrough",
        summary:
          "Onboarding/kickoff call for S&P\u2019s March investor access conference. Detailed integration scoping \u2014 how OE Central handles multi-day conference configurations, speaker management, and registration flows.",
      },
      {
        title: "Andersen Debrief",
        summary:
          "Internal debrief after the discovery call. Max, Kara, Kristen and I worked through what Zoom CMS can actually deliver vs. what Andersen needs. Identified gaps in the on-demand content management workflow.",
      },
      {
        title: "Max Debrief + Kara Follow-Up",
        summary:
          "End of day debrief with Max covering a NYC conference integration, Zoom CMS nuances, and follow-ups from the day\u2019s calls.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "February 24",
    meetingCount: 4,
    meetings: [
      {
        title: "Jefferies Data Discussion \u2014 Follow-Up",
        summary:
          "Continued from Monday\u2019s data issue. Good exposure to the debugging process and how OE\u2019s integration layer handles edge cases when client systems change without notice.",
      },
      {
        title: "Mark Lehrman 1:1 \u2014 Meet the CEO",
        summary:
          "Introductory call with Mark. He walked through OE\u2019s history \u2014 from the pandemic-era virtual events boom through Zoom\u2019s evolution. Mark\u2019s vision for migration as a marketplace opportunity was clear. He sees OE as the connective tissue between legacy platforms and Zoom\u2019s ecosystem.",
      },
      {
        title: "Weekly Internal Zoom CMS/VM Migration Check-In",
        summary:
          "Internal working session on Zoom CMS and video migration status. Covered current client pipeline, technical blockers, and the approach to Kaltura/ON24/Notified migrations.",
      },
      {
        title: "Annalisa 1:1 \u2014 Delivery Pain Points + AI Opportunities",
        summary:
          "Deep dive into delivery operations. Highlighted Lasso integration issues, manual processes built during rapid growth, no centralized automation. Strong appetite for AI-assisted improvements in scheduling, reporting, and client communications.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "February 25",
    meetingCount: 6,
    meetings: [
      {
        title: "Tommaso 1:1 \u2014 Product Team Intro",
        summary:
          "Introductory call with Tommaso from the product team. Walked through his focus areas, how product priorities get set, and where the SE role intersects with product development.",
      },
      {
        title: "OE <> Citi \u2014 Velocity Migration Technical Sync",
        summary:
          "Citi\u2019s Velocity migration to Zoom is the largest and most complex active project. Conferences came up as a must-have for the first time \u2014 despite being documented as out of scope. Connor proposed a workaround.",
      },
      {
        title: "Computershare \u2014 Product Feedback & Platform Enhancement",
        summary:
          "Product update call with Computershare. Covered how CPU uses the platform today \u2014 booking events, sharing Zoom details and audio bridge info from the control tab. Discussion about speaker management workflow.",
      },
      {
        title: "SF: Biweekly Stakeholder Call \u2014 Internal Systems",
        summary:
          "Internal sync on Salesforce \u2192 NetSuite \u2192 billing workflows. Ali is now owning this workstream. Discussed data hygiene, reporting gaps, and integration points.",
      },
      {
        title: "Zoom | Swire \u2014 FIFA World Cup Discovery",
        summary:
          "Sales discovery call for Swire\u2019s FIFA World Cup trophy event \u2014 a corporate town hall combined with a live event component. Good example of hybrid/experiential events beyond standard webcasts.",
      },
      {
        title: "Amelia \u2014 Midweek Check-In",
        summary:
          "Strategic download. Tyler Brubach (her main Zoom contact) is ready for an SE intro whenever I am. Amelia reinforced that the Zoom partnership is her top priority and the SE role is critical to scaling it.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "February 26",
    meetingCount: 5,
    meetings: [
      {
        title: "Product & Delivery Weekly",
        summary:
          "LSEG incident post-mortem: stream backup switchover failed. AI automation progress: Joe built 12\u201313 meetings in minutes with Claude, Connor automating Computershare spreadsheet with Cowork. JP Morgan update: $4M/year potential, $254K API license on the table. Podium 2.0 first real-world test went well.",
      },
      {
        title: "Zoom Sales Weekly \u2014 Pipeline + Partner Program",
        summary:
          "Zoom is moving toward a certified partner program for OE. Tyler told Mike Conlon that OE is their most important partner globally across four pillars. Max demoed Zoom Contact Center for the support line pilot. Pipeline at 44% of quarterly target, $525K in contracting.",
      },
      {
        title: "Max Barrett \u2014 Migration Prototype Demo",
        summary:
          "Showed Max the migration prototype \u2014 dashboard with user overview, action stages (Kaltura \u2192 AWS \u2192 Zoom), pipeline test, field mapping UI, cost tracker, and settings. Max agreed with the approach of building something repeatable. Waiting on real Kaltura API credentials.",
      },
      {
        title: "Devin \u2014 SE Peer Sync",
        summary:
          "Showed the same prototype. Key addition: ingesting Joe\u2019s architecture doc into Claude, confirming the gap between my build and engineering\u2019s spec is ~30%. Started planning the SE function: Confluence page, golden demo framework, product feedback loops. In-person meetup March 5.",
      },
      {
        title: "Andrew \u2014 Week 2 Check-In",
        summary:
          "End-of-week debrief. Andrew\u2019s coaching: build relationships first, invest in knowing people as people. Everyone here has been around 5\u20138 years and is protective of what they\u2019ve built \u2014 ease in. Positive reaction to the migration prototype.",
      },
    ],
  },
  {
    day: "Friday",
    date: "February 27",
    meetingCount: 3,
    meetings: [
      {
        title: "Citi Velocity \u2014 Internal Escalation Call",
        summary:
          "Observed an internal strategy call. Citi slept on the Veracast migration for 6+ months and is now demanding everything work exactly as before with ~90 days left \u2014 including conferences that were explicitly out of scope. Mark\u2019s decision: escalate to Christina next week, cut scope creep. Masterclass in managing the biggest institutional client.",
      },
      {
        title: "Carlos Valle \u2014 Global Head of Delivery Intro",
        summary:
          "Met Carlos for the first time. He runs all delivery operations globally \u2014 ~50 operators across US, UK, India, and APAC. Biggest pain point: no unified dashboard. Offered to spec out an operator dashboard concept \u2014 he was into it.",
      },
      {
        title: "Sales Org Chart Teach-In \u2014 Amelia + Andrew",
        summary:
          "Full walkthrough of the sales org. Three teams: GCS, Institutional, and Zoom Partnership. Almost everyone on the institutional side came from the client side at banks. Amelia and Andrew co-lead sales. Action item: 1\u20132 salespeople per week for intro calls, start with Gib.",
      },
    ],
  },
];

// ─── TTS Script (for Kokoro TTS) ─────────────────────────────────────────────

const ttsScript = `Week 2 Report. February 23 through 27, 2026. ... Week 2 was a big step up from orientation. 27 meetings across the week gave me exposure to every part of the business. Sales, delivery, product, engineering, and the Zoom partnership. ... Theme 1: The Zoom Partnership Is the Growth Engine. Every team talks about Zoom. The certified partner program is taking shape, and the SE role plugs in directly here. ... Theme 2: Migration Is a Repeatable Opportunity. I built a migration prototype this week and showed it to four people. The reaction was consistently positive. ... Theme 3: The Institutional Business Runs on Relationships. The depth of those relationships is what makes OE's institutional business defensible. ... Theme 4: AI Adoption Is Happening Organically. The appetite is real, the tooling and governance just need to catch up. ... Monday, February 23rd. 9 meetings. ... Started with a Jefferies data issue walkthrough with Connor. OE has no automated validation layer for upstream client data changes. ... Met with Connor and Nick on integration status. Most delays are client-side, not OE engineering. ... Delivery Manager Weekly covered weather disruptions and a Grinders earnings event streaming live to their CEO's social media. ... Connor gave me a deep product architecture walkthrough of OE Central, Passport, and the backend services. ... CEO-driven intro between OE and Net Roadshow exploring a partnership around investor access events. ... Andersen Discovery Call. They're coming off ON24 and want to migrate 35 to 38 webcasts to Zoom Webinars Plus. ... S&P March Investor Access onboarding and integration scoping. ... Internal Andersen debrief, then end-of-day debrief with Max covering NYC conference integration and Zoom CMS nuances. ... Tuesday, February 24th. 4 meetings. ... Continued Jefferies data debugging from Monday. ... Met the CEO, Mark Lehrman. He walked through OE's history and his vision for migration as a marketplace opportunity. ... Weekly Zoom CMS and video migration status check-in covering the client pipeline and technical blockers. ... Deep dive with Annalisa on delivery operations. Strong appetite for AI-assisted improvements in scheduling and reporting. ... Wednesday, February 25th. 6 meetings. ... Met Tommaso from the product team. Walked through how product priorities get set. ... Citi Velocity migration technical sync. Conferences came up as a must-have for the first time, despite being out of scope. ... Computershare product feedback call covering their booking and speaker management workflows. ... Internal Salesforce to NetSuite billing workflow sync with Ali. ... Zoom and Swire discovery call for a FIFA World Cup corporate event. Good example of hybrid experiential events. ... Midweek check-in with Amelia. Tyler Brubach is ready for an SE intro whenever I am. ... Thursday, February 26th. 5 meetings. ... Product and Delivery Weekly. LSEG incident post-mortem. Joe built 12 to 13 meetings in minutes with Claude. JP Morgan update: 4 million dollars a year potential. ... Zoom Sales Weekly. Tyler told Mike Conlon that OE is Zoom's most important partner globally across four pillars. Pipeline at 44 percent of quarterly target. ... Showed Max the migration prototype. Dashboard with user overview, action stages, pipeline test, field mapping, and cost tracker. Waiting on real Kaltura API credentials. ... SE peer sync with Devin. Started planning the SE function: Confluence page, golden demo framework, product feedback loops. In-person meetup March 5th. ... Week 2 check-in with Andrew. His coaching: build relationships first, invest in knowing people as people. ... Friday, February 27th. 3 meetings. ... Citi Velocity internal escalation call. Mark's decision: escalate to Christina, cut scope creep. Masterclass in managing the biggest institutional client. ... Met Carlos Valle, Global Head of Delivery. Runs 50 operators across US, UK, India, and Asia Pacific. Offered to spec out an operator dashboard concept. ... Full sales org chart teach-in with Amelia and Andrew. Three teams: GCS, Institutional, and Zoom Partnership. Action item: 1 to 2 salespeople per week for intro calls. ... Looking Ahead to Week 3. ... Zoom Partnership Deep Dive. Getting introduced to Tyler Brubach and shadowing Max and Kara on Zoom sales calls. ... Migration Prototype Live Test with real Kaltura API credentials. ... SE Function Build-Out with Devin. In-person meetup March 5th. ... And continued relationship building across the sales team, starting with Gib Smith on the institutional side.`;

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
      const { KokoroTTS } = await import("kokoro-js");

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
  }, [status, ttsScript]);

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
    { value: "32", label: "People Met" },
    { value: "8", label: "Clients Touched" },
    { value: "6", label: "Departments" },
    { value: "2", label: "Key Deals" },
  ];

  const meetingsByDay = [
    { day: "Mon", count: 9 },
    { day: "Tue", count: 4 },
    { day: "Wed", count: 6 },
    { day: "Thu", count: 5 },
    { day: "Fri", count: 3 },
  ];

  const meetingTypes = [
    { type: "1:1 Calls", count: 9, color: "#008285" },
    { type: "Client / Discovery", count: 8, color: "#0ea5e9" },
    { type: "Internal Sync", count: 6, color: "#8b5cf6" },
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
          Week 2 Analytics
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
                      width: `${(item.count / 9) * 100}%`,
                      height: "100%",
                      background: "#008285",
                      borderRadius: 4,
                      opacity: 0.6 + (item.count / 9) * 0.4,
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
                color: "#5b21b6",
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

export default function WeekTwoReport() {
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
              href="/weekly_report_week2.pdf"
              download="Weekly_Report_Week2.pdf"
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
            Week 2
          </h1>
          <div style={{ fontSize: 15, color: "#9ca3af", marginBottom: 4 }}>
            February 23&ndash;27, 2026
          </div>
          <div style={{ fontSize: 14, color: "#b0b0b0" }}>
            Mithun Manjunatha &mdash; Sales Engineer
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#5b21b6",
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
            { label: "Meetings", value: "27" },
            { label: "Days", value: "5" },
            { label: "Themes", value: "4" },
            { label: "Onboarding Week", value: "2 of 6" },
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
            Week 2 was a big step up from orientation. I went from learning
            names and navigating tools to sitting in on live client calls,
            observing how OE manages its most complex accounts, and starting
            to contribute with prototype work. 27 meetings across the week
            gave me exposure to every part of the business &mdash; sales,
            delivery, product, engineering, and the Zoom partnership. A few
            clear patterns emerged.
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
            This was Week 2 of the onboarding plan (Weeks 1&ndash;2: Product
            + Integrations, shadowing Connor). I&rsquo;m tracking ahead on
            integration exposure and already building relationships across
            sales and delivery that will matter when I shift into Zoom
            partnership shadowing in Weeks 3&ndash;4.
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
            Looking Ahead &mdash; Week 3
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
          <span>Week 2 &middot; Feb 23&ndash;27, 2026</span>
        </div>
      </div>
    </div>
  );
}
