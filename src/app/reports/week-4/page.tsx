"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

interface DayData {
  day: string;
  date: string;
  meetingCount: number;
  meetings: Meeting[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-4";

// ─── Themes Data ──────────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    title: "Migration Pricing Hits the Market",
    text: "The one-pager went through multiple iterations with direct input from Rajul and Tyler at Zoom. Final numbers: Simple $9,600 / Complex $21,600, both including 10TB of data. Zoom AEs are now equipped to quote migrations without custom scoping. Anderson signed the first deal \u2014 a 20-video migration at ~$8,200 by March 31.",
  },
  {
    title: "Zoom Platform Fluency",
    text: "Max ran a two-hour hands-on onboarding session covering the full Zoom Webinars/Events platform. Mithun now has enough fluency to run discovery calls and qualify license tier independently.",
  },
  {
    title: "New Partnership Tracks Open",
    text: "Peter (EMEA, ex-Zoom) introduced as a warm channel into European Zoom partners. Workato discovery call with Jamie (Alliance Manager) confirmed MSP model as the right structure for OE to own the integration layer for Zoom clients.",
  },
  {
    title: "Zoom API Gap \u2014 Urgent Risk Before April 1",
    text: "Joe surfaced significant Zoom CMS API gaps after a deep review: captions, attachments, and thumbnails have no API support today. Expanded APIs releasing March 23 \u2014 only 8 days before the April 1 IFRS dry run. OE compiled a structured gap list to send to Zoom proactively.",
  },
];

// ─── Look Ahead Data ──────────────────────────────────────────────────────────

const lookAheadItems: LookAhead[] = [
  {
    title: "Zoom API Release \u2014 March 23",
    text: "Monitor closely. If the expanded metadata APIs (captions, thumbnails, attachments) are incomplete or delayed, the April 1 IFRS dry run is at risk. Structured gap list already sent to VJ as partner feedback.",
  },
  {
    title: "Zoom AE Teaching Session",
    text: "Schedule and run the joint session with Rajul, Tyler, and Zoom\u2019s sales team. Mithun and Max to present the one-pager and walk through Simple vs. Complex qualification.",
  },
  {
    title: "IFRS Dry Run \u2014 April 1 Target",
    text: "First live extraction from IFRS\u2019s Kaltura account into Zoom\u2019s go-environment. Validation of the full pipeline: metadata, captions, thumbnails, and the Kaltura-to-Zoom ID mapping report.",
  },
  {
    title: "Workato MSP Deep Dive",
    text: "Follow-up call with Workato\u2019s MSP team. Confirm whether OE\u2019s scoped integration use case qualifies under their MSP program. Don\u2019t sign MSP agreement until 2\u20133 client use cases are confirmed.",
  },
  {
    title: "Corp Comms Prospecting for Andrew",
    text: "Run OE\u2019s prospecting tool against Andrew\u2019s corporate communications firm target list. Surface best-fit contacts and draft outreach emails for the BDR/marketing team.",
  },
  {
    title: "Tyler Brubach Intro",
    text: "Still pending from Week 3. Get the introduction done this week \u2014 Emilia confirmed Tyler is ready.",
  },
];

// ─── Meeting Data ─────────────────────────────────────────────────────────────

