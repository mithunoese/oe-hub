"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-20";

const themes: Theme[] = [
  {
    title: "Support Line Goes Live",
    text: "What began as an internal build closed the week as a company-wide Zoom product: the official kickoff call to Zoom's AE and CSM team drew heavy engagement and immediate adoption requests, with reps asking to put the link in their email signatures on the spot. The ticketing architecture (ZCC to Freshdesk, with wrap-up webhooks and disposition statuses) and Salesforce lead-scoring design matured over the week, but Contact Center license shortfalls with Zoom kept the team capped at four seats against a 24x5 coverage goal.",
  },
  {
    title: "Indeed Migration Kicks Off",
    text: "With Indeed formally signed, the week moved from prep to execution: a Wednesday planning call and Thursday's live Kaltura walkthrough surfaced concrete migration mechanics, including the creator-versus-administrative-owner distinction and a phased six-to-seven service-account structure. The team deliberately chose to hold full migration until Zoom's 'do not delete' feature ships in mid-July rather than risk data loss, with a small pilot batch planned first and a recurring weekly cadence starting July 13.",
  },
  {
    title: "SE Team Expansion",
    text: "Mithun screened five Associate Solutions Engineer candidates this week spanning backgrounds from NASA JPL data engineering to enterprise AI consulting, while working with Chiwei to define a lightweight case-study evaluation and a clearer framing of the role as a forward-deployed function sitting between product ideation and engineering. Eric Costello's hire, starting late August, and the search for a fourth SE reflect a team that is outgrowing its original two-person structure.",
  },
  {
    title: "Self-Service Tooling Gains Traction",
    text: "The CMS migration quote calculator and TCO calculator, built earlier this quarter, saw real usage this week: demoed to Devin, Andrew, Amelia, and Zoom AEs, and used directly to calibrate UK pricing parity for a Computershare-related opportunity. The tools are becoming a reusable proof point in partner conversations beyond their original Zoom-AE use case.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Resolve Contact Center Licensing — Mithun / Max",
    text: "Continue pushing Zoom's Tyler and Steve for the additional seats needed for 24x5 coverage; escalate through Andrew and Alan if unresolved early in the week, since it is blocking both agent coverage and Salesforce lead generation.",
  },
  {
    title: "Fix Salesforce Access Blocker — Mithun",
    text: "Work with the Salesforce admin team to resolve the service-account impersonation issue preventing Contact Center from creating Salesforce leads, a dependency for the Support Line's lead-scoring pipeline.",
  },
  {
    title: "Finalize Associate SE Case Study — Mithun / Chiwei",
    text: "Build and run the case-study round with remaining candidates, and get sign-off on process now that leadership is back from PTO.",
  },
  {
    title: "Prep Indeed for Pilot Migration — Max / Indeed Team",
    text: "Finalize service accounts and channel-collaborator user lists ahead of the July 13 weekly cadence, with migration execution held until Zoom's star feature ships.",
  },
  {
    title: "Advance ZCC-Freshdesk Ticket Flow — Mithun",
    text: "Continue building the wrap-up webhook integration and evaluate a Zoom Marketplace app version of the Support Line as a lower-friction alternative to the current link-based access.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "June 29", meetingCount: 5,
    meetings: [
      {
        title: "ZCM Ticket Standup — ZVM API Exploration & JIRA Process Reset",
        summary: "Akash reported progress on ZCM-180, exploring the ZVM APIs and drafting documentation to be pushed by end of day or the next morning, confirmed ZCM-183 had been resolved on June 29, and said ZCM-181 would begin the next day. The team clarified there is no direct ZVM API, so the migration flow will use the Clips API to upload files and route them to a channel. Max confirmed Indeed's kickoff call is set for Thursday, with more detail expected on account access afterward.",
        angle: "The 'no direct ZVM API, use Clips API plus channel routing' pattern is the concrete technical workaround Mithun will need to reference when scoping any future video-migration bot work for clients like Indeed.",
      },
      {
        title: "Candidate Screen — Associate Solutions Engineer",
        summary: "Mithun screened a candidate transitioning from a technical business analyst role at a large job-search platform, where he led front-end modernization work and cross-functional coordination between product, marketing, and engineering. Mithun walked through OE's dual SE mandate (CMS migration and integration work) and the difference between an enterprise SE role and OE's more engineering-embedded structure. Feedback centered on the candidate being personable and technically credible but light on hands-on technical proof points, flagged as a gap for the next, more technical round.",
        angle: "Hiring for the Associate SE role directly affects how much migration and integration build capacity Mithun and Max can offload — a stronger technical bench shortens the runway on Indeed-style engagements.",
      },
      {
        title: "Q2 Close Sprint — Sales & GCS Weekly Call",
        summary: "The commercial team's weekly call doubled as a quarter-close sprint update with two days left in Q2. HubSpot signed a $22K investor-day deal and Cytokinetics signed $40K for a hybrid R&D day in Munich, pushing the team to roughly $10.7M against a $10.85M quarter goal. Institutional highlights included a $225K Bank of America Veracast extension and a combined $133K from Goldman Sachs' Project Apex IPO work. Kara flagged Indeed's first CMS migration deal as a major new offering, with a kickoff call scheduled for Thursday with Mithun and Max.",
        angle: "Indeed's video and CMS migration deal being highlighted company-wide on the sales call signals it as a flagship reference case — worth having a clean technical narrative ready before Thursday's kickoff.",
      },
      {
        title: "Candidate Screen — Associate Solutions Engineer",
        summary: "Second Associate SE screening interview, with a candidate coming off a co-op building an AI-driven claims automation pipeline (OCR plus TensorFlow and SageMaker classification), following prior solutions engineering experience on hybrid cloud architecture. Mithun walked the candidate through a live GitHub repo, an OE ZCC support demo prototype, to gauge technical reading comprehension, which she handled well. Behavioral discussion covered handling misaligned customer expectations against engineering capacity, and she was advanced to the next, more technical round.",
        angle: "Both candidate screens this week test for the same gap — strong communication is common, but hands-on ability to read and reason about a real OE codebase is the differentiator Mithun is filtering for before handing off to engineering.",
      },
      {
        title: "Max 1:1 — ZCC-Freshdesk-Salesforce Flow Mapping & Support Line Prep",
        summary: "Mithun and Max worked through the expanded ZCC-to-Freshdesk-to-Salesforce flow map, confirming logic for checking Salesforce contacts, creating leads when none exist, and routing engagements into a Freshdesk ticket at video-engagement start with the ticket ID passed back into the ZCC flow for later updates. They agreed the ticket description should stay customer-facing and generic, with the AI engagement summary added afterward as an internal-only comment, avoiding Workato for this flow given SOC 2 concerns about routing customer data through it. They also finalized the OE Zoom Support Line landing page design and reviewed the TCO calculator's new admin portal, which logs every generated quote.",
        angle: "The ticket-ID-passback and internal-versus-public-comment split is the piece Mithun will want written into the Support Line runbook — it is the difference between a clean case-management handoff and a support-line launch that looks broken from day one.",
      },
    ],
  },
  {
    day: "Tuesday", date: "June 30", meetingCount: 5,
    meetings: [
      {
        title: "ZCM Standup — ZVM-180 Near Completion, Licensing Snag Surfaces",
        summary: "Akash reported ZCM-180 was nearly complete, with plans to update the JIRA ticket and start ZCM-181 the next day. The team flagged that Zoom informed OE overnight that Contact Center licenses would no longer be provided free for the pilot as originally discussed, a shift already relayed to Amelia and Alan for follow-up.",
        angle: "This licensing reversal is the first real friction point in the Zoom partnership on the Support Line build, worth tracking closely since it directly affects how much agent coverage Mithun and Max can staff for launch.",
      },
      {
        title: "Support Line Build Review — Licensing Shortfall & Lead Scoring Design",
        summary: "Max, Alan, and Mithun worked through the Contact Center licensing shortfall (four licenses on hand versus the ten-plus needed for round-the-clock coverage) after Zoom indicated OE would need to pay for additional seats, a reversal from earlier verbal commitments. Leadership was firm that OE would happily field these calls for free during the pilot as a favor to Zoom's sales team, but would not pay for licenses until the program proves it drives revenue. Separately, the team reviewed a Salesforce lead-scoring whiteboard for the support-line-to-BDR handoff, agreeing every support-line click becomes a lead into the outbound sequence, with score weighted by click frequency, title, and department. The team also confirmed a co-branded OE and Zoom virtual background was already built and pre-assigned as the agent default.",
        angle: "The lead-scoring logic Mithun is building directly determines whether the Support Line becomes a real pipeline generator for OE or just a cost center — getting the department and click-frequency weighting right before it goes live matters more than any UI polish.",
      },
      {
        title: "OE Support Line Official Kickoff — Zoom AE/CSM Team",
        summary: "Amelia and Max formally launched the OpenExchange Support Line to Zoom's broader AE, CSM, and SE team, sharing the customer-facing link for reps to use in email signatures or drop into conversations. Amelia framed the pilot around freeing Zoom reps from the 30-40% of their time spent on feature-functionality questions, with OE's team providing 24x5 white-glove coverage, monthly reporting back to Zoom on top questions and feature requests, and lead generation for OE event services as a byproduct. Q&A covered scope, language coverage, and positioning guidance. Tyler confirmed the whole experience runs on Zoom's own Contact Center product, giving AEs a live reference to point to when selling Contact Center itself.",
        angle: "Zoom explicitly floated turning this into a Contact Center sales tool for their own AEs — if that lands, it reframes the Support Line from a goodwill gesture into a joint go-to-market asset, which changes how Mithun should scope the next phase of build.",
      },
      {
        title: "Post-Launch Debrief — Support Line Traction & Next Steps",
        summary: "Immediately after the Zoom kickoff call, Max, Alan, Amelia, and Mithun debriefed on the strong reception, noting the planned 25-minute session ran long because Zoom reps kept asking questions and immediately wanted the link for their signatures. The group discussed escalation paths, current gaps (no defined threshold yet for converting a repeat support-line user into a paid support or event-management contract), and analytics visibility without buying more Contact Center seats. David Kincaid was confirmed as Max's initial coverage partner, and the team discussed longer-term ideas: integrating the flow into OECentral, publishing it to the Zoom Marketplace as an embedded app, and looping in Zoom's product team for a dedicated deep-dive call.",
        angle: "The Zoom Marketplace app idea is a low-lift, high-visibility next step Mithun flagged as trivial to build — worth prioritizing since it would put OE's support line inside the Zoom product surface rather than a link reps have to remember.",
      },
      {
        title: "Recruiting Sync — Case Study Panel & Candidate AI-Use Concerns",
        summary: "Mithun discussed next steps for the Associate Solutions Engineer search with a colleague, proposing a small case-study panel to keep the process lightweight, pending confirmation from leadership when back from PTO. Mithun raised a concern that multiple recent candidates appeared to be leaning on AI tools live during interviews, and wanted alignment on requiring candidates to disclose AI use during the process. The two also resolved a recruiting-pipeline access gap between LinkedIn sourcing and the applicant tracking system.",
        angle: "The AI-disclosure policy question is worth resolving before the technical round, since it directly affects how much weight Mithun's team puts on live coding or system-design portions of future SE interviews.",
      },
    ],
  },
  {
    day: "Wednesday", date: "July 1", meetingCount: 4,
    meetings: [
      {
        title: "ZCM Standup — Zoom Clips License Blocker & MVP Timeline",
        summary: "Akash updated the ZCM-180 ticket but hit a new blocker: uploading a test video to ZVM requires a Zoom Clips license, which he did not have on his own account. Mithun asked whether Akash had tried Max's credentials and said he would check whether Max's account already has Clips access. Mithun asked for a rough timeline on an MVP bot demo, and Akash estimated next Wednesday or Thursday, lining up with Indeed's kickoff call the following day.",
        angle: "The Clips license requirement is a second concrete technical dependency, after the 'no direct ZVM API' finding, that needs to be resolved before Mithun can promise Indeed a working end-to-end migration demo.",
      },
      {
        title: "Max & Mithun — Indeed Kickoff Prep & Freshdesk-Workato Ticket Architecture",
        summary: "Mithun and Max prepped for Thursday's Indeed kickoff, agreeing to keep it lightweight: a quick recap of the four teams and channel mapping, confirming Indeed still wants the 'favorite' feature coming in the July release, and using most of the hour to screen-share into Indeed's account for an initial audit and to collect access credentials. They also worked through the Freshdesk-Workato ticket integration architecture in detail: a ticket gets created in Freshdesk at the start of the ZCC engagement, the returned ticket ID is stored as a variable tied to that engagement, and when the engagement wraps up a webhook fires with the AI-generated brief and a disposition status that a Workato recipe uses to update the existing ticket. Max granted Mithun Freshdesk admin access and an API key.",
        angle: "The wrap-up webhook plus disposition-status mapping is the exact mechanism Mithun should reference when documenting the Indeed migration bot's eventual support handoff — it is the same pattern, just applied to a different client.",
      },
      {
        title: "Devin 1:1 — Computershare Update, Migration Pricing, and Team Growth",
        summary: "Mithun and Devin caught up after Devin's trip, where he focused on Computershare's fragmented internal structure following several acquisitions and worked to spread unified-investor-communications messaging organically at the rep level. Mithun shared that Indeed's migration engagement closed smoothly, in contrast to a separate ongoing migration engagement that has required more hand-holding. Mithun demoed the CMS migration quote calculator and TCO calculator built for Zoom AEs, walked Devin through the new OE Zoom Support Line and its ticketing integration, and floated the idea of OE eventually offering Contact Center build services to other customers. Mithun explained OE's expanding SE team structure: Eric Costello hired as a second Associate Solutions Engineer starting late August, a fourth SE hire in active interviews, and asked Devin to join the eventual case-study panel.",
        angle: "The TCO and quote calculator getting positive AE reception at Computershare, a live example Mithun can now point to, makes it a reusable proof point worth surfacing in other partner conversations, not just Zoom.",
      },
      {
        title: "Candidate Interview — Associate Solutions Engineer",
        summary: "Mithun interviewed a candidate currently on contract with NASA's Jet Propulsion Laboratory, working on oceanographic data pipelines after an internship building automated data-processing tools. Mithun tested her ability to reason about an unfamiliar codebase, the same OE ZCC support demo repo used in prior screens, and to reverse-engineer a prompt that could have generated the front-end mockups, which she handled methodically, then asked follow-up questions on basic security concepts like hashing and encryption, which she answered well enough to earn a recommendation to advance.",
        angle: "This candidate's data-pipeline background (ETL, deduplication logic, observability layers) is a closer technical match to the Associate SE's actual day-to-day than the earlier candidates screened this week — worth prioritizing her through the technical round.",
      },
    ],
  },
  {
    day: "Thursday", date: "July 2", meetingCount: 7,
    meetings: [
      {
        title: "ZCM Standup — ZCM-181 Complete, Clips License Fix Confirmed",
        summary: "Akash confirmed ZCM-181 was complete and asked whether Max's ZVM account had a Clips license, since the upload API was returning a 400 error tied to license requirements. Max and Akash confirmed the app's OAuth scopes were correctly configured and that the issue resolved once Akash was assigned a business license, since Clips is bundled into it. Max also flagged an important finding: the Clips upload API defaults ownership to whoever's credentials perform the upload, with no way to specify an owner at upload time, and floated using a placeholder fallback-owner account for any videos that cannot be mapped to a specific user. The team confirmed this would be their last daily standup for a while, with the next one likely early September.",
        angle: "The 'uploader becomes default owner' discovery, combined with the fallback-account idea, is now a validated design pattern Mithun can carry into Indeed's ownership-mapping conversation — it directly answers the question of what happens to off-boarded users' videos.",
      },
      {
        title: "Chiwei Sync — Candidate Debrief & Forward-Deployment Engineer Role Definition",
        summary: "Mithun and Chiwei compared notes on the Associate Solutions Engineer candidates screened this week and agreed to move forward with a lightweight case-study round run jointly by the two of them rather than a full panel. Chiwei explained the strategic framing behind the role from the engineering side: OE's product development is bottlenecked by a traditional product-owner-driven idea pipeline that cannot keep pace with how fast ideas surface, so this hire is meant to sit forward of that process, quickly prototyping and validating ideas with AI before handing a working proof of concept to engineering to harden. Mithun offered to plug the eventual hire into concrete near-term work: the Contact Center build, supporting Akash on the migration bot, and the integration-services line of business.",
        angle: "Chiwei's framing of this hire as sitting left of engineering gives Mithun a cleaner pitch for why OE needs forward-deployed technical roles at all — useful language to reuse when explaining the Associate SE function to partners or leadership.",
      },
      {
        title: "Candidate Interview — Associate Solutions Engineer",
        summary: "Mithun and Chiwei interviewed a candidate currently working as an AI data engineer at an applied-AI consultancy, building agentic workflows and data pipelines for enterprise clients, with a prior internship at a large software company's internal AI lab. He walked through a recent project automating natural-language querying over legacy spreadsheet-based data using a lightweight embedded database, LangChain-orchestrated agents, and an eval harness, and demonstrated solid familiarity with MCP, control loops, and model-selection tradeoffs. He described his ideal balance as roughly 30-40% customer-facing discovery and the rest internal solution design, and asked thoughtful questions about team structure and continuous AI upskilling.",
        angle: "This candidate's reasoning for defaulting to one consistent model across a multi-agent pipeline, to avoid terminology drift between agents, is exactly the kind of engineering judgment call the Associate SE role needs — worth flagging to Chiwei as a standout data point.",
      },
      {
        title: "Sales & Zoom Partnership Weekly — Q3 Kickoff, Licensing Follow-Up, Pricing Tool Demo",
        summary: "The weekly sales call opened Q3 with strong deals from Kara: a renewed $68,500 American Idol audition-hosting contract, a $120K Databricks tech summit, and confirmation that Intuit's renewal is moving forward. Andrew relayed that Zoom's go-to-market lead has warmed up considerably since Tuesday's support-line call and now understands OE's role and migration pricing model more clearly. Max gave an update on the Support Line: two additional PMs have agreed to help with coverage once more Contact Center licenses come through. Mithun demoed the CMS quote and TCO calculators to the broader team, which drew interest for adapting a similar tool to other partner pricing conversations.",
        angle: "The shift in Zoom's go-to-market lead from gatekeeping customer access to warming up to OE's role is the clearest signal yet that positioning OE as the moving company, not a competitor, is landing — worth reinforcing with a similar direct conversation for every new Zoom AE OE starts working with.",
      },
      {
        title: "Indeed Kickoff — Kaltura Content Audit & Migration Architecture",
        summary: "Mithun, Max, and Indeed's team held their first working session since signing, confirming no content will be deleted from Kaltura during migration and that channel-level permissions will carry over cleanly once URLs are updated. The group walked through Indeed's Kaltura instance live, reviewing entry counts (roughly 7,000, down from nearly a million after a prior cleanup effort), media types, thumbnail handling, caption file formats, and ownership structure, distinguishing creator from administrative owner fields to determine how ownership should map into Zoom channels. They agreed on a service-account structure split across six or seven groups, with a designated fallback owner for orphaned or off-boarded users' content, and confirmed the migration will hold until Zoom's do-not-delete star feature ships in mid-July rather than risk any data loss. Both sides agreed to a phased rollout, a small pilot batch validated by Indeed before the full library moves, with weekly check-ins starting the week of July 13th.",
        angle: "The creator-versus-administrative-owner distinction Indeed surfaced is a new edge case worth folding into the ownership-mapping documentation drafted earlier this week — a concrete example of the 'someone uploads on behalf of someone else' pattern the migration bot will need to handle generically, not just for Indeed.",
      },
      {
        title: "Candidate Interview — Associate Solutions Engineer",
        summary: "Mithun and Chiwei interviewed a recent computer science and business graduate juggling several side ventures alongside his job search, including a self-built analytics and marketing effort for a local restaurant, a contract AI-evaluation role, and personal LangGraph-based scheduling-automation and RAG chatbot projects. He described a clear framework for deciding when a workflow needs deterministic chaining versus conditional branching, and gave a grounded explanation of hallucination mitigation via strict context-grounding and escalation fallbacks. He asked detailed questions about how success would be measured in the role and what tends to trip up new hires in similar positions.",
        angle: "This candidate's own framework for choosing between deterministic and conditional agent orchestration is one of the clearer technical self-assessments Mithun has heard this week — worth weighing against other candidates when Chiwei and Mithun compare notes.",
      },
      {
        title: "Andrew 1:1 (+Amelia) — LSEG Pricing, Indeed Update, Contact Center Access Blocker",
        summary: "Mithun and Andrew caught up on business items: Mithun confirmed the Indeed kickoff went well and is heading toward a light wrap-up once basic credentials come through, with Okta and HubSpot next in the pipeline. Mithun walked Andrew through the LSEG UK pricing research he had put together, confirming pricing should land around 2,400 pounds to stay in parity with the roughly $3,000 US base package. When Amelia joined, she confirmed Citi's earnings-call production has officially moved to OE's new earnings-reimagined workflow. Mithun demoed the CMS migration quote calculator and its admin reporting view, and Amelia flagged a new use case: automating the formatting of end-of-project capital markets invoice-confirmation reports. Mithun also raised the still-unresolved Contact Center Salesforce access issue and asked Andrew to help escalate with the Salesforce admin team.",
        angle: "The Salesforce impersonation blocker on Contact Center is the same lead-generation pipeline the team designed on Tuesday — if it is not resolved before the Support Line scales up, the lead-scoring and BDR handoff work from earlier this week has nothing to feed it.",
      },
    ],
  },
  {
    day: "Friday", date: "July 3", meetingCount: 0,
    meetings: [],
  },
];

