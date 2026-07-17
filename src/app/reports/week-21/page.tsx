"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-21";

const themes: Theme[] = [
  {
    title: "Pre-Migration Reporting Becomes Standard Process",
    text: "What started as an ad hoc Excel export for IFRS became, over three separate working sessions with Akash and Max, a defined discovery template covering entry counts, ownership mapping, tag and caption limits, and embed codes, now being applied live to Indeed's migration before any Zoom credentials are touched.",
  },
  {
    title: "Migration Pipeline Widens Faster Than Bot Automation Can Keep Up",
    text: "With Okta's CircleHD migration now active alongside Indeed and IFRS's offboarding, the in-progress migration bot (roughly 50% complete) risks becoming permanently deprioritized against live client work. Mithun pushed for an end-of-month MVP target before a fourth migration lands.",
  },
  {
    title: "Contact Center Integration Architecture Settles on Workato",
    text: "After weighing routing logic through the Zoom virtual agent versus a dedicated integration layer, the team converged on pushing all Freshdesk and Salesforce logic through Workato via webhook, a single, natural-language-editable integration surface rather than duplicated logic across platforms.",
  },
  {
    title: "Team Growth Outpaces Reporting Structure",
    text: "With Eric started, Ash accepted, and Clara's case study still pending, multiple conversations this week, with Chiwe and with Devin, circled the same open question of who actually owns day-to-day direction for the incoming associate SEs, without landing on a final answer.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Close Out the IFRS Migration — Akash",
    text: "Migrate the roughly 28 outstanding Kaltura entries ahead of the July 24th final broadcast, with the last entry pulled the morning of the 27th before Kaltura access ends on the 28th.",
  },
  {
    title: "Deliver the Indeed Pre-Migration Report — Akash",
    text: "Finalize the Excel discovery report covering entry counts, ownership mapping, and embed codes by end of week, ahead of Monday's Indeed working session.",
  },
  {
    title: "Advance CircleHD Kickoff Follow-Through — Mithun / Max",
    text: "Coordinate with Zoom's Rajul on the S3-to-S3 handoff process and get the Okta Slack channel live before the first Tuesday 9am check-in.",
  },
  {
    title: "Push the Migration Bot Toward MVP — Mithun / Akash",
    text: "Revisit resourcing with Akash's team to reprioritize the bot given three concurrent live migrations, targeting an end-of-month MVP.",
  },
  {
    title: "Resolve Associate SE Reporting Structure — Mithun",
    text: "Bring the open reporting-line question to Amelia once she's back, ahead of Ash's July 27th start date.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "July 6", meetingCount: 2,
    meetings: [
      {
        title: "Indeed Migration Ticketing and Pre-Migration Report Process",
        summary: "Akash confirmed the Zoom Clips API permission fix from last week held and reported a video successfully uploaded to Indeed's ZVM channel with plain-text metadata attached, with a resource-file attachment test still pending. Max and Mithun proposed formalizing a new pre-migration discovery step for future migrations, generating an Excel report of every Kaltura asset before touching Zoom credentials, using the prior IFRS report as a template. Akash logged the work as ZCM tickets 182 and 183, and confirmed a prior live-streaming Zoom-mapping report ticket could move to Done.",
        angle: "Standardizing a pre-migration report step turns discovery into a repeatable, sellable deliverable rather than one-off manual work for each new migration client.",
      },
      {
        title: "Teams Town Hall Demo and New Salesforce Rep Dashboards",
        summary: "The team walked through a live demo of Microsoft Teams Town Hall as a fallback offering for prospects locked into Teams, positioned explicitly as a break-glass option rather than a lead product. Ali then rolled out new individual Salesforce dashboards tying quarter-to-date closed revenue to order-creation dates and walked reps through the parent-order/child-order billing workflow. New sales hire Josh Kaiser was introduced to the team.",
        angle: "Understanding the Salesforce order-splitting mechanics gives Mithun a clearer picture of how OE's commercial side attributes revenue back to the deals he influences.",
      },
    ],
  },
  {
    day: "Tuesday", date: "July 7", meetingCount: 6,
    meetings: [
      {
        title: "ZVM App Permission Debugging and Indeed Kaltura Access",
        summary: "Akash's first Indeed video upload succeeded via test credentials but failed under the dedicated ZVM app with a clips-scope permission error even after re-selecting all available scopes. Max found the app was missing a clip-management role permission and enabled it directly. Separately, Indeed granted Kaltura KMC access that morning, and the team walked through locating the partner ID and admin secret needed to authenticate.",
        angle: "Nailing down the exact Zoom scope set for a ZVM integration app is reusable knowledge Mithun can hand directly to any future TVM migration client's admin team.",
      },
      {
        title: "New IT and Product Support Team Structure Introduced",
        summary: "Brian introduced himself as the new combined IT/product delivery support lead following recent team departures, joined by new Level 1 support hire Rosemarie O'Shaughnessy and IT staff Pradvih and Vamsi. Mithun was invited as the SE representative to hear pain points directly and flagged that sales-side Salesforce admin access has been a persistent blocker as OE Central absorbs more Salesforce-adjacent functionality.",
        angle: "Sitting in on the support team's ticket-routing gaps early positions Mithun to spot automation opportunities before they become entrenched manual process.",
      },
      {
        title: "Ash and Clara Advanced to Case Study Round for Associate SE Roles",
        summary: "The hiring panel aligned on advancing candidates Ash and Clara to case studies for the newly created associate SE roles, with Eric Costello already confirmed to start July 10th. Mithun raised early questions about reporting structure for the incoming hires given the team spans engineering, sales, and delivery.",
        angle: "Getting reporting-line clarity settled before the new hires start avoids the ambiguity Mithun flagged around who directs their day-to-day technical work.",
      },
      {
        title: "Workato Renewal Scoping and Contact Center Integration Plans",
        summary: "With the Workato renewal approaching, the team reviewed current task usage against plans to route the new Zoom Contact Center's ticket creation and wrap-up flow through Workato into Freshdesk and Salesforce. The group agreed the right next step is a working session directly with Workato's team to confirm licensing covers the planned build before the July 26th renewal.",
        angle: "Looping Workato's team into the design conversation early validates the contact-center architecture is licensed correctly before building it, avoiding a rebuild later.",
      },
      {
        title: "Indeed Pre-Migration Discovery Fields and Embed Code Generation",
        summary: "Mithun and Max worked through the full field list for Indeed's pre-migration report, entry counts, unique owners, tag/caption/attachment limits, and channel-ownership mapping, pulling real numbers from Indeed's account (6,976 entries, 21,935 users, 228 categories). They also solved for generating usable embed codes for videos whose flavor IDs don't support direct playback links.",
        angle: "This session effectively built the reusable pre-migration report template from scratch, turning a one-off client ask into standard tooling for every future Kaltura migration.",
      },
      {
        title: "Okta and Indeed Deal Recap, Team Structure Discussion with Devin",
        summary: "Mithun and Devin reviewed the quarter's closed migration deals and discussed how the incoming associate SE hires will report, and where Devin fits alongside them given his enterprise-facing demo background. They agreed to loop in leadership on defining team structure once Amelia returns.",
        angle: "Clarifying how the new hires, Devin, and Mithun divide enterprise demos versus integration work now prevents overlap once three more people join the SE function.",
      },
    ],
  },
  {
    day: "Wednesday", date: "July 8", meetingCount: 2,
    meetings: [
      {
        title: "IFRS Final Video Pull Scheduled, Indeed ZVM Upload Confirmed Working",
        summary: "With IFRS's Kaltura access ending July 28th and their last broadcast July 24th, the team agreed to migrate the roughly 28 outstanding entries in one batch and hold the final video for pickup the following Monday. Separately, Akash confirmed a full successful ZVM upload test for Indeed, video, metadata, and channel placement all working, with the migration script itself roughly 60% built.",
        angle: "Locking the IFRS offboarding date into a shared calendar hold now avoids a scramble on the actual last-access day.",
      },
      {
        title: "Technical Interview: Connor for Associate SE Role",
        summary: "Mithun and Chiwe interviewed Connor, a founding SE at an early-stage sales-intelligence startup, who walked through building a Meta Ads MCP integration for a customer's disconnected ad and prospecting data. The panel probed his specific ownership of that build versus his CEO and CTO's, and his AI-native workflow using Cursor, Claude Code, and Warp terminal.",
        angle: "Connor's hands-on MCP integration experience is directly relevant to the forward-deployed integration work the associate SE role is meant to cover.",
      },
    ],
  },
  {
    day: "Thursday", date: "July 9", meetingCount: 5,
    meetings: [
      {
        title: "Pre-Migration Report In Progress, Workato MCP Confirmed Working",
        summary: "Akash reported Indeed's pre-migration report is underway with delivery targeted for the next day. The team confirmed Workato's MCP connection is now live and functioning end-to-end.",
        angle: "A working Workato MCP connection unlocks natural-language recipe building for the contact center integration work planned for later this quarter.",
      },
      {
        title: "Task-Tracking Board Proposal and Team Reporting Lines",
        summary: "Chiwe proposed a shared Kanban board to track the associate SE team's work once the incoming hires ramp up, and floated putting Mithun in a manager-of-record line for that group pending final sign-off. Mithun explained Devin's more traditional enterprise-facing background for context and confirmed Joe as the right contact for MCP tooling questions.",
        angle: "A lightweight Kanban board ahead of three new hires starting gives Mithun a way to route and track integration work without building process from scratch under pressure.",
      },
      {
        title: "Support Line Staffing Ramp and Indeed Follow-Up",
        summary: "The delivery team reviewed the ongoing effort to staff the new Zoom-based support line to round-the-clock coverage starting the following week now that licenses have been issued. Mithun confirmed the next Indeed working session is scheduled for Monday now that Kaltura access has been granted, and offered to field integration-specific questions coming through the support line.",
        angle: "Volunteering as the technical escalation point for integration questions keeps Mithun visible as the go-to resource before that routing pattern gets set in stone.",
      },
      {
        title: "Okta CircleHD Kickoff Confirmed for Following Week",
        summary: "Kara confirmed the Okta CircleHD migration kickoff would proceed the following Tuesday. Mithun flagged the S3-to-S3 transfer process as the one open technical unknown ahead of that call.",
        angle: "Flagging the unknown ahead of the kickoff means Mithun walks in ready with the right questions rather than discovering the gap live with the client.",
      },
      {
        title: "Ash's Case Study Presentation: Rules-Based Message Triage System",
        summary: "Ash walked the panel through Inbox IQ, a rules-based message classifier routing support messages by department and urgency using keyword and negation matching rather than an LLM. He fielded deep follow-ups on manipulation risk, confidence-scoring, and RAG-based scaling options, and Joe suggested exploring local or small language models as a no-token-cost alternative.",
        angle: "Ash's clear judgment on when to reach for a full LLM versus simpler rules-based logic is exactly the call this associate SE role needs to make constantly when scoping client integrations.",
      },
    ],
  },
  {
    day: "Friday", date: "July 10", meetingCount: 5,
    meetings: [
      {
        title: "IFRS Out-of-Scope Request Surfaced, ZVM Bot at 50%, Contact Center Integration Path Set",
        summary: "IFRS's contact requested additional video extractions beyond the originally scoped migration; Mithun and Max agreed to loop Zoom's account team in for visibility. Akash reported the migration bot is roughly 50% complete, Kaltura-side retrieval works, but ZVM-side transfer still needs coding, and Mithun proposed reprioritizing it toward an end-of-month MVP given two more migrations are already active. The team also settled on routing the Contact Center's Freshdesk and Salesforce integration entirely through Workato via webhook.",
        angle: "Centralizing the contact-center integration logic in Workato keeps the architecture in one place Mithun can iterate on with natural language instead of maintaining two integration surfaces.",
      },
      {
        title: "EMEA Prospecting Support: On24/Q4/Notified Competitor List",
        summary: "New EMEA rep Jacob asked Mithun for help building a list of companies using competing earnings-call platforms as outbound targets. Mithun agreed to pull a targeted, evidenced list using Claude and demoed OE's ROI calculator tool as a resource Jacob could use directly with prospects.",
        angle: "Building Jacob a sourced target list turns a generic outbound motion into a warm-feeling first contact.",
      },
      {
        title: "Okta CircleHD Migration Kickoff: Scope, Taxonomy, and S3-to-S3 Process",
        summary: "Mithun and Max kicked off the CircleHD-to-Zoom migration with Okta's team, confirming roughly 10 terabytes of content across a flat, unorganized 137-channel structure Okta wants restructured around groups and departments. The team aligned on Zoom's S3-to-S3 transfer process, content moves directly from Okta's bucket into a Zoom-managed one, removing OE from staging entirely, and set a recurring Tuesday 9am Pacific check-in with a late-September production deadline.",
        angle: "The S3-to-S3 flow removes OE's own staging costs from this migration entirely, worth calling out to future TVM prospects as a cost and complexity reduction.",
      },
      {
        title: "Okta Service Account and Slack Coordination Channel Set Up",
        summary: "Following the kickoff, Okta confirmed it would provision an internal OAuth service account rather than granting direct CircleHD access, and the team agreed to stand up a shared Slack channel to keep communication centralized given the team's vacation-heavy summer schedule.",
        angle: "A single shared channel instead of side conversations matters a lot once multiple people are out mid-project.",
      },
      {
        title: "Job Offer Extended and Finalized for Ash",
        summary: "Mithun and Nathan formally extended the associate SE offer to Ash, who accepted verbally, with a target July 27th start date and standard Eastern-aligned working hours with occasional early-morning overlap for the India engineering standup.",
        angle: "A friendly offer call and an offered in-person lunch set a strong first impression for someone joining a small, fast-moving team.",
      },
    ],
  },
];

