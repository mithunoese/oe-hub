"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-17";

const themes: Theme[] = [
  {
    title: "IFRS Final Mile — Late Discoveries Resolved Before Delivery",
    text: "The IFRS migration spent the week closing out a cascade of technical issues that emerged during final QA. S3's same-name file overwrite behavior caused attachment count discrepancies across more than 60 entries; agenda slide images had been classified and migrated as video thumbnails rather than slide documents for some entries; caption file logging failed to surface drop events; and a capitalization typo in a video ID email blocked Tudor's embed testing until corrected on Tuesday's client call. All issues were investigated, explained, and documented before the client report was delivered Friday. Two items carry into Week 18: Zoom's content library does not yet support JSON file import, requiring follow-up with Fan on timeline; and IFRS will be offered a 30-day post-completion data retention window before OE's S3 infrastructure is torn down.",
  },
  {
    title: "Indeed Migration Contract Kick-Off",
    text: "Monday's call with Indeed's Paul, Jacob, and Skylar formally resolved the starred clips retention question and aligned on the full migration scope. Zoom will deliver an admin toggle exempting starred clips from the 30-day auto-deletion policy, and OE will API-star all migrated clips at the moment of transfer. Kara sent the revised SOW and W-9 to Indeed the same afternoon, with Workday procurement running through Austin as the primary legal contact. Scope additions include Google Drive backup of migrated content, expanded project management hours, and a Kaltura-sourced viewership analytics report. Indeed will provide six service account channel names and user lists within the week, and a standing Monday noon Eastern cadence was established.",
  },
  {
    title: "Vault Jump Bot Architecture Formalized",
    text: "Wednesday's session with Joe and Chiwei was a structural inflection point for the migration bot. Mithun demoed the Zoom Marketplace entry point, the Vercel-hosted discovery interface, and his full agentic development workflow; Joe set engineering expectations around version control, DevOps pipelines, and client data isolation before any prototype moves toward production; and Chiwei was established as the engineering counterpart for formalizing the prototype-to-production pipeline. Separately with Akash, OE's ZVM OAuth credentials were created with Clips and Video Management scopes, channel creation and ownership assignment APIs were documented as new Jira tickets, and a JIRA-to-MongoDB knowledge sync was planned to give the bot automatic awareness of past migration edge cases. Akash is targeting a working end-to-end ZVM file migration demo via the bot for Monday.",
  },
  {
    title: "SE Fluency — Contact Center, Staffing Tooling, and Expanded Role",
    text: "The OE Support Line moved from blocked to ready this week: the camera and microphone permission failure was traced to OE's Passport hosting environment and resolved by moving to a Vercel-hosted page. Zoom Contact Center SE Nate walked the team through a full architecture from web chat intake through Salesforce CRM lookup and queue routing to video escalation, with Quality Management, Workforce Management, and CX Insights all available on OE's Elite licenses. A separate session surfaced OE's Lasso staffing platform limitations—400 operators, manual time card approval for 200-plus weekly, no automated change propagation—as an opportunity to evaluate Zoom WFM as an internal solution. OE's leadership formally expanded Mithun's remit into delivery-side AI tooling, and Mithun was asked to advise on the hiring and title structure for a new SE-adjacent function being built around an incoming full-time hire.",
  },
];

const lookAhead: LookAhead[] = [
  { title: "IFRS JSON Files and Final Closeout", text: "Max to follow up with Fan at Zoom on content library JSON support timeline; pending resolution, extend a 30-day data retention offer to IFRS before S3 teardown. Owner: Max." },
  { title: "Indeed Contract Execution", text: "Monitor Workday procurement through Austin; receive channel names and user lists from Indeed's team; Kara to finalize any SOW adjustments. Owner: Kara and Max." },
  { title: "Okta S3-to-S3 Architecture", text: "Max to confirm S3-to-S3 transfer flow details with Zoom engineering; Akash to begin ZVM channel creation and ownership assignment API review from the new Jira tickets. Owner: Max and Akash." },
  { title: "Vault Jump Bot Demo", text: "Akash targeting Monday demonstration of end-to-end file migration via the ZVM bot; ZVM credential and scope setup already complete. Owner: Akash." },
  { title: "Citi Transfer Method", text: "Max to call Citi contact to clarify whether the name and email request is procedural or required for server access provisioning; confirm next steps for SFTP access. Owner: Max." },
];

