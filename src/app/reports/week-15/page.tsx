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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-15";

const themes: Theme[] = [
  {
    title: "IFRS Migration: Final Mile and Structural Lessons",
    text: "The migration reached its closing phase with all content extracted from Kaltura and largely uploaded to Zoom, but seven entities failed during the load-video phase and required investigation before formal client sign-off. Joe reinforced that IFRS must explicitly confirm the account looks correct before the engagement is declared complete. Zoom’s weekend tag limit increase clears the last metadata blocker, after which a full repatch of all 2,800 entities runs on Monday. Each technical edge case — tag ceilings, extraction failures, dual-account SSO complications — has been added to the pre-migration scoping checklist for future clients.",
  },
  {
    title: "ZVM Bot: From Spike to Structured POC",
    text: "The migration bot crossed a critical threshold when Joe joined a scoping session and reframed the open-ended work into a spike-then-POC structure with defined win conditions. Akash demoed the working bot live: it connected to a Kaltura test account, retrieved video metadata and thumbnails, and prompted for Zoom destination credentials entirely through natural language in a Zoom chat interface. Joe introduced MCP-driven orchestration as the right architecture — a markdown spec per source-destination pair that the agent reads and uses to skip questions already answered. Security: credentials in AWS Secrets Manager, 30-day retention with a destruction attestation, short-lived staging infrastructure. The bot now has a clear path to Zoom marketplace listing.",
  },
  {
    title: "Commercial Expansion: CrowdStrike, Okta, and the Integrations Pattern",
    text: "Three distinct commercial moments defined the week. CrowdStrike surfaced as the first OE-originated Zoom CMS displacement opportunity when an internal comms contact mentioned still using Kaltura alongside Zoom for live town halls; Andrew pivoted to the migration pitch and flagged it for Rajul and Tyler. The Okta Circle HD migration was repriced from $38K to a sub-$15K proposal after the client identified items they could handle internally, with a contract target before end of June. A Solstice Marketo integration request came in via a Zoom AE referral — the team pointed to the marketplace app first and noted hands-on configuration is a paid engagement.",
  },
  {
    title: "Zoom Products: Contact Center Unblocked, Support Line Building",
    text: "The Zoom Contact Center received four Elite trial licenses approved live on a Thursday call with Zoom specialists Pre and Jamie, unlocking AI Smart Notes — the automated end-of-engagement summarization absent from prior testing. The persistent browser audio bug was confirmed as a non-standard issue requiring a support ticket. Max’s V2 Passport landing page demo — a branded page with a chat-to-video widget and marketing video queue screen — was shown to Alan, who engaged on back-end data tracking, signaling readiness to move from prototype to formal pitch. The agent staffing spreadsheet reached eight of ten identified slots, with a list of fifteen planned for Tyler’s review.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Metadata Repatch — Max, Akash",
    text: "Zoom’s tag limit increase lands this weekend. Max and Akash to run the full repatch starting Monday, confirm all seven failed entities resolve, and obtain formal IFRS sign-off before closing the engagement.",
  },
  {
    title: "ZVM Bot POC Tickets — Akash, Mithun",
    text: "Akash to restructure ZCM-157 into a spike ticket and a separate POC ticket per Joe’s framework. First win condition: bot reads a markdown workflow spec and drives a branching conversation without hardcoded prompts. Mithun to keep scope tight and document assumptions.",
  },
  {
    title: "Okta Proposal Delivery — Kara",
    text: "Send the revised sub-$15K proposal this week. Target contract signed before end of June. Mithun to flag Okta as a potential pilot customer for the ZVM migration bot in the proposal conversation.",
  },
  {
    title: "Tyler Meeting — Support Line and Contact Center — Max, Mithun",
    text: "Complete agent staffing spreadsheet to fifteen names and send to Tyler with a request to meet covering Contact Center licensing, potential discounts, and AE distribution of the one-pager Mithun is building.",
  },
  {
    title: "CrowdStrike Zoom CMS Handoff — Andrew",
    text: "Andrew to email Rajul and Tyler, loop in Farah and Kara. Confirm Zoom AE ownership before scheduling the CMS platform demo. Mithun and Max to co-present a ZVM training session for the full OE sales team within two weeks.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "May 25",
    meetingCount: 0,
    meetings: [],
  },
  {
    day: "Tuesday",
    date: "May 26",
    meetingCount: 4,
    meetings: [
      {
        title: "IFRS/Citi Migration Weekly Standup",
        summary: "Kiran reported all IFRS videos migrated and the report generated, with half the entity fields complete. Four bot changes were deployed. The team addressed Zoom’s upcoming tag limit increase, planned for the weekend, estimating a one-day patch window plus buffer. The decision was made to perform a full metadata repatch across all 2,800 IFRS videos simultaneously to also address the thumbnail visibility issue identified the prior week. The Citi project was confirmed complete on the conversion side, awaiting SFTP credentials from the client.",
        angle: "The systematic full-metadata repatch approach demonstrates OE’s operational rigor in ZVM migrations, reinforcing that OE is the right partner for migration delivery rather than a DIY or internal Zoom-managed process.",
      },
      {
        title: "OE Global Sales Weekly War Room",
        summary: "The Zoom team drove 21 of 52 meetings set the prior week against a goal of 40, with Kara at 9, KC at 7, and Peter at 5. Forty-six ops were created including 24 new business and 18 expansion totaling $81K; 28 deals closed. Orders created remained the week’s primary gap at $680K versus an $825K goal. Jacob closed a two-year new deal with Standard through the channel partner NYC. Mark’s in-person visits to Salesforce HQ and Zoom CEO Eric Yuan’s office were flagged as major pre-NERI catalysts. ComputerShare was tracking $550K in YTD revenue with 150 delivery meetings in May and a joint Flow Traders capital market day scheduled for end of June.",
        angle: "Amelia explicitly called out CMS migration, the support line, and marketing integrations as the next close-one growth vectors for the Zoom side of the business, directly validating the SE-led pipeline streams as the path to quarterly attainment.",
      },
      {
        title: "ZVM Strategy and IFRS Status Call — Alan",
        summary: "Alan, Max, and Mithun reviewed the full state of IFRS and the bot pipeline. The IFRS migration is functionally complete with approximately 2,800 media elements extracted from Kaltura EU in two days. A new complexity emerged when a Zoom ZVM EMEA specialist flagged that IFRS operates two Zoom accounts, with SSO configured on the US account while content was migrated to the EMEA account — potentially requiring a second migration load. The Kaltura-to-Zoom bot was confirmed running in sandbox with real migration data. Alan pushed for Mithun to be involved earlier in the bot’s UX design given user-facing concerns around data residency, selective migration, and compliance.",
        angle: "The IFRS dual-account SSO issue surfaces a new pre-migration scoping requirement — account consolidation — that OE should formalize into the standard discovery checklist for all future ZVM engagements.",
      },
      {
        title: "1:1 Onboarding Intro with Brian",
        summary: "Mithun connected with Brian, a returning OE employee who had been on the production and virtual support team from 2020 to 2023 before rejoining in a hybrid L2 support and product role. Mithun walked Brian through OE’s current landscape including the CMS migration motion, the ZVM bot, the 24-hour support line, and the Citi media delivery project. He demonstrated the Claude Excel add-in and showed how AI tooling was embedded across daily workflows. The two discussed potential collaboration on the Microsoft Teams support agent and a future Salesforce population agent.",
        angle: "Onboarding Brian into the SE context early establishes shared vocabulary around ZVM, the bot, and the support line, reducing future bottlenecks as the support product scales toward active Zoom customer deployment.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "May 27",
    meetingCount: 6,
    meetings: [
      {
        title: "IFRS/Citi Migration Wednesday Standup",
        summary: "No new migration activity; the team remained in a holding pattern pending Zoom’s tag limit increase. Max reviewed the Citi delivery sheet and proposed trimming the CSV before client handoff — removing internal fields and retaining destination URL, event name, and event ID. The team discussed generating video-level links in the migration report; Zoom advanced CMS does not expose public per-video links but ZVM does. Max agreed to write tickets to test ZVM’s video-level link retrieval. Joe joined to flag that the ZVM bot Jira ticket needed a scope description with defined goals before the team meeting.",
        angle: "Joe’s insistence on scope before work begins is exactly right for productization readiness — a clearly defined POC with named win conditions is also a stronger pitch internally to Alan and externally to Zoom.",
      },
      {
        title: "ZVM Bot UX Design Session — Akash and Mithun",
        summary: "Mithun walked Akash through the full intended bot user flow ahead of writing the Jira ticket. The proposed six-stage flow covers platform selection with a guided tour, credential collection via a secure OE Passport-style link embedded in the Zoom chat app, a discovery phase pulling all video metadata, an exclusion filtering step by date range or keyword, data residency selection specifying the target AWS region, full migration execution, and a final report surfacing source and destination links. Akash confirmed all elements are technically achievable and agreed to send his progress summary. The broader team meeting was rescheduled to Thursday at 10am EST.",
        angle: "Designing the bot as a guided enterprise workflow with exclusion filters and data residency controls positions OE above any DIY migration attempt and creates a defensible product differentiator for the ZVM go-to-market.",
      },
      {
        title: "CrowdStrike Kaltura Displacement Discovery",
        summary: "Andrew, Kaylee, and the SE and channel teams reviewed a CrowdStrike conversation that surfaced a Zoom CMS displacement opportunity. CrowdStrike’s internal employee comms team uses both Kaltura and Zoom for live town halls without a clear rationale for which platform they use in a given instance, and the contact expressed openness to consolidating. Andrew positioned Zoom CMS at approximately $20K–$30K annually versus Kaltura’s estimated $150K–$200K, with OE facilitating the migration. The next step was for Andrew to email Rajul and Tyler, loop in Farah and Kara. Andrew also committed to a training session for the full sales team in approximately two weeks on Zoom CMS signals and questions to ask, with Mithun and Max co-presenting.",
        angle: "This is the first OE-originated Zoom CMS displacement opportunity, proving the SE role as a discovery layer between OE’s existing client relationships and Zoom’s newer product lines.",
      },
      {
        title: "Zoom AI Companion Troubleshooting and Support Line Architecture — Max",
        summary: "Mithun and Max worked through a live troubleshooting session and discovered that Mithun’s Zoom account had been configured as a Contact Center agent role rather than a standard Zoom Workplace license, explaining why AI Companion features were entirely unavailable. Max resolved this via IT ticket. The two discussed the architecture of the planned Zoom marketplace support line app: a chat application seeded with semantic knowledge from recorded onboarding sessions, handling common questions autonomously and escalating to a live queue after a defined number of turns, with the Zoom MCP auto-generating a meeting when a user enters the queue. Max moved the Contact Center technical sync to Friday.",
        angle: "The missing license is a quick-win fix that will immediately expand Mithun’s ability to demo AI Companion functionality to Zoom AEs and enterprise prospects evaluating the support line offering.",
      },
      {
        title: "Devin 1:1 — Product Strategy and AI Tooling",
        summary: "Mithun and Devin had a wide-ranging conversation on product strategy, AI tooling, and data infrastructure. OE’s Power BI semantic models expose event-level and revenue data tied to Salesforce only; attendee-level records live inside OE Central per event and are not connected to any reporting layer. Devin shared his Salesforce revenue dashboard and offered to have Allie replicate it for Mithun. The conversation moved to ComputerShare’s newly acquired investor targeting platform and the opportunity to marry OE’s attendee registration data with targeting signals to automate follow-up scheduling for investor relations officers. Nokia’s interest in retail investor engagement was noted as a recurring theme worth developing.",
        angle: "The gap between OE Central’s attendee-level records and the Power BI reporting layer is a product insight worth filing — bridging it would create the data foundation for the ComputerShare investor targeting integration Devin described.",
      },
      {
        title: "Brief Pre-Travel Check-In",
        summary: "Brief coordination call taken while traveling to Atlanta ahead of client meetings.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "May 28",
    meetingCount: 7,
    meetings: [
      {
        title: "Zoom Contact Center Technical Deep Dive — Pre and Jamie",
        summary: "Max, Mithun, and David joined Zoom Contact Center specialists Pre and Jamie. Pre approved four Elite trial licenses for one month on the call. The primary blocker from prior testing — end users unable to connect audio or video through the browser widget despite device permissions being enabled — was confirmed as a non-standard issue requiring a support ticket. The session covered variable storage using Consumer and Engagement variable categories for capturing name, email, organization, and engagement topic. Pre confirmed AI Smart Notes are included in the Elite tier but were absent from the previous license, explaining why summaries never generated during earlier testing. Quality management including sentiment analysis, topic trending, and scorecarding were reviewed. A Friday follow-up was scheduled.",
        angle: "The Elite license unlocking AI Smart Notes is a key selling point for the support line — automated summaries eliminate the manual debrief step and make per-engagement reporting to Zoom feasible without additional tooling.",
      },
      {
        title: "Zoom Contact Center UX Review — Max and Mithun",
        summary: "Following the specialist call, Max demonstrated his existing chat-to-video flow prototype: a branded intake form collecting name, email, and company, followed by one automated response before prompting the user to start a video call, with a marketing video playing in the waiting room. The audio connection bug remained reproducible in this demo session, reinforcing the need for the support ticket. Mithun noted the OE implementation should not exceed 12 weeks given Zoom-certified partners complete comparable setups in six to eight, and proposed asking Zoom for subsidized implementation hours as part of the Contact Center license negotiation.",
        angle: "Max’s working prototype — even with the audio bug present — is far enough along to serve as a credible live demo for the Tyler and Rajul pitch meeting next week.",
      },
      {
        title: "ZVM Bot Scope and Sprint Planning — Joe, Akash, Mithun",
        summary: "Joe formalized the ZVM migration bot project by reframing ZCM-157 — which had been running since May 5 with no defined win conditions — into a spike-then-POC structure. Akash demoed the working bot live, successfully connecting to a Kaltura test account, pulling video listings with metadata, and prompting for Zoom destination credentials. Joe introduced MCP-driven orchestration as the right architectural path: the agent reads a markdown spec of required inputs per source-destination pair and skips questions already answered in the initial prompt. Security requirements: credentials in AWS Secrets Manager, 30-day retention with a destruction attestation, short-lived staging infrastructure torn down automatically. Joe noted the bot concept extends directly to internal OE Central workflows for QC and PM tasks.",
        angle: "Joe’s spike-to-POC-to-MVP framework and the MCP orchestration model give the team a defensible architecture to present to Alan and eventually to Zoom as a partner-built marketplace product.",
      },
      {
        title: "TKO Group Zoom SSO and Okta Integration Planning",
        summary: "Mithun joined alongside Kara and Farah for a technical call with the Zoom solutions team and TKO Group’s IT team. The call focused on planning the SSO consolidation of TKO’s Zoom tenant, historically mastered by the WWE business unit. The key clarification: vanity URL branding is only required for TKO Group and WWE — not all sub-brands including UFC and PBR — significantly reducing implementation scope. Lenny walked through SAML attribute mapping, managed domain configuration, and the user consolidation flow. A Monday architect review was confirmed before sending the final implementation document to TKO in Excel format.",
        angle: "The TKO engagement gives Mithun direct exposure to enterprise multi-brand identity consolidation — a pattern that will recur with any large OE client running Zoom across multiple divisions.",
      },
      {
        title: "Okta Circle HD Migration Negotiation",
        summary: "Kara, Max, and Mithun held a brief internal prep, then joined Kenneth, Adam, and Bree from Okta. Kenneth confirmed the team wants to move forward but that $38K is too high. He identified items Okta could handle internally: environment setup, employee onboarding, communication rollout, intranet embed replacement, and user guides. He confirmed no hard delivery deadline and preferred a Q4 timeline allowing for a proper early-adopter phase before full production rollout. Kara confirmed OE would rebuild the proposal under $15K, preserving core migration of content, channels, ownership, and metadata with 30-day post-migration support.",
        angle: "The $15K ceiling and Q4 timeline create favorable conditions for a bot-assisted migration pilot — if Okta agrees, it produces a referenceable enterprise case study at a price point that funds the productization phase.",
      },
      {
        title: "Andrew Weekly Check-In (Brief)",
        summary: "Brief conversation while traveling in Atlanta covering AI tooling progress, open-source GitHub repositories as a resource for domain-specific analysis, and Claude Code as a practical learning tool for professionals entering AI-adjacent workflows.",
      },
      {
        title: "Zoom Support Line Agent Staffing — Alan, Max, Mithun",
        summary: "Alan, Max, and Mithun reviewed the agent staffing spreadsheet for the Zoom 24-hour support line. Eight of ten slots were identified; two APAC positions pending Wayman’s input, with Wayman and Shirley tentatively identified as the strongest candidates. Kiara was moved to an additional tab noting she already has a laptop but will be on maternity leave in the fall. Alan suggested sending Tyler a list of fifteen names total — ten primary plus five additional — to show the breadth of the initiative. Max demonstrated the V2 Passport landing page to Alan for the first time: a branded page with the Zoom Contact Center chat-to-video widget and a marketing video queue display. Alan engaged on back-end engagement data tracking.",
        angle: "Alan seeing the V2 demo and engaging on engagement data tracking signals he is ready to move from prototype to pitch — the Tyler meeting next week is effectively the first formal go-to-market moment for the support line.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 29",
    meetingCount: 5,
    meetings: [
      {
        title: "IFRS Migration Friday Standup",
        summary: "The team reviewed the migration report showing seven failed entities: six in the load-video phase and one at extraction. One extraction failure had already been manually migrated by Max. Akash committed to investigating root causes before any further intervention to ensure fixes could be applied systematically in future migrations. Zoom’s tag limit increase to 5,000 remained on track for the weekend, with the full metadata repatch confirmed for Monday. Akash flagged a bot blocker: the Zoom app marketplace account ID was needed to proceed. Joe reinforced that blockers must be documented in Jira rather than surfaced only in standups. He closed by expressing enthusiasm for the migration bot and confirming formal IFRS sign-off must be obtained before declaring the engagement complete.",
        angle: "Joe’s sign-off requirement formalizes the QA handoff process — IFRS confirming acceptance is also the moment the engagement becomes a referenceable case story for the Zoom CMS go-to-market.",
      },
      {
        title: "OE Friday Sales All-Hands",
        summary: "Kara’s week was consumed by the Unblinded event, delivering a $21K upsell from an original $8K estimate. David described a Zoom platform incident where a license upgrade invalidated 5,500 previously distributed registration links; OE set up a support line that handled the event with approximately 500 attendees and no voicemail overflow. Kristen reported the American Bankers Association responded to the $199K proposal without objecting to price, asking only to add more webinars. Peter reported Zoom’s new CMS specialist Chris Milne called the IFRS migration ahead of schedule and confirmed Zoom intends to use it as their flagship ZVM case story. Peter surfaced Bain and Co as a new channel opportunity from sequencing speakers at a Louis Vuitton event OE had supported. The group discussed a client platform churn situation stemming from a license type mismatch, with Amelia directing the team to share structured feedback with Zoom’s partner team.",
        angle: "The Zoom platform incident and the platform churn situation are both concrete data points for why OE’s SE layer provides product-fit validation that Zoom’s own sales motion does not perform.",
      },
      {
        title: "Okta Circle HD Migration Rescoping — Kara, Max, Mithun",
        summary: "The three finalized the Okta proposal under $15K. Items removed: environment setup and teardown, user guides, communication rollout, and intranet embed replacement. Items retained: core content and metadata migration, channel access control, onboarding sessions for admin users and content owners, and 30-day post-migration support. A Solstice Marketo integration request came in via a Zoom AE referral; the team agreed to point Solstice to the marketplace app and note that configuration support is a paid engagement before scheduling a meeting. Kara wants the contract signed before end of June.",
        angle: "Scoping onboarding sessions to admins and content owners specifically protects OE from open-ended support commitments while delivering the highest-leverage training to the people who will run the platform.",
      },
      {
        title: "Citi Delivery Options Discussion — Max and Mithun",
        summary: "Max and Mithun discussed Citi’s SFTP delivery request for migrated media files. Mithun proposed two paths: direct S3-to-S3 transfer, the simplest option given OE already has the files staged, or AWS Transfer Family providing an SFTP-protocol endpoint backed by S3 for enterprise security requirements. From OE’s infrastructure perspective both options use the same underlying S3 storage. Max agreed to respond to the Citi contact and set up a Monday touchpoint with Joe, Akash, and Gib to align on the delivery approach before committing either way.",
        angle: "Resolving which Citi team is making this request early is worth the effort — if it connects to the broader Zoom Kaltura migration conversation, the delivery model OE establishes here could set a precedent for a much larger engagement.",
      },
      {
        title: "Energize Marketing HubSpot Integration (Brief)",
        summary: "Kara briefly looped Mithun and David into a new inbound from Energize Marketing looking to connect a HubSpot landing page to a Zoom event with standard registration and email communication flows. The integration design outlined was a HubSpot landing page driving Zoom event registration with Zoom handling invite delivery. Mithun flagged for potential involvement as scope develops next week.",
        angle: "Energize Marketing is a repeating pattern — a Zoom customer needing the HubSpot-to-Zoom connector that sits squarely in the integrations lane and is likely a quick win if the marketplace app covers their requirements.",
      },
    ],
  },
];

export default function Week15Report() {
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
        <Link href="/reports" style={{ ...serif, fontSize: 13, color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          &larr; Back to Reports
        </Link>
        <a
          href="/weekly_report_week15.pdf"
          download="Weekly_Report_Week15_final_1.pdf"
          style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
        >
          <span style={{ fontSize: 14 }}>&darr;</span> Download PDF
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 15</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>May 25 &ndash; 29, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "22", l: "Meetings" },
          { n: "4", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "15", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 15 Analytics</strong> &nbsp;&middot;&nbsp; IFRS final mile &nbsp;&middot;&nbsp; ZVM bot POC scoped &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Okta &middot; CrowdStrike &middot; Zoom Support Line &middot; ZVM Bot
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 15 was a short four-day week following Memorial Day, but the most technically dense of the quarter. The IFRS migration reached its final mile — all content extracted and largely uploaded to Zoom, with seven failed entities under investigation and Zoom’s weekend tag limit increase clearing the last metadata blocker before formal client sign-off. The ZVM migration bot crossed a meaningful threshold when Joe formalized the development structure into a spike-then-POC framework and Akash demoed it live connecting to Kaltura and retrieving video metadata through natural language — moving the project from open-ended exploration to a scoped POC with a path to Zoom marketplace listing. On the commercial side, CrowdStrike surfaced as the first OE-originated Zoom CMS displacement opportunity, Okta was repriced to a sub-$15K proposal with a June contract target, and the Zoom Contact Center received Elite trial licenses unlocking AI Smart Notes — the key missing feature before the 24-hour support line can go to market.
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
              onClick={() => day.meetingCount > 0 ? setOpenDay(openDay === day.day ? null : day.day) : undefined}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "none", border: "none", cursor: day.meetingCount > 0 ? "pointer" : "default", textAlign: "left" }}
            >
              <div>
                <span style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#111827" }}>{day.day}</span>
                <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 8 }}>{day.date}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: day.meetingCount > 0 ? teal : "#9ca3af", background: day.meetingCount > 0 ? "#f0fafa" : "#f9fafb", padding: "3px 10px", borderRadius: 20 }}>
                {day.meetingCount > 0 ? `${day.meetingCount} meeting${day.meetingCount > 1 ? "s" : ""} ›` : "Holiday"}
              </span>
            </button>
            {openDay === day.day && day.meetings.length > 0 && (
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 16</h2>
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