export default function Week21Report() {
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
    const comment: Comment = { id: Date.now().toString(), author: newAuthor.trim() || "Anonymous", text: newText.trim(), timestamp: new Date().toLocaleString() };
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
        <Link href="/reports" style={{ ...serif, fontSize: 13, color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>&larr; Back to Reports</Link>
        <a href="/weekly_report_week21.pdf" download="Weekly_Report_Week21_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 21</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>July 6 &ndash; July 10, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "20", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "21", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 21 Analytics</strong> &nbsp;&middot;&nbsp; Okta CircleHD signed, $15K &nbsp;&middot;&nbsp; Pre-migration report template built &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Indeed &middot; IFRS Offboarding &middot; Okta CircleHD &middot; Migration Bot &middot; SE Hiring
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 21 was defined by turning migration execution into repeatable process, building a standardized pre-migration report template live with Max and Akash, debugging Indeed&rsquo;s ZVM permission scopes to a working state, and locking down IFRS&rsquo;s final offboarding timeline. Three new fronts opened simultaneously: the Okta CircleHD migration kicked off with a clear S3-to-S3 technical path, hiring closed on Ash for the second associate SE seat, and the Contact Center&rsquo;s Freshdesk and Salesforce integration architecture settled on a Workato-centralized design. The week also surfaced early team-structure questions, reporting lines for the incoming hires, Devin&rsquo;s role relative to the new associate SEs, that leadership will need to resolve before three more people ramp up at once.</p>
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
            <button onClick={() => setOpenDay(openDay === day.day ? null : day.day)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div>
                <span style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#111827" }}>{day.day}</span>
                <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 8 }}>{day.date}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: teal, background: "#f0fafa", padding: "3px 10px", borderRadius: 20 }}>{day.meetingCount} meeting{day.meetingCount !== 1 ? "s" : ""} &rsaquo;</span>
            </button>
            {openDay === day.day && (
              <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {day.meetings.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>No meetings were held.</p>
                ) : (
                  day.meetings.map((m) => (
                    <div key={m.title} style={{ borderLeft: `2px solid ${teal}`, paddingLeft: 14 }}>
                      <h4 style={{ ...serif, fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{m.title}</h4>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 6 }}>{m.summary}</p>
                      {m.angle && <p style={{ fontSize: 12, color: teal, fontStyle: "italic" }}>SE: {m.angle}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 22</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {lookAhead.map((a) => (
          <div key={a.title} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px" }}>
            <h3 style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{a.title}</h3>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{a.text}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 40 }}>Note: This report was created in tandem with AI to help summarize and organize meeting notes. Every line has been read and verified for accuracy.</p>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 24 }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Comments</h3>
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Leave feedback, questions, or notes. Stored in your browser.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Name" style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px", fontSize: 13 }} />
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Comment" rows={3} style={{ border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px", fontSize: 13, resize: "vertical" }} />
          <button onClick={saveComment} style={{ alignSelf: "flex-start", background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Post Comment</button>
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
