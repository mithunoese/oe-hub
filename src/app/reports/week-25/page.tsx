"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-25";

const themes: Theme[] = [
  {
    title: "Video Migration Operationalization",
    text: "Indeed and City migrations moved from planning to active pipeline validation this week. Max's video-to-channel mapping spreadsheet, ZVM API troubleshooting, and Friday dry-run readiness represent the operational pathway to delivering both customer migrations on schedule, with collaborator-access patterns, S3 bucket permissions, and cue-point API integration establishing a repeatable migration template.",
  },
  {
    title: "AI Tooling and Infrastructure Governance",
    text: "Edgar's VPS infrastructure, Casey's Perfect Cut editing skill, and the FitScore qualification tool moved from experimentation toward production infrastructure. VPS spend was cleared by CISO/leadership, a GitHub-repo-plus-README packaging standard was set for AI proof-of-concepts, and the UBS prerecord project needed data processor/controller classification before it could ship &mdash; a reminder that governance has to precede feature work, not follow it.",
  },
  {
    title: "Staffing Console Validation and Build vs. Buy",
    text: "Deep-dive interviews with Kevin (UK/EMEA), Annalisa (ops lead), and Emily surfaced quantified pain points &mdash; manual reassignment, timing errors, recurring sync failures, and no recurring-unavailability tracking &mdash; that are shaping the staffing console's MVP scope. Joe's direction to evaluate existing shift-management platforms before building signals real urgency behind this decision.",
  },
  {
    title: "Partner Sales and FitScore Engagement",
    text: "OmniAB's $51K deal closed and the ComputerShare FitScore pilot advanced toward a customer demo. Support-line metrics (50% first-engagement close rate, ~$1M pipeline) and steady BDR tool adoption point to a healthy sales motion heading into September prep.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Bot MVP Demo and Deployment — Akash",
    text: "Target August 10 internal demo and August 20 MVP release; unblock the GitHub Actions deployment issue and finalize Zoom Connect form-field specs.",
  },
  {
    title: "Indeed 30-Video Dry Run Demonstration — Max",
    text: "Deliver Monday, confirm ZVM channel assignment and cue-point API integration, and document edge cases for the parallel City track.",
  },
  {
    title: "FitScore Demo and ComputerShare Expansion — Devin / Mithun",
    text: "Monday 3:30pm demo to validate attendee qualification and the 24-hour follow-up cadence, then scope ComputerShare partnership expansion terms.",
  },
  {
    title: "Staffing Tool Vendor Evaluation vs. Build Decision — Mithun / Joe",
    text: "Compile Kevin, Annalisa, and Emily feedback into a vendor evaluation, identify 2&ndash;3 shift-management platform candidates, and deliver a build-vs-buy recommendation by end of August.",
  },
  {
    title: "AI Production Pipeline Baseline — Casey / Edgar",
    text: "Generate 5&ndash;10 golden earnings-call examples to validate the Perfect Cut skill, stand up the VPS environment, and lock in the weekly AI production sync.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "August 3", meetingCount: 9,
    meetings: [
      {
        title: "Weekly Sales Update — OmniAB",
        summary: "The OmniAB deal ($51K) closed, hitting weekly revenue targets. The team reviewed pipeline KPI performance, discussed BDR tool investment (Ducks), and reviewed the current Zoom AE channel coverage.",
        angle: "Closed revenue anchors the FitScore and staffing-tool ROI case, and early adoption signals here will drive OE's feature prioritization.",
      },
      {
        title: "Bot Demo and Video Mapping",
        summary: "Akash confirmed bot V2 development is tracking with multiple field types ahead of a scheduled demo. Max presented a video-to-channel mapping spreadsheet for Indeed's 30-video dry run, covering caption format and metadata variance across five videos per channel. The team also confirmed 44 corrupted City files were unrecoverable and added zero-byte validation to the upload pipeline, and configured server-to-server OAuth for Indeed's account.",
        angle: "Mapping complexity and the new file-validation check directly reduce migration risk for both Indeed and City.",
      },
      {
        title: "Pause Zoom App Build",
        summary: "Mithun told Akash to pause the Zoom app build and prioritize reviewing Zoom Connect documentation, driven by pending API capability validation ahead of City's access timing.",
        angle: "Pausing to validate the Zoom Connect API surface first de-risks the bot's production submission path.",
      },
      {
        title: "Video Pipeline Dry Run Planning",
        summary: "Max walked the team through the 30-video dry-run logistics &mdash; channel assignment, caption/metadata enrichment, and error tracking &mdash; targeting a Friday/Monday demonstration to Indeed.",
        angle: "This scope and phasing directly informs City's post-Indeed migration timeline.",
      },
      {
        title: "VIP Event Staffing Strategy",
        summary: "The team reviewed staffing tiers, redemption-event capacity, and the OE staffing console prototype's readiness, incorporating Annalisa's operational input against existing Lasso workflows.",
        angle: "Prototype validation with real event managers is directly informing the build-vs-buy evaluation.",
      },
      {
        title: "Replay Library and Quiz Setup",
        summary: "The team worked through MOFO/CLE quiz integration, passport library structuring, and OE Stream project duplication, with CEU reporting compliance requirements discussed.",
        angle: "Replay and quiz features expand Zoom's post-event engagement motion for the education vertical.",
      },
      {
        title: "Zoom Per-Video Publishing Issue",
        summary: "Indeed, Jacob, and Skyler discussed ZVM channel publish controls and content-library access, centering on per-video publishing granularity and the administrative ownership model for migrated content.",
        angle: "Resolving publish-control granularity is a key requirement for Indeed's confidence in ZVM as a Kaltura replacement.",
      },
      {
        title: "OpenExchange FitScore Integration Discussion",
        summary: "The team reviewed the ComputerShare FitScore pilot scope &mdash; attendee data scrubbing and 12 earnings calls as initial test data &mdash; framing FitScore as a downstream post-earnings engagement driver.",
        angle: "Customer validation this week directly informs ComputerShare partnership expansion terms.",
      },
      {
        title: "AI Intern Interview — Rachel (Pacero)",
        summary: "Mithun interviewed an SDSU candidate on Copilot Studio bot development and web-scraping experience for the AI internship pipeline.",
        angle: "Talent evaluation here supports scaling the Edgar/AI tooling function.",
      },
    ],
  },
  {
    day: "Tuesday", date: "August 4", meetingCount: 5,
    meetings: [
      {
        title: "Zoom Migration and Bot Update",
        summary: "Akash confirmed Zoom Connect readiness; Kiran tested the Kaltura-to-Zoom migration pipeline with 10 videos. City S3 bucket access timing was confirmed, bot MVP V2 was targeted for August 20, and two ZCM tickets were closed.",
        angle: "A successful 10-video migration test de-risks the larger 30-video Indeed dry run.",
      },
      {
        title: "AI Editing Workflow Planning",
        summary: "Casey demonstrated the Perfect Cut skill for earnings-call video editing, producing XML output with slide detection and spacing rules. Mithun outlined a three-phase rollout plan: prove locally, stand up on VPS, then operationalize for editors, with golden-dataset and OneDrive/VPS integration needs discussed.",
        angle: "This AI editing capability could cut earnings-call turnaround from days to hours, directly supporting the UBS and ComputerShare value proposition.",
      },
      {
        title: "Live Stream Device Inventory",
        summary: "The team reviewed live-stream device inventory, targeting 5 units on hand ahead of September's busy event season.",
        angle: "Device readiness directly affects OE's ability to deliver live events reliably during peak season.",
      },
      {
        title: "FitScore Demo Planning Session",
        summary: "Devin, Amelia, and Mithun discussed the FitScore proof of concept &mdash; the attendee-report scrubbing skill and a 24-hour post-earnings client email cadence &mdash; with Mithun set to share the relevant Claude skill.",
        angle: "The 24-hour follow-up cadence is a real ComputerShare differentiator that next week's demo will test with a live customer.",
      },
      {
        title: "ZVM Access Control Discussion",
        summary: "Indeed and Max compared contact groups vs. user groups and Okta push-group integration for ZVM channel permissions. Zoom's sites feature was confirmed for a September 15 release, and offboarded-employee clip-ownership transfer policy was clarified.",
        angle: "Closing this access-control gap, alongside the sites feature, removes the last functional difference versus Kaltura.",
      },
    ],
  },
  {
    day: "Wednesday", date: "August 5", meetingCount: 6,
    meetings: [
      {
        title: "ZVM API Discovery and Channel Access",
        summary: "Akash, Kiran, and Max troubleshot a ZVM channel-assignment API issue requiring collaborator access, reviewed metadata patch sequencing, and documented findings in a ticket for future reference.",
        angle: "This API documentation and access pattern becomes the template for future customer integrations.",
      },
      {
        title: "Zoom Bot App Submission Planning",
        summary: "Mithun and Akash reviewed Zoom Connect form-field specs and mobile-support requirements for bot V2, targeting an August 10 internal demo and August 20 MVP.",
        angle: "The August 20 MVP target keeps the bot on track for September partner-demo readiness.",
      },
      {
        title: "Staffing Deep Dive — Kevin",
        summary: "Mithun interviewed Kevin, a senior staffing manager covering UK/EMEA, on end-to-end staffing workflow in Lasso and Teams, including client-specific staffing exclusion rules and persistent pain points: manual reassignment, timing errors, recurring sync failures, and no recurring-unavailability tracking. Mithun demoed the staffing console prototype for feedback.",
        angle: "Kevin's manual-workflow audit quantifies the automation ROI case and validates feature priorities against real operator expectations.",
      },
      {
        title: "Edgar VPS and AI Tools Discussion",
        summary: "Mithun briefed Chiwei on AI tooling being built for OE (caption conversion, transcript/video quality checks, and voice-clone infrastructure for UBS prerecords) and on VPS spend approval (~$1K). The discussion flagged infrastructure-governance and data-residency concerns and escalated the topic to Joe and Alan for policy review.",
        angle: "This escalation establishes infrastructure accountability standards while validating a forward-deployed-engineer staffing model.",
      },
      {
        title: "Michael Morales — Claude Code Setup",
        summary: "Mithun helped Michael set up Claude Code CLI, GitHub, and Vercel MCP access for the OE website redesign project, including a private GitHub repo and an approved $80/month Vercel budget for 4 seats.",
        angle: "This infrastructure setup establishes the delivery model for the website-redesign project.",
      },
      {
        title: "Edgar VPS Connection Session",
        summary: "Mithun and Edgar connected to the VPS via RDP after troubleshooting network and IP configuration, and discussed Ollama/Hermes/Claude integration options for the runtime.",
        angle: "VPS connectivity unblocks near-term deployment of the AI video-editing pipeline.",
      },
    ],
  },
  {
    day: "Thursday", date: "August 6", meetingCount: 7,
    meetings: [
      {
        title: "ZVM Bot and City Standup",
        summary: "Akash reported the bot deployment blocked by a GitHub Actions issue (DevOps ticket open); ZVM migration was waiting on Indeed collaborator access, and City S3 access was followed up on.",
        angle: "Fast DevOps turnaround on this blocker is critical for MVP demo credibility.",
      },
      {
        title: "Engineering/Product — Joe Sync",
        summary: "Joe, Chiwei, and Mithun aligned on hiring-pipeline status, a GitHub-repo-plus-README POC packaging standard, Edgar's VPS infrastructure (CISO-confirmed), the UBS prerecord project's data processor/controller classification, and the OE website-redesign disaster-recovery plan. Joe directed evaluating existing shift-management software before building a custom staffing tool.",
        angle: "The POC packaging standard and vendor-first staffing-tool guidance both accelerate delivery velocity.",
      },
      {
        title: "Zoom Partner Sales Weekly",
        summary: "Standup covered BDR updates, support-line metrics (44 sessions, 16 unique visitors, 1:36 average wait, 50% first-engagement close), FitScore customer confirmations, pipeline at roughly $1M, and September prep across several accounts.",
        angle: "A 50% first-engagement close rate from the support line is a strong product-market-fit signal.",
      },
      {
        title: "Michael Morales — Website Followup",
        summary: "Michael confirmed Claude Desktop was connected to GitHub/Vercel overnight. Mithun walked through domain handoff, a dependency check on existing integrations, and GitHub repo/session-management basics, with the next check-in set for Wednesday 2pm.",
        angle: "Early dependency mapping here prevents production issues once the redesign goes live.",
      },
      {
        title: "Annalisa — Staffing Console Demo",
        summary: "Mithun demoed the staffing console prototype (event dashboard, operator browser, client-role matcher, budget view) to Annalisa, who flagged needed filters (date, client, event type, status, urgency, complexity), visibility into meeting arrival times, and integration with reporting tools. She committed to scheduling deep dives with several staffing team members.",
        angle: "Annalisa's filter feedback directly prioritizes the console's MVP roadmap.",
      },
      {
        title: "Edgar, Casey, Mithun — AI Production Sync",
        summary: "First joint sync on the AI video-editing pipeline. VPS infrastructure was cleared by leadership; Casey demoed Perfect Cut skill output, and the UBS deal was clarified as transcript summarization rather than voice cloning. The team settled on VPS for storage, Vercel for front-end, and GitHub for code, with Casey owning delivery and a weekly sync established.",
        angle: "This sync structure establishes clear ownership and unblocks the UBS deal's technical dependencies.",
      },
      {
        title: "Devin — FitScore Skill and Zoom Clips Demo",
        summary: "Mithun updated Devin on the AI video project and demoed the FitScore attendee-qualification skill along with Zoom's auto-clip feature. Claude Code CLI was installed on Devin's machine, and a FitScore demo with Brendan was scheduled for Monday.",
        angle: "Zoom's auto-clip generation meaningfully reduces manual editing effort ahead of Monday's customer validation.",
      },
    ],
  },
  {
    day: "Friday", date: "August 7", meetingCount: 7,
    meetings: [
      {
        title: "Workforce Scheduling Tool Discussion",
        summary: "The team discussed staffing/workforce scheduling tool requirements, weighing a Lasso replacement against existing shift-management platforms versus a custom-built console.",
        angle: "This build-vs-buy framing gates the staffing console's ongoing investment.",
      },
      {
        title: "Video Migration Ownership Review",
        summary: "The team reviewed video ownership mapping for the migration process, including channel-assignment logic and admin-vs-user ownership models, to ensure consistent ownership transfer during migration.",
        angle: "Clear ownership mapping prevents orphaned content after migration.",
      },
      {
        title: "Migration and Integration Sync",
        summary: "Kiran, Max, and Mithun synced on the Indeed dry-run status, confirmed a ZVM API collaborator fix, coordinated the City S3 bucket handoff, and reviewed Kaltura app token generation.",
        angle: "Dry-run readiness by Friday validates the pipeline ahead of Monday's demonstration to Indeed.",
      },
      {
        title: "Mithun — Quick Task Confirmation",
        summary: "Mithun confirmed cross-project status across bot demo prep, staffing console next steps, the Edgar VPS/AI production sync, Monday's FitScore demo, the website redesign handoff, and the Indeed dry-run timeline.",
        angle: "This end-of-week sync keeps multiple external validation gates from colliding on Monday.",
      },
      {
        title: "Staffing Process Discussion with Emily",
        summary: "An hour-plus deep dive with Emily on her staffing workflow in Lasso, role matching, client-specific rules, and recurring pain points including no auto-reassign capability and no recurring-unavailability tracking. Mithun demoed the staffing console prototype and collected detailed filter and view feedback.",
        angle: "Emily's workflow audit validates the console's MVP scope and flags recurring unavailability as a priority feature.",
      },
      {
        title: "Investigating Video Cue Points",
        summary: "Mithun, Akash, and Max investigated the ZVM cue-points API for chapter-marker support, confirming the data is available via API for inclusion in the migration pipeline.",
        angle: "Preserving chapter markers maintains content quality through the Kaltura-to-Zoom transfer.",
      },
      {
        title: "Hybrid Engineer POC Strategy",
        summary: "Mithun, Joe, and Chiwei held an end-of-week strategy review covering the hybrid-engineer POC packaging standard, the staffing-tool vendor-vs-build decision, Edgar VPS governance, the website-redesign go-live plan, and FitScore next steps with ComputerShare.",
        angle: "This session sets clear strategic direction across the week's parallel workstreams heading into August.",
      },
    ],
  },
];

export default function Week25Report() {
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
        <a href="/weekly_report_week25.pdf" download="Weekly_Report_Week25_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 25</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>August 3 &ndash; August 7, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "34", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "25", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 25 Analytics</strong> &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Indeed/City Migration &middot; ZVM API &middot; Bot MVP &middot; AI Editing Pipeline &middot; Staffing Console &middot; FitScore &middot; Website Redesign
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 25 centered on three execution tracks: operationalizing the Indeed and City video migrations (30-video dry-run planning, ZVM API integration, channel access controls), advancing AI production tooling (Edgar's VPS infrastructure, Casey's Perfect Cut editing skill, the FitScore attendee-qualification tool), and validating the staffing console prototype with real operators to inform a build-vs-buy decision. Deal velocity stayed strong with OmniAB's $51K closure, and the ComputerShare FitScore pilot advanced toward a customer demo. Governance decisions around AI-tooling infrastructure and spend were escalated to leadership, with VPS spend cleared and a GitHub-repo packaging standard set for future proof-of-concepts.</p>
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
