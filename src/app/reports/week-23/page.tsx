"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-23";

const themes: Theme[] = [
  {
    title: "Migration Data Integrity Keeps Surfacing Gaps",
    text: "Across City and IFRS this week, small but consequential gaps kept turning up — 54 corrupted City files, a missed June 10–17 migration window, and a BOMA livestream-ID mapping mix-up — each caught and patched quickly, but signaling a need for tighter reconciliation checkpoints on future migrations before they go final.",
  },
  {
    title: "Okta's S3-to-S3 Architecture Took Shape — and Exposed a Real Gap",
    text: "Detailed sessions with Zoom's product team and with Okta itself clarified exactly how the customer-to-Zoom S3 transfer works, but also surfaced an unresolved question — will OE retain access to patch metadata once content lands in Zoom's own bucket — that needs an answer before the migration can fully proceed. Zoom's upcoming Sites/Site Pages feature emerged as a promising fit for Okta's multi-level channel request.",
  },
  {
    title: "The Zoom Support Line Is Becoming a Real Lead Channel",
    text: "What started as a manual chat experiment is turning into production infrastructure — Salesforce lead routing, Freshdesk ticket creation, and a ZCC wrap-up webhook were all built and tested this week, and it already produced its first attributed closed deal.",
  },
  {
    title: "AI Tooling Adoption Spread Beyond the SE Function",
    text: "From walking Andrew through Claude-powered PowerPoint/Excel edits for the board deck, to pitching an “agent-readable” website to marketing, to standing up Claude Code for a forward-deployed engineer, this was a week of quietly scaling internal AI workflows across sales and marketing, not just SE work.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Close Out the Bot Demo and City File Review — Akash / Kieran",
    text: "Deliver the working bot upload demo with sample files and finish investigating the 54 corrupted City files flagged this week.",
  },
  {
    title: "Finish the Migration Gap Patch and Lead-Routing Build — Max",
    text: "Close out the June 10–17 migration reconciliation and continue hardening the ZCC-Freshdesk-Salesforce flow toward full production use.",
  },
  {
    title: "Resolve the Okta Post-Transfer Access Question — Mithun",
    text: "Get clarity from Zoom's Vijay on whether OE will retain S3 access to patch metadata after transfer, and lock in the dedicated channel/site-structure design session with Okta.",
  },
  {
    title: "Nail Down the Zoom Ops Handoff Process — Mithun",
    text: "There's still no defined way to notify Zoom's operations team when OE is ready for an S3 transfer; needs an answer before Okta's migration can kick off.",
  },
  {
    title: "Keep Manually Triaging Support-Line Leads — Kara / Andrew / Amelia",
    text: "Continue hand-assigning leads for another couple of weeks before deciding whether further automation is warranted.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "July 20", meetingCount: 6,
    meetings: [
      {
        title: "Akash/Max Standup — Kaltura Migration & City Metadata",
        summary: "Akash pulled Kaltura Indian-culture samples into S3 and migrated them into ZVM (unassigned, sitting in the videos folder), and was retrying the automated bot upload after updating its secret/permissions, with a plan to regenerate credentials if that failed. Mithun flagged that Citi still needs specific metadata (speakers, event names) on the 818 delivered files and committed to creating a dedicated Jira ticket for it, floating the idea of using Claude to auto-transcribe and extract speaker/event data from files missing metadata. They also confirmed Indeed's Zoom role/credentials for channel creation hadn't come through yet, and agreed the 5 test-migration videos should move off OE's internal test account onto the real customer account going forward.",
        angle: "Automating metadata extraction from audio via Claude could become a reusable tool across every future migration, not just Citi.",
      },
      {
        title: "OE Weekly Leadership/Sales Call",
        summary: "Brett detailed the Uber investor-update project (~$30-34K with add-ons, 4-language subtitles, confidential pre-record after the Delivery Hero acquisition) as a flagship example of OE's value prop, alongside recaps of the Citi and State Street earnings-call deliveries. The team reviewed KPIs (51 meetings booked last week, $715K in orders created against an $825K goal, capital markets down due to deal-timing and market anxiety) and highlighted momentum on Sanofi's renewal ($70-90K potential), the new BetaNXT referral partnership, the PowerLaw prospect, and the Zoom support line's early conversion rate. Two new Zoom-team hires (Josh, Pete Carroll) were announced to help scale the team.",
        angle: "BetaNXT, PowerLaw, and the Zoom support line are all named as fresh momentum sources — worth watching for SE involvement as they progress.",
      },
      {
        title: "CMS Migration Strategy — Apex Technical (Panopto) Deal Loss",
        summary: "Kara, Max, Andrew, and Mithun discussed Apex Technical declining to move forward with a Panopto migration after a discovery call, with the Zoom AE attributing the loss to OE overcomplicating the process. The group agreed migration complexity (LMS integration, redirects, quiz/chapter handling) can't be papered over without setting bad expectations, and decided the real client to manage here is the Zoom AE relationship — planning to get direct input from Zoom on how they want migrations scoped and communicated to prospects going forward. They also noted OE's migration win rate is roughly 6 of 8 opportunities so far.",
        angle: "How this discovery process gets repositioned to Zoom AEs will directly affect OE's conversion rate on future Zoom-sourced migration leads.",
      },
      {
        title: "Tommaso — Veracast-to-OE Platform Migration Planning",
        summary: "Tommaso outlined the plan to migrate all non-Bank-of-America Veracast/Novio events to OE Stream, Central, and Passport with CloudFront redirects, targeting mid-August completion; Broadridge accounts for the bulk of the work (~60 events) and is gated on a configuration change Broadridge needs to make on their end. He demoed a private Streamlit app he built that bulk-creates OE Central events from Broadridge's Excel schedule via API, already used to pre-populate many records. The group discussed whether AI/agentic tooling could shortcut the remaining manual cross-platform steps but concluded current API coverage isn't exposed enough yet to fully automate it.",
        angle: "Broadridge's willingness to make that config change is the single swing factor gating ~60 events against a mid-August deadline.",
      },
      {
        title: "Devin — Forward-Deployed-Engineer Workflow & Claude Code Setup",
        summary: "Using the example of manually building dozens of OE Central meetings and attendees from a daily capital-markets schedule email (8-10 minutes per event), Devin and Mithun worked through how the new forward-deployed-engineer function should operate: define current/future state, evaluate options (Teams agent, CSV ingestion like Tommaso's Broadridge tool), prototype fast, and iterate to roughly 80% coverage before handing off to engineering. They then set up Claude Code on Devin's Windows machine, hitting an admin-access snag that needs IT to resolve, and discussed the incoming engineering hire as key to building out Teams-agent automations.",
        angle: "This internal automation pattern is a template OE could reuse across other account teams' repetitive tasks.",
      },
      {
        title: "Andrew — Claude for PowerPoint/Excel Board Deck Walkthrough",
        summary: "Mithun walked Andrew through installing and using Claude's add-in inside PowerPoint and Excel to update Q2 board-deck slides ahead of Friday's board meeting, based on Amelia's outstanding comments. They practiced pasting screenshots of source data with plain-language prompts to update specific slide sections, and demoed connecting two live files to auto-build a stack-ranked sales leaderboard chart. Andrew found it fast once prompts included slide numbers and clear context, and suggested formalizing 'teaching the team AI tools' as one of Mithun's Q3 KPIs.",
        angle: "A clean internal AI-adoption story with a business stakeholder that could double as reusable content for OE's own AI positioning with clients.",
      },
    ],
  },
  {
    day: "Tuesday", date: "July 21", meetingCount: 5,
    meetings: [
      {
        title: "Akash/Max Standup — Bot Pipeline Progress & BOMA Livestream Clarification",
        summary: "Akash confirmed the automated upload bot was fully implemented in the production pipeline and just needed testing, with a working demo on sample files expected by Friday's call. Max clarified a mapping confusion Tudor had raised about BOMA video IDs on permanent hold — the extended migration run had picked up additional livestream VODs that were initially held before being fetched and properly migrated, and Max drafted a clarifying note to Tudor. Fran's report request was also closed out with an updated file covering all newly migrated livestream entries.",
        angle: "Recurring livestream-vs-VOD mapping confusion is worth documenting as a known gotcha for future Kaltura migrations.",
      },
      {
        title: "OE Staffing Team Sync",
        summary: "The team flagged a Salesforce-to-Teams integration bug (only the project manager gets auto-added to a Teams channel on a new order, not the full delivery team) traced to a weekend platform change, plus a separate, unrelated issue of assets disappearing from Teams' shared tab. Onboarding updates covered a new part-time cohort starting July 29, Shelby joining full-time the next day, Pete Carroll starting July 27 on the Zoom sales team, and a solutions engineer hire hoped for soon.",
        angle: "The Teams auto-add bug is worth tracking since it directly affects delivery-team visibility on new orders.",
      },
      {
        title: "IFRS/Zoom Closed-Captions Troubleshooting",
        summary: "A lengthy technical session with Zoom engineers traced missing transcripts and captions on IFRS's staged embeds to a missing player-profile-ID parameter in the embed script — once added, the transcript button still didn't render, escalating the issue to Zoom's engineering team overnight. The deeper issue for IFRS is that Zoom's custom-caption system is all-or-nothing per video (uploading a custom file permanently replaces the auto-generated one, with no way to selectively suppress AI captions site-wide while keeping custom ones), which Zoom confirmed has no near-term fix beyond its native custom-captions feature launching August 2.",
        angle: "The all-or-nothing caption limitation is a real platform gap for any client wanting selective custom vs. AI-generated captions — worth flagging to Zoom product.",
      },
      {
        title: "Zoom Support Line Planning",
        summary: "Andrew, Kara, Kristen, Josh, Max, and Mithun walked through the support-line chat flow end to end and discussed moving Salesforce lead creation from sandbox to production. Rather than over-engineer the post-engagement follow-up before understanding real volume, the group opted for a simple manual approach — new leads routed to Kara, Andrew, or Amelia for assignment, with a templated thank-you email drafted for follow-up. An inbound email about a CMS migration opportunity was also flagged for likely handoff to Kara or Kristen.",
        angle: "This support line is quietly becoming a second lead-gen channel alongside Streamlinks — worth tracking conversion once volume grows.",
      },
      {
        title: "ZCC↔Workato Technical Build Session",
        summary: "Max and Mithun built the technical plumbing to connect Zoom Contact Center wrap-up events to Workato, working around the lack of a built-in trigger in Workato's Zoom connector by setting up a ZCC OAuth app with event subscriptions pointing to a new webhook-based recipe. They landed on a two-flow architecture (session-start to Salesforce/Freshdesk lead creation; wrap-up to record updates).",
        angle: "This ZCC-Workato integration is foundational infrastructure for automating lead capture off the support line.",
      },
    ],
  },
  {
    day: "Wednesday", date: "July 22", meetingCount: 4,
    meetings: [
      {
        title: "Akash/Kieran Standup — City Report Delivered",
        summary: "Akash confirmed the City metadata report was generated and attached to its ticket for Mithun's review, with no other major updates; the bot build remained on track for Friday's demo.",
        angle: "Minimal update, straightforward status check.",
      },
      {
        title: "Monthly Salesforce/Integrations Office Hours with Ali",
        summary: "Ali fielded a series of Salesforce order-structuring questions, using a client quarterly-billing series to reinforce the standard: one parent order ties a series together, with one child order per individual session for staffing and invoicing clarity, rather than one child per quarter. He clarified that products only auto-roll-down from parent to child orders converted from an opportunity, and walked through the correct billing-status sequence for OE Stream renewals (mark 'Delivered,' not 'Complete,' until invoiced, since 'Complete' locks the record). He also previewed the phased Salesforce event-type field migration and demoed new local-timezone display fields designed to prevent the classic mistake of scheduling an event in the wrong timezone.",
        angle: "The timezone-field fix directly addresses a recurring scheduling error that's bitten the sales team for years.",
      },
      {
        title: "Mithun/Max Sync — City File Gap & Support-Line Cleanup",
        summary: "Mithun flagged 54 of 818 City files as zero-byte/corrupted for investigation, and separately, a flagged missing video led to discovering a June 10-17 migration date gap that Max agreed to patch the same day. Mithun also disclosed he'd accidentally logged a personal test engagement on the new Support Line bot while demoing it, prompting a plan to build a separate test/demo queue so testing doesn't pollute real lead data going forward, and relayed team feedback that the support-line webpage should clarify what it doesn't cover.",
        angle: "Standing up a dedicated test queue is a small but important fix to keep support-line lead data clean.",
      },
      {
        title: "Nathan/Michael (Marketing) Sync",
        summary: "Michael shared strong Q2 marketing results ($105K in closed-won pipeline attributed to the website, a 656% increase over Q1, steady LinkedIn growth, and early engagement from Zoom's overlay/AE team on a new email campaign). Mithun pitched making OE's website 'agent-readable' given the rise of AI-driven search, and demoed a Claude/Vercel-built CMS-migration quote calculator he'd built for frustrated Zoom AEs, along with his broader workflow of forking open-source UI projects and refining them with a custom multi-agent design pipeline.",
        angle: "The agent-readable website concept is a forward-looking SEO/discoverability angle worth raising with marketing leadership as AI search grows.",
      },
    ],
  },
  {
    day: "Thursday", date: "July 23", meetingCount: 1,
    meetings: [
      {
        title: "Akash/Max Standup — City File Corruption & Urgent IFRS Pull",
        summary: "Akash confirmed the CT metadata report was reviewed and approved, with only minor bug fixes landing in Friday's bot update. Mithun flagged a City migration issue via a new ticket: 54 of the 818 delivered files came back as zero-byte/corrupted and need investigation. The bigger item was an urgent, same-day request from IFRS's UK team to pull Kaltura content from July 18-22 — originally scheduled for the following Tuesday, but moved up against a tight UK deployment window — which Akash agreed to handle despite travel/network issues, with backup help on standby. Max joined partway through, confirmed the team was now correctly targeting today's pull, and said he'd share the fully reconciled gap-content file from Wednesday's discovery once he got home.",
        angle: "A recurring pattern this week — content-migration deadlines keep getting compressed on short notice — is worth surfacing as a scoping/buffer lesson for future Kaltura-to-Zoom migrations.",
      },
    ],
  },
  {
    day: "Friday", date: "July 24", meetingCount: 5,
    meetings: [
      {
        title: "Internal Okta S3-to-S3 Prep with Kieran",
        summary: "The team reviewed Zoom's S3-to-S3 migration documentation against Kieran's outstanding questions, working through confusion over whose S3 bucket is involved in the flow (the customer stages files and grants Zoom read access; Zoom copies into its own relay bucket, then access is revoked) and confirming that Zoom Events is out of scope for both Okta and Indeed since both are migrating specifically to Zoom Video Management. The open question left unresolved was how OE should formally notify Zoom's ops team when a transfer is ready to go — no automated mechanism exists today.",
        angle: "The notification gap is worth solving before scaling this migration pattern to more customers.",
      },
      {
        title: "Mithun/Max — ZCC↔Freshdesk Technical Testing",
        summary: "The pair live-tested the Freshdesk ticket-creation recipe built earlier in the week, fixing field mappings (group ID, product ID, name concatenation) and disabling an unwanted customer-facing 'ticket created' confirmation email that shouldn't go out unless follow-up is actually needed. They confirmed tickets route to the correct Freshdesk group in real time and added logic to check for existing Salesforce leads by email to avoid duplicate creation for repeat callers.",
        angle: "This closes the loop on the support-line-to-Freshdesk automation, making the lead pipeline meaningfully more production-ready.",
      },
      {
        title: "OE Q2 Business Review (Company All-Hands)",
        summary: "Leadership reviewed Q2 results (~$300K short of the $43.5M full-year goal but tracking well), welcomed three new sales hires, and previewed board-meeting talking points for the following Tuesday. Institutional/capital-markets had its strongest quarter in years driven by the SpaceX IPO, the corporate team closed seven deals in the final 24 hours, and the Zoom segment was acknowledged as understaffed, driving the Josh and Pete Carroll hires. Marketing presented strong pipeline growth, the Zoom-partnership lead covered deals and named CMS/video-management migration as a growth focus for Max and Mithun, and the GCS team closed with a full review and individual rep shout-outs.",
        angle: "Leadership explicitly called out CMS/video-management migration as a named growth area for Max and Mithun — useful validation for prioritizing that work.",
      },
      {
        title: "Zoom S3-to-S3 Technical Walkthrough with Vijay",
        summary: "The team stepped through Zoom's migration guide end to end and surfaced a real gap: once content lands in Zoom's own S3 bucket, OE has no clear way to access it to patch metadata unless Zoom explicitly grants read access — something Vijay said is likely but unconfirmed. Vijay demoed the upcoming 'Sites/Site Pages' feature, a channel-grouping hub that addresses Okta's request for multi-level channel organization, though it won't ship until after September, and confirmed the chapter/clip APIs needed to preserve Okta's chaptered videos already exist.",
        angle: "The post-transfer metadata-access gap is a real technical risk that needs resolving before Okta's migration can fully proceed.",
      },
      {
        title: "Okta External Check-In Call",
        summary: "With Okta's team, OE delivered two updates: chapter-creation APIs are now confirmed available (resolving Okta's top technical ask), and a walkthrough of the upcoming Sites/Site Pages structure for organizing channels. The call clarified Okta's S3 bucket structure (paired media files and UUID-matched metadata JSON containing playlist, channel, and chapter info), confirmed historical analytics can't migrate to Zoom (export-only), and scheduled a dedicated session next week to jointly design the final channel/site structure.",
        angle: "Getting ahead of the channel/site design before the technical migration starts should reduce costly rework later.",
      },
    ],
  },
];

export default function Week23Report() {
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
        <a href="/weekly_report_week23.pdf" download="Weekly_Report_Week23_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 23</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>July 20 &ndash; July 24, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "21", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "23", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 23 Analytics</strong> &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> City &middot; IFRS &middot; Okta S3-to-S3 &middot; Zoom Support Line &middot; ZCC/Workato &middot; Veracast Migration &middot; AI Tooling Rollout
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>This week combined steady migration operations &mdash; City, IFRS, and early Okta groundwork &mdash; with a real investment in internal automation, as the Zoom support line&rsquo;s lead-routing pipeline went from concept to tested infrastructure and produced its first attributed closed deal. Small but consequential data-integrity gaps surfaced in both the City and IFRS migrations (corrupted files, a missed migration window, a livestream-ID mapping mix-up) and were caught and patched quickly. A detailed technical session with Zoom&rsquo;s product team clarified &mdash; and partially complicated &mdash; the path forward for Okta&rsquo;s S3-to-S3 migration, surfacing an open question about post-transfer metadata access. The week closed with Friday&rsquo;s Q2 business review, which named CMS/video-management migration as a strategic growth area for Max and Mithun heading into the second half of the year.</p>
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
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead</h2>
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
