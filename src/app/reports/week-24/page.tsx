"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-24";

const themes: Theme[] = [
  {
    title: "IFRS Migration Formally Closes Out",
    text: "A year-long thread wrapped this week — a final reconciliation exercise resolved every discrepancy between IFRS's Kaltura UI count and the migration report (down to three explainable buckets: no-media placeholders, drafts, and already-migrated errors) before source access shut off, while a parallel deep-dive into chapter and cue-point data gave Zoom's product team the analysis it needed for its own agenda-slide chapter-recreation feature.",
  },
  {
    title: "Mithun's Role Formalizes Around AI-Driven Engineering",
    text: "Alan confirmed Mithun's shift to sit more directly under Joe's engineering-adjacent track, explicitly positioning him as the connective tissue between sales, product, and engineering as OE doubles down on AI-built software company-wide. The AI-tooling push kept spreading in parallel — a Microsoft Copilot Studio knowledge-base test, early access requests for Zoom's Content Studio, and getting Devin set up with Claude API access.",
  },
  {
    title: "Okta and Indeed Advance in Parallel, Both Gated on Zoom",
    text: "Both migrations moved from planning into concrete steps this week — Indeed delivered channel IDs and service-account ownership data for a 30-video dry run, and Okta locked a dedicated architecture-mapping session — but both remain dependent on Zoom's Sites/Site Pages feature, which won't ship until after September.",
  },
  {
    title: "New Revenue Threads Open Outside Core Migration",
    text: "A CVS bulk-video-hosting proposal (~400 videos, ~$12K estimate), DXC's departure-migration SOW pricing ($20K&ndash;$41K tiers), and a deep technical conversation with Zoom's marketplace PM about productizing OE's workflow as a native app all point toward diversifying revenue beyond one-off CMS migrations.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Run Okta's Channel-Mapping Working Session — Mithun / Max / Sammy",
    text: "Use the exported channel inventory to jointly design the final channel/site structure, factoring in Zoom's upcoming Sites/Site Pages release.",
  },
  {
    title: "Execute Indeed's 30-Video Dry Run — Mithun / Akash / Max",
    text: "Move 5 videos per channel across all 6 channels once Zoom access and OAuth app creation come through.",
  },
  {
    title: "Finalize CVS and DXC Pricing — Mithun / Jules / Tomaso",
    text: "Send the CVS bulk-hosting quote (~40 hours man-work) and lock in DXC's tiered SOW pricing for their platform departure.",
  },
  {
    title: "Follow Up with Zoom Marketplace/DevRel — Mithun",
    text: "Continue the thread with Abe on manifest API vs. Connect service architecture, and loop in Will Worthington on security/waiver requirements ahead of the August MVP app submission.",
  },
  {
    title: "Continue Migration Bot UX Redesign — Mithun / Akash",
    text: "Implement the 3-phase source-selection/discovery/permissions flow and get internal Kaltura test account credentials sorted so future demos don't touch live client data.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "July 27", meetingCount: 8,
    meetings: [
      {
        title: "Max/Mithun Standup — IFRS Thumbnails, Okta/Indeed Status",
        summary: "Reviewed IFRS's thumbnail cue-point investigation tied to Zoom's chapter-recreation ask, confirmed Okta and Indeed were both essentially handled pending Zoom's updated S3-to-S3 documentation, and mapped next steps on the City AWS delivery plan and a Salesforce/Zoom-integrations question routed to Zoom's Ren.",
        angle: "Keeping three concurrent migrations moving without any one blocking the others is the core of this role right now.",
      },
      {
        title: "Internal ADP Support Ticket",
        summary: "A brief internal IT session resolved a calendar-sync access issue in OE's ADP Workforce Now interview-scheduling module; the likely root cause was a Friday ADP platform push, with a direct workforcenow.adp.com login workaround identified for future sign-in confusion.",
        angle: "Minor internal-tooling housekeeping with no client impact.",
      },
      {
        title: "OE Weekly Sales All-Hands",
        summary: "Company-wide pipeline and KPI review covering July's closing deals and updated team targets across capital markets, GCS, and Zoom-aligned accounts. Mithun gave a brief update confirming IFRS was wrapped and Okta/Indeed were progressing well.",
        angle: "Attending for visibility into company-wide deal flow and to represent the Zoom/CMS book of business to leadership.",
      },
      {
        title: "Indeed Channel-Mapping Data Call",
        summary: "Indeed delivered channel service-account emails and channel IDs for all 6 target ZVM channels, and the group agreed on a 5-videos-per-channel (30 total) dry-run scope once Zoom access lands.",
        angle: "Locking down the exact data fields needed (channel ID plus owner email) keeps the dry run from stalling on ambiguous mapping later.",
      },
      {
        title: "Zoom Content Studio Demo",
        summary: "A Zoom contact demoed the new advanced-CMS \"Content Studio\" AI feature, which auto-chops long recordings into bite-sized clips with generated summaries and images; Mithun floated a prompted-highlight-reel use case for IR clients and asked about early access.",
        angle: "Direct line into unreleased Zoom product features that could feed the retail-investor clipping idea from earlier weeks.",
      },
      {
        title: "ZCC Lead-Architecture Rethink",
        summary: "Mithun and Max reworked the ZCC lead-creation architecture, proposing to defer Salesforce lead creation to post-engagement rather than pre-engagement since nothing about the interaction needs real-time lookups for lead-gen purposes.",
        angle: "A simpler data flow avoids unnecessary Salesforce lookups on every support-line session.",
      },
      {
        title: "Alan/Amelia/Andrew — Role Change & AI Roadmap",
        summary: "Alan laid out OE's AI/knowledge-base roadmap (a hardened GitBook-based MCP, eventually unifying Salesforce, Lasso, NetSuite, and Teams data) and formally confirmed Mithun's shift to sit more directly under Joe's engineering-adjacent track, with variable-comp structure to be sorted separately by Andrew and Amelia.",
        angle: "The clearest signal yet that OE is restructuring the SE function around AI-driven delivery, with Mithun positioned at the center of it.",
      },
      {
        title: "Michael Morales — Website Revamp Talking Points",
        summary: "Prepped talking points for Michael's leadership pitch on a Vercel-based website rebuild, covering AI-search/agent-discoverability positioning, recent Zoom AE email-blast results (3 meetings booked), and the marketing-budget gap versus competitors.",
        angle: "The same Vercel conversation from prior weeks is now being pushed formally into a budget ask, with Mithun supplying the technical framing.",
      },
    ],
  },
  {
    day: "Tuesday", date: "July 28", meetingCount: 7,
    meetings: [
      {
        title: "Max/Akash/Mithun Standup",
        summary: "Confirmed no discrepancies in the prior day's report, reviewed Indeed's preliminary channel-ownership document, and set the dry-run plan of 5 videos across 6 channels; Mithun also chased status on the 54 zero-byte City files.",
        angle: "Keeping the City data-integrity thread and Indeed onboarding moving in parallel.",
      },
      {
        title: "Akash — Live Migration-Bot Demo",
        summary: "A live demo moved 2 real videos from Kaltura to ZVM end-to-end; the team caught that the demo was pointed at Indeed's live account rather than an internal test Kaltura account and corrected course, and Mithun gave detailed UX feedback proposing a 3-phase flow modeled on his own quote-calculator site.",
        angle: "Catching the wrong-account mistake before any real client data was touched is exactly the kind of judgment call this hybrid SE/engineering role exists for.",
      },
      {
        title: "OE Staffing Ops Sync",
        summary: "Internal staffing-team meeting covering onboarding pipeline updates, a duplicate-profile cleanup issue flagged in Lasso, part-time rate-change effective dates, and a broader note that HR/finance systems integration remains manual.",
        angle: "Mostly observational for Mithun, but surfaced a recurring automation gap worth revisiting later.",
      },
      {
        title: "Okta Channel-Review Scheduling",
        summary: "Locked a Thursday working session to review Okta's channel inventory together, confirmed Slack access was pending, and agreed Okta would export a full channel list ahead of that call.",
        angle: "Getting a concrete time locked in unblocks channel-mapping work that had been stuck in scheduling limbo.",
      },
      {
        title: "Max/Mithun — IFRS Final Reconciliation",
        summary: "Worked through a 24-entry discrepancy between IFRS's Kaltura UI count and the migration report live with Claude, narrowing it down to three explainable buckets before Kaltura access closed for good.",
        angle: "Getting to zero unexplained gaps before source access is revoked is the whole ballgame for a clean handoff.",
      },
      {
        title: "Hiring Process & Staffing-Tool Exploration",
        summary: "Formalized the associate-SE hiring process (Mithun and Chi Wei first round, cross-functional panel second round including Joe and Devin), walked through the LinkedIn Recruiter messaging tool, and explored Microsoft Teams Shifts as a possible staffing-tool alternative.",
        angle: "Confirms Mithun's new role includes real ownership of associate-SE hiring, not just interviewing.",
      },
      {
        title: "Devin Catch-Up",
        summary: "Wide-ranging sync covering IFRS/Indeed/Okta status, a Zoom Content Studio access request, confirmation that the retail-investor session with Lorna moved to Thursday, ZCC support-line volume and coverage-hours planning, a review of OE's internal AI-strategy decks, and getting Devin set up with Claude API access.",
        angle: "Devin is becoming a second internal advocate for the AI-tooling push, which matters given his deep institutional knowledge of OE's customer base.",
      },
    ],
  },
  {
    day: "Wednesday", date: "July 29", meetingCount: 9,
    meetings: [
      {
        title: "Stefan (Zoom)/Max/Mithun — IFRS Chapter Scoping",
        summary: "Discussed how Zoom wants to recreate IFRS's agenda-slide chapter data natively rather than relying on a customer-facing feature, agreeing to prioritize by broadcast date and get Ryan's ZVM channel access set up.",
        angle: "Zoom asking OE to help solve a product gap on its own platform is a strong signal of the depth of this partnership.",
      },
      {
        title: "Max/Akash/Kieran Standup — ZCM-224 Resolved",
        summary: "Akash reported 46 of the 54 corrupted City files recovered after a root-cause fix, with 8 unrecoverable; also touched on bot-demo scheduling.",
        angle: "Closing the loop on the corrupted-file investigation clears a lingering data-integrity item before it becomes a client-facing issue.",
      },
      {
        title: "Chapter-Recreation Deep Dive (ZCM-226)",
        summary: "A focused analysis session to identify which of roughly 675 IFRS videos have genuine multi-point chapters versus a single placeholder cue point, resulting in a new ticket to formalize the analysis for Zoom.",
        angle: "Distinguishing real chapter data from placeholders before committing to a recreation plan avoids wasted engineering effort.",
      },
      {
        title: "Staffing Tool Exploration",
        summary: "Discussed replacing Lasso with Microsoft Teams Shifts for staffing and scheduling, acknowledging it's a multi-month undertaking, and agreed to a shadowing exercise to document the current workflow before committing.",
        angle: "A realistic assessment of switching costs before jumping on a shinier tool.",
      },
      {
        title: "Zoom AE Migration-Process Simplification",
        summary: "Zoom AEs raised frustration with the migration-quoting process being overwhelming for both AEs and customers; the group walked through new ZVM feature updates and discussed simplifying discovery.",
        angle: "Direct AE feedback on the quoting friction is exactly the input needed to prioritize the next round of tooling.",
      },
      {
        title: "Quote Calculator Go/No-Go Decision",
        summary: "The team decided against making the pricing calculator customer-facing, given the risk of an early estimate scaring off deals, and used the session to walk new Zoom hires through OE's CMS/migration business model.",
        angle: "Protecting deal flow by keeping quoting bespoke rather than rigid was the right call given how variable migration scope actually is.",
      },
      {
        title: "Max/Mithun — IFRS Chapter Follow-Up",
        summary: "Reviewed the finalized chapter-timestamp analysis (483 real chapter entries identified) and discussed the remaining blocker of getting content into ZVM given Ryan's content ownership.",
        angle: "Having a hard number (483) to report back to Zoom turns an open-ended ask into a scoped, trackable deliverable.",
      },
      {
        title: "Vercel Sales Call",
        summary: "Mithun and Michael took an introductory call with a Vercel rep covering Pro-plan pricing (~$20/seat/month), AI infrastructure primitives, and confirmation that OE's current traffic fits comfortably within the Pro tier.",
        angle: "Vendor-side validation that a Vercel migration is financially reasonable strengthens the case being built for leadership.",
      },
      {
        title: "Vercel Debrief with Michael",
        summary: "Recapped the Vercel pricing conversation and began planning a dedicated setup session, along with the internal approval chain needed for a potential website migration.",
        angle: "Moving from exploratory conversation to a concrete setup plan is the next real step toward the website rebuild.",
      },
    ],
  },
  {
    day: "Thursday", date: "July 30", meetingCount: 11,
    meetings: [
      {
        title: "Max/Akash/Kieran Standup",
        summary: "Covered an overnight chapter-title breakthrough, Indeed's OAuth access blocker, Kieran's Kaltura-to-ZVM upload debugging, and the City corrupted-files AWS delivery plan.",
        angle: "Routine but necessary cross-team sync to keep three active workstreams aligned.",
      },
      {
        title: "Chapter-Title Output Quality Review",
        summary: "Reviewed the overnight chapter-title extraction output with Max, addressing inconsistent \"Agenda Item\" header detection across PowerPoint formats and weighing whether a stronger model would improve consistency.",
        angle: "Iterating on extraction logic live with the person consuming the output is faster than guessing at requirements up front.",
      },
      {
        title: "Chi Wei 1-on-1",
        summary: "Discussed POC review delegation at Chi Wei's org, an update on migration-project complexity, the Vercel website-migration conversation, and confirmation that Eric (the second associate SE) starts end of August.",
        angle: "Cross-pollinating engineering-process learnings from a partner org informs how OE structures its own POC/handoff conventions.",
      },
      {
        title: "New Hire Intro — Pete",
        summary: "An introductory call with a new Zoom-team hire covering career background and OE's event-driven business model versus traditional SaaS sales, plus a licensing feature-matrix idea to help ramp new team members faster.",
        angle: "A recurring theme from new hires — the licensing complexity gap — is worth turning into a real reference asset.",
      },
      {
        title: "Retail-Investor Strategy Session",
        summary: "Discussed a \"clipping\" strategy for earnings-call content aimed at retail investors, identifying candidate clients for a pilot using Zoom's AI Studio.",
        angle: "A tangible pilot plan gives this recurring idea its first real path to execution.",
      },
      {
        title: "Zoom Licensing Platform Training",
        summary: "Walked new Zoom-team hires through the differences between Webinars, Webinars Plus, and Zoom Events licensing, including the hub/hub-host access model and premium features.",
        angle: "Consistent onboarding materials reduce the number of times this same explanation has to happen one-on-one.",
      },
      {
        title: "Okta Channel/Site Architecture Session",
        summary: "The scheduled working session to map Okta's channel inventory into the new site/site-page structure, discussing retention-policy alignment and access-control models.",
        angle: "This is the concrete follow-through on the scheduling locked in earlier in the week — turning a plan into mapped architecture.",
      },
      {
        title: "Microsoft Copilot Studio Knowledge-Base Test",
        summary: "Tested a Copilot Studio declarative agent connected to OE's GitBook knowledge base, checking whether responses stayed grounded in documented content rather than drifting to general knowledge.",
        angle: "Validating that an internal knowledge agent stays grounded is a prerequisite before rolling it out more broadly.",
      },
      {
        title: "IFRS Chapter Column-Detection Fix Planning",
        summary: "Planned a fix to detect chapter-title columns by literal header match rather than heuristic guessing, aiming for more consistent extraction across varied PowerPoint formats.",
        angle: "Moving from a fuzzy heuristic to an exact-match rule should meaningfully cut down on extraction errors going forward.",
      },
      {
        title: "ZVM Access-Control Design & Avatar Update",
        summary: "Discussed ZVM's contact-groups and sites/site-pages permission model for Okta's SSO-based access control, plus an update on the AI-avatar delegation feature for earnings-call content creation.",
        angle: "Getting the access-control model right before migration reduces the odds of a costly permissions redo later.",
      },
      {
        title: "DXC Migration Pricing Discussion",
        summary: "Worked through tiered pricing options ($20K&ndash;$41K) for helping DXC migrate data off OE's platform as they depart, based on estimated content volume and video count.",
        angle: "Even a departing client is an opportunity to generate clean, well-scoped revenue on the way out.",
      },
    ],
  },
  {
    day: "Friday", date: "July 31", meetingCount: 4,
    meetings: [
      {
        title: "Max/Akash/Kieran Standup",
        summary: "Covered bot-deployment status, the Kaltura-to-ZVM migration fix timeline, Indeed's dry-run details, IFRS's 3&ndash;4 flagged videos needing re-migration due to a Zoom-side sync issue, and a GitHub Actions pipeline fix for the bot's Mac-vs-Linux library mismatch.",
        angle: "Closing out these last loose ends is what turns a mostly-done migration into a fully clean one.",
      },
      {
        title: "CVS Bulk Video-Hosting Discovery Call",
        summary: "A discovery call to scope bulk-hosting roughly 400 short pitch videos with unique-visitor analytics and frictionless public links, working through guestbook/email tradeoffs and categorization needs.",
        angle: "A new use case for OE Stream's existing infrastructure that doesn't require any new migration work — just smart configuration.",
      },
      {
        title: "Internal CVS Pricing Debrief",
        summary: "Decided against a showcase page for the CVS videos in favor of client-based tagging, and landed on a ~40-hour, ~$12K estimate for the bulk-upload work; also sized DXC's content volume for that separate SOW.",
        angle: "A quick, well-reasoned pricing exercise turns a simple ask into an easy revenue win.",
      },
      {
        title: "Zoom Marketplace Deep Dive with Abe",
        summary: "A deep technical conversation on Zoom's manifest API, Connect service for third-party API calls, and Zoom Apps sidebar components, discussing how OE's migration workflow could become a Zoom-native app tied to Vijay and Rajul's goal of scaling to 1,000 migrations by year-end.",
        angle: "Understanding Zoom's full app-platform toolkit opens the door to productizing the migration workflow rather than running it manually forever.",
      },
    ],
  },
];

