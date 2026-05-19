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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-13";

const themes: Theme[] = [
  {
    title: "IFRS Migration Start Locked for May 18",
    text: "The week resolved all remaining pre-migration technical open items. Akash confirmed agenda slides are extractable from Kaltura via the thumb queue document path and transfer cleanly to Zoom’s resources folder. A category assignment bug was discovered mid-week: all 232 account-level categories were being applied to every video rather than the categories associated with each specific entry. Joe and Max diagnosed this as a per-entry filtering fix requiring only a metadata patch call, not a re-upload. Max will write the ticket and Akash will apply the fix before Monday. IFRS has a hard deadline to cut its Kaltura license, making May 18 non-negotiable.",
  },
  {
    title: "Indeed Proposal Converts to Confirmed Engagement",
    text: "The Thursday discovery call completed the Indeed sales cycle that started with Skyler Fitzpatrick’s May 6 deliverables email. A live walkthrough of the ZVM environment, channel structure, permission tiers, and sample migration report gave Skyler everything needed to brief leadership on the 10TB, 150-publisher, three-platform embed inventory scope. Her response was immediate: “This is perfect, thank you.” Materials were circulated to leadership the same day, positioning Indeed squarely at contract stage heading into Week 14.",
  },
  {
    title: "Integration Pricing Playbook Formalized",
    text: "The Arziant/Baker Media RFQ — a financial media company migrating from Cvent to Zoom Events and Webinars Plus — forced OE to build a repeatable pricing structure for integration services for the first time. Across two working sessions, the team aligned on $3K per integration for setup and onboarding with $500 per year maintenance, a $100K contract threshold for bundled dedicated CSM support, and $3,500–$5,000 per month for CSM access below that threshold. The RFQ response was submitted before the May 15 deadline with a discovery-first cover letter. This model is now the default template for all future integration RFQ responses.",
  },
  {
    title: "Earnings Automation Concept Takes Shape",
    text: "Back-to-back conversations with Casey and Devin throughout the week produced the clearest articulation yet of a potential OE product extension: an end-to-end AI-powered earnings call platform covering script generation from financial API connectors, live teleprompter (Casey currently operates one manually), OE production delivery, post-event auto-editing and clip extraction, and retail investor sentiment analysis pulling from Reddit and X. Devin confirmed internal appetite and noted that both S&P Capital Access and Computershare have infrastructure OE could build on. Lorna, a former Credit Suisse IR executive now consulting for OE, will validate the Computershare partnership direction.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS: Live Migration Begins Monday May 18",
    text: "Max and Akash begin the full Kaltura-to-Zoom extraction and upload. Category patch to be applied before the first batch runs. Max to coordinate with Fan Wang on progress check-ins and keep the IFRS team informed. Owner: Max, Akash.",
  },
  {
    title: "Indeed: Send Contract",
    text: "Skyler has materials and is circulating to leadership. Cara to send the contract this week and confirm the kickoff timeline. Owner: Cara, Mithun.",
  },
  {
    title: "Weekly CMS Pipeline Report to Amelia",
    text: "First weekly email report on open CMS and integration opportunities due start of week. Include Indeed, Okta, HubSpot, Arziant (shortlist pending), University of Ottawa, and any new inbound. Owner: Mithun.",
  },
  {
    title: "Salesforce Dashboard Access",
    text: "Follow up with Diana and Ali on pre-sales engineer permissions and dashboard build. Mithun needs visibility into closed-won opportunities he has influenced. Devin’s ticket has been open six weeks. Owner: Mithun, Devin.",
  },
  {
    title: "Arziant/Baker: Watch for Shortlist Decision",
    text: "RFQ closed May 15 with ten vendors in scope. Shortlisting to three to five vendors is next. Monitor for response and be ready to schedule a discovery conversation quickly. Owner: Kara, Mithun.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "May 11",
    meetingCount: 4,
    meetings: [
      {
        title: "ZCM Weekly Standup — Internal",
        summary: "The migration team opened the week reviewing the Kaltura agenda file retrieval problem. Max created ZCM-133 to track investigation into how agenda slides can be consistently extracted from the Kaltura API, noting they had been surfacing as thumbnails rather than standalone files. The IFRS migration targeted for May 18 remained on hold pending a response from Priya; Mithun confirmed no reply had arrived. The team also worked through setting up Dashlane password manager access for the India dev team so admin credentials for the Kaltura integration could be shared securely.",
        angle: "ZCM-133 moves the last pre-migration blocker forward; Dashlane setup removes the manual credential handoff risk before IFRS go-live.",
      },
      {
        title: "Pharma SDK Discovery — Internal (Peter + Mithun)",
        summary: "A pharma company called Menarini, with a global market cap of $46 billion and an APAC entity at $66 million, wants to embed live Zoom webinars into a marketing portal in the Philippines via the Zoom Meeting SDK. Their Korean dev partner is building the site on Drupal or WordPress. Mithun assessed the project as technically feasible at $20K–$340K depending on scope but raised concerns about maintenance ownership and OE’s lack of prior SDK delivery precedent. Peter resolved to message Amelia about capability direction. Amelia later confirmed this is not OE’s lane at this stage.",
        angle: "Menarini was a useful capability boundary test — Amelia’s clear guidance prevents OE from overcommitting on unfamiliar SDK work.",
      },
      {
        title: "Monday OE All-Hands — Internal",
        summary: "The company reviewed a record prior week of 1,300 delivered events across capital markets (550), corporate services (269), conferences (75), and OE Connect (360). Christian and Jamie shared learnings from the LSEG Investor Relations Masterclass, including that 85% of buy-side analysts require at least two meetings before investing and IR teams feel they are flying blind on messaging reception. Kara recapped an on-site delivery at Flextronics in Austin where the company announced a split into two entities. Mithun shared that OE won its first investor day through a Computershare referral, set for mid-June. GCS pipeline stood at $39 million with Goldman Sachs showing genuine interest after the latest dry run and Garrett’s $77K Site One IRD topping the closed column.",
        angle: "The Computershare investor day win validates the Zoom partner referral motion; Mithun’s Claude-for-notes moment during the LSEG recap reinforced the SE-as-AI-practitioner positioning.",
      },
      {
        title: "Baker Media RFQ Working Session — Kara + Mithun",
        summary: "Kara and Mithun reviewed an RFQ from Baker Media, publisher of American Banker and National Mortgage News, migrating from Cvent to Zoom Events and Webinars Plus. The document asked for pricing on five integrations — Ometa (direct, no Zapier), Salesforce, HubSpot/Marketo, Sessionboard, and a CMS migration — plus a dedicated customer success manager. Mithun proposed $3,000 setup plus $500 per year maintenance per integration, citing the Cargill precedent. He flagged the no-Zapier requirement as unusual given all five systems connect natively through it and pushed for a discovery call before finalizing. Total Zoom licensing is approximately $107K, leaving roughly $143K headroom under the $250K ceiling.",
        angle: "Pricing integrations at $3K/$500 sets a repeatable template for future RFQ responses across integration-heavy deals.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "May 13",
    meetingCount: 8,
    meetings: [
      {
        title: "ZCM Standup — Agenda Slides Confirmed, JSON Roadmap",
        summary: "Akash updated ZCM-133 confirming agenda slide files are extractable from Kaltura’s API. Max shared that Zoom is targeting a June release to support compressed file uploads to the content library, giving OE a clean path to bulk-dump JSON files after primary video migration. Max also flagged a Zoom thumbnail cap of five per video; since some Kaltura entries return six objects, the team needs to filter by object type to avoid that error during migration.",
        angle: "ZCM-133 is now unblocked and the June compressed file enhancement removes the last major technical unknown for IFRS delivery.",
      },
      {
        title: "Migration Bot Development Review — Akash + Mithun",
        summary: "Akash walked Mithun through the current chatbot state: it can query Kaltura for a file list and is in progress on retrieving full metadata and attachments alongside each video. Mithun proposed shifting the UX from listing all files to asking what the user wants to exclude, with date range, tag, or title as filter criteria, to make it practical at scale.",
        angle: "The exclusion-first UX pattern reduces cognitive load for large libraries and moves the bot toward an enterprise migration tool.",
      },
      {
        title: "Weekly SE + Partnerships Check-in — Amelia, Devin, Mithun",
        summary: "Amelia and Devin debriefed on an S&P Capital Access meeting, noting S&P likely holds the largest IR CRM in the US and that a combined OE–S&P analytics offering could be powerful. Amelia flagged the Bullish acquisition of Aquinity for $500 million as reshaping the transfer agent competitive landscape. Mithun updated the group on active CMS pipeline: Indeed, Okta, HubSpot, Arziant, University of Ottawa. Amelia requested a weekly email report on open CMS and integration opportunities. Salesforce dashboard ticket has been open six weeks with no resolution.",
        angle: "Amelia’s weekly CMS pipeline request establishes a formal reporting cadence making the integration business line visible to leadership heading into Q3.",
      },
      {
        title: "ZCM Migration Strategy Review — Joe, Max, Mithun, Akash",
        summary: "Joe joined for an IFRS migration status check ahead of May 18. Max reported the agenda slide retrieval path had been found but Joe raised concern that inferring slide identity from thumbnail count is fragile at scale. Zoom has hired a new migration specialist formerly ten years at Panopto who will be OE’s dedicated technical contact going forward. Joe asked to be removed from the IFRS PM email chain. Target extraction start remains Monday May 18.",
        angle: "A Zoom-side migration specialist with Panopto background gives OE a more qualified counterpart for the edge cases surfacing in the IFRS dry run.",
      },
      {
        title: "Arziant RFQ Pricing Strategy + Indeed Prep — Kara, Max, Amelia, Mithun",
        summary: "The group tackled the dedicated CSM line item newly added to the Baker Media RFQ. Amelia proposed a tiered model: clients contracting over $100K annually receive CSM-level support bundled into the engagement; below that threshold, $3,500–$5,000 per month. Kara confirmed Zoom’s base licensing for Baker at approximately $120K, leaving roughly $130K of headroom. The session closed with quick Indeed call prep: Max will build demo channels and run ownership remapping, Mithun will present the agenda and migration report. Kara noted Okta onboarded in three days despite projections of months, though no contract has been sent yet.",
        angle: "The $100K CSM bundling threshold is a reusable pricing model for all future integration deals; the Okta three-day onboarding story is a strong proof point for the Indeed call.",
      },
      {
        title: "Max + Mithun — Indeed Pre-Call Sync",
        summary: "Quick sync to confirm the next day’s Indeed presentation sequence: implementation plan walkthrough, Max handles Zoom user onboarding and hub structure, Mithun closes with the dummy migration report, then open Q&A. Expected run time 30 minutes.",
        angle: "A confirmed agenda the evening before ensures the Indeed call opens structured rather than improvised.",
      },
      {
        title: "Casey 1:1 — Earnings Automation Concept",
        summary: "Mithun and Casey mapped out a potential end-to-end AI-powered earnings call platform, reverse-engineering the flow from go-live backward: script development from financial data via API connectors, rehearsal mode, OE production delivery, post-event clip extraction, and retail investor sentiment analysis from Reddit and X. Casey demonstrated his live teleprompter workflow, scrolling the script and adjusting pace in real time. Mithun suggested teleprompter as a $500 add-on or bundled at a spend threshold. Irwin was flagged as a comparable IR platform worth analyzing.",
        angle: "The earnings automation concept — teleprompter, script generation, auto-edit, and retail sentiment analysis — is a differentiated product wedge that extends OE beyond event delivery and builds on its existing AV infrastructure.",
      },
      {
        title: "Devin 1:1 — IR Analytics and Partnership Strategy",
        summary: "Mithun and Devin compared notes on the IR analytics product concept. Devin confirmed internal appetite but noted S&P and Computershare both have infrastructure OE could build on top of. Lorna, a former Credit Suisse investor relations executive and president of the Swiss IR Society, was brought on as a consultant to shape the Computershare partnership direction. Mithun added himself to Salesforce as a pre-sales engineer during the call. Devin’s own Salesforce dashboard returned obviously incorrect figures and he planned to escalate the following week.",
        angle: "Lorna’s involvement gives OE a credentialed IR practitioner to validate the Computershare analytics product direction before committing development budget.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "May 14",
    meetingCount: 2,
    meetings: [
      {
        title: "ZCM Wednesday Standup — Slide Transfer Approach Confirmed",
        summary: "Akash presented the finalized agenda slide migration approach: the bot downloads the PowerPoint file directly from Kaltura, stores it in S3, then uploads it to Zoom’s resources endpoint. The logic is coded and ready to test against the IFRS Kaltura account. Max confirmed Zoom’s category fields are now visible following a fix deployed earlier in the week. JSON files will not block the May 18 start and will be handled as a follow-up batch in mid-June after Zoom’s compressed file release.",
        angle: "All technical blockers for the May 18 IFRS migration start are resolved; the June JSON dump is documented as a planned follow-on step, not a risk.",
      },
      {
        title: "Arziant/Baker RFQ Final Pricing Review — MK, Kara, Max, Mithun",
        summary: "The team finalized the Arziant RFQ response before the May 15 deadline. OE’s contribution was presented as a range with a cover letter explaining that exact event support pricing requires a follow-up discovery conversation. Integration support was set at $3K per integration. Technical onboarding was raised to $2,000. CMS migration was listed at a $9K–$50K range. The group targeted a total OE number with a two in the front to stay competitive on the shortlist. MK drafted the cover letter language and submitted the response the same day.",
        angle: "Coming in under the threshold with a discovery-first cover letter is the right play to reach the shortlist — the real pricing conversation happens in the next round, not the RFQ.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "May 15",
    meetingCount: 4,
    meetings: [
      {
        title: "ZCM Thursday Standup — Agenda Slides Verified, Category Bug Found",
        summary: "Akash confirmed a successful first end-to-end test: the PowerPoint agenda slide file (4 slides) transferred cleanly from Kaltura to Zoom’s resources folder. Max verified all slides look correct. The team discovered a category assignment bug: all 232 account-level Kaltura categories were being applied to every migrated video rather than only those associated with each specific entry. Joe joined and confirmed this is a per-entry filtering bug. The fix is a targeted metadata patch call that does not require re-uploading any video files. Monday May 18 migration start remains firm.",
        angle: "The category bug is patch-level and does not affect Monday’s start — all video content and slides migrate cleanly.",
      },
      {
        title: "Indeed Discovery Call — Skyler Fitzpatrick, Cara Dingenthal, Max, Mithun",
        summary: "The team delivered a live walkthrough of the ZVM environment covering channel and playlist structures, permission tiers, and the publisher experience for Indeed’s 150 content publishers. Mithun presented the sample migration report and the full implementation plan covering the 10TB Kaltura-to-ZVM scope: dry run gate, embed inventory for Confluence, Degreed, and Huddle, ownership remapping, and 30-day post-migration support. Materials were sent over the same day for Skyler to circulate to leadership. Skyler’s response: “This is perfect, thank you.”",
        angle: "Indeed is now fully aligned on scope with leadership-ready materials in hand — the next step is contract.",
      },
      {
        title: "Zoom Sales Weekly — Emilia Tapsall",
        summary: "Standard weekly Zoom partner sync. No noteworthy items to report this week.",
      },
      {
        title: "Mithun Weekly Check-In",
        summary: "Skipped this week.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 15",
    meetingCount: 1,
    meetings: [
      {
        title: "Max + Mithun — End-of-Week Catch-Up",
        summary: "Brief end-of-week sync. Mithun was largely off Friday. IFRS migration confirmed for Monday May 18, Arziant RFQ submitted, Indeed discovery call delivered strong outcomes. No blocking issues heading into Week 14.",
        angle: "Clean close to the week with migration unblocked, Indeed aligned, and integration pricing formalized.",
      },
    ],
  },
];

export default function Week13Report() {
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
          href="/api/report-pdf/week-13"
          download="Weekly_Report_Week13_final_1.pdf"
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
        Week 13
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>May 11 &ndash; 15, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "19", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "13", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 13 Analytics</strong> &nbsp;&middot;&nbsp; IFRS migration locked for May 18 &nbsp;&middot;&nbsp; Indeed confirmed &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Indeed &middot; Okta &middot; Arziant RFQ &middot; Earnings Automation Concept
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 13 ran on three parallel tracks: resolving the last technical blockers ahead of the IFRS Kaltura-to-Zoom migration scheduled for Monday May 18, moving Indeed from proposal stage to a confident client with leadership-ready materials in hand, and formalizing OE&rsquo;s integration pricing model through the Arziant/Baker RFQ. The ZCM team confirmed agenda slide extraction and diagnosed a video category assignment bug as a patch-level fix that does not require re-uploading content, keeping Monday&rsquo;s start intact. The Indeed discovery call delivered a live walkthrough that Skyler Fitzpatrick described as &ldquo;perfect&rdquo; and immediately circulated to leadership. The Arziant RFQ response was submitted before the May 15 deadline with a tiered CSM pricing model and a $3K per integration template that is now reusable across all future RFQ responses. Wide-ranging conversations with Casey and Devin surfaced a coherent earnings automation product concept &mdash; script generation, teleprompter, auto-editing, and retail investor sentiment analysis &mdash; representing the clearest product extension beyond events and migrations that has emerged so far.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 14</h2>
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
