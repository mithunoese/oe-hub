"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-22";

const themes: Theme[] = [
  {
    title: "AI-Native Engineering Strategy Takes Shape",
    text: "Joe's strategy document formalized the hybrid solutions-engineer/forward-deployed-engineer role and the \"build twice, productize thrice\" rule for turning repeated manual workarounds into real product features, discussed at length across three separate sessions with Chiwe, Devin, and Andrew/Amelia.",
  },
  {
    title: "Hiring Process Redesigned After Losing Ash",
    text: "Candidate Ash's surprise decline, after initially indicating he'd sign, prompted a full rework of the associate SE hiring funnel: knockout questions reviewed first, then a case study, then a single culture-fit interview, to reduce wasted cycles on candidates who won't ultimately accept.",
  },
  {
    title: "Migration Pipeline Diversifies Beyond Video",
    text: "Alongside Indeed's near-complete pre-migration report and Okta's CircleHD taxonomy planning, Apex Technical (Panopto) and Coupa (Goldcast) both entered active discovery and pricing this week, broadening OE's migration business past pure Kaltura-to-Zoom work.",
  },
  {
    title: "Support Line Monetization Strategy Crystallizes",
    text: "With engagements running multiple hours on things like HubSpot integration troubleshooting, leadership drew a clear line between free trial-period support and paid professional-services work, while pushing hard for more volume to demonstrate value to Zoom before the pilot period ends.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Close Out Indeed Ownership Mapping — Akash / Indeed Team",
    text: "Get the channel-to-owner mapping report from Indeed's stakeholders, still pending as of Monday's check-in.",
  },
  {
    title: "Resolve IFRS Video Discrepancy — Max / Akash",
    text: "Reconcile the 86-permanent-hold vs. 28-sync-issue video counts once Max is back, and get Zoom's Stefan and Fan the corrected report.",
  },
  {
    title: "Restart Associate SE Pipeline — Mithun / Chiwe",
    text: "Begin interviewing fresh candidates using the redesigned case-study-first process, prioritizing East Coast-based applicants.",
  },
  {
    title: "Finalize Okta and Coupa Proposals — Mithun / Josh",
    text: "Send Okta the requested playbook document and finalize Coupa's pricing for training, 7 events, and the 50-video migration.",
  },
  {
    title: "American Idol Zoom Setup — Mithun / Brian",
    text: "Complete the remaining Zoom link and breakout-room configuration ahead of the August 25th audition start, and deactivate the OAuth apps once done.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "July 13", meetingCount: 7,
    meetings: [
      {
        title: "Indeed Pre-Migration Report Progress and Kaltura-to-S3 Discovery Approach",
        summary: "Akash reported the Indeed pre-migration report has everything requested except embed codes, which fetch successfully but add roughly 10 hours of runtime across ~6,900 entries. The team agreed to migrate Kaltura content to S3 first and generate reports from the cached JSON rather than re-querying Kaltura live for every report iteration.",
        angle: "Caching the raw Kaltura discovery data in S3 turns every future report iteration into a fast read instead of a 10-hour live query, a meaningful efficiency gain worth carrying into every future Kaltura migration.",
      },
      {
        title: "AI-Native Engineering Strategy Walkthrough",
        summary: "Joe walked Mithun, Chiwe, and Nathan through a formal strategy document reframing OE's engineering culture around agent-assisted development, a queryable knowledge base, and MCP rollout, introducing the hybrid solutions-engineer/forward-deployed-engineer role that sits with end users and feeds recurring manual workarounds back into the product roadmap. He proposed a build-twice-productize-thrice rule and floated tracking POC-to-product conversion and cycle time as the team's first KPIs.",
        angle: "This document is the first time OE's hybrid SE strategy has been written down with concrete rules and measurable KPIs, worth treating as the reference document for every future team-structure conversation.",
      },
      {
        title: "Quick Follow-Up with Chiwe on Onboarding and Roles",
        summary: "Mithun offered to raise open role-clarity questions directly with Andrew and Amelia, and Chiwe confirmed he's open to that, floating a simple you-manage-your-line, I-manage-mine framing. They also discussed collecting product ideas more systematically during delivery-team meetings.",
        angle: "A quiet idea-collection mechanism during delivery meetings could surface productizable patterns without requiring anyone to remember to write them down after the fact.",
      },
      {
        title: "EMEA/Institutional Weekly Sales Call",
        summary: "Andrew's team opened Q3 with new hire Saeed introduced as coverage for Daisy's upcoming maternity leave, alongside a strong two-week start ($408K against a $1.6M target) driven by Kara's Intuit ($180K) and Databricks ($120K) closes. Institutional highlights included JPMorgan's contract expanding from $2M to $3.75M and a large proposed Citi Japan meetings program.",
        angle: "The scale of JPMorgan's contract growth is a useful data point for framing OE's own migration and integration work as land-and-expand rather than one-time engagements.",
      },
      {
        title: "IFRS/Zoom Technical Sync — iFrame Channel Bugs and Final Migration Timeline",
        summary: "Zoom's Stefan and Fan walked through fixes shipping in the weekend's July release, including the iframe embedded channel setting finally covering both old and new event-build workflows, and closed captions/AI chapters returning after an unrelated bug had disabled them. The group locked the final IFRS migration mapping timeline ahead of Kaltura access ending.",
        angle: "Getting the exact release-weekend fix confirmed directly from Zoom's engineering team means Mithun can tell IFRS precisely when their channel issues resolve instead of guessing.",
      },
      {
        title: "Indeed/Skyler Weekly Check-In",
        summary: "Skyler, back from PTO, confirmed the Kaltura service account OE sent is working well for API-based discovery, and committed to sending the exact Zoom role permissions needed by end of day. The main open item remains the ownership-mapping report tying videos to Zoom channels.",
        angle: "Getting Indeed's admin comfortable navigating both platforms via shared credentials early avoids a bottleneck later when access needs escalate during the actual migration.",
      },
      {
        title: "Panopto/Community College Discovery Call",
        summary: "Mithun and Kara priced a Panopto-to-Zoom migration for a technical/trade college (18TB, 3,500 videos, an estimated $23-27K given it exceeds OE's 10TB data standard) using a grant that must be spent by year-end. The discovery call covered Canvas LMS folder-based access control organized by curriculum, and Mithun positioned the migration as fast once stakeholders align, contrary to the client's assumption it would be slow.",
        angle: "Reframing migration speed against stakeholder-alignment speed, the real bottleneck, is a positioning line worth reusing with any prospect who assumes the technical lift is the hard part.",
      },
    ],
  },
  {
    day: "Tuesday", date: "July 14", meetingCount: 8,
    meetings: [
      {
        title: "Citi S3 Test Bucket, DevOps Process, and Migration Bot Split",
        summary: "After confusion over why DevOps needed to be involved in sharing AWS credentials, Joe clarified the team will never get direct AWS Secrets Manager access and should follow the existing key-sharing process; the group agreed that going forward, external file access should go through SFTP rather than direct S3 access. Akash and Kiran confirmed they'll split the migration bot's Kaltura-side and ZVM-side work into parallel tracks, and Mithun opened a new discovery ticket for a Panopto prospect, Apex Technical.",
        angle: "The SFTP-vs-direct-S3-access lesson is exactly the kind of infrastructure decision worth documenting so it doesn't get relitigated with every new external file-sharing request.",
      },
      {
        title: "Ash Role-Clarification Call",
        summary: "Mithun answered candidate Ash's questions about the associate SE role's mix of engineering versus customer-facing work and OE's work-life balance, emphasizing the team's independence while being direct that the role leans technical. Ash indicated his main concern was work-life balance relative to his current job, not compensation, and said he'd decide by noon.",
        angle: "This call reads as a strong, honest sell of the role, worth noting for calibration on why it still didn't convert, since the pitch itself wasn't the problem.",
      },
      {
        title: "IT/Support Standup — Laptop Retrieval and EuroOps Onboarding",
        summary: "The team debated how long to chase down laptops from departed employees before filing a police report, landing on a stronger explicit warning in separation letters instead. Separately, they clarified the process for reactivating a European contractor group for an upcoming BMW event, agreeing IT should proactively schedule an equipment check-in ahead of time.",
        angle: "The proactive equipment-check-in idea for reactivated contractors is a small process fix that directly prevents a repeat of a past live-event scramble.",
      },
      {
        title: "Workato Enterprise MCP & Renewal Call",
        summary: "With the Workato renewal approaching, Mithun and Max walked Workato's team through the Zoom Contact Center integration use case, and Workato clarified the distinction between Arrow (their AI copilot, accessible via MCP) and Enterprise MCP (custom MCP servers built for specific applications), the latter not something OE currently has. The team decided to renew on the existing Business Edition rather than upgrade.",
        angle: "Understanding the real difference between Arrow and Enterprise MCP avoids overselling internally what the current Workato license can actually do for the ZCC integration.",
      },
      {
        title: "Ash's Decline Discussed with Chiwe, Nathan, and Annalisa",
        summary: "The group was surprised Ash declined after seemingly indicating he'd accept, theorizing a last-minute counteroffer from his current employer; a separate NASA-background candidate had also withdrawn. They agreed to restart the pipeline with a redesigned process, case study before a single interview, and to prioritize East Coast-based candidates going forward.",
        angle: "Two candidate losses in close succession is the direct trigger for the hiring-process redesign that follows on Wednesday, worth remembering as the why behind that change.",
      },
      {
        title: "Okta CircleHD Weekly Check-In",
        summary: "Andrew gave Mithun and Max a guided tour of Okta's flat, 137-channel CircleHD structure, confirming most channels are publicly accessible with tags functioning as CircleHD's equivalent to sub-channels. The team confirmed Zoom Clips supports in-place media replacement without breaking existing embed links, and the next weekly call moved from Tuesday to Friday due to Okta's team offsite.",
        angle: "Confirming Zoom Clips preserves the same URL after a media swap is a concrete answer to a real client concern about broken links post-migration, worth having ready for every future TVM prospect.",
      },
      {
        title: "Hybrid Role Strategy Walkthrough with Devin",
        summary: "Joe and Chiwe explained the hybrid SE/forward-deployed-engineer concept directly to Devin, framing his current sales-enablement role as adjacent but distinct, a working prototype rather than a one-line Word-document request is what turns a client ask into something engineering can actually build. Devin raised early questions about where he personally fits, prompting Joe to reassure the team that mistakes are expected in this new way of working.",
        angle: "Devin's concern about not knowing where he fits foreshadows Wednesday's clarification that he stays reporting to Amelia/Andrew, separate from this initiative.",
      },
      {
        title: "Apex Technical (Panopto) Scoping, Canvas Deep-Dive, Coupa, and American Idol",
        summary: "Kara, Max, and Mithun brought in Zoom's Andrew, a former Panopto specialist, to clarify how Canvas LMS's course-navigation deep-linking works, surfacing that individually-embedded course videos could require a much larger manual remapping effort than a channel-level connection. The same session priced Coupa's Goldcast migration and training package, and Kara handed Mithun the American Idol Zoom account spreadsheet to start building the 21 audition-session links.",
        angle: "The individually-embedded-video-vs-channel-level distinction is a genuine scope risk for any future LMS migration, flagging it before quoting protects margin on deals like this one.",
      },
    ],
  },
  {
    day: "Wednesday", date: "July 15", meetingCount: 5,
    meetings: [
      {
        title: "Chiwe 1:1 — IFRS Report, Ash's Decline, Hiring Redesign, Devin, AI-Tooling Ideas",
        summary: "Mithun and Chiwe confirmed the hiring process going forward, knockout questions first, then case study, then a single interview, and agreed a candidate who can't explain their own resume is a hard red flag. They also discussed Devin's reaction to Tuesday's strategy call and brainstormed two AI-tooling ideas: an AI video-editing assistant for delivery teams and an agent to automate American Idol's annual Zoom link setup.",
        angle: "The can't-explain-their-own-resume red flag is now a documented interview heuristic worth reusing for every future technical hire, not just this search.",
      },
      {
        title: "Akash JIRA/Ticket Cleanup Standup",
        summary: "Mithun worked through outstanding JIRA tickets with Akash, closing out ZCM186 (cultural findings documentation) and clarifying the still-unstarted Okta S3-to-S3 ticket needs a scheduled call with Zoom before Kiran's team can proceed.",
        angle: "Explicitly scheduling the Zoom S3-to-S3 call rather than leaving it as an open ticket is what actually unblocks Kiran's assigned work.",
      },
      {
        title: "Kara Personal Catch-Up and American Idol Zoom Setup Walkthrough",
        summary: "After catching up on Kara's squirrel infestation and Mithun's sudden apartment situation, Kara walked through the full American Idol Zoom setup requirements: 21 main-room audition sessions under one producer account, a recurring passcode-protected Winner's Circle meeting under a second account, all producers added as alternative hosts, and breakout-room lists uploaded per meeting. Mithun committed to a same-day turnaround.",
        angle: "Getting the exact account-and-permission structure explained once, clearly, meant this task, which took Max several weeks manually last year, was scoped for same-day completion this time.",
      },
      {
        title: "Devin 1:1 — Reporting Clarity, KPI Idea, Okta Playbook, IFRS Venting",
        summary: "Devin confirmed with Amelia that he won't report into Joe or Chiwe and will stay focused on sales enablement. They discussed building Devin a personal KPI-tracking dashboard similar to Mithun's own, reviewed a draft playbook document for Okta, and Mithun vented again about IFRS's demanding contact.",
        angle: "Offering to build Devin the same weekly KPI-tracking pattern Mithun uses for himself is a low-effort way to extend a working internal tool to a teammate.",
      },
      {
        title: "Server-to-Server OAuth Setup with Brian (IT)",
        summary: "Mithun walked Brian through creating a server-to-server OAuth app under the American Idol producer account to enable programmatic Zoom link creation, discovering the account needed an explicit Zoom Developer role assignment before the app-creation option would appear. Once permissions were corrected, the app connected successfully.",
        angle: "The exact permission path needed to enable server-to-server OAuth app creation is now documented and reusable for any future account needing the same setup.",
      },
    ],
  },
  {
    day: "Thursday", date: "July 16", meetingCount: 5,
    meetings: [
      {
        title: "Akash/Kiran Standup — S3/Bot Progress, IFRS Poll Timing, Missing-Video Discrepancy",
        summary: "Kiran reported the Kaltura-to-S3 fetch for Indeed is roughly 80-90% complete, and Akash reported similar progress on the migration bot. The team worked through a confusing IFRS request for two separate video polls on specific dates before agreeing on a simpler plan, and Akash flagged 86 videos on permanent hold in the database versus the 28 Zoom's Fan had cited, a discrepancy left for Max to resolve once back.",
        angle: "Untangling a client's overly specific timing request into a simpler equivalent plan avoided a needless multi-day back-and-forth over which exact hour a report gets pulled.",
      },
      {
        title: "Max/Mithun Call — American Idol OAuth Follow-Up, Missing-Video Reconciliation",
        summary: "Max, recovering from knee surgery, reviewed what Mithun and Brian had set up for American Idol, confirming general OAuth apps were the correct approach but flagging they should be deactivated once the meeting links are created. On the IFRS discrepancy, Max clarified the 86 permanent-hold videos are unrelated to the 28 sync-issue videos Zoom's Fan flagged, since permanent-hold content was never attempted in the migration at all.",
        angle: "Max's clarification that permanent-hold and sync-issue videos are two entirely separate buckets prevents a wasted afternoon trying to reconcile numbers that were never meant to match.",
      },
      {
        title: "Zoom Support-Line Weekly Call",
        summary: "The team debated when free trial-period support crosses into a billable engagement, citing a multi-hour HubSpot-integration troubleshooting call as an example that should have been monetized, and agreed all professional-services work will eventually be paid once the pilot period ends. Amelia pushed for higher volume in the meantime to build the case for Zoom, while the team reviewed EMEA staffing coverage and confirmed Q3 is off to a strong start.",
        angle: "Drawing a clear internal line now between quick fix and billable engagement avoids setting a precedent during the free trial that becomes hard to walk back once the line starts charging.",
      },
      {
        title: "Coupa Scoping Call with Josh",
        summary: "Mithun and Josh, a newer AE, built Coupa's full proposal live on the call, regional training, seven branded Webinars Plus events, and a 50-video Goldcast-to-Zoom migration, while reviewing Okta's requested playbook status document.",
        angle: "Building the proposal live during the call, rather than after it, cuts the typical days-long turnaround down to same-day and gives Josh a repeatable pattern to use on his own migration deals.",
      },
      {
        title: "Andrew/Amelia Q2 Review and Strategy 1:1",
        summary: "Mithun and Andrew reviewed Q2 KPI highlights and discussed a lost CMS migration deal where the client cited migration complexity as the blocker; Amelia reframed this as an easy excuse rather than a real objection and proposed exploring a model where Zoom subsidizes migration costs to remove that friction. They also confirmed Mithun's associate SE track stays under Joe/Chiwe while Devin remains fully separate under Amelia/Andrew.",
        angle: "Amelia's reframe, that too complex is often a convenient excuse rather than the real objection, is a useful lens to apply before assuming a lost deal requires a pricing or product fix.",
      },
    ],
  },
];