export default function Week20Report() {
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
        <a href="/weekly_report_week20.pdf" download="Weekly_Report_Week20_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 20</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>June 29 &ndash; July 3, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "21", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "20", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 20 Analytics</strong> &nbsp;&middot;&nbsp; Support Line launched &nbsp;&middot;&nbsp; Indeed Kaltura audit complete &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Support Line &middot; Indeed &middot; Contact Center Licensing &middot; SE Hiring &nbsp;&middot;&nbsp; <em style={{ color: "#9ca3af" }}>Independence Day holiday &mdash; July 3&ndash;4</em>
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>The week centered on turning infrastructure work into live, customer-facing systems. The OE Zoom Support Line launched to Zoom&rsquo;s AE and CSM team on Tuesday and drew an immediately strong reception, while the Indeed CMS migration moved from signed contract to a detailed kickoff and full Kaltura account audit by Thursday. A key technical discovery, that the Zoom Clips upload API defaults ownership to whoever&rsquo;s credentials perform the upload, resolved a blocker that had stalled both the migration bot and Indeed&rsquo;s onboarding, and gave the team a validated fallback-owner pattern to reuse. Mithun also ran a full slate of Associate Solutions Engineer interviews this week, working with Chiwei to sharpen the hiring bar and define a forward-deployed engineering scope for the growing SE team. Contact Center licensing with Zoom remained a persistent friction point that did not fully resolve by week&rsquo;s end.</p>
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
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>The OE team observed the July 4th holiday weekend; no meetings were held.</p>
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
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 21</h2>
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