const days: DayData[] = [
  {
    day: "Monday", date: "June 8", meetingCount: 4,
    meetings: [
      { title: "IFRS Migration Standup — Internal", summary: "The morning standup confirmed that Akash planned to finalize the JSON column update in the migration report—changing it from a flag to a count—and had flagged two new errors from the weekend run: a resource upload failure caused by a .txt file extension and a thumbnail patch error. Max noted three legacy entities with outstanding failures were ones he had migrated manually. Akash committed to regenerating the corrected report within the hour. Max flagged an upcoming call with Indeed and proposed a 30-minute session with Akash later in the week to walk through the ZVM OAuth setup and admin interface before testing begins.", angle: "Internal pre-call QA discipline on the IFRS report catches edge cases before client touchpoints, protecting OE's delivery credibility at a sensitive final-mile stage." },
      { title: "OE Monday All-Hands — Weekly Pipeline Review", summary: "The full OE team reviewed performance and pipeline across all regions. Institutional had its best order week in three weeks at $537K, with SpaceX pricing its IPO on Thursday—described as three times larger than Saudi Aramco, with Goldman Sachs and Morgan Stanley as book runners and OE embedded in the investor communication workflow. Gibb and Naomi completed a London client tour covering Citi, Jefferies, Bank of America, Rothschild, and BMP Paribas, with Rothschild emerging as a multi-year opportunity through new hires Marina Panos and Lucy Baldwin. GCS closed approximately $110K in new business last week and added 14 new opportunities pushing pipeline to $4.7M. Jacob joined the UK GCS team as a new account executive with a background from ON24. Mithun updated the team that IFRS is 80–90% complete and on track to ship by end of week.", angle: "IFRS completion signaled publicly to the full OE team builds delivery credibility; Jacob's ON24 background is an immediate source of competitive intelligence on the migration displacement play." },
      { title: "Indeed Migration Update and Contract Kickoff", summary: "The team reconvened with Indeed's Paul, Jacob, Skylar, and Kara to confirm the starred-clips retention solution. OE will API-star all migrated clips at the moment of transfer, applying the same exemption logic already live for favorited whiteboards—preventing the 30-day auto-deletion until a user consciously un-stars a clip. Admin groups of 150 to 175 users will have the starred-exemption toggle enabled, with deactivated employee content defaulting to Skylar's account. Indeed agreed to create six service account channels and provide user lists within the week. OE committed to delivering Zoom embed codes and a Kaltura-sourced viewership analytics report. Kara sent the revised SOW and W-9 that afternoon, with Workday procurement running through Austin. A standing weekly cadence was established at Monday noon Eastern.", angle: "Contract kickoff positions OE as the lead migration partner for Indeed's 7,000-video Kaltura library with strong technical credibility on both Zoom platform knowledge and API delivery." },
      { title: "Indeed Scope and Proposal Review — Internal", summary: "Following the Indeed call, Kara, Max, and Mithun reviewed the proposal in light of new requirements. The team agreed to increase project management hours from 10 to 15, add a line item for Google Drive backup of migrated content, and include a Kaltura analytics summary report as a deliverable. The team also discussed establishing a regular cadence with Zoom's dedicated OE product resources to create a defined channel for platform-level product questions, keeping OE positioned as the delivery expert while Zoom carries platform authority for technical clarifications on new features like starred clips.", angle: "Revised scope and a Zoom product expert cadence strengthens OE's co-sell motion and protects delivery credibility as the Indeed engagement scales." },
    ],
  },
  {
    day: "Tuesday", date: "June 9", meetingCount: 4,
    meetings: [
      { title: "IFRS Migration Standup — Internal", summary: "Max joined having reviewed the migration report overnight and added columns to compare thumbnail and caption counts against what was actually migrated. Across 23 flagged entries, thumbnail discrepancies ranged from cases explained by Zoom's five-thumbnail maximum to others requiring further log review. Caption logging gaps surfaced—some files dropped due to Kaltura errors never produced an error flag in the report, meaning the pipeline returned clean output that didn't reflect actual state. Max asked Akash to pull specific entity IDs from the ticket and investigate the logs.", angle: "Pre-call QA surfacing logging gaps before client delivery prevents OE from presenting a report that misrepresents actual migration state, protecting both the client relationship and OE's delivery standard." },
      { title: "IFRS Pre-Call Report Review — Internal", summary: "Max walked Mithun through a detailed analysis of 63 migration entries where the attachment count formula did not balance. The core finding: Kaltura allows the same file to be attached multiple times under the same filename, and OE's S3 download pipeline overwrites same-name files—resulting in fewer migrated resources than Kaltura's count suggests. Spot checks confirmed the duplicated files were identical in content. A second issue emerged: agenda slide images were being classified and migrated as thumbnails rather than slide documents. The team aligned on showing the Zoom UI on the upcoming client call rather than sharing the raw report, and confirmed three new video IDs for Tudor's embed testing.", angle: "Deliberate pre-call alignment prevents unresolved internal edge cases from surfacing on a client call, protecting OE's delivery credibility at a sensitive handoff stage." },
      { title: "IFRS Embed Testing and Product Gaps Review — Client Call", summary: "The IFRS technical team including Tudor, Fan, Elizabeth, Ryan, and Priya joined Max and Mithun to review outstanding integration issues. Tudor's embed testing blocker resolved quickly: one video ID had a capitalization error introduced in an earlier email; all newer migration IDs tested successfully on the call. Fan confirmed the start-time parameter requires a new API targeting the July 19 release; Elizabeth and Tudor agreed to add interim language on affected meeting pages. For four entries with tags exceeding Zoom's 50-character limit, Fan confirmed a July code change is needed with abbreviated tags as a near-term workaround. Max disclosed that duplicate-named attachment files had been deduplicated; Ryan confirmed this was acceptable. Fan noted tags also power ZVM's content recommendation engine in addition to search.", angle: "Clean resolution of the embed issue keeps Tudor's testing on schedule; surfacing the start-time and tag-limit gaps as documented Zoom product feedback strengthens OE's position as an engaged delivery partner." },
      { title: "Attachment Deduplication Analysis — Claude Code Working Session", summary: "Max and Mithun ran an internal working session to verify whether 63 duplicate-named attachment entries contained identical or genuinely different content. Using Claude Code, they downloaded files grouped by entry ID and ran character-level text comparisons, producing a structured table of unique JSON count, unique TXT count, and empty file count per video ID. Analysis confirmed duplicates were overwhelmingly identical in content, validating OE's deduplication behavior. The session surfaced a recurring operational gap: the extraction pipeline lacked logging to proactively flag these cases. Mithun proposed requesting read access to OE's S3 bucket to eliminate the back-and-forth of routing file inspection requests through engineering.", angle: "Proactive duplicate file verification before client report delivery protects OE's credibility; the S3 access request and logging improvement set up a faster internal QA loop for the Indeed migration and beyond." },
    ],
  },
  {
    day: "Wednesday", date: "June 10", meetingCount: 6,
    meetings: [
      { title: "IFRS Migration Standup — Internal", summary: "Quick check-in confirming that Max and Mithun had resolved all outstanding discrepancies across files, thumbnails, and captions the previous afternoon. Max planned a 2pm session with Mithun to polish the raw CSV into client-ready format, after which he would send Ryan the report along with an offer to walk through the content and show the Zoom UI. Mithun flagged that IFRS may benefit from a supplemental OE onboarding session given their team's limited Zoom platform experience, and committed to reaching out to Peter.", angle: "Proactive offer of post-migration onboarding for IFRS creates a natural upsell opportunity for OE's managed services and establishes a delivery-to-retention handoff pattern." },
      { title: "OE Support Line Architecture Deep-Dive — Zoom Contact Center", summary: "Max and Mithun joined David and Nate, a Zoom Contact Center SE, to work through the support line architecture. The camera and microphone permission blocker was traced to OE's Passport hosting environment; a Vercel-hosted page resolved it cleanly. Nate walked through a complete reference architecture: web chat widget captures initial contact information, routes unauthenticated visitors through a Salesforce new-lead creation script, and prioritizes existing customers at the top of the live agent queue via JSON API calls in the flow builder. Nate demonstrated Quality Management scorecards, Workforce Management shift adherence reporting, and the CX Insights natural language interface for querying all contact center interaction data. MCP integration is currently concentrated in Zoom Mate rather than the contact center flow builder.", angle: "Full architecture clarity on the web chat to video escalation flow clears OE's path to go-live, and the Salesforce script approach enables a lead-tracking data flywheel from first contact without a Salesforce agent license." },
      { title: "Vault Jump Bot Demo and Engineering Alignment — Joe and Chiwei", summary: "Joe introduced Chiwei as a new engineering contact for a technical walkthrough of OE's migration bot prototype. Mithun demonstrated the Zoom Marketplace app entry point, the Vercel-hosted discovery interface, and his agentic development setup using Claude Code with an orchestration agent, specialized sub-agents, and MCP connectors for Vercel and GitHub. Joe set engineering expectations: rapid prototyping is valuable as a communication tool, but version control, DevOps pipelines, and client data isolation are required before production. Joe outlined agent workforce orchestration tools—Paperclip and Anthropic's Software Factory—as directions OE engineering is exploring to formalize the prototype-to-production pipeline.", angle: "Establishing a direct relationship with OE's engineering leadership on the bot architecture surfaces the path from rapid prototyping into a productized platform and positions Mithun as the business-side driver of OE's AI tooling adoption." },
      { title: "Lab Roots and Webinar.net Prospect Check-In", summary: "Brief check-in with Andrew, Kyle, and Mithun on a Webinar.net prospect in conversation for three to four months. Andrew committed to re-engaging Greg, their primary contact. The team noted that Zoom's upcoming late-June release includes custom lower thirds in Production Studio—a capability the prospect had cited as a gap versus Webinar.net—providing a concrete new proof point. The team aligned on introducing OE's migration capability as the solution to the prospect's hesitation around operational migration complexity, and agreed to apply a close-or-deprioritize signal if the account continues to stall.", angle: "New Production Studio lower thirds capability closes the competitive gap that had stalled this deal, and framing OE's migration offering as the answer to migration complexity turns the prospect's main objection into OE's differentiation." },
      { title: "ZVM OAuth Setup and Indeed Migration Architecture — Akash Walkthrough", summary: "Max walked Akash through creating a server-to-server OAuth app on the OE account carrying the Zoom Video Management license—a distinct account from the sandbox used for Zoom Events migrations. Akash successfully created the app with Clips and Video Management scopes activated. Max demonstrated the ZVM UI end-to-end: migrated videos land in Zoom Clips with an assigned owner, then are added to a ZVM channel with collaborators and restricted viewer access. For Indeed, OE plans four service account-owned channels with 150–175 users as collaborators. A JIRA-to-MongoDB knowledge sync was planned to give the migration bot semantic awareness of past migration edge cases; Akash confirmed feasibility and committed to revisiting the architecture document the following day.", angle: "ZVM credential setup gives Akash what he needs to begin Indeed testing immediately; the JIRA knowledge sync architecture accelerates the bot's ability to self-reference past edge cases during discovery for any future client." },
      { title: "IFRS Migration Report Cleanup — Client Handoff Prep", summary: "Max and Mithun ran a focused session preparing the IFRS CSV for client delivery. Attachment deduplication analysis confirmed five of fifteen flagged entries had byte-for-byte identical duplicate TXT files that were both migrated—a behavior tied to S3 not overwriting same-named files. Max committed to manually deleting duplicates in Zoom before the report goes out. The team decided to hide internal check columns while retaining entity IDs, titles, media type, Zoom video IDs, thumbnail counts, resource counts, and slides added, and to add a plain-English header row defining each column. Mithun committed to producing the polished client-facing version with cover page and summary analytics. Max would send Ryan an interim deduplication analysis email, with the full report following by end of week.", angle: "Thorough pre-delivery cleanup and annotated column headers set a replicable documentation standard for client-facing migration reports across all future ZCM engagements." },
    ],
  },
  {
    day: "Thursday", date: "June 11", meetingCount: 3,
    meetings: [
      { title: "IFRS Migration Standup and ZVM Testing Plan", summary: "Quick standup where Max confirmed both Indeed and Okta are moving forward as ZVM migrations. Max shared Vijay's technical document detailing the ZVM migration flow—Zoom Clips upload, metadata patch, then channel assignment—and asked Akash to review it. For Indeed testing, Max proposed creating test channels in OE's ZVM account to validate content routing to multiple channels, the key architectural difference from IFRS. For Okta, Max flagged that Zoom may offer a direct S3-to-S3 transfer flow where content moves from Okta's existing bucket directly into a Zoom-owned bucket, and committed to confirming specifics with Zoom before Okta contracts.", angle: "Parallel ZVM testing setup for two distinct migration architectures—channel-based for Indeed and S3-to-S3 for Okta—positions OE's engineering team to begin work as soon as contracts execute." },
      { title: "OE Staffing Operations Review and AI Tooling Opportunity", summary: "Mithun met with Annalisa from OE's operations and HR team to understand OE's staffing workflow. OE manages approximately 400 part-time operators across concurrent global events using Lasso, a scheduling platform requiring significant manual workarounds. Key friction points include manual time card approval for 200-plus operators weekly, no calendar visualization of overlapping shifts across time zones, no automated change propagation after events go live, and duplicative data entry across Lasso, Salesforce, and OE's event hub Central. OE pays approximately $50K annually for Lasso with the last vendor evaluation in 2023. Mithun shared the Zoom Contact Center Workforce Management module preview, which Annalisa found relevant for time-zone-aware scheduling and adherence monitoring. OE's leadership formally expanded Mithun's remit into delivery-side AI tooling, and Mithun was asked to advise on the title structure for a new SE-adjacent function being built around an incoming full-time hire.", angle: "Deep visibility into OE's internal staffing pain positions Zoom Contact Center WFM as a meaningful internal recommendation while the formalized AI prototyping pipeline and hiring initiative extend Mithun's direct influence across OE's delivery and engineering functions." },
      { title: "GCS Weekly Pipeline Review", summary: "The GCS team reviewed weekly pipeline health: 18 meetings booked, 14 of 20 opportunity targets, two deals closed out of ten. Kara is working two deals expected to close by end of week—one waiting on a purchase order and one with a client-committed June signature. Peter has a potential $26K close across two line items from one existing customer with a final-push pricing conversation that afternoon. A competitive situation has a prospect comparing OE's proposal against a lower-cost alternative; the team emphasized OE's delivery track record and reduced onboarding friction. Max briefed the team that the IFRS report is expected by end of week and that both Indeed and Okta are moving forward on ZVM migrations.", angle: "IFRS delivery completing at end of week gives OE a concrete migration win to reference in active deal conversations, while Indeed and Okta ZVM starts represent the first revenue from the migration practice Mithun has been building." },
    ],
  },
  {
    day: "Friday", date: "June 12", meetingCount: 1,
    meetings: [
      { title: "Migration Standup — IFRS Closeout and ZVM Prep", summary: "Brief end-of-week standup covering three active migration threads. On IFRS, Max confirmed the full migration report would go out that day; Tudor had received the updated video ID mapping file earlier in the week without issues. One outstanding item remains: Zoom's content library does not yet support JSON files, so Max will follow up with Fan the following week and bundle the remaining JSON files in one pass once support is available. The team agreed to offer IFRS a 30-day post-completion data retention window before S3 teardown. On ZVM preparation, Akash is completing the file transfer layer and expects to demonstrate working end-to-end migration via the bot early the following week. Max created two new Jira tickets covering ZVM channel creation, ownership assignment, and video-to-channel assignment flows, consolidating with existing tickets ZCM 80 and ZCM 82. Target completion for both Indeed and Okta remains end of August. On Citi, Max reported the client is close to completing server setup and has requested a name and email from OE's side; Max planned to call the Citi contact that afternoon to clarify whether this is procedural or required for access provisioning.", angle: "IFRS delivery at the finish line with a clean data-retention handoff protocol sets a professional close for OE's first full ZVM migration and establishes the close-out standard for all future engagements." },
    ],
  },
];