const meetingData: DayData[] = [
  {
    day: "Monday",
    date: "March 9",
    meetingCount: 5,
    meetings: [
      {
        title: "Team Zoom Sales Standup",
        summary:
          "Opening sync with Devin, Emilia, and Kristen. Captions and thumbnails confirmed working in the migration pipeline \u2014 a meaningful technical milestone that removes a common objection from sales conversations. Kristen aligned on GTM next steps. Tyler Brubach meeting flagged as a priority action for the week.",
      },
      {
        title: "ZVM Migration Discovery \u2014 Laurentian University",
        summary:
          "First formal PS discovery call between OE and Zoom\u2019s migration channel, with Farrah and Sarah (Zoom AEs, Canada). Laurentian has ~12K Panopto videos, go-live needed before August 1. University of Regina also in play \u2014 migrating from Kaltura with a May launch. Farrah pushed for simpler pricing she can quote in a 5-minute customer conversation. One-pager reviewed live \u2014 Alan confirmed $15\u201325K typical range. Edits agreed: all-in framing up front, remove Availability column, add \u201cSubject to Scope\u201d on add-ons, infra floor raised to $500 for \u22641TB, YuJa added to supported platforms. Competitor Codomite acknowledged; Sarah prefers OE.",
      },
      {
        title: "Internal Pricing Sync \u2014 Post-Laurentian",
        summary:
          "Debrief and one-pager finalization with Max, Alan, Emilia, and Kara. All edits locked: all-in examples at top, PS + infra breakdown below, flat $0.40/GB rate, \u201cUp to X hours\u201d PS language, multi-source as explicit add-on, YuJa added. Distribution plan: Emilia sends to Rajul + Tyler privately with 24-hour window, then Kara posts to broader Zoom channel. Teaching session for Zoom AEs planned \u2014 Mithun and Max to present.",
      },
      {
        title: "Andrew (Zoom) \u2014 Daily Check-In",
        summary:
          "Mithun demo\u2019d VideoMigrate \u2014 metadata (transcripts, captions, dates, download links) coming through cleanly for hour-long videos. Walked through Simple vs. Complex pricing using the moving truck analogy: fixed PS cost = bringing the truck, variable = how much data you\u2019re moving. Andrew confirmed Zoom AEs don\u2019t get comped on migration revenue \u2014 it\u2019s a license stickiness play, not a direct comp item. That framing shapes how OE should pitch the teaching session.",
      },
      {
        title: "Zoom Sales Weekly",
        summary:
          "Pipeline update: 16, 12, and 11 new deals closed over the last three weeks, sitting at 86% to quarterly goal with ~$160K in contracting. BDR hiring down to two candidates (Camden and Theo). Mithun\u2019s prospecting tool highlighted \u2014 cross-references ICP companies with LinkedIn activity to surface best-fit contacts and draft outreach emails; Kristen pulling ZoomInfo leads from it. Anderson signed for a 20-video migration at ~$8,200 by March 31. Annabeth Ferris promoted to Senior PM. Hyatt client escalation discussed \u2014 going forward, leadership (Andrew, Emilia, or Brit) to join any debrief where a client is unhappy.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "March 10",
    meetingCount: 4,
    meetings: [
      {
        title: "Peter Intro Call \u2014 EMEA",
        summary:
          "Introductory call with Peter, OE\u2019s EMEA sales lead. Peter spent 4 years at Zoom (European events lead, then head of Zoom Rooms) before joining OE in May 2025. Currently building a partner channel in EMEA \u2014 targeting Zoom resellers and managed service providers who don\u2019t offer event support, with ~3 calls booked in his first week of outreach. Holds ~80\u201390% of OE\u2019s EMEA inbound from Zoom. Mithun demo\u2019d VideoMigrate and the pricing one-pager. Peter acknowledged CMS migration is a blind spot he\u2019ll lean on Mithun for. Follow-up session agreed: Peter to walk Mithun through the EMEA business structure and partner deal flow.",
      },
      {
        title: "CMS Migration Engineering Standup",
        summary:
          "Engineering and product sync with Joe, Max, Alan, and Alex. Joe actively scaffolding the extraction layer \u2014 goal to have listing and metadata extraction working by end of day. Needs Kaltura App Token credentials for the trial account. Joe\u2019s approach: capture everything from Kaltura generically, regardless of current Zoom field mapping. Zoom handles transcoding on ingest. Three job modes confirmed: full account, filter-based, or specific entry IDs. Dry run target: first two weeks of April in Zoom\u2019s go-environment. Indeed also on Kaltura \u2014 pipeline being built to cover both IFRS and Indeed. Alan closed with strong praise: Kara and the AEs will be \u201chappy as hell\u201d to finally have a number to give.",
      },
      {
        title: "Max Daily Sync \u2014 Support Line + AI Architecture",
        summary:
          "Two-part call. First: Sanofi follow-up tabled (no response from client in two weeks). Second: substantive conversation on the Zoom L1 support line Max is building \u2014 a click-to-join widget on OE\u2019s referral page, every call recorded and transcribed. Mithun proposed a two-layer architecture: a live dashboard surfacing pain points from transcripts in real time, plus a weekly cron job that auto-generates an insight report for Zoom. Referenced Gong as a directional UI model. Also floated a Salesforce integration leg \u2014 support calls becoming warm leads passed to the sales team with full context. If OE can show Zoom a weekly structured report of what their customers are struggling with, that\u2019s a feedback channel no other managed services partner provides.",
      },
      {
        title: "Devin Daily Check-In",
        summary:
          "Mithun gave Devin a rundown of the week. Devin shared two early-stage product ideas for retail investor engagement. Idea 1: OE Meet for Retail \u2014 threshold-gated 1:1 meetings with IROs for shareholders above a certain holding size, dependent on ComputerShare data access. Idea 2: Earnings Highlight Reels \u2014 automated extraction of the most relevant 60-second clips from a 60-minute earnings call, formatted for LinkedIn/TikTok distribution. Mithun: \u201cI was buying AMC on Reddit forums, I wasn\u2019t watching 60-minute calls.\u201d Both ideas had positive reception from Mark and Emilia. Mithun offered to draft a 3-question IRO survey and a one-pager thesis on the highlight reel concept.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "March 11",
    meetingCount: 2,
    meetings: [
      {
        title: "Migration Pricing \u2014 Rajul Feedback Debrief",
        summary:
          "Rajul and VJ reviewed the one-pager and liked the layout. Two structural edits requested: both Simple ($12K) and Complex ($21.6K) starting prices should explicitly state they include 1TB of data, with additional data at $500/TB. New ask for a second page: a definitions guide so Zoom AEs can self-qualify which migration tier to pitch \u2014 what \u201cstandard metadata / no custom rules / single source\u201d actually means, a clear Simple vs. Complex breakdown, and a visual example. Competitive intel: Rajul revealed Zoom has another migration partner \u2014 Codomite \u2014 who has done phone and ZRA migrations and may move into CMS. Rajul offered to share Codomite\u2019s pricing for comparison. VJ responded with excitement \u2014 ready to walk through the one-pager with their sales team.",
      },
      {
        title: "Zoom Platform Onboarding Session \u2014 Max (2hrs)",
        summary:
          "Two-hour hands-on product training covering the Zoom Webinars/Events platform end-to-end. Platform architecture: two portals (zoom.us for admin, events.zoom.us for event building). Licensing: each Events license = one concurrent event plus a hub; hub owners get 4 additional hosts. Event types covered: single session, recurring, and multi-session (Events license only \u2014 enables simultaneous tracks, expo booths, networking, up to 6-day span). Webinars vs. meetings distinction: webinars = controlled broadcast with panelist management; meetings = fully bidirectional. Registration and access: bypass (most common for corporate), allow list, email verification, source tracking links, geo-blocking controls. Production Studio = platform-native video switcher. OE sells 4-hour onboarding packages: session 1 covers account settings + hub orientation; sessions 2\u20134 tailored to client\u2019s event type. Mithun now has enough platform fluency to run discovery calls and qualify license tier independently.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "March 12",
    meetingCount: 4,
    meetings: [
      {
        title: "Migration Sales Doc Review \u2014 Joe Technical Deep Dive",
        summary:
          "Joe walked through a cost framework built to help OE price migrations by technical complexity. Key trigger question for AEs: what format is the source video? MP4 or WebM (Zoom-native) = Cost Card A. Anything else = Cost Card B, because transcoding roughly doubles storage and CPU. What drives complexity within each card: field mapping (standard vs. custom logic), content filtering, access control mapping, data consistency gaps, client involvement level, source system API quality, and multi-source content. Zoom API status: upload API only accepts MP4 and WebM \u2014 other formats rejected outright, not transcoded. Expanded metadata APIs releasing March 23 \u2014 only 8 days before the April 1 dry run. Joe\u2019s pipeline produces a flat ledger: Kaltura entry ID \u2192 Zoom video ID \u2192 new Zoom URL for every file, which clients use to regenerate all embedded video links. Joe currently runs one migration at a time; goal is 5\u201310 concurrent via AWS scaling.",
      },
      {
        title: "Zoom Sales Weekly",
        summary:
          "Trending well at 86% to quarterly goal. Anderson signed for a 20-video migration at ~$8,200 by March 31 \u2014 first standalone deal closed. BDR hiring close (Camden and Theo as final candidates). Mithun\u2019s ICP prospecting tool featured \u2014 Kristen pulling ZoomInfo leads off the back of it. CMS one-pager v2 going to Rajul/Tyler for final review; next step is a joint presentation call with Zoom\u2019s sales team. Emilia asked Mithun to explore expanding the prospecting tool to non-Zoom clients.",
      },
      {
        title: "GCS Order Management \u2014 New Workflow",
        summary:
          "Two live changes to the GCS order management process. Child Order Roll-Down: instead of manually building child orders, add products to the parent and hit \u201cCreate Child Orders\u201d \u2014 system splits evenly and strips products off the parent. Only works with whole-number quantities. Add-On Flow: add-ons now live as orders under the relevant child, not as new opportunities. Use the Add-On button from the child order level, fill in the Related Event Order field. Sales/AMs move the add-on to Delivered status, which triggers billing. Single standalone orders currently default to Multi Event Order type (breaks reporting) \u2014 must be manually changed to Single Order until Ali fixes it.",
      },
      {
        title: "Andrew (Zoom) \u2014 Weekly Check-In",
        summary:
          "Mithun demo\u2019d the corp comms prospecting tool built for Andrew \u2014 an AI-powered OE Hub agent that takes an ICP, finds similar companies, surfaces the best contact at each firm, and drafts a cold outreach email. Andrew immediately connected it to a project he\u2019s building with Michael Morales (marketing): expanding OE\u2019s partnership channel beyond IR consultants into corporate communications firms (town hall, internal comms, M&A announcement work). Andrew\u2019s ask: run the prospecting tool against his existing target list, find the right contacts, and generate intro emails positioning OE as the broadcast tech layer for their client engagements.",
      },
    ],
  },
  {
    day: "Friday",
    date: "March 13",
    meetingCount: 4,
    meetings: [
      {
        title: "Brooks Demo \u2014 AI Video Tool Exploration",
        summary:
          "Brooks (external consultant at Haystack/Fearless) presented a local-first AI pipeline: ingests video, does offline transcription and visual recognition, indexes into a searchable library, and auto-generates branded sales reels. Alan\u2019s challenge: where\u2019s the moat given Zoom, Adobe, and HubSpot are building the same features natively? Brooks\u2019 answer: air-gapped financial clients who need fully local infrastructure. Joe flagged that Zoom auto-transcribes everything on upload. The one idea that resonated: post-event sizzle reels as a free OE value-add \u2014 auto-generate 3x60-second clips from a client\u2019s investor day, send as a follow-up gift, cost ~$2 and 5 minutes. Alan loved it. Mithun quietly rebuilt Brooks\u2019 core tool during the call using an open-source library and Claude Code.",
      },
      {
        title: "Max Sync \u2014 Post-Brooks + Workato Prep",
        summary:
          "Post-mortem on Brooks: both aligned the tool has no moat. Mithun laid out his SaaS moat framework \u2014 as agentic workflows commoditize every button-click in software, the only defensible moats are domain expertise, trusted relationships, and proprietary data. OE\u2019s moat is 10+ years producing town halls for JP Morgan and similar \u2014 not replicable. Second half: prepped for the Workato call. Max had reached out cold to Workato\u2019s AE, framing OE as a Zoom PS partner seeing growing demand for integration work (registration flows, marketing platform sync, CRM handoff). Key commercial concern discussed: how does OE stay in the deal and not get disintermediated once Workato has the client relationship.",
      },
      {
        title: "Zoom Sales Weekly \u2014 Pricing Final + API Gaps",
        summary:
          "Three topics. Pricing final: Mark\u2019s input came through overnight \u2014 push Simple to $9,600, bump included data on both tiers to 10TB. Alan validated 62% margin is fine; costs will come down as AI reduces labor. Decision locked: Simple $9,600 / Complex $21,600, both including 10TB. Brooks debrief: keep the post-event sizzle reel idea using Zoom\u2019s native tools. API gap warning from Joe: captions, attachments, and thumbnails have no Zoom CMS API support today. Naming inconsistencies between endpoints suggest docs are incomplete. Expanded APIs drop March 23 \u2014 only 8 days before April 1 dry run. OE to send a structured gap list to VJ as a constructive partner feedback document. Alan: \u201cZoom is aggressive and serious, they\u2019ll welcome this and marshal resources.\u201d",
      },
      {
        title: "Workato Discovery Call \u2014 Jamie (Alliance Manager)",
        summary:
          "First formal conversation with Workato\u2019s partner team. Three models explained: Referral (OE sends leads, earns commission on ARR), Resell, and MSP (OE buys bulk task instance, manages client sub-workspaces, prices independently). MSP is the most relevant model. Jamie\u2019s guardrail \u2014 MSP is designed for SMB clients under 200 employees \u2014 acknowledged as flexible for OE\u2019s scoped, workflow-specific use case (not full enterprise IT automation). Sub-accounts per client confirmed. OE buys a task bucket and splits across client workspaces. Salesforce, SFMC, and Marketo all have pre-built connectors. Next steps: Jamie to send partner agreement (referral model) via DocuSign; follow-up call with MSP team week of March 23.",
      },
    ],
  },
];

// ─── TTS Script (for Kokoro TTS) ─────────────────────────────────────────────

const ttsScript = `Week 4 Report. March 9 through 13, 2026. ... Week 4 was the most externally-facing week of onboarding so far. OE's migration pricing hit the market, the Zoom AE channel was formally activated, and two new partnership tracks opened simultaneously — EMEA via Peter and integration middleware via Workato. Anderson signed OE's first standalone migration deal at 8,200 dollars. ... Theme 1: Migration Pricing Hits the Market. The one-pager went through multiple iterations with direct input from Rajul and Tyler at Zoom. Final numbers: Simple 9,600 dollars, Complex 21,600 dollars, both including 10 terabytes of data. Anderson signed the first deal — a 20-video migration at 8,200 dollars by March 31. ... Theme 2: Zoom Platform Fluency. Max ran a two-hour hands-on onboarding session covering the full Zoom Webinars and Events platform. Mithun now has enough fluency to run discovery calls and qualify license tier independently. ... Theme 3: New Partnership Tracks Open. Peter, OE's EMEA lead, introduced as a warm channel into European Zoom partners. Workato discovery call with Jamie confirmed MSP model as the right structure for OE to own the integration layer for Zoom clients. ... Theme 4: Zoom API Gap — Urgent Risk Before April 1. Joe surfaced significant Zoom CMS API gaps: captions, attachments, and thumbnails have no API support today. Expanded APIs releasing March 23 — only 8 days before the April 1 IFRS dry run. OE compiled a structured gap list to send to Zoom proactively. ... Monday, March 9th. 5 meetings. ... Team Zoom Sales Standup. Captions and thumbnails confirmed working in the migration pipeline. Tyler Brubach meeting flagged as priority. ... ZVM Migration Discovery — Laurentian University. First formal PS discovery call with Farrah and Sarah, Zoom AEs in Canada. Laurentian has 12,000 Panopto videos, go-live before August 1. One-pager reviewed live and edited. YuJa added to supported platforms. Competitor Codomite acknowledged; Sarah prefers OE. ... Internal Pricing Sync — post-Laurentian. All edits locked. Distribution plan: Emilia sends to Rajul and Tyler privately, then Kara posts to broader Zoom channel. Teaching session for Zoom AEs planned. ... Andrew daily check-in. Demo'd VideoMigrate — metadata coming through cleanly for hour-long videos. Moving truck analogy: fixed PS cost equals bringing the truck, variable equals how much data you're moving. Andrew confirmed Zoom AEs don't get comped on migration revenue — it's a license stickiness play. ... Zoom Sales Weekly. 86% to quarterly goal. Anderson signed for a 20-video migration at 8,200 dollars by March 31. Mithun's prospecting tool highlighted. Annabeth Ferris promoted to Senior PM. ... Tuesday, March 10th. 4 meetings. ... Peter Intro Call — EMEA. Peter spent 4 years at Zoom before joining OE in May 2025. Building a partner channel in EMEA targeting Zoom resellers. Holds 80 to 90 percent of OE's EMEA inbound from Zoom. Demo'd VideoMigrate and pricing one-pager. ... CMS Migration Engineering Standup. Joe scaffolding the extraction layer — goal to have listing and metadata extraction working by end of day. Three job modes confirmed: full account, filter-based, or specific entry IDs. Indeed also on Kaltura — pipeline being built to cover both IFRS and Indeed. ... Max Daily Sync — Support Line plus AI Architecture. Substantive conversation on the Zoom L1 support line Max is building. Mithun proposed two-layer architecture: live dashboard plus weekly cron job auto-generating an insight report for Zoom. Also floated a Salesforce integration leg — support calls becoming warm leads. ... Devin Daily Check-In. Devin shared two retail investor product ideas: OE Meet for Retail, and Earnings Highlight Reels — automated 60-second clips from earnings calls for LinkedIn and TikTok. Mithun: I was buying AMC on Reddit forums, I wasn't watching 60-minute calls. Both ideas had positive reception. ... Wednesday, March 11th. 2 meetings. ... Migration Pricing — Rajul Feedback Debrief. Rajul and VJ liked the layout. Two structural edits and a new second page requested: a definitions guide for AEs to self-qualify migration tier. Competitive intel: Zoom has another migration partner — Codomite. Rajul offered to share Codomite's pricing for comparison. ... Zoom Platform Onboarding Session with Max — two hours. Covered the full platform end-to-end: portals, licensing, event types, webinars vs. meetings, registration, access control, Production Studio. Mithun now has enough platform fluency to run discovery calls independently. ... Thursday, March 12th. 4 meetings. ... Migration Sales Doc Review — Joe Technical Deep Dive. Key trigger question: what format is the source video? MP4 or WebM equals Cost Card A. Anything else equals Cost Card B — transcoding roughly doubles storage and CPU. Expanded metadata APIs releasing March 23 — only 8 days before the April 1 dry run. Joe's pipeline produces a flat ledger: Kaltura entry ID to Zoom video ID to new Zoom URL for every file. ... Zoom Sales Weekly. Anderson signed — first standalone deal closed. CMS one-pager v2 going to Rajul and Tyler for final review. Emilia asked Mithun to expand the prospecting tool to non-Zoom clients. ... GCS Order Management — new workflow changes. Child Order Roll-Down and Add-On Flow both updated. Single standalone orders must be manually changed to Single Order type until Ali fixes the default. ... Andrew weekly check-in. Demo'd the corp comms prospecting tool. Andrew connected it to a project with Michael Morales expanding OE's channel into corporate communications firms. ... Friday, March 13th. 4 meetings. ... Brooks Demo — AI Video Tool Exploration. Brooks presented a local-first AI pipeline for financial clients needing air-gapped infrastructure. The one idea that resonated: post-event sizzle reels as a free OE value-add — auto-generate 3 sixty-second clips from a client's investor day, cost about 2 dollars and 5 minutes. Mithun quietly rebuilt Brooks' core tool during the call using Claude Code. ... Max Sync — Post-Brooks plus Workato Prep. Both aligned Brooks' tool has no moat. Mithun's SaaS moat framework: the only defensible moats are domain expertise, trusted relationships, and proprietary data. OE's moat is 10-plus years producing town halls for JP Morgan. ... Zoom Sales Weekly — Pricing Final plus API Gaps. Final pricing locked: Simple 9,600 dollars, Complex 21,600 dollars, both including 10 terabytes. API gap warning: captions, attachments, and thumbnails have no Zoom CMS API support today. Expanded APIs drop March 23. Alan: Zoom is aggressive and serious, they'll welcome this and marshal resources. ... Workato Discovery Call with Jamie. Three models explained: Referral, Resell, and MSP. MSP is most relevant. Sub-accounts per client confirmed. Salesforce, SFMC, and Marketo all have pre-built connectors. Next steps: partner agreement via DocuSign, MSP follow-up call week of March 23. ... Looking Ahead to Week 5. ... Monitor Zoom March 23 API release — critical dependency for April 1 dry run. ... Zoom AE Teaching Session — Mithun and Max to present the one-pager. ... IFRS Dry Run April 1 — first live extraction from IFRS's Kaltura account. ... Workato MSP Deep Dive — confirm whether OE's use case qualifies. ... Corp Comms Prospecting for Andrew. ... And Tyler Brubach Intro — still pending from Week 3.`;

// ─── Comments Component ───────────────────────────────────────────────────────

function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (stored) setComments(JSON.parse(stored));
    const storedName = localStorage.getItem("oe-hub-comment-name");
    if (storedName) setAuthorName(storedName);
  }, []);

  return (
    <div style={{ marginTop: 48 }}>
      <div style={{ borderTop: "2px solid #008285", paddingTop: 24 }}>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Comments
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            marginBottom: 24,
          }}
        >
          Leave feedback, questions, or notes. Stored in your browser.
        </p>

        {comments.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "16px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Georgia', serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {comment.author}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#c0c0c0",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {comment.timestamp}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.7,
                        color: "#374151",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {comment.text}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const filtered = comments.filter(
                        (c) => c.id !== comment.id
                      );
                      setComments(filtered);
                      localStorage.setItem(
                        COMMENTS_STORAGE_KEY,
                        JSON.stringify(filtered)
                      );
                    }}
                    style={{
                      fontSize: 11,
                      color: "#d1d5db",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                      fontFamily: "system-ui, sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            padding: "20px 24px",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 4,
              }}
            >
              Name
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 14,
                fontFamily: "'Georgia', serif",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 4,
              }}
            >
              Comment
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment or question..."
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 14,
                fontFamily: "'Georgia', serif",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                outline: "none",
                resize: "vertical",
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => {
              if (!authorName.trim() || !commentText.trim()) return;
              const newComments: Comment[] = [
                ...comments,
                {
                  id: Date.now().toString(),
                  author: authorName.trim(),
                  text: commentText.trim(),
                  timestamp: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                },
              ];
              setComments(newComments);
              localStorage.setItem(
                COMMENTS_STORAGE_KEY,
                JSON.stringify(newComments)
              );
              localStorage.setItem(
                "oe-hub-comment-name",
                authorName.trim()
              );
              setCommentText("");
            }}
            disabled={!authorName.trim() || !commentText.trim()}
            style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              color:
                authorName.trim() && commentText.trim()
                  ? "#fff"
                  : "#9ca3af",
              background:
                authorName.trim() && commentText.trim()
                  ? "#008285"
                  : "#f3f4f6",
              border: "none",
              borderRadius: 6,
              padding: "8px 20px",
              cursor:
                authorName.trim() && commentText.trim()
                  ? "pointer"
                  : "default",
              transition: "all 0.15s",
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TextToSpeech Component ───────────────────────────────────────────────────

