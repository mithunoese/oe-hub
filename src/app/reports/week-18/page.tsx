"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-18";

const themes: Theme[] = [
  {
    title: "IFRS Migration Closed Out",
    text: "The week opened with the discovery of 816 livestream entries that had never been migrated — 765 with recoverable recordings hidden under a “recorded entry ID” field the original pipeline had not targeted. Within two days, Akash ran the full pipeline for those 765 videos, reconstructed PowerPoint presentations from rendered slide images using Kaltura cue point data, and Max delivered an updated mapping report to Tudor linking each livestream entry ID to its corresponding Zoom video ID. Tudor canceled his Thursday follow-up call indicating the team had what they needed. One open item remains: a tag metadata patch deferred to the July Zoom release due to the current code freeze.",
  },
  {
    title: "Indeed Migration Contract and Kickoff",
    text: "Indeed represented the week’s most urgent commercial priority. Kara flagged at Monday’s all-hands that the SOW must close within the week, and the team cleared a security compliance hurdle mid-week when Mithun’s technical response to Indeed’s security team received confirmation that approvals were moving forward. The contract is fully redlined and accepted on OE’s side. The migration is structurally the same Kaltura-to-ZVM pipeline validated on IFRS, and Max confirmed that discovery sessions with the Indeed team will begin the following week.",
  },
  {
    title: "OE Support Line Moves to Pilot",
    text: "The Zoom Contact Center support line advanced from internal design into operational planning. Max demoed the full agent experience to OE’s staffing leadership for the first time: web chat triggers a Zoom Contact Center queue, agents accept calls like incoming Zoom Phone calls, and AI-generated engagement briefs are produced automatically post-session. The staffing team aligned on a launch roster (Lucy and Liza for EMEA, Shirley and Wayman for APAC), a July 6 pilot go-live date, and a supervisor access model for real-time monitoring. In parallel, Mithun scoped two Salesforce integration paths with Nilesh: a contact lookup and lead-creation flow for the chat widget, and a Teams-embedded CRM agent that parses meeting transcripts and updates opportunity fields.",
  },
  {
    title: "OE AI Delivery Vision Advancing",
    text: "Three threads this week pushed the OE AI team agenda forward. Thomas’s PM automation proof-of-concept — a form-driven checklist and document generator built in 30 minutes — was demoed to the AI team and validated the knowledge repository thesis, saving an estimated 32 hours per month across his 16 monthly events. Devin’s workflow deep dive gave Mithun the ground-level requirements for Dottie’s first automation targets: manual Central configuration steps, attendee entry from email schedules, and the Salesforce-to-Central reconciliation that PMs currently perform by hand each evening. Eric Castillo’s full-time hire as associate solutions engineer is moving toward offer, with Mithun involved in drafting the job description and the upcoming interview process.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Indeed SOW Signature — Mithun / Kara",
    text: "The contract is fully redlined and accepted on OE’s side. The security team email received positive confirmation from Indeed. Close this week and proceed to Indeed discovery kickoff with Max and Akash targeting the following week.",
  },
  {
    title: "Chris Millen Pricing Deliverables — Mithun / Peter",
    text: "Deliver ballpark pricing for the 40-terabyte big pharma Kaltura opportunity and the Panopto EU university (42,000 assets, estimated 20–30 TB). Build a lightweight migration cost calculator for the ZVM sales team and draft a summer education special one-pager with an anonymized migration success story to reduce deal friction.",
  },
  {
    title: "ZVM Bot Validation — Akash / Max / Mithun",
    text: "Akash estimated the bot will be in strong shape for Kaltura-to-ZVM migrations by the weekend of June 21. Validate end-to-end with a test run, confirm pipeline behavior for the Indeed source configuration, and document the OAuth credential flow for Okta onboarding.",
  },
  {
    title: "OE Support Line Pilot Prep — Max / David / Mithun",
    text: "Internal testing week of June 30 with Max, David, and the senior staffing team as agents. Obtain Zoom Contact Center licenses for the supervisor team. Complete Salesforce connector testing with Nilesh using stage credentials. Confirm July 6 as the pilot go-live date with Amelia.",
  },
  {
    title: "IFRS Closeout and Fan Follow-Up — Max",
    text: "Retry the metadata patch for the 759 newly migrated videos once the June Zoom release propagates. Follow up with Fan on the 100-video playlist limit as a July release request. Confirm with Tudor that all embed links are resolving correctly and that the migration is formally complete.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "June 15", meetingCount: 5,
    meetings: [
      {
        title: "ZCM Migration Standup — ZVM Bot Link Fix",
        summary: "Akash confirmed the AWS credential link issue on the ZVM bot was resolved and testing is underway against ZVM as the new destination. Remaining errors are infrastructure-level configuration issues rather than functional test cases, and AWS audit logs are available in plain text on the server. Akash estimated the bot will be ready for end-to-end migration testing by Wednesday and strong enough for Kaltura-to-Zoom use by the weekend, with a modified Okta path targeting the same timeline.",
        angle: "Bot stability ahead of Indeed and Okta scoping reinforces OE’s production-readiness narrative for the ZVM migration service.",
      },
      {
        title: "OE Support Line — Salesforce Integration Architecture",
        summary: "Max, Ali, and Mithun mapped the full web chat to Salesforce integration flow: visitor initiates chat, the contact center performs a Salesforce lookup, routes to lead creation or usage-count tracking for existing customers, and an engagement brief is generated on session close. Shadow launch was targeted for June 22 with sales team access on July 1. Ali flagged he needs to consult on Salesforce authentication before credentials can be provisioned. The QM tool natively stores session transcripts, removing the need for a separate archiving solution.",
        angle: "Defining the Salesforce architecture before the July 6 go-live ensures the contact center can route and track leads from day one rather than operating without CRM visibility.",
      },
      {
        title: "OE Monday All-Hands — NIRI Debrief and Q2 Pipeline Review",
        summary: "The team debriefed on NIRI, noting a lower IRO attendance ratio than expected but strong ComputerShare partnership momentum and 56 meeting sets with $647K in orders. Institutional pipeline was reported at 98% of target, with Exxon and Imperial Oil receiving verbal commitments. Kara flagged three urgent commercial items: the Indeed SOW must close this week, a Marsh contract is needed, and CrowdStrike at $4K is pending. Alan outlined an H2 focus on expanding the non-IRO universe.",
        angle: "The Indeed SOW urgency at all-hands establishes it as the week’s top commercial priority for the SE function.",
      },
      {
        title: "IFRS Migration Report Review — Max and Mithun",
        summary: "Max and Mithun reviewed the final IFRS report before client delivery. Notes included adding a thumbnail visibility callout, clarifying quiz text item behavior, confirming the 100-video playlist cap as a known Zoom limit, and minor editorial edits. Max committed to sending the polished report to Ryan and Peter at IFRS following the session.",
        angle: "Reviewing the report together ensures technical accuracy and consistent framing before it reaches the client stakeholders who will use it for ongoing reference.",
      },
      {
        title: "OE AI Initiatives and Role Development — Eric Castillo 1:1",
        summary: "Mithun walked Eric Castillo, an OE intern with Power Automate, SAP, and Power BI experience from a pharmaceutical internship, through the Vault Jump bot, OE Hub, and the Zoom Contact Center prototype. The conversation expanded into OE’s emerging AI team vision, with Joe and Chiwei endorsing an expanded role for Mithun. Role titles under consideration for Eric include Associate Solutions Engineer and Product Solution Specialist. A full-time fall hire appears likely, with Mithun to be involved in the job description and interview process.",
        angle: "Building the associate SE pipeline with candidates who have enterprise integration backgrounds directly extends OE’s technical capacity for the ZVM and AI agent roadmap.",
      },
    ],
  },
  {
    day: "Tuesday", date: "June 17", meetingCount: 8,
    meetings: [
      {
        title: "ZCM Migration Standup — Bot Credential Fix Confirmed",
        summary: "Akash confirmed the AWS credential link issue was resolved and active testing against ZVM was underway. Remaining errors are infrastructure-level configuration issues not requiring Jira tickets. Akash estimated end-to-end migration will be testable by Wednesday and the bot will be in strong shape for Kaltura-to-Zoom migrations by the weekend, with Okta requiring a separate modified path.",
        angle: "Each standup confirming incremental bot progress builds the credibility needed to commit Indeed and Okta migrations to the automated workflow.",
      },
      {
        title: "IFRS Livestream Entry Mapping Call with Tudor",
        summary: "Tudor joined to surface a critical gap: his website embeds use the original Kaltura livestream entry IDs, not the VOD entry IDs that OE migrated. After a livestream ends in Kaltura, the recording is stored under a separate VOD entry, but Tudor’s pages still reference the parent livestream ID. Max confirmed the current mapping report is insufficient and committed to producing a new report linking each livestream entry ID to its corresponding migrated Zoom video ID. Tudor also flagged that some entries use reference IDs rather than primary video IDs, raising a potential additional coverage gap.",
        angle: "Resolving the embed link mapping before IFRS goes live directly protects the delivery outcome and OE’s credibility on its first ZVM migration account.",
      },
      {
        title: "Max and Mithun — Post-Tudor Internal Sync",
        summary: "A brief follow-up immediately after the Tudor call to align on the livestream-to-Zoom mapping approach. Mithun offered to attempt the script via Kaltura APIs before escalating to the team. Both needed to join a Peter stakeholder call within 20 minutes, keeping the sync focused on immediate next steps.",
        angle: "Keeping the mapping work internal rather than immediately escalating prevented unnecessary delays on a time-sensitive client deliverable.",
      },
      {
        title: "IFRS and ZVM Stakeholder Call with Peter",
        summary: "Peter, a UK-based partner contact involved in IFRS’s original scoping, rejoined to discuss the ongoing migration and IFRS’s planned Zoom workflow. The new Zoom iframe embed player released the prior Friday was discussed as central to how IFRS will stream from their website going forward. Max walked through the full ZVM metadata transfer scope: tags (limit escalated from 500 to accommodate IFRS’s 4,700 unique tags), categories, thumbnails, captions (SRT converted to WebVTT), playlists, and channels. Quizzes were manually recreated for IFRS’s seven quiz entries. JSON resource files remain pending a Zoom platform release. An APAC-based Zoom events rep with a Vimeo background was introduced as a potential referral channel.",
        angle: "The tag limit escalation story and full metadata walkthrough are reusable enablement content for onboarding Zoom AEs and APAC partners to the ZVM migration service.",
      },
      {
        title: "Max, Mithun, and Akash — 765 Missing Livestream Recordings",
        summary: "Mithun and Max discovered that all 816 livestream entries in the IFRS Excel were marked permanent hold and never migrated. Investigation confirmed 765 have associated recordings in Kaltura under a “recorded entry ID” field that the migration pipeline had never targeted because it was built to skip livestream entries entirely. The 765 IDs are downloadable and processable through the existing pipeline. The remaining 51 livestream entries have no recording in Kaltura. Akash estimated one day to run the pipeline for the 765 IDs once given the full list. Mithun committed to filing the Jira ticket within 15 minutes.",
        angle: "Closing this gap before IFRS’s embed go-live removed the last major technical blocker for full backwards compatibility with their existing website embeds.",
      },
      {
        title: "OE Zoom Content Marketing Strategy — Kurt, Kara, Michael, Max, Mithun",
        summary: "Kurt, a marketing consultant newly engaged by OE, presented an outreach concept targeting existing OE-Zoom customers for service expansion and net-new Zoom customers via LinkedIn. The group aligned on short-form content: LinkedIn teaser posts paired with a 90-second demo video and a CTA for a deeper-dive meeting. Mithun advocated for the education market as a near-term focus, citing summer budget cycles and cost pressure from legacy platforms like Kaltura and Panopto. A named case study was flagged as a future goal pending client approval.",
        angle: "Formalizing the education migration pitch and short-form video assets creates a repeatable lead-generation mechanism tied to OE’s strongest near-term CMS opportunity.",
      },
      {
        title: "Amelia, Devin, and Mithun — Business Strategy Conversation",
        summary: "Amelia, Devin, and Mithun held a candid discussion on OE’s positioning, growth trajectory, and future investment priorities. The conversation covered the strategic value of the Zoom partnership, where capital investment would yield the highest return, and OE’s path to scaling delivery capacity. OE Dotty — the internal agent concept connecting delivery tooling across Lasso, Salesforce, Passport, and Central — was discussed as a high-priority product investment. Mithun and Devin shared perspectives on SE expansion and delivery automation as the highest-leverage areas.",
        angle: "Understanding OE’s strategic direction informs how Mithun positions the Zoom partnership and AI team work as core pillars of long-term company value.",
      },
      {
        title: "OE AI Initiatives Team Meeting — PM Automation Demo",
        summary: "Thomas, a project manager, demonstrated a tool he built in approximately 30 minutes using Claude that automates event setup documentation. The form-based intake generates a combined checklist, channel guidelines, client connection details, and templated emails drawn from OE’s training documents. Thomas estimated it saves roughly two hours per event, translating to approximately 32 hours saved monthly across his 16 events. Joe, Alex, and Annalisa discussed how the proof of concept maps to the broader knowledge repository initiative, and Alex proposed connecting the booking form intake to Salesforce as the next integration step.",
        angle: "Thomas’s POC validates OE’s delivery automation thesis and gives Mithun a concrete internal case study for the OE AI team pitch.",
      },
    ],
  },
  {
    day: "Wednesday", date: "June 18", meetingCount: 6,
    meetings: [
      {
        title: "ZCM Migration Standup — Tags Decision and Fan Escalation",
        summary: "A short standup centered on Akash’s message presenting options for handling the IFRS tag limit issue. Mithun and Max aligned on dropping the tags for now to unblock the migration, with Max committing to reach out to Fan (Zoom product manager) directly to escalate. Zoom had already planned to raise the tag limit to 10,000 in a two-phase approach.",
        angle: "Taking a drop-and-escalate approach rather than blocking delivery on a metadata field with zero functional impact on go-live shows sound delivery judgment.",
      },
      {
        title: "Salesforce Connector Session with Nilesh",
        summary: "Mithun walked Nilesh through two Salesforce integration use cases both blocked by an OAuth connector error. The first is the contact center workflow: visitor triggers a Salesforce lookup, checks existing customer status and usage-count fields, and if no match is found creates a new lead record. The second is a Teams-embedded Salesforce agent: Mithun pastes a meeting transcript, the agent parses opportunity fields, writes them to Salesforce, and confirms completion without requiring manual CRM entry. Nilesh offered stage credentials for testing and scheduled a follow-up Thursday.",
        angle: "Unblocking the Salesforce connector enables both the contact center launch and a transcript-to-CRM automation that would significantly reduce post-meeting admin time.",
      },
      {
        title: "OE Support Line Staffing Kickoff — Annalisa, David, Max, Mithun, and Staffing Team",
        summary: "Max and Mithun met with OE’s staffing leadership for the first time to align on how to staff the Zoom Contact Center support line. Attendees included Christina (senior staffing manager, Ohio), Teresa (9 years tenure, Massachusetts), Kevin (senior staffing manager, UK), and Emily (part-time, Zoom events). The team aligned on Lucy and Liza for EMEA and Shirley, Wayman, and incoming hire Anna for APAC. Go-live was pushed to July 6 to avoid the Fourth of July weekend, with staffing supervisors receiving Zoom Contact Center access for real-time monitoring.",
        angle: "Bringing staffing operations into the contact center design early ensures the launch is operationally sustainable and the escalation structure is in place before the line opens.",
      },
      {
        title: "Michael and Mithun — NIRI Registration List Format",
        summary: "A brief check-in with Michael to clarify the format of the investor meeting registration list. Michael confirmed the list should mirror an earlier version in structure, retaining all registrants but excluding known vendors including Q4, Broadridge, ComputerShare, and Notified. The list had been trimmed from 681 to 624 during deduplication; confirmed corrections will be applied.",
        angle: "Clean registration data supports NIRI post-event reporting and downstream investor outreach for the institutional sales team.",
      },
      {
        title: "Zoom Product Sync with Fan — Tags, JSON Files, and Embeddable Player",
        summary: "Max and Mithun connected with Fan, Zoom’s ZVM product manager. On tags: the June code freeze has passed and the limit increase targets the July release — Max made the case that tags are functionally unused in IFRS’s embed-only deployment. On JSON resource files: compression to zip and upload to the Zoom content library will be available as of Sunday June 22. On the embeddable web player: the new iframe-based livestream player is shipping in the June release, with IFRS among over 20 requesting customers alongside Ernst and Young, Carnegie Mellon University, and Citi. Fan agreed to enable it on OE’s sandbox production account.",
        angle: "Direct confirmation from Zoom product on all three open items gives OE a clean delivery roadmap to share with IFRS and reusable knowledge for every future ZVM migration engagement.",
      },
      {
        title: "Max and Mithun — IFRS Deliverables Working Session",
        summary: "Max and Mithun finalized the exact deliverables needed to close out the IFRS migration for Tudor. Tudor needs a mapping of each Kaltura livestream entry ID to the corresponding Zoom video ID (not the intermediate recorded entry ID). The PDF report requires only number updates. Channel assignment: 759 of 765 recordings were successfully migrated and all 759 need to be added to IFRS’s embed channel via the Zoom API (30 videos per call limit). Tags and playlists were confirmed functionally zero-value in IFRS’s embed-only scenario and deferred to the July limit increase.",
        angle: "Scope-controlling the final deliverables to what Tudor actually needs for go-live keeps IFRS on track without waiting for platform fixes that have no functional impact on their use case.",
      },
    ],
  },
  {
    day: "Thursday", date: "June 19", meetingCount: 7,
    meetings: [
      {
        title: "ZCM Migration Standup — Report Finalization and Indeed Kickoff",
        summary: "Akash completed the updated migration report overnight. The 3,400-row count was resolved — it resulted from a duplication between the first batch run marking on-hold entries and the second run completing those same entries under VOD IDs. The fix consolidates to one row per entity with the parent livestream ID in the source entry column. Max confirmed he had already sent Tudor a hand-built mapping, and Tudor’s follow-up call was canceled indicating receipt. Akash also confirmed he programmatically reconstructed PowerPoint presentations from Kaltura’s rendered slide images using cue point ordering. Max announced Indeed discovery meetings begin next week.",
        angle: "Closing Tudor’s deliverable and announcing the Indeed start in the same standup marks two major delivery transitions simultaneously.",
      },
      {
        title: "OE Sales Training — Cricket Summit Session 5",
        summary: "The fifth Cricket Summit session covered presentation technique with the full OE sales team. Core concepts included staging the value proposition at the top of a meeting, using OE marketplace FAQs as a structured credibility opener to surface and prioritize the prospect’s questions before answering them, the feature-advantage-benefit framework for presenting service offerings, and using indirect confirmation questions to elicit honest reactions rather than reflexively asking whether something makes sense.",
        angle: "The FAQ-as-meeting-guide framework is directly applicable to ZVM migration sales conversations, where pre-answering migration scope and pricing questions addresses the deal-stall pattern Chris Millen raised on the same day.",
      },
      {
        title: "Chris Millen — ZVM Inbound Migration Opportunities",
        summary: "Chris Millen, Zoom’s international video management specialist based in London, reached out with two inbound migration opportunities. The first is a large pharmaceutical company on Kaltura with approximately 40 terabytes of data; GDPR and data residency requirements are in play and pricing is needed. The second is a European university on Panopto with 42,000 assets, estimated at 20 to 30 terabytes, expected to close within one to two months. Mithun committed to pricing for both by end of day Friday. Chris also surfaced a recurring friction point: migration pricing ambiguity is stalling deals before commitment, and he wants a self-serve cost calculator to use in discovery meetings.",
        angle: "Both are ZVM migrations where the IFRS and Indeed playbook applies directly — and the calculator and one-pager assets committed serve the full ZVM sales motion beyond these two opportunities.",
      },
      {
        title: "OE Thursday Sales Weekly",
        summary: "Camden reported four meetings sourced independently this week: PepsiCo (two contacts), California Department of Public Health via Zoom office hours, and CoStar. Amelia clarified that Camden-sourced leads are not restricted to the Zoom platform — OE can sell Zoom, its own platform, or Teams managed service depending on discovery. A Teams Town Hall enablement demo for the sales team was requested for the week before July 1. On pipeline: Peter closed Genius Sports at $20–30K; Indeed must sign this week; Casey is pushing Atlassian toward a two-event pre-purchase at up to $100K before quarter-end. The contracting pipeline stands at $315K.",
        angle: "Camden’s non-Zoom pipeline opening and the Teams enablement push signal OE is deliberately expanding its total addressable market heading into H2.",
      },
      {
        title: "Devin — PM Workflow Deep Dive (OE Dotty Roadmap Session)",
        summary: "Devin walked Mithun through the full capital markets PM workflow using a live Bausch and Lomb demo build. The process spans OE Central (event creation via blueprints auto-generating Zoom webinar, OE Stream, and speaker links), OE Stream (webcast player with client branding), OE Passport (registration front end requiring manual meeting ID updates), and Salesforce (which creates the initial event shell and Teams channel but builds nothing else). A significant share of PM time goes to processing schedule confirmation emails received the night before and manually entering each meeting slot and attendee. Mithun identified nearly every manual step as a structured-field automation candidate for Dottie.",
        angle: "The PM workflow walkthrough gives Mithun the ground-level requirements for scoping Dottie’s first automation targets, tied directly to OE’s largest operational cost center.",
      },
      {
        title: "Andrew and Mithun — Weekly 1:1",
        summary: "Andrew and Mithun reviewed the full project landscape: IFRS at 99.9% pending client confirmation, Indeed kicking off next week, Zoom Contact Center Salesforce credentials just received and in testing, the Vault Jump bot progressing, and OE Dotty discussions underway with Joe and Chiwei (recently promoted to Director of Engineering). The workload has grown to approximately 40 active items in two weeks. Andrew flagged that the NIRI conference attendee scrape returned LinkedIn profiles only and email addresses are needed for outreach. Andrew is visiting New York the following week and proposed meeting Wednesday.",
        angle: "The full-project inventory makes clear Mithun’s work now spans migration delivery, product integration, AI tooling, and sales enablement simultaneously — context supporting the expanded role conversations underway.",
      },
      {
        title: "Max and Mithun — End-of-Week Sync",
        summary: "Max and Mithun wrapped Thursday noting the week was heavier than anticipated. They confirmed canceling Friday’s ZCM standup for Juneteenth. Max will ask Akash to send the finalized report and plans to monitor the 759 newly migrated videos before Monday, when the metadata patch retry should also run. For Chris Millen: Mithun will build the migration cost calculator, TCO tool, and summer education one-pager, and will send pricing for the 40-terabyte big pharma opportunity through Peter early the following week.",
        angle: "Ending the week with a defined deliverables list against Chris Millen’s asks sets up a clean post-holiday push into the ZVM migration pipeline.",
      },
    ],
  },
];