export default function Week17Report() {
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
        <a href="/weekly_report_week17.pdf" download="Weekly_Report_Week17_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 17</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>June 8 &ndash; 12, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "18", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "17", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 17 Analytics</strong> &nbsp;&middot;&nbsp; IFRS delivered &nbsp;&middot;&nbsp; Indeed contracted &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Indeed &middot; Okta &middot; Vault Jump Bot &middot; Contact Center &middot; Citi
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 17 was defined by finishing one major delivery and formally starting two more. IFRS&mdash;OE&rsquo;s first end-to-end Kaltura-to-Zoom migration&mdash;crossed the finish line with the client-facing report shipping Friday, after a week of intensive QA that surfaced duplicate file behavior in S3, thumbnail misclassifications, caption logging gaps, and a video ID typo that were all resolved systematically before delivery. On the pipeline side, the Indeed contract kicked off formally following Monday&rsquo;s call confirming Zoom&rsquo;s starred clips retention solution; Kara sent the revised SOW and W-9 that afternoon with scope set at approximately $18&ndash;19K. Okta advanced in parallel, with ZVM internal testing infrastructure now in place and an end-of-August target set for both engagements. Engineering leadership formally engaged on the migration bot architecture through Joe and Chiwei, the OE Support Line cleared its last technical blocker, and OE&rsquo;s leadership expanded Mithun&rsquo;s role into delivery-side AI tooling&mdash;making this the week where migration delivery, new pipeline, and internal infrastructure all moved forward at once.</p>
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
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 18</h2>
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