export default function Week22Report() {
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
        <a href="/weekly_report_week22.pdf" download="Weekly_Report_Week22_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 22</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>July 13 &ndash; July 17, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "25", l: "Meetings" }, { n: "4", l: "Days" }, { n: "4", l: "Themes" }, { n: "22", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 22 Analytics</strong> &nbsp;&middot;&nbsp; Updated through Thursday &mdash; Friday still in progress &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Indeed &middot; Okta CircleHD &middot; Apex Technical &middot; Coupa &middot; IFRS &middot; American Idol &middot; SE Hiring
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 22 opened with Joe formalizing OE&rsquo;s AI-native engineering strategy, a hybrid solutions-engineer/forward-deployed-engineer role, a shared knowledge base, and MCP rollout, while the sales side introduced Saeed covering for Daisy&rsquo;s maternity leave and closed strong Q3-opening deals. Migration work advanced on three fronts: Indeed&rsquo;s pre-migration report neared completion, the Okta CircleHD kickoff moved into detailed taxonomy planning, and a new Panopto-to-Zoom prospect, Apex Technical, began discovery. The week&rsquo;s biggest disappointment was losing candidate Ash after he initially indicated he&rsquo;d accept the associate SE offer, triggering a redesign of the hiring process and a broader conversation about team reporting structure that ultimately confirmed Devin stays separate from the Joe/Chiwe engineering track. A one-off but time-consuming distraction was building out Zoom meeting infrastructure for American Idol&rsquo;s auditions, which also became a live example of the productize-repeated-manual-work philosophy Joe is pushing.</p>
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
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Click a day to expand meeting details. Friday will be added once complete.</p>
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
      <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 40 }}>Note: This report was created in tandem with AI to help summarize and organize meeting notes. Every line has been read and verified for accuracy. Covers Monday&ndash;Thursday; Friday will be appended once complete.</p>
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
