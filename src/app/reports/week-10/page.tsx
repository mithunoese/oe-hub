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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-10";

const themes: Theme[] = [
  {
    title: "One Week, Two Proposals",
    text: "The automated migration pricing tool — built and live by Tuesday — takes a discovery questionnaire and outputs a line-itemized SOW summary. Indeed was scoped at $22,100 in a single session using it. Paired with the six-phase Okta implementation plan, which is now a reusable template for all ZCM engagements, OE can move from discovery intake to formal proposal in one step. The scoping cycle that took weeks on IFRS now takes a day.",
  },
  {
    title: "IFRS Engineering Sprint Clears the Gate",
    text: "In 72 hours the ZCM engineering team resolved every outstanding blocker: ZCM-118 (thumbnail migration fixed), MOV-to-MP4 conversion validated, tag limit raised from 20 to 30, captions workaround established, and the VOD channel assignment step identified and ticketed before any client-facing run. IFRS is now scheduled for client content review with full migration to begin on approval.",
  },
  {
    title: "Okta Reaches Committee",
    text: "The proposal built on Tuesday was in front of Okta’s internal committee by Thursday afternoon. Kenneth’s price sensitivity — against an existing Vimeo contract he cannot use — gave OE and Zoom a clear negotiation signal: let Zoom lead with the $15K credit before OE adjusts price. The August 15th go-live deadline, tied to the Oktane conference, creates urgency the customer already owns.",
  },
  {
    title: "AI Tooling Agenda Advances on Three Fronts",
    text: "The OE Video Editor reached working demo stage with a Claude-powered transcript-to-cut pipeline. The Power BI-to-Claude daily briefing agent was architecturally scoped with Connor and Eric, blocked only by a Microsoft Fabric auth ticket submitted to IT. Devin’s Podium 2.0 IR platform — with analyst briefing summaries and live Q&A call assist — moved toward a formal product review. All three share OE data assets as the intelligence layer.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Client Review and Go-Live — Max and Mithun",
    text: "Schedule content review call with IFRS team. Validate VOD channel structure preference. Establish batch throughput rate (videos per day) before scaling. Target beginning full migration by end of next week pending client green light.",
  },
  {
    title: "Okta Follow-Up — Kara and Adam",
    text: "Adam to contact Kenneth regarding Vimeo contract end date and explore pricing options. Committee decision expected. Kara to confirm proposal received via Slack and maintain warm engagement. OE price holds at $38K until Zoom leads with the $15K credit conversation.",
  },
  {
    title: "Indeed Scoping Call — Kara and Mithun",
    text: "Kara to send pricing overview to Zoom. Max recommends a joint discovery review call before finalizing the quote to validate questionnaire interpretation, particularly on the multi-sub-account ownership structure and Degreed/Confluence embed requirements.",
  },
  {
    title: "May 5th Zoom AE Pitch Prep — Mithun and Max",
    text: "Prepare five-minute migration value proposition for Zoom AE all-hands. Loop in Camden and Kristen. Align messaging on the self-service tier for lower-complexity education clients. Confirm agenda with Andrew ahead of the meeting.",
  },
  {
    title: "ZCM Discovery Questionnaire v2 — Mithun",
    text: "Update the discovery questionnaire and migration proposal template incorporating IFRS and Okta learnings. Key additions: Circle HD as a documented source, S3 complexity pricing, chapter migration scope language, VOD channel assignment as a deliverable step, and post-migration completion report as a standard handoff artifact.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "April 20",
    meetingCount: 4,
    meetings: [
      {
        title: "ZCM Technical Standup — Internal",
        summary: "Akash flagged two open API blockers: D2L Brightspace migration cannot upload external files to ZVM, and the Circle HD API spike for Okta remained in progress. The team confirmed the recent IFRS test batch uploaded into IFRS’s actual Zoom account rather than the test environment. Mithun noted the April 18th release may have addressed the ZVM upload gap and asked the team to retry before escalating.",
        angle: "The D2L ZVM upload blocker is the same API gap limiting Laurentian’s migration — this needs a formal Zoom escalation before any D2L engagement can be scoped or committed.",
      },
      {
        title: "Power BI Agent Architecture Discovery — Connor 1:1",
        summary: "Mithun explored building a daily event intelligence agent using OE’s data lake and Power BI semantic model with Connor. Connor had set up a Power BI MCP connector in VS Code but was hitting a Microsoft Fabric auth bug. He recommended Copilot Studio as an alternative deployment path and introduced Eric Costello, who built OE’s internal support assistant in Copilot Studio using GitBook MCP and Claude Sonnet 4.6, as the right contact for further guidance.",
        angle: "The Fabric auth blocker is the single remaining gate between Mithun’s daily briefing concept and a working prototype — the IT ticket submitted Wednesday is the critical path item.",
      },
      {
        title: "OE Sales Weekly All-Hands — Monday",
        summary: "Miguel Saliana was introduced as a new hybrid events team member joining Sean for EMEA on-site work. KPIs for last week: 45 meetings set (target 40), 43 opportunities created totaling $120–150K, $240–295K closed across 25 deals, $12M orders created including a $325K Citi ELA. Sean booked 10 meetings on Thursday alone from 240 dials. Garrett converted XTI Aerospace from an earnings call to a four-pack town hall contract within three days of the event. OE Meet’s native debut was announced for Tuesday. Q1 commission reports were being finalized for finance submission. Mithun was referenced as building self-service ZCM migration automation for lower-complexity clients.",
        angle: "OE’s migration practice is now part of the standard all-hands update — Mithun’s self-service tool work is cited publicly as a growth lever.",
      },
      {
        title: "Okta Migration Pricing and Scoping — Kara and Max",
        summary: "Mithun and Kara worked through pricing strategy for the Okta Circle HD to Zoom migration. The existing framework ran $28–30K; Mithun advocated for $37–38K given Circle HD as a new undocumented source, S3 structural complexity, and role hierarchy mapping requirements. The group aligned on framing the premium through new-source and S3 line items. Timeline was set at four months post-signature with a milestones-based structure. Kara to send the implementation plan and quote by Wednesday ahead of a client call.",
        angle: "Establishing a defensible premium for new-source migrations here sets the commercial template for every Circle HD and D2L engagement that follows.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "April 21",
    meetingCount: 4,
    meetings: [
      {
        title: "ZCM Technical Standup — Internal",
        summary: "D2L Brightspace API blocker confirmed: extraction works but no ZVM upload endpoint exists for external files. Mithun asked the team to retry after the April 18th release. The Circle HD API spike for Okta remained in progress. The group confirmed the IFRS test batch had uploaded to the correct account. The standup spun off immediately into a detailed IFRS batch review.",
        angle: "The D2L blocker and the ZVM channel assignment gap are both platform-level issues — both need formal Zoom escalation paths before any D2L engagement can be quoted.",
      },
      {
        title: "IFRS Batch Results Review — ZCM Engineering",
        summary: "Max, Mithun, Akash, and Kieran reviewed five IFRS videos in ZVM against Kaltura source records. Tag cap discrepancy: Zoom now supports 30 but OE’s transformer was capped at 20 — sub-ticket raised. Custom uploaded thumbnails not migrating — investigation ticket raised. MOV files rejected by Zoom API — fix: rename to MP4 or select highest-resolution Kaltura rendition. JSON attachments correctly skipped. Captions returning 500 errors. Max requested Dashlane credentials for Akash to validate results directly.",
        angle: "Resolving thumbnail, MOV, and tag issues this week means the first IFRS client review can happen against clean content — no surprises on delivery.",
      },
      {
        title: "Okta Implementation Plan Review — Max 1:1",
        summary: "Mithun and Max refined the Okta implementation document. Key edits: SSO push group mapping replaced with “channel access control configuration” to avoid committing to ZVM user group auto-provisioning via SSO; chapter migration removed from implementation scope (Zoom API not ready, deferred to post-Oktane); ownership remapping simplified to a document mapping Circle HD accounts to Zoom accounts; “parent-child channel relationships” changed to “channel-playlist relationships.” Max also proposed a post-migration completion report as a standard handoff artifact for every future engagement.",
        angle: "Cleaning up the scope language now prevents the same contract exposure that slowed down the IFRS engagement — precise wording on channels and chapters is foundational for every future ZCM proposal.",
      },
      {
        title: "Okta Migration Proposal Alignment — Kara, Adam, Farah",
        summary: "Adam (Zoom) surfaced a hard constraint: Okta’s Oktane conference is mid-September, making August 15th the absolute completion deadline. A four-month timeline from end-of-April signature lands exactly on that date. The group agreed to ask Kenneth which videos require manual chapter migration — if it is a small set, proceed; otherwise defer chapters to post-Oktane. Pricing settled on $37–38K with willingness to negotiate to $35K. Farah committed to sending the proposal and PDF to the client that day with a joint walkthrough call scheduled Wednesday ahead of Okta’s committee presentation Thursday.",
        angle: "The August 15th deadline changes the entire risk profile of this engagement — if Zoom’s chapter API is not released before July, OE needs a scoped-out fallback already in the contract.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "April 22",
    meetingCount: 9,
    meetings: [
      {
        title: "ZCM Technical Standup — Internal",
        summary: "Akash confirmed ZCM-118 (thumbnail fix) resolved — root cause was a missing default flag, test cases passing, server validation pending. Kieran completed the tag limit increase from 20 to 30 and pushed for review. The MOV fix was validated locally by renaming to MP4; needs IFRS account confirmation. Joe closed with a clear expectation: the next update should be that IFRS is executing and wrapping up within two days.",
        angle: "With thumbnail, tag limit, and MOV fixes all landing simultaneously, the IFRS batch is close to a clean end-to-end run — the first migration OE can point to as technically complete.",
      },
      {
        title: "IFRS Migration Logging and Reporting Review — Max and Engineering",
        summary: "Max identified a structural gap: the batch report shows video entity migration status but not attachment-level detail — whether caption files, TXT attachments, or thumbnails actually moved. Akash walked through the S3 architecture showing both a Kaltura source JSON and Zoom destination JSON maintained per entity. Mithun proposed adding per-video attachment counts and file-level success or failure indicators to the report so that client handoffs include verifiable fidelity data. The team committed to the enhancement.",
        angle: "A migration completion report with attachment-level fidelity is the difference between a professional handoff and a client asking weeks later why their caption files are missing.",
      },
      {
        title: "Microsoft Copilot Studio and Power BI Agent Architecture — Eric 1:1",
        summary: "Mithun met with Eric to explore the Power BI agent architecture. The primary blocker — Power BI MCP connector failing due to a Microsoft Fabric auth error — was confirmed as a known issue. Mithun submitted an IT Freshdesk ticket during the call. Eric walked through how the OE support assistant was built in Copilot Studio using GitBook MCP and a Freshdesk connector with Claude Sonnet 4.6, then demonstrated Teams deployment. Mithun demoed the OE Video Editor pipeline.",
        angle: "Resolving the Fabric auth ticket via IT is the single gate between Mithun’s daily briefing concept and a working prototype — this is worth escalating as a priority ticket.",
      },
      {
        title: "Camden New BDR Introduction — 1:1",
        summary: "Mithun connected with Camden (new Zoom team BDR, week 1.5) to explain the ZCM migration business from scratch. OE acts as a programmatic moving van transferring video content and metadata from legacy platforms into Zoom Video Management. Mithun walked through the Okta implementation plan as a live example of what a migration engagement looks like and outlined how Camden would participate in discovery calls as volume grows with Mithun and Max handling technical portions.",
        angle: "Getting Camden up to speed on ZCM migration early means OE has a BDR who can run initial discovery conversations, which directly scales the top of the migration pipeline.",
      },
      {
        title: "Okta Pre-Call Sync — Kara, Max, Mithun",
        summary: "Brief internal alignment before the Okta call. Kara confirmed the proposal email had been sent. Agreed: Mithun leads the document walkthrough, Max handles technical follow-up, pricing defense stays high-level at $38K covering discovery, migration, documentation, communication, and August 15th go-live — without itemizing by hour. Max and Mithun aligned on staying descriptive rather than prescriptive on ZVM platform specifics unless Okta pushed for detail.",
        angle: "Presenting a unified front on pricing with a clear go-live milestone removes the opportunity for Okta to negotiate down on hours rather than outcomes.",
      },
      {
        title: "Okta Pre-Call Internal — Farah, Adam, Zoom and OE Teams",
        summary: "Farah walked through the deck she built: Kaltura comparison, ZVM product roadmap, and feature highlights. Feature requests submitted this week included branding, dynamic embed via CDN link, AES encryption specification, session cookie timeout, advanced analytics with geolocation, and Korean language support. Adam confirmed a $15K Zoom credit is approved and needs to appear on the pricing appendix slide. Pricing appendix stays hidden from the main deck per Kenneth’s request.",
        angle: "The volume and specificity of feature requests submitted this week gives OE a documented paper trail of customer requirements — valuable both for Zoom’s roadmap and for protecting the engagement scope.",
      },
      {
        title: "Okta Migration Presentation — Full Call with Okta",
        summary: "Farah presented the ZVM capabilities deck to Kenneth, Andrew, and Alex. Kenneth flagged AES encryption specification, dynamic embedding without iframe restrictions, and session cookie timeout as security team requirements. Mithun walked through the six-phase implementation plan covering Circle HD-specific considerations, S3 transfer design, access control configuration, GDPR compliance, and communication cadence. Kara presented $38K for 3.5 months with August 15th go-live. Kenneth indicated price sensitivity against existing Vimeo and Circle HD contracts. Adam committed to following up on vendor onboarding and the Vimeo contract timing privately.",
        angle: "Okta’s proposal is now in front of decision-makers above Kenneth — the customer case study angle and the Vimeo contract timing conversation are the two levers worth pursuing this week.",
      },
      {
        title: "Post-Okta Debrief — Kara",
        summary: "Kara’s read: Kenneth’s reaction reflected real budget pressure from already paying for two platforms he cannot fully use. Strategy: let Zoom lead the credit conversation before OE revisits price. Both agreed the migration complexity and timeline justify the fee, and that Okta’s situation with Vimeo is not OE’s problem to solve at a discount. InvestX Capital also surfaced: the April 29th pre-record event has two editing hours baked in and the client barely understands their Webinar Plus license — a strong candidate for an onboarding package after the event.",
        angle: "Kara’s sequencing — let Zoom lead with the credit first — is right. It preserves OE’s price integrity while giving the customer a path forward.",
      },
      {
        title: "OE Video Editor and Podium 2.0 — Devin 1:1",
        summary: "Devin confirmed OE Meet’s native debut with Danaher went well — five-day trial, $5K, buy-side analysts joined and expressed intent to standardize on it. Mithun demonstrated the OE Video Editor with a CVS test case: project setup, slide and video upload, and a Claude agent instruction prompt handling cut points, dead air removal, and production mention filtering. Devin shared the Podium 2.0 IR platform concept, including a live call assist feature that would give the IR team real-time intelligence during earnings Q&A — replacing the current practice of shared Word documents mid-call.",
        angle: "Podium 2.0’s live call assist concept addresses a real gap in how IR teams currently manage earnings calls and could differentiate OE’s managed services in a way no competitor is pursuing.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "April 23",
    meetingCount: 5,
    meetings: [
      {
        title: "ZCM Technical Standup — Internal",
        summary: "Akash confirmed the thumbnail fix is visible and working in the IFRS account. Max approved the report enhancement format just before the call — team to begin work with a report ready by Monday. Max requested a CSV of this week’s validated migration results for IFRS to use for embed replacement work ahead of the client review. ZCM-121 (VOD channel assignment) queued for Monday. Team aligned: if IFRS approves the content review next week, full migration can begin the following week pending throughput benchmarking.",
        angle: "The IFRS migration is functionally ready to scale — the client review meeting is the only remaining gate before full production begins.",
      },
      {
        title: "IFRS Content Validation and Channel Architecture — Max and Mithun",
        summary: "Max investigated the Zoom preview rendering bug by creating a test channel and adding IFRS videos. All videos play correctly in channel context, English and French captions confirmed present, and tags display with 20-plus entries per video. Key discovery: generating embed codes requires videos to be assigned to a VOD channel first — this step was missing from the pipeline. A Zoom API endpoint exists for bulk channel assignment. Max and Mithun agreed to add this as a programmatic step 3 and created ZCM-121.",
        angle: "The VOD channel assignment gap would have caused a painful client conversation post-migration — catching it before the review meeting means every video is immediately embeddable on delivery.",
      },
      {
        title: "Zoom Thursday Weekly All-Hands",
        summary: "OE announced a new marketing agency engagement on a month-to-month basis covering LinkedIn, blogs, webinars, and direct outreach. Q2 open opportunities have doubled to $390K. Rajul (Zoom CMS leader) shared three strategic pillars: live events, video CMS migration, and AI content generation. He cited 53,000 Zoom customers and 9 million events and estimated 5 percent could use OE services. CMS focus for Q2–Q3: corporates via active pipeline, education via summer contract renewals. Mithun’s self-service migration tool was cited as critical for education price points. Luminal and Tiles (Zoom hybrid streaming tool) flagged as an underexploited service — delivery team to assess readiness. May 5th Zoom AE all-hands pitch confirmed.",
        angle: "Rajul’s 5 percent adoption math puts OE’s addressable opportunity at roughly 20 times current revenue scale — May 5th is a high-stakes pitch.",
      },
      {
        title: "Weekly Check-In — Emilia",
        summary: "Weekly 1:1 covering active engagements, Q2 priorities, and upcoming week planning.",
      },
      {
        title: "Indeed Migration Pricing Review — Kara and Camden",
        summary: "Mithun walked Kara and Camden through the migration pricing tool using the Indeed discovery questionnaire. Output: complex migration at $22,100. The base rate reflects custom DND retention metadata, caption migration, multi-sub-account ownership remapping, and legacy embed continuity across Degreed, Huddle, and Confluence. A $500 link redirect report was added. Data volume confirmed at 7.9TB, under the 10TB base threshold. Hard deadline September 30th driven by Kaltura contract expiration. The session demonstrated how the tool compresses scoping from days to a single meeting.",
        angle: "Indeed’s multi-sub-account Kaltura structure and the Degreed-Huddle-Confluence embed dependency make this a more complex engagement than Okta — the September Kaltura expiration creates the same hard deadline urgency.",
      },
    ],
  },
  {
    day: "Friday",
    date: "April 24",
    meetingCount: 1,
    meetings: [
      {
        title: "ZCM Technical Standup — Friday Wrap",
        summary: "Akash confirmed the thumbnail fix is visible and working in the IFRS Zoom account. The enhanced migration report will be ready by Monday. Max requested a CSV of this week’s validated IFRS content for the client to begin embed replacement work. ZCM-121 (VOD channel assignment) queued for Monday. The team aligned on starting full migration processing the following week pending client review approval. The Zoom preview rendering bug was acknowledged as a Zoom-side UI issue — content plays correctly in the published channel.",
        angle: "With every blocker resolved and the client review meeting scheduled, the IFRS migration has the clearest path to go-live of any engagement in Q2.",
      },
    ],
  },
];

export default function Week10Report() {
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
          href="/weekly_report_week10.pdf"
          download="Weekly_Report_Week10_final_1.pdf"
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
        Week 10
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>April 20 &ndash; 24, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "23", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "10", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 10 Analytics</strong> &nbsp;&middot;&nbsp; Okta $38K proposal to committee &nbsp;&middot;&nbsp; Indeed $22,100 scoped via automated tool &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Okta &middot; Indeed &middot; OE Video Editor &middot; Power BI Agent
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 10 was the week the migration practice converted months of pipeline work into formal commercial motion. Two proposals went out &mdash; a $38K six-phase implementation plan to Okta&rsquo;s committee and a $22,100 automated quote to Indeed &mdash; while a 72-hour engineering sprint cleared every outstanding IFRS technical blocker, bringing the first client-scale ZCM migration to the edge of go-live. Mithun built and deployed the automated migration pricing tool, delivered a Camden ZCM onboarding session, and advanced three internal AI initiatives in parallel: the OE Video Editor prototype, a Power BI-to-Claude daily briefing agent, and Devin&rsquo;s Podium 2.0 IR platform. The week closed with IFRS scheduled for client review, Okta in front of its procurement committee, and the May 5th Zoom AE pitch confirmed across 23 meetings.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 11</h2>
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