export default function Week18Report() {
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
        <a href="/weekly_report_week18.pdf" download="Weekly_Report_Week18_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 18</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>June 15 &ndash; 19, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "26", l: "Meetings" }, { n: "4", l: "Days" }, { n: "4", l: "Themes" }, { n: "18", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 18 Analytics</strong> &nbsp;&middot;&nbsp; IFRS closed out &nbsp;&middot;&nbsp; Indeed contracted &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Indeed &middot; Okta &middot; Support Line &middot; Dottie &middot; Chris Millen opps &nbsp;&middot;&nbsp; <em style={{ color: "#9ca3af" }}>Fri June 20 &mdash; Juneteenth holiday</em>
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 18 was defined by delivery execution and pipeline expansion across OE&rsquo;s Zoom partnership. The IFRS migration reached completion after a mid-week discovery of 765 unmigrated livestream recordings that were tracked down, migrated through the existing pipeline, and delivered to the client by Thursday &mdash; with Tudor canceling his follow-up call, indicating the team had everything they needed. In parallel, the Indeed contract moved to the edge of signature after a security compliance hurdle was cleared, the OE Support Line staffing kickoff confirmed a July 6 go-live, and two new inbound ZVM migration opportunities arrived from Zoom&rsquo;s London team. Internally, a PM automation proof-of-concept validated OE&rsquo;s AI delivery thesis, and a deep dive into PM workflows gave the SE team the ground-level requirements needed to scope the first Dottie automation targets.</p>
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
              <span style={{ fontSize: 11, fontWeight: 600, color: teal, background: "#f0fafa", padding: "3px 10px", borderRadius: 20 }}>{day.meetingCount} meeting{day.meetingCount > 1 ? "s" : ""} &rsaquo;</span>
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
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 19</h2>
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