type TTSState = "idle" | "loading" | "playing" | "paused" | "error";

function TextToSpeech() {
  const [status, setStatus] = useState<TTSState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsInstanceRef = useRef<any>(null);

  const handlePlayPause = useCallback(async () => {
    if (status === "playing" && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }

    if (status === "paused" && audioRef.current) {
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // @ts-expect-error - kokoro-js is loaded dynamically at runtime via CDN/wasm
      const { KokoroTTS } = await import(/* webpackIgnore: true */ "kokoro-js");

      if (!ttsInstanceRef.current) {
        ttsInstanceRef.current = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-v1.0-ONNX",
          { dtype: "q8", device: "wasm" }
        );
      }

      const audio = await ttsInstanceRef.current.generate(ttsScript, {
        voice: "am_michael",
      });
      const blob = audio.toBlob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audioElement = new Audio(url);
      audioRef.current = audioElement;

      audioElement.onended = () => setStatus("idle");
      audioElement.onerror = () => {
        setStatus("error");
        setErrorMessage("Audio playback failed");
      };

      await audioElement.play();
      setStatus("playing");
    } catch (err: any) {
      console.error("TTS failed:", err);
      setStatus("error");
      setErrorMessage(err?.message || "Unknown error");
    }
  }, [status]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("idle");
  }, []);

  const buttonLabel: Record<TTSState, string> = {
    idle: "Listen",
    loading: "Loading voice...",
    playing: "Pause",
    paused: "Resume",
    error: "Retry",
  };

  const buttonIcon: Record<TTSState, string> = {
    idle: "\u25B6",
    loading: "\u23F3",
    playing: "\u23F8",
    paused: "\u25B6",
    error: "\u26A0",
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {errorMessage && status === "error" && (
        <span
          style={{
            fontSize: 11,
            color: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={errorMessage}
        >
          {errorMessage}
        </span>
      )}
      <button
        onClick={
          status === "error"
            ? () => {
                setStatus("idle");
                setErrorMessage("");
              }
            : handlePlayPause
        }
        disabled={status === "loading"}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color:
            status === "error"
              ? "#ef4444"
              : status === "playing" || status === "paused"
              ? "#fff"
              : "#008285",
          background:
            status === "error"
              ? "#fef2f2"
              : status === "playing" || status === "paused"
              ? "#008285"
              : "#f0fafa",
          border:
            status === "error"
              ? "1px solid #fecaca"
              : status === "playing" || status === "paused"
              ? "1px solid #008285"
              : "1px solid #e0f0f0",
          borderRadius: 6,
          padding: "7px 16px",
          cursor: status === "loading" ? "wait" : "pointer",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        <span style={{ fontSize: 11 }}>{buttonIcon[status]}</span>{" "}
        {buttonLabel[status]}
      </button>
      {(status === "playing" || status === "paused") && (
        <button
          onClick={handleStop}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#9ca3af",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "7px 12px",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Stop
        </button>
      )}
    </div>
  );
}

// ─── Analytics Component ──────────────────────────────────────────────────────

function Analytics() {
  const [isExpanded, setIsExpanded] = useState(true);

  const statsCards = [
    { value: "22", label: "People Met" },
    { value: "3", label: "Clients Touched" },
    { value: "5", label: "Departments" },
    { value: "1", label: "Deals Closed" },
  ];

  const meetingsByDay = [
    { day: "Mon", count: 5 },
    { day: "Tue", count: 4 },
    { day: "Wed", count: 2 },
    { day: "Thu", count: 4 },
    { day: "Fri", count: 4 },
  ];

  const meetingTypes = [
    { type: "1:1 Calls", count: 5, color: "#008285" },
    { type: "Client / Discovery", count: 2, color: "#0ea5e9" },
    { type: "Internal Sync", count: 7, color: "#8b5cf6" },
    { type: "Partner / Strategic", count: 4, color: "#f59e0b" },
    { type: "Debriefs", count: 1, color: "#ec4899" },
  ];

  return (
    <div style={{ marginBottom: 48 }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: isExpanded ? 20 : 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Week 4 Analytics
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          {isExpanded ? "collapse" : "expand"}
        </span>
      </div>

      {isExpanded && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            {statsCards.map((card) => (
              <div
                key={card.label}
                style={{
                  flex: "1 1 100px",
                  minWidth: 80,
                  background: "#f0fafa",
                  border: "1px solid #e0f0f0",
                  borderRadius: 8,
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#008285",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    fontFamily: "system-ui, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: 2,
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              Meetings by Day
            </div>
            {meetingsByDay.map((item) => (
              <div
                key={item.day}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 30,
                    fontSize: 12,
                    color: "#9ca3af",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "right",
                  }}
                >
                  {item.day}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    background: "#f3f4f6",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.count / 5) * 100}%`,
                      height: "100%",
                      background: "#008285",
                      borderRadius: 4,
                      opacity: 0.6 + (item.count / 5) * 0.4,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              Meeting Types
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {meetingTypes.map((item) => (
                <div
                  key={item.type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 20,
                    padding: "6px 14px",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {item.type}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#111827",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DaySection Component ─────────────────────────────────────────────────────

function DaySection({ data }: { data: DayData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: "pointer",
          padding: "16px 0",
          borderBottom: isExpanded ? "none" : "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#008285",
                letterSpacing: "-0.02em",
              }}
            >
              {data.day}
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                fontFamily: "'Georgia', serif",
                marginLeft: 10,
              }}
            >
              {data.date}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                color: "#008285",
                background: "#f0fafa",
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {data.meetingCount} meetings
            </span>
            <span
              style={{
                fontSize: 18,
                color: "#d1d5db",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                transition: "transform 0.15s ease",
                fontFamily: "serif",
              }}
            >
              ›
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{ paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}
        >
          {data.meetings.map((meeting, index) => (
            <div
              key={index}
              style={{
                padding: "14px 0",
                borderTop: index > 0 ? "1px solid #f9fafb" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {meeting.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#6b7280",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {meeting.summary}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function WeekFourReport() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "56px 24px 96px",
        }}
      >
        {/* Header Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Link
            href="/reports"
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            &larr; Back to Reports
          </Link>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <TextToSpeech />
            <span
              style={{
                fontSize: 10,
                color: "#c0c0c0",
                fontFamily: "system-ui, sans-serif",
                maxWidth: 90,
                lineHeight: 1.3,
              }}
            >
              First load downloads ~80MB voice model
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c0c0c0",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 16,
            }}
          >
            Weekly Report
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px 0",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Week 4
          </h1>
          <div style={{ fontSize: 15, color: "#9ca3af", marginBottom: 4 }}>
            March 9&ndash;13, 2026
          </div>
          <div style={{ fontSize: 14, color: "#b0b0b0" }}>
            Mithun Manjunatha &mdash; Sales Engineer
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#008285",
              borderRadius: 2,
              marginTop: 20,
            }}
          />
        </div>

        {/* Summary Stats */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Meetings", value: "19" },
            { label: "Days", value: "5" },
            { label: "Themes", value: "4" },
            { label: "Onboarding Week", value: "4 of 6" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#f9fafb",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "14px 20px",
                flex: "1 1 120px",
                minWidth: 100,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontFamily: "system-ui, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics */}
        <Analytics />

        {/* Overview + Themes */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Overview
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#374151",
              marginBottom: 24,
            }}
          >
            Week 4 was the most externally-facing week of onboarding so far.
            OE&rsquo;s migration pricing hit the market, the Zoom AE channel
            was formally activated, and two new partnership tracks opened
            simultaneously &mdash; EMEA (via Peter) and integration middleware
            (via Workato). Anderson signed OE&rsquo;s first standalone
            migration deal at $8,200. 19 meetings across the week.
          </p>

          {themes.map((theme, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                {theme.title}
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.75,
                  color: "#6b7280",
                }}
              >
                {theme.text}
              </div>
            </div>
          ))}

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: "#9ca3af",
              marginTop: 24,
              fontStyle: "italic",
            }}
          >
            Note: Created in tandem with AI to summarize meeting notes. Every
            line read and verified.
          </p>
        </div>

        {/* Day by Day */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Day by Day
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 20,
            }}
          >
            Click a day to expand meeting details.
          </p>
          {meetingData.map((day) => (
            <DaySection key={day.day} data={day} />
          ))}
        </div>

        {/* Looking Ahead */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Looking Ahead &mdash; Week 5
          </h2>
          {lookAheadItems.map((item, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#6b7280",
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* AI Disclaimer */}
        <div
          style={{
            fontSize: 12,
            color: "#b0b0b0",
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
            marginBottom: 8,
            lineHeight: 1.6,
          }}
        >
          Note: This report was created in tandem with AI to help summarize
          and organize meeting notes. I have read every line and verified its
          accuracy. Please feel free to reach out with any questions.
        </div>

        {/* Comments */}
        <Comments />

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 20,
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10.5,
            color: "#c0c0c0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span>Open Exchange &middot; Confidential</span>
          <span>Week 4 &middot; Mar 9&ndash;13, 2026</span>
        </div>
      </div>
    </div>
  );
}
