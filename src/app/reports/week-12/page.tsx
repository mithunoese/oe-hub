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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-12";

const themes: Theme[] = [
  {
    title: "IFRS Migration Reaches the Final Gate",
    text: "Multiple conversations this week advanced IFRS from pending to effectively unblocked. Fan confirmed the content migration infrastructure is ready immediately; the thumbnail deletion bug was mitigated from 7 days to 30 days; and Mithun’s end-of-week Zoom platform validation confirmed that category structure and Video IDs carried over correctly from Kaltura. The only remaining gate before go-live is Tudor’s AEM iframe verification, expected mid-Week 13.",
  },
  {
    title: "CMS Migration Channel Activated Across Zoom’s Global Team",
    text: "The Tuesday Zest call reached 30 to 35 Zoom video management specialists with the OE six-step go-to-market, the Okta implementation document, and the active pipeline of five engagements. Andrew Piper’s in-call validation against his Panopto benchmarks gave the pricing credibility before the full group. The referral form was updated in real time during the call to include all migration and integration materials, giving every rep an immediate path to route opportunities.",
  },
  {
    title: "Integration Services Emerge as a Standalone Business Line",
    text: "Farah’s on-camera enthusiasm on the Zest call for marketing integrations — Marketo, HubSpot, Eloqua, Salesforce, Zapier — and the Amgen discovery call, where OE was confirmed as the implementation partner for a bi-directional Zoom webinar data pipeline touching Pulse Engage, Salesforce Marketing Cloud, and MuleSoft, together signal that integration services are now generating real inbound demand. A repeatable pricing model and a marketing integrations one-pager are the two missing pieces before this scales.",
  },
  {
    title: "Migration Bot Security Architecture Defined",
    text: "The Monday session with Will produced the first formal security requirements framework for the automated migration bot: service accounts rather than user credentials, MFA exception requirements, and client IT security pre-approval as a precondition. Akash separately confirmed multi-tenant credential isolation is architecturally in place. This work means security requirements can now be incorporated into the discovery questionnaire before the bot goes anywhere near a client environment.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS: Confirm Tudor’s AEM Iframe Verification",
    text: "Tudor’s AEM sandbox verification is expected mid-week. If the iframe solution passes, OE and Zoom proceed immediately with the full live migration. Mithun and Max to align with Fan on an exact start date and batch plan. Owner: Mithun, Max, Fan Wang.",
  },
  {
    title: "Amgen: Send Integration Engagement Proposal",
    text: "Kristen to finalize the pricing proposal looping in Emilia for alignment before it goes out. Target first workshop session by end of Week 13. Structure should include a base package and an overage rate to protect against scope creep. Owner: Kristen, Mithun.",
  },
  {
    title: "Migration Bot: Produce Client Requirements Document",
    text: "Mithun to draft the service account specification and MFA exception requirements document based on the Will review. Share with Kara for incorporation into the migration discovery checklist so future AEs surface security requirements early. Owner: Mithun.",
  },
  {
    title: "Zest Integration Leads: Follow Up with Farah",
    text: "Follow up with Farah on any integration questions from her team routed this week. Build a marketing integrations one-pager covering Marketo, HubSpot, Eloqua, Salesforce, and Zapier to add to the CMS materials package in the referral form. Owner: Mithun, Max.",
  },
  {
    title: "Citi Veracast: Check in with Andrew Classen",
    text: "Confirm ColdFusion extraction script progress and S3 landing zone. Update Gib on the approximately 753-file count so he can communicate the accurate inventory to the Citi team. Owner: Max, Andrew Classen.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "May 4",
    meetingCount: 6,
    meetings: [
      {
        title: "OE/Zoom Internal Weekly Standup — IFRS & Citi Updates",
        summary: "Max flagged two active blockers on IFRS. A Zoom platform bug is deleting uploaded thumbnail and resource files after seven days due to a staging area issue; the fix is expected in the mid-May Zoom release. Fan is working through a JSON transcript file retention gap with a file-dump workaround proposed. Max also introduced the Citi Veracast ETL project: extracting legacy MP4s, SRT files, and transcripts from OE’s own Veracast platform for Citi, with Andrew Classen as the key developer. Mithun framed it as a pure extraction and reporting job with no traditional migration destination required.",
        angle: "The Zoom platform bug and JSON file gap are the two live blockers between OE and IFRS revenue — tracking their resolution is the primary SE work item for the week.",
      },
      {
        title: "OE Company-Wide Monday All-Hands — Q2 Pipeline & Delivery Week Briefing",
        summary: "Emilia announced May 6–7 as the company’s busiest delivery days of the year, cancelling all internal meetings. The company added approximately $250K in opportunity value and $750K in new orders created last week. Capital markets beat their $500K April goal at $550K. The Zoom team reported $81K closed and $77K in new opportunities. Rob flagged Equisolve beginning to function as a flywheel with repeat quarterly earnings customers, and a potential referral agreement with Precision AQ for 100% of their event business. Alan flagged a critical operational issue: the OE website went down for three days after a Salesforce earnings event link was flagged as phishing, triggering Bluehost to shut the site. The team is switching hosting providers and building an IT whitelist communication workflow for all event URLs.",
        angle: "The phishing link issue is operationally relevant to any OE-hosted event page tied to a Zoom customer and reinforces the need for proactive IT contact capture during client onboarding.",
      },
      {
        title: "Andrew Piper (Zoom ZVM) Introduction — CMS Migration Partnership Kickoff",
        summary: "Tyler arranged an introduction between Mithun, Max, Alan, and Andrew Piper, who joined Zoom two weeks prior as a video management specialist with a decade at Panopto and a background at an AI transcription startup. Andrew validated OE’s migration pricing as directly in line with his Panopto experience, where migrations ranged from $10K to $60K. Migration is consistently one of the top three questions on every ZVM customer call. The group discussed folder hierarchy, embedded link migration, multi-source capture, and metadata gaps. Alan shared an active UBS opportunity in London where a customer was redirected away from Kaltura toward Zoom. Andrew will join the ZVM weekly call the following morning and was looped in on the Citi feature gap analysis between Kaltura and Zoom.",
        angle: "Andrew Piper is an ideal internal Zoom champion who understands migration complexity from Panopto — this introduction positions Mithun and Max as the default migration partner across ZVM’s entire customer-facing motion.",
      },
      {
        title: "Citi Veracast Content Extraction — Technical Scoping Call",
        summary: "Mithun, Max, Justin, and Andrew Classen aligned on scope after Citi updated requirements. Citi is asking only for existing MP4 and SRT files delivered via SFTP to a Citi-provided bucket. Files are stored on FSX attached to ColdFusion servers and require a ColdFusion script to extract. Files are in F4V format needing batch conversion to MP3; untrimmed files are acceptable since Citi will run AI transcription. The actual file count is approximately 753, significantly less than the 1,500 Citi believed, because files were only retained when an event was set to archive. Andrew Classen committed to writing the extraction script and producing a CSV mapping each file to its event title, speaker names, start date, and filename.",
        angle: "OE’s ability to extract and deliver content from its own legacy Veracast platform establishes a new internal migration capability that could apply to other long-standing institutional clients on the same infrastructure.",
      },
      {
        title: "Zest Call Presentation Prep — Internal Dry Run",
        summary: "Emilia, Mithun, Max, and Kristen ran through the slide deck for the following morning’s Zoom ZVM global call with approximately 30 to 35 participants. Emilia will open with team introductions and drop three documents in chat: the CMS one-pager, pricing guide, and discovery questionnaire. Mithun will present the six-step go-to-market and pull up the Okta implementation document on screen. Emilia flagged the Sienna deal — a $250K three-day hybrid event in India and Ottawa — as worth mentioning to demonstrate AV capability. CMS migration materials were added to the referral form in real time before the call.",
        angle: "This call is the most important channel activation moment in the CMS migration go-to-market so far — successfully briefing 30-plus Zoom reps with materials and a live demo of the Okta proposal sets the tone for inbound lead quality.",
      },
      {
        title: "Migration Bot Security Review — Will",
        summary: "Mithun walked Will through the AI migration chatbot concept: a Zoom Team Chat app that authenticates via OAuth, accepts source platform credentials, discovers content via API, and executes the migration on behalf of the customer. Will raised three enterprise blockers: credentials must come from a service account coordinated by IT rather than submitted by an end user through a link; most enterprise source platforms require MFA which the bot cannot handle automatically; and app deployment requires IT security review at every client. Will concluded that automated self-service is possible only if the client security team approves the app, provides a service account without MFA, and grants read/write API access. Mithun acknowledged MFA as the key unaddressed gap and committed to producing a client requirements document.",
        angle: "This review directly shapes how OE qualifies CMS migration deals — MFA handling and service account provisioning need to be added as standard discovery questions before the bot is marketed as self-service.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "May 5",
    meetingCount: 5,
    meetings: [
      {
        title: "Internal Migration Morning Standup",
        summary: "A brief check-in with no new migration updates before the IFRS client call. The team is waiting for Andrew Classen to extract Citi files from ColdFusion and deposit them in S3, after which transcoding and transcript extraction work begins. No action items beyond holding the current pattern until Andrew’s script is ready.",
        angle: "Citi project pacing is entirely dependent on Andrew Classen’s ColdFusion extraction script — no blocking dependency on Mithun or Max at this stage.",
      },
      {
        title: "Akash — Migration Bot Demo Check-in",
        summary: "Akash could not show a working demo, still completing Zoom app cloud deployment, webhook URL configuration, and initial setup. Mithun raised the multi-tenancy question: if two separate enterprise customers both download the app, can the bot correctly manage their separate credential sets in isolation. Akash confirmed that credentials entered through the Zoom app are passed directly to the relevant source platform API and the system handles multiple distinct customer environments. Mithun asked Akash to reconnect when a demo-ready build is available.",
        angle: "Confirming multi-tenant isolation is a prerequisite before OE can responsibly market the bot — this check-in advances readiness even without a live demo.",
      },
      {
        title: "Zoom ZVM Global Weekly — CMS Migration Pitch to Zest Team",
        summary: "The major channel activation call for the week, reaching approximately 30 to 35 Zoom video management specialists globally with Tyler leading in Rajule’s absence. Emilia presented OE highlights: 1,300 events being delivered this week, Kara on-site at Flextronics, and the Sienna $250K contract split between $100K professional services and $150K on-site AV in India and Ottawa. Mithun walked through the six-step go-to-market, the Okta implementation document, and the active pipeline of five engagements: IFRS in active implementation, Okta and Indeed proposals sent, University of Ottawa RFP submitted, and Anderson pending signature. Max covered pricing at $15K–20K typical with discovery required. Andrew Piper validated pricing against Panopto history. Farah had the most emphatic response, immediately confirming OE covers Marketo, HubSpot, Eloqua, Salesforce, and Zapier, asking for this added to all documentation.",
        angle: "Farah’s real-time enthusiasm about marketing integrations opens a second lead channel beyond migration — her customer base is generating questions OE can monetize immediately with minimal lift.",
      },
      {
        title: "IFRS Migration Progress Call — Client, Zoom, and OE Alignment",
        summary: "Call with Ryan and Stefan from IFRS, Fan and newly introduced Chris from Zoom, and Mithun and Max. Fan confirmed the content migration infrastructure is technically ready to begin immediately. The thumbnail retention has been extended to 30 days as a mitigation; the permanent fix is in the May release. The primary remaining blocker is the AEM embedding solution — Fan’s team confirmed the iframe script works on their end and IFRS’s AEM platform owner Tudor needs to validate in a sandbox mid-next-week. On JSON files, Fan proposed a temporary file dump. On slides for multi-stream videos, no API exists for programmatic attachment — manual only — flagged as a potential separate contractual conversation. Ryan also flagged a Zoom email disabling transcript download for VOD effective May 18. The admin-side player bug preventing content access was confirmed as a new player configuration issue with the public channel sharing link as a working workaround.",
        angle: "Fan’s confirmation that migration can start now effectively removes the last technical blocker OE controls — the outstanding items are all Zoom-side product gaps and Mithun’s job is now to manage Ryan’s expectations while Zoom resolves the embedding and slide API work.",
      },
      {
        title: "Post-IFRS Internal Debrief — Mithun and Max",
        summary: "Mithun and Max agreed to proceed with migrating all files except JSONs and run a separate job once Bo confirms a storage bucket. Fan’s 30-day extension on thumbnail retention means restarting the dry run batch is not urgent. The slide attachment problem has no clear programmatic path from either Zoom or Kaltura. Both noted the Zest call went well and Farah’s integration interest signals a meaningful new inbound channel. Mithun departed for Canada that afternoon for a wedding, working Wednesday and Thursday on Pacific Time.",
        angle: "Proceeding with migration minus JSONs keeps IFRS momentum alive while deferring unresolved slide and JSON questions to Zoom — a reasonable risk split given Fan’s confidence in the May release.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "May 6",
    meetingCount: 2,
    meetings: [
      {
        title: "Amgen DTM — Zoom Webinar Registration Integration Discovery Call",
        summary: "Multi-team call with Amgen’s DTM marketing group (Diti as technical coordinator, Minnie as business POC, Darian and Kaushik from the web team, Siley from MCRM, and Akil and Jimin as technical leads), Zoom (Charles Briles and Jason Stubo), and OE (Kristen, Mithun, Max). Amgen wants to replace a manual Epsilon-dependent post-event data process with an automated bi-directional API integration: registrant data flowing into Pulse Engage at the moment of registration, and post-event attendance data returning automatically via API. Jason recommended Webinars Plus for healthcare marketing use cases. Max walked through the open API and Salesforce integration paths. Diti confirmed the goal is full automation to eliminate Epsilon. Amgen plans weekly workshop sessions through end of June and asked for a packaging proposal from OE. Jean, who owns the Zoom platform relationship at Amgen, was not on the call and was identified as a key contact for the Webinars Plus conversation.",
        angle: "Amgen represents a meaningful multi-month professional services engagement — with weekly workshops, full API implementation, and a clear path to becoming the integration partner for one of the largest pharma companies in the Zoom customer base, this call opens a revenue line that validates OE’s integration capability.",
      },
      {
        title: "Post-Amgen Pricing Debrief — Kristen and Mithun",
        summary: "Kristen and Mithun discussed how to price the Amgen engagement. Mithun anchored at a floor of $10K for any implementation with weekly consulting sessions, noting Cargill’s simpler integration was approximately $3,500 and Amgen’s scope is materially more complex given the number of stakeholders, multi-sprint design process, and bi-directional API work. Kristen floated $400–$500 per hour. Both discussed Workato as a middleware option where OE would act in a reseller capacity. Mithun suggested a base price with overage to protect against scope creep. Decision was deferred to loop in Max and Emilia before sending anything to Amgen.",
        angle: "Getting the Amgen pricing proposal right sets a precedent for all future marketing integration engagements — with Farah indicating multiple similar inbound requests, a clearly packaged integration service tier would let OE move faster without repricing from scratch each time.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "May 7",
    meetingCount: 1,
    meetings: [
      {
        title: "IFRS Migration Validation — Mithun and Max (Remote)",
        summary: "Mithun joined from Canada on Pacific Time. Mithun and Max worked through outstanding migration questions and completed the key technical validation for the week: confirming that both Video IDs and Categories/Sub-Categories from the Kaltura source are correctly visible in Ryan’s Hub on the Zoom Video Management platform after the dry run migration. Mithun shared screenshots in the Zoom chat tagging Fan Wang directly. Fan confirmed that the category and metadata fidelity is sufficient to meet IFRS requirements. The migrated category structure includes year-based categories (2008, 2018, 2020), organizational categories like ASAF and KMSProd, and a Content Migration folder, with Kaltura entry IDs carrying across as tags — confirming metadata mapping is functionally intact.",
        angle: "This validation is the last piece needed before the team can greenlight the full live migration — Fan’s explicit sign-off on category/subcategory fidelity removes what had been an open question going into the week.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 8",
    meetingCount: 1,
    meetings: [
      {
        title: "End-of-Week Check-in — Mithun and Max",
        summary: "Mithun and Max closed out the week with a brief call. The IFRS migration is effectively ready to begin pending Tudor’s AEM validation expected mid-next-week and Zoom’s mid-May release. The Citi Veracast extraction is in Andrew Classen’s hands. The Amgen integration proposal is being drafted by Kristen with input from Mithun and Max. Fan’s metadata sign-off and category validation completed Thursday are the last pieces needed before the full live migration run. No blocking issues were surfaced heading into Week 13.",
        angle: "Ending the week with migration unblocked, two new inbound engagement threads (Amgen integrations, Zest integration leads from Farah), and Fan’s metadata validation completed is a strong close to a heavy delivery week.",
      },
    ],
  },
];

export default function Week12Report() {
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
          href="/api/report-pdf/week-12"
          download="Weekly_Report_Week12_final_1.pdf"
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
        Week 12
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>May 4 &ndash; 8, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "15", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "12", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 12 Analytics</strong> &nbsp;&middot;&nbsp; IFRS migration unblocked &nbsp;&middot;&nbsp; Zest channel activated &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Okta &middot; Indeed &middot; Amgen Integration &middot; Citi Veracast &middot; Migration Bot
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 12 was OE&rsquo;s most operationally dense week of Q2, running the company&rsquo;s busiest delivery period of the year &mdash; over 600 events globally across May 6 and 7 &mdash; in parallel with a major CMS migration channel activation, a live IFRS dry run validation, a new enterprise integration discovery at Amgen, and a full security architecture review of the migration bot. The week opened with Fan Wang confirming the Zoom migration infrastructure is technically ready to start, and closed with Mithun validating that Video IDs and category metadata are migrating correctly from Kaltura, effectively unblocking IFRS for a full live migration in Week 13. Two new inbound channels emerged from the Zest call: Farah&rsquo;s real-time enthusiasm about marketing integrations opens a service line OE has not yet formally packaged, and the Amgen discovery call establishes OE as the integration implementation partner for a multi-sprint pharma engagement running through end of June.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 13</h2>
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