export default function Week24Report() {
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
        <a href="/weekly_report_week24.pdf" download="Weekly_Report_Week24_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 24</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>July 27 &ndash; July 31, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "39", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "24", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 24 Analytics</strong> &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> IFRS Closeout &middot; Okta Channel Architecture &middot; Indeed Dry Run &middot; Migration Bot UX &middot; CVS Hosting &middot; DXC SOW &middot; Zoom Marketplace &middot; AI Tooling Rollout
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 24 closed out the IFRS migration for good &mdash; a final reconciliation exercise resolved every discrepancy between Kaltura&rsquo;s UI and the migration report before source access shut off, and a parallel deep-dive into chapter and cue-point recreation gave Zoom&rsquo;s product team the data it needed for its own agenda-slide feature request. Mithun&rsquo;s role formally shifted this week as well, with Alan confirming a move to sit more directly under Joe&rsquo;s engineering-adjacent track as OE doubles down on AI-driven delivery across sales, product, and engineering. Okta and Indeed both progressed from planning into concrete execution &mdash; Indeed delivered channel and ownership data for a 30-video dry run, while Okta locked a dedicated architecture-mapping session &mdash; though both remain gated on Zoom&rsquo;s September Sites/Site Pages release. The week also opened new revenue threads outside core migration work: a CVS bulk-video-hosting proposal, DXC&rsquo;s departure-migration SOW pricing, and a deep technical conversation with Zoom&rsquo;s marketplace team about productizing OE&rsquo;s workflow as a native app.</p>
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
