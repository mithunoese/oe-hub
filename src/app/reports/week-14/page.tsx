"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-14";

const themes: Theme[] = [
  {
    title: "IFRS Migration: All Technical Blockers Cleared",
    text: "Five days of iterative engineering resolved every outstanding item before the Monday May 25 live start. Akash confirmed agenda slide extraction works by recovering the PowerPoint file via Kaltura cue point document IDs, the Zoom compressed-file June release provides a clean second phase for JSON attachments, and the video category over-assignment bug was diagnosed as an API scoping issue patchable via metadata update without re-uploading any video files. IFRS has a hard Kaltura license deadline driving the urgency, and the migration team enters next week with no technical unknowns.",
  },
  {
    title: "CMS Pipeline: Five Active Enterprise Opportunities",
    text: "Indeed, Okta, Arizent, University of Ottawa, and HubSpot all advanced this week at various stages. The Arizent RFQ response established OE’s first formal integration pricing model — $3,000 per integration with $500 per month maintenance — alongside a CSM threshold structure that bundles dedicated support for accounts above $100K annually. Submitting the Arizent RFQ and delivering the Indeed discovery call in the same week marks the moment migration services moved from pitch to parallel delivery pipeline.",
  },
  {
    title: "Strategic Market Consolidation",
    text: "The Bullish acquisition of Acquinity for $500M reshuffled Computershare’s competitive position and is the direct reason they moved all business to OE, positioning OE as a strategically attractive asset in a consolidating transfer-agency and IR infrastructure market. A call with S&P Capital Access surfaced genuine complementary overlap between their investor CRM and OE’s event engagement data. Investment bankers are now engaged. Computershare also sourced OE into a mid-June investor day, the team’s first through that partnership channel.",
  },
  {
    title: "Earnings Automation: End-to-End Product Vision Emerging",
    text: "Conversations with Casey and Devin this week mapped a modular end-to-end earnings call platform covering financial data ingestion, AI-assisted script drafting, teleprompter rehearsal, production delivery via OE platform, post-event video editing, and retail investor sentiment analysis from social platforms. Casey demonstrated a working teleprompter prototype built in Claude Code. Devin surfaced analysis of 40 earnings call transcripts showing that internal AI efficiency is the dominant corporate theme but investors are discounting it, suggesting a differentiated product and content angle. Lorna, a former Swiss IR Society president engaged as OE consultant, will validate the analyst dashboard before it reaches Computershare.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Live Migration Start",
    text: "Max and Akash begin extracting and uploading the full Kaltura video library to Zoom on Monday May 25. Track extraction rate, verify the category metadata patch runs correctly on the first batch, and send a progress update to the IFRS client team by end of day. Owner: Max, Akash.",
  },
  {
    title: "Indeed Contract",
    text: "Kara to send the Indeed contract following the discovery call. Kenneth has not responded to three follow-up emails; escalate within Indeed to the procurement owner before the relationship goes cold. Owner: Kara, Mithun.",
  },
  {
    title: "Okta Contract Follow-up",
    text: "Okta completed onboarding in three days but no contract has been sent and the primary contact is unresponsive. Identify the procurement decision-maker and send the contract before the engagement stalls. Owner: Kara.",
  },
  {
    title: "Arizent RFQ Shortlist Preparation",
    text: "RFQ submitted. If OE is selected for the shortlist deep-dive, prepare a formal discovery questionnaire covering event support model, CMS content volume, and integration architecture requirements. Owner: Mithun, Kara, Max.",
  },
  {
    title: "Earnings Automation Flow Map",
    text: "Mithun and Devin to document the end-to-end earnings call workflow from financial data ingestion to post-event video distribution, identifying the two or three highest-impact modules to prioritize for internal build approval. Share with Amelia and Alan by end of week. Owner: Mithun, Devin.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "May 18",
    meetingCount: 4,
    meetings: [
      {
        title: "ZCM Migration Standup — IFRS Agenda Files & Dashlane Setup",
        summary: "Max opened the standup by announcing ZCM-133, targeting extraction of Kaltura agenda slide files that IFRS has been requesting. Akash committed to investigating the Kaltura API to determine whether agenda files can be fetched separately from the thumbnail format currently returned, and updating the ticket by the following day. The IFRS May 18 migration plan remained on hold pending a response from Priya. The standup concluded with Dashlane onboarding — Akash installed the browser extension so Max can securely share the Kaltura admin secret the migration chatbot requires.",
        angle: "ZCM-133 moves the last pre-migration blocker forward; Dashlane setup removes the manual credential handoff risk before IFRS go-live.",
      },
      {
        title: "Menarini APAC SDK Feasibility Discussion — Peter, Max, Mithun",
        summary: "Peter brought a new opportunity: Menarini (global group market cap $46B) wants to embed live Zoom webinars into a Drupal or WordPress marketing portal in the Philippines via the Zoom Meeting SDK, with a Korean dev agency building the site infrastructure. Mithun assessed the core technical piece as achievable but cautioned about maintenance ownership, expertise positioning, and the need for a co-build engagement rather than turnkey delivery. Amelia later confirmed SDK integrations are out of OE’s lane at this stage.",
        angle: "Menarini was a useful capability boundary test — Amelia’s clear guidance prevents OE from overcommitting on unfamiliar SDK work.",
      },
      {
        title: "Monday All-Hands Sales Kickoff",
        summary: "Amelia reported 1,300 events delivered the prior week across capital markets, corporate services, conferences, and OE Connect, with 1,100-plus already booked for the current week including the UBS Best of Europe conference. Christian and Jamie shared LSEG IR Masterclass insights: under 7% of US investors back an EMEA company below $5B market cap, and 74% require at least one in-person meeting before committing. Kara debriefed her on-site Flextronics visit in Austin, where a 30,000-person town hall announced the company splitting into two publicly traded entities. Mithun reported OE won its first Computershare-sourced investor day, set for mid-June.",
        angle: "The Flextronics split doubles the addressable opportunity within one enterprise relationship; the Computershare investor day validates the partner referral channel.",
      },
      {
        title: "Arizent RFQ Review — Kara and Mithun",
        summary: "Kara walked Mithun through an RFQ from Arizent (American Banker, National Mortgage News) migrating from Cvent to Zoom Events and Webinars Plus. Integration requirements included Omeda, Stripe, Salesforce, and HubSpot/Marketo — all without Zapier. Mithun proposed $3,000 per integration plus $500 per month maintenance, citing the Cargill AI agent project as precedent. Zoom licensing was approximately $107K, leaving roughly $143K for OE professional services within a sub-$250K ceiling. Mithun drafted outreach to the Skyler contact at Arizent to initiate discovery.",
        angle: "$3K/$500 sets a repeatable integration pricing template; 300 annual sponsored webinars makes Arizent a high-frequency recurring services opportunity.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "May 19",
    meetingCount: 7,
    meetings: [
      {
        title: "ZCM Technical Standup — Agenda Slide API & June Zoom Release",
        summary: "Akash confirmed agenda slide extraction is feasible and updated the ticket with findings matching Max’s prior investigation, noting that saving attachments to Zoom via the resources path was already working. Max shared that a Zoom June release will include compressed file upload support for the content hub, enabling JSON attachment files to be pushed as a second phase after core video migration. Max also raised a Zoom five-thumbnail-per-video limit and recommended filtering by object type before passing assets to avoid upload errors during the live run.",
        angle: "ZCM-133 is unblocked and the June compressed file enhancement removes the last major technical unknown for IFRS delivery.",
      },
      {
        title: "Migration Chatbot 1:1 Demo — Akash and Mithun",
        summary: "Akash walked Mithun through a live demo of the migration chatbot, which had accepted Kaltura admin credentials and returned a file inventory with video names, durations, and basic metadata. Attachment fetching was still in development. Mithun proposed a UX shift: rather than presenting a full file list at intake — impractical for libraries over five terabytes — the bot should ask users what they do not want to migrate, supporting responses by date range, tag, or title. The team aligned on prioritizing metadata completeness before refining the flow.",
        angle: "Exclusion-first intake makes the bot enterprise-ready for large Kaltura libraries and strengthens the demo story for future migration prospects.",
      },
      {
        title: "Amelia, Devin, and Mithun Weekly Sync",
        summary: "Amelia and Devin recapped a productive S&P Capital Access call, noting genuine strategic overlap with S&P’s investor CRM database. Amelia flagged the Bullish acquisition of Acquinity for $500M as the direct reason Computershare moved all business to OE, noting investment bankers are now engaged. Capital markets QTD was at 58% of target after 5.5 weeks with last week’s revenue at $190K. Mithun updated on five active CMS pipeline opportunities and Amelia asked for a weekly email summary of open CMS opportunities going forward.",
        angle: "Five named CMS opportunities in a single week signals that migration services are generating real commercial pull that warrants structured tracking.",
      },
      {
        title: "Arizent RFQ Pricing Strategy — Amelia, Kara, Max, Mithun",
        summary: "The team worked through pricing dedicated CSM and 24/7 technical support within the Arizent RFQ’s $250K total ceiling. Amelia proposed a threshold model: accounts above $100K annually receive a dedicated CSM bundled; below that, $3,500–$5,000 per month. Power BI showed only Databricks and CNN currently above $100K in 2026 bookings, confirming the tier protects OE from extending high-touch support to low-spend clients. Standard event rates apply to the 300-webinar and 20–25 virtual event volumes, with production complexity scoped in the shortlist discovery call.",
        angle: "The CSM pricing tier creates a reusable commercial structure for enterprise accounts beyond Arizent, turning one RFQ into a repeatable packaging model.",
      },
      {
        title: "Indeed Demo Prep and Okta Check-in — Kara, Max, Mithun",
        summary: "Kara, Max, and Mithun aligned on the structure for Thursday’s Indeed implementation call: Mithun to walk the implementation plan and a dummy migration report, Max to cover Zoom user onboarding including channels, permissions, and hub structure, and Kara to close with the onboarding process overview. Kara shared that Okta had completed onboarding in three days — well ahead of the months Zoom projected — but Kenneth had not responded to three follow-up emails and no contract had yet been sent.",
        angle: "Okta completing onboarding in three days is exactly the client story that anchors the migration pitch; getting the contract signed converts a delivery win into revenue.",
      },
      {
        title: "Casey and Mithun Sync — Earnings Automation Roadmap",
        summary: "Casey and Mithun mapped an end-to-end earnings call product vision: financial data ingestion and AI-assisted script drafting, rehearsal with live teleprompter support, production delivery via OE platform, post-event video editing, and retail investor sentiment analysis from Reddit and X. Casey demonstrated a live teleprompter built in Claude Code with real-time scrolling and operator-controlled pacing. Mithun framed OE’s advantage as the only provider owning both event infrastructure and production services, meaning each workflow stage could be offered as a modular paid add-on.",
        angle: "Even the teleprompter and video editing modules alone create a sticky, high-margin product layer that no pure-platform competitor in earnings can replicate.",
      },
      {
        title: "Devin and Mithun Sync — IR Product Roadmap and Salesforce",
        summary: "Devin and Mithun discussed his analyst dashboard project, agreeing that S&P and Computershare hold complementary data sets OE should partner with rather than rebuild. Devin shared a thought leadership experiment: 40 earnings call transcripts analyzed in Claude showed internal AI efficiency is the dominant corporate theme but investors are discounting it. Mithun worked through a Salesforce permissions fix live on the call. Diana’s newly delivered dashboard showed completely wrong numbers ($51M in closed deals) and a meeting with Ali was scheduled for next week.",
        angle: "Devin’s earnings transcript analysis is exactly the differentiated IR insight that positions OE as a knowledgeable capital markets partner, not just a logistics provider.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "May 20",
    meetingCount: 2,
    meetings: [
      {
        title: "ZCM Pre-Launch Technical Standup — Akash, Max, Mithun",
        summary: "Akash reported file transfer changes were complete but the demo Kaltura account had only five videos with no attachments, making agenda slide validation impossible there. Max clarified agenda slide functionality is a paid Kaltura add-on only available in IFRS’s live production account. Akash committed to running the original migration code against the IFRS account, with results expected by Friday and Monday remaining the go-live target. Max confirmed Zoom’s categories bug was fixed — category fields now visible — removing all remaining hard blockers. JSON files remain a second-phase item pending the June Zoom release.",
        angle: "All technical blockers for May 25 IFRS migration start are resolved; the June JSON dump is documented as a planned follow-on step, not a risk.",
      },
      {
        title: "Arizent RFQ Final Submission — MK, Kara, Mithun",
        summary: "The team finalized the Arizent RFQ submission, working through the hardest line items where pricing 300 webinars at standard one-on-one rates would push the total far above the $250K ceiling. The agreed approach was to submit with ranges and include a cover note explaining that accurate pricing requires a discovery conversation about their actual event support model. Integration pricing was set at $3K per integration, CMS migration at $9K–$50K, technical onboarding at $2K. Kara targeted a grand total around $210K to signal competitiveness in the shortlist process. The submission was sent the same day.",
        angle: "Submitting with ranges and a discovery-first cover note keeps OE in the shortlist conversation without over-committing on event support pricing that could create an unprofitable contract.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "May 21",
    meetingCount: 3,
    meetings: [
      {
        title: "ZCM Migration Standup — Agenda Slide Validated, Category Bug Found",
        summary: "Akash confirmed success: a four-slide PowerPoint file had transferred cleanly from Kaltura to Zoom’s resources folder and was verified by Max as fully intact. A critical new issue emerged: all 232 Kaltura root categories were being assigned to every migrated video regardless of actual association. Joe joined and confirmed a likely bug — the entries.category API call appears to return every category that exists on the account rather than only those assigned to a specific entry. Since categories are metadata-only and patchable post-extraction without re-uploading video files, the team agreed it would not block Monday’s start.",
        angle: "Catching the category bug before live migration — and confirming it is patchable — keeps Monday go-live on schedule and protects the client from receiving incorrectly tagged content.",
      },
      {
        title: "Indeed Migration Discovery Call — Max, Mithun, Skyler",
        summary: "Mithun and Max delivered the Indeed implementation walkthrough covering the migration process end to end: a high-level implementation plan with timeline, Zoom hub and channel structure with user ownership remapping, a dummy migration report showing client-facing output, and the onboarding process overview. The call served as a pre-sales alignment session to show Indeed exactly what the migration engagement would entail before contract finalization.",
        angle: "Walking Indeed through a visual migration report and structured onboarding plan moves the conversation from pricing to delivery partnership, the right framing to close the $15K proposal.",
      },
      {
        title: "Zoom Sales Weekly Standup",
        summary: "Mithun joined the regular Thursday Zoom sales call covering pipeline activity, partner referrals, and cross-team coordination across the OE and Zoom partner teams, maintaining the consistent partner presence that has sourced IFRS, Indeed, and Okta.",
        angle: "Consistent Zoom Weekly presence is the primary source of SE-relevant referrals in the CMS and migration pipeline.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 22",
    meetingCount: 1,
    meetings: [
      {
        title: "End-of-Week Check-in — Mithun and Max",
        summary: "Mithun connected briefly with Max to review IFRS migration readiness heading into the weekend, confirm Akash’s category bug fix was on track for Friday completion, and align on the Monday May 25 go-live plan with no remaining open items.",
        angle: "A Friday pre-weekend sync ensures the team enters Monday’s IFRS migration start fully aligned with no ambiguity around open items.",
      },
    ],
  },
];

export default function Week14Report() {
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (stored) setComments(JSON.parse(stored));
    } catch {}
  }, []);

  const saveComment = useCallback(() => {
    if (!newText.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: newAuthor.trim() || "Anonymous",
      text: newText.trim(),
      timestamp: new Date().toLocaleString(),
    };
    const updated = [...comments, comment];
    setComments(updated);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
    setNewText("");
    setNewAuthor("");
  }, [comments, newAuthor, newText]);

  const serif = { fontFamily: "Georgia, serif" };
  const teal = "#008285";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Link
          href="/reports"
          style={{ ...serif, fontSize: 13, color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          &larr; Back to Reports
        </Link>
        <a
          href="/api/report-pdf/week-14"
          download="Weekly_Report_Week14_final_1.pdf"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#008285",
            background: "#f0fafa",
            border: "1px solid #e0f0f0",
            borderRadius: 6,
            padding: "7px 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 14 }}>&darr;</span> Download PDF
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        Weekly Report
      </p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>
        Week 14
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>May 18 &ndash; 22, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "17", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "14", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 14 Analytics</strong> &nbsp;&middot;&nbsp; IFRS go-live Monday May 25 &nbsp;&middot;&nbsp; 5 CMS opportunities active &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Indeed &middot; Okta &middot; Arizent RFQ &middot; HubSpot &middot; Earnings Automation Concept
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 14 was defined by the IFRS migration crossing from preparation to go-live readiness, a CMS pipeline deepening into five named enterprise opportunities, and the early architecture of an earnings automation product vision. The India engineering team validated agenda slide extraction and surfaced a video category bug that was quickly diagnosed and planned for a post-extraction patch, clearing all remaining technical blockers before Monday&rsquo;s live migration start. On the commercial side, the Arizent RFQ was submitted with OE&rsquo;s first formal integration pricing framework, and both the Indeed discovery call and Okta onboarding advanced toward contract. Strategically, the Bullish acquisition of Acquinity for $500M is reshaping the capital markets infrastructure landscape in OE&rsquo;s favor, and conversations with S&amp;P Capital Access and Computershare continued to deepen partnership optionality.
      </p>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Themes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {themes.map((t) => (
          <div key={t.title} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "20px 24px" }}>
            <h3 style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{t.title}</h3>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65 }}>{t.text}</p>
          </div>
        ))}
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Day by Day</h2>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Click a day to expand meeting details.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {days.map((day) => (
          <div key={day.day} style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <span style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#111827" }}>{day.day}</span>
                <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 8 }}>{day.date}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: teal, background: "#f0fafa", padding: "3px 10px", borderRadius: 20 }}>
                {day.meetingCount} meeting{day.meetingCount > 1 ? "s" : ""} &rsaquo;
              </span>
            </button>
            {openDay === day.day && (
              <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {day.meetings.map((m) => (
                  <div key={m.title} style={{ borderLeft: `2px solid ${teal}`, paddingLeft: 14 }}>
                    <h4 style={{ ...serif, fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{m.title}</h4>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 6 }}>{m.summary}</p>
                    {m.angle && <p style={{ fontSize: 12, color: teal, fontStyle: "italic" }}>SE: {m.angle}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 15</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {lookAhead.map((a) => (
          <div key={a.title} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px" }}>
            <h3 style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{a.title}</h3>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{a.text}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 40 }}>
        Note: This report was created in tandem with AI to help summarize and organize meeting notes. Every line has been read and verified for accuracy.
      </p>

      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 24 }}>
        <h3 style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Comments</h3>
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Leave feedback, questions, or notes. Stored in your browser.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <input
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Name"
            style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px", fontSize: 13 }}
          />
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Comment"
            rows={3}
            style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px", fontSize: 13, resize: "vertical" }}
          />
          <button
            onClick={saveComment}
            style={{
              alignSelf: "flex-start",
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </div>
        {comments.map((c) => (
          <div key={c.id} style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "12px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{c.author}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.timestamp}</span>
            </div>
            <div style={{ fontSize: 13, color: "#374151" }}>{c.text}</div>
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
}
