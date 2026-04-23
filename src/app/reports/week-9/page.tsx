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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-9";

const themes: Theme[] = [
  {
    title: "April 18th as the Migration Hinge Point",
    text: "Every active migration thread — IFRS, Laurentian, Okta — ran through the April 18th Zoom release. Tag limits expanded (5 → 30 tags, 20 → 40 chars), caption upload unblocked, and the SRT→VTT conversion completed. Monday’s validation run on the first IFRS batch is the real test. The multipart upload part-size limit (confirmed hard at 100MB per part) was formally pushed back to Zoom for the second time. Joe’s read: OE is still acting as Zoom’s QA team.",
  },
  {
    title: "Okta as the Practice’s First Enterprise Scale Deal",
    text: "The Circle HD to ZVM migration for Okta landed in a single week — discovery call, post-call debrief, and pricing debate. At 130 channels, hierarchical restructuring, SSO via Okta push groups, chapter migration, and a hard mid-August deadline (Oktane conference), this is structurally the most complex migration scoped so far. Vijay confirmed S3-to-S3 transfer launching in April, which dramatically reduces infrastructure cost. Pricing converged around $40K. Implementation plan and formal quote due Monday.",
  },
  {
    title: "Open Montage Crosses into Working Prototype",
    text: "The earnings call video editor moved from idea to working demo across the week. Three versions built and tested against the CVS Health earnings call — rules-based, slides + moderator, and Claude Opus 4.6 timestamp-aligned — coming within three seconds of the original. The UI was built and deployed on Vercel by Friday with a 97% confidence score on the mock agent simulation, versioning history, XML export for Premiere, and Neon database wired in. Casey’s full editor training doc and practice edit files are now in Mithun’s hands to improve accuracy.",
  },
  {
    title: "AI Tooling Spreading Across the Organization",
    text: "Alan announced OE’s internal AI support agent (Copilot + Claude, full knowledge base) went live Friday — 50 historical tickets answered in minutes. Edgar on the production team is using Claude Code for client page builds. Peter built a Claude pricing tool for EMEA/APAC quoting in 10 minutes. Mithun built a migration pricing estimator and an OE Central agent concept framed for Cargill and Mark’s internal request. Emilia gave Mithun explicit license to keep pursuing the AI and product work. The SE role is visibly evolving into something closer to AI GTM.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Monday Validation Run — The Critical Gate",
    text: "Monday morning: rerun the existing IFRS batch through transform to re-patch tags (now 40 chars, up to 30 tags), and run a new batch of five entities with captions end-to-end to validate caption behavior post-April 18th release. Both must pass cleanly before the IFRS client call Thursday. If they do, full migration begins at 200–300 entities per day.",
  },
  {
    title: "Okta Implementation Plan & Quote — Due Monday",
    text: "Mithun to draft the six-phase implementation plan (discovery, setup, dry run, migration, validation, handoff) referencing the Okta discovery call transcript and migration document. Pricing to go out at $40K or higher with a detailed SOW breaking out PM hours to justify the number. Align with Kara Monday afternoon before anything goes to Okta.",
  },
  {
    title: "Multipart Upload Part-Size Limit — Formal Zoom Response",
    text: "The 100MB-per-part ceiling is confirmed for the second time. Joe’s recommendation: formally push back to Zoom requesting a technical resource who can clarify the actual limit and the timeline for raising it. This affects every large-file migration going forward.",
  },
  {
    title: "Open Montage — XML Export Fix & Casey’s Practice Files",
    text: "The XML export is currently producing HTML — reprompt needed. Casey’s editor training doc and practice edit files are now in hand; use them to improve the agent’s segment classification accuracy and test the voice cloning/TTS splice feature. Target: bring accuracy from 90% to 95%+ before presenting to Britt.",
  },
  {
    title: "Migration Bot — Joe Briefing & App Submission Path",
    text: "Emilia greenlit the migration bot concept and confirmed Zoom would welcome it on the Marketplace. Next step: brief Joe on the architecture before finalizing the build plan. Separately, explore with Vijay whether the 100-day Marketplace review process can be expedited given OE’s ISV partner status.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "April 14",
    meetingCount: 5,
    meetings: [
      {
        title: "ZCM Migration Standup — Joe, Akash, Mithun",
        summary: "The weekly ZCM standup with Joe leading. Infrastructure stood up and torn down in AWS US East 2 with no issues. ZVM API gap (no external media upload) confirmed as documented in ticket ZCM-79 and closed. Resource cleanup automation identified as the next open item — per contract OE cannot retain client data beyond a defined period and that automation does not yet exist. Post-April 18th plan: re-emit metadata for the first batch to validate tag fixes by April 23rd, then ramp to 100–200–300 videos per day the following week.",
        angle: "The April 18th Zoom release is still the hard gate for everything — Mithun is coordinating that dependency across both IFRS and Laurentian.",
      },
      {
        title: "OE Central API Exploration — Tomaso",
        summary: "Mithun explored what OE Central data could feed an intelligent event-monitoring agent with Tomaso (OE product/engineering). Tomaso walked through the platform architecture: accounts contain events, which contain meetings with topics, presenter/host lists, and registrant counts. Registrant count is a useful but imperfect importance signal since people often register late. External API docs cover auth, attendee retrieval, and CRUD but do not yet include an endpoint to pull Zoom connection details by meeting ID. Tomaso directed Mithun to define the agent’s data inputs first, then bring that list to Ali (internal integrations) and Connor (API lead) to clarify what is accessible internally versus externally.",
        angle: "This gives Mithun the data access map needed to begin speccing the OE Central agent concept, which connects directly to the Cargill Microsoft integration inquiry and the broader managed agent write-up.",
      },
      {
        title: "OE Q1 All-Hands & Quarterly Business Review",
        summary: "Company revenue came in at approximately $10M, 93% of the quarterly target. Institutional delivered its best Q1 in five years at +19% revenue growth led by Goldman Sachs, Wells Fargo (+75%), JP Morgan (+39%), RBC (+35%), Bank of America (+33%), and UBS (+21%). GCS closed 99 deals totaling $1.667M (167% of target) with 32 new logos. The Zoom partnership closed $1.306M at 106% of quota. Six reps exceeded quota: Kaylee, Jules, Jamie, Kara, Brit Marinucci, and Canis. Emilia led a closed-loss analysis identifying ghosting and cost/budget as the top two loss drivers. Mithun was formally introduced company-wide as the Zoom partnership SE with CMS migration and marketing integrations named as the two new SE-led growth vectors.",
        angle: "Being introduced at the all-hands with migrations and integrations framed as strategic growth lines gives Mithun company-wide visibility and internal mandate heading into Q2.",
      },
      {
        title: "Claude API Cost Review — Joe",
        summary: "Joe flagged that Mithun’s Claude API usage was running roughly double the rest of the team, attributed to Opus model use via fast mode and large accumulated context windows. Joe shared a structured multi-phase AI workflow: phase one uses a lighter model to extract structured JSON company facts, phase two feeds that output into Sonnet for scoring and outreach copy, with extended thinking disabled and context cleared between sessions. Mithun confirmed he had already switched off fast mode, disabled his three MCP servers, and would monitor usage going forward.",
        angle: "The phased, model-matched workflow Joe demonstrated is directly applicable to how the migration bot and OE Central agent should be architected to keep costs controlled at scale.",
      },
      {
        title: "SE Monday Sync — Emilia",
        summary: "With Max out of town, Mithun is the primary Zoom contact for the week. A University of Ottawa migration RFP was submitted. IFRS was the most pressing issue: a Zoom sales rep had committed to IFRS in March that Kaltura slide content would be embedded into migrated Zoom videos, but this was agreed without looping in OE — creating a gap that now threatens the migration. The Okta migration is being scoped at approximately $50K after Kara recommended increasing PM hours. Cargill was flagged as exploring a Microsoft Copilot agent built on OE Central registrant data. Mithun previewed the video migration bot concept as a potential Zoom Marketplace SaaS product.",
        angle: "The IFRS slide-embedding gap — a Zoom promise made without OE’s knowledge — is the most urgent coordination issue; the Okta scoping and managed agent write-up are the two primary Q2 deliverables taking shape.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "April 15",
    meetingCount: 2,
    meetings: [
      {
        title: "ZCM Tuesday Standup — Joe, Akash, Mithun",
        summary: "Two open items resolved. First, the ZCM S3-to-S3 ticket — Mithun uploaded the missing technical document during the call. Joe clarified the architecture requirement: Zoom must physically move client data out of OE’s S3, not simply read from it, since OE cannot retain client data permanently per contract. ZCM-39 (cleanup and tear-down with actual files) confirmed tested and working. Joe flagged a new ticket: Zoom’s docs imply a 100-part cap on multipart uploads. At OE’s 100MB chunk size this creates a file size ceiling. Joe wants the team to reduce chunk size to force over 100 parts and confirm whether the cap is real.",
        angle: "If the 100-part cap is confirmed it needs to go to Zoom as a formal platform gap — it puts a hard ceiling on migrating large files and affects every future ZVM migration.",
      },
      {
        title: "Devin Weekly Check-In — IR Agent & Open Montage Demo",
        summary: "Commission structure discussed: both Mithun and Devin receiving first SE payouts this week. Cargill update: Jules and Connor sold OE Central data access at $3K setup plus $500 annual maintenance; Mark asked Mithun to build the same thing internally. Mithun demoed Open Montage — a GitHub-based agent parsing VTT transcripts and outputting a single MP4. Three versions built; the Claude Opus 4.6-powered version ran 26:27 against the original 26:30. Devin raised a security concern about pre-public earnings call data fed to Claude. Devin previewed the IR agent with analyst sentiment, predicted Q&A, and rehearsal mode.",
        angle: "Open Montage is demo-ready and the Cargill data pull work connects directly to Devin’s IR platform — the same OE Central data layer can feed both.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "April 16",
    meetingCount: 3,
    meetings: [
      {
        title: "ZCM Wednesday Standup — Joe, Akash, Mithun",
        summary: "ZCM-99 (increasing part count cap from 100 to 500) confirmed done. The team tested a 35GB file at approximately 120 parts and it uploaded successfully — the part-count limit is not 100. Joe recommended bumping the internal cap to 500 to find the real ceiling; a PR is up for peer review. April 18th release prep: tag character limit expanding to 40 characters, to be tested Monday morning. Post-release plan: rerun the 16 already-migrated IFRS entities through transform to re-patch tags; create a new batch of five entities with captions for end-to-end caption validation. If both pass before the IFRS call the following Thursday, full migration begins at 200–300 entities at a time.",
        angle: "Monday morning is the first real validation gate post-April 18th release — Mithun needs to relay the tag fix results to IFRS quickly since that unblocks the full migration run.",
      },
      {
        title: "Salesforce Order Process Training — Ali (Sales Ops)",
        summary: "Ali ran a company-wide Salesforce training on converting opportunities to orders and managing add-ons. Core principle: opportunities represent pipeline; orders represent all confirmed revenue, and commission/quota tracking will run off orders going forward. Multi-event flow: close the opportunity, convert to order, mark as multi-event, create child orders (one per event), mark each as pending billing review. Add-ons must be created from the relevant child order and not marked pending billing review until after the event delivers. Shannon confirmed delivery will not execute events without products itemized on the order starting this quarter.",
        angle: "Mithun should confirm any Zoom partnership or migration deals he owns are properly converted to orders with products itemized — this is now how quota and commission are tracked.",
      },
      {
        title: "Michael Morales 1:1 — Claude SEO Tool Handoff",
        summary: "Mithun walked Michael through the implementation guide for the Claude-based SEO workflow: runs Claude Code in terminal, spawns nine parallel agents, generates JSON content validating against current Google requirements at zero cost versus AHrefs at $900/month and SEMrush at $117/month. Mithun flagged the new Claude desktop app as a lower-barrier entry point. Camden came up as someone to loop into Zoom-related content and lead follow-up.",
        angle: "Getting Michael using the Claude SEO workflow directly extends the AI tooling footprint into marketing without requiring Mithun’s ongoing involvement.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "April 17",
    meetingCount: 8,
    meetings: [
      {
        title: "OE Q2 Delivery All-Hands",
        summary: "Annalisa led staffing data showing peak hours up 376% (9am–1pm EST) and 82 March connect meetings arriving under 48 hours notice, directly correlated with geopolitical activity. Carlos presented operator team expansion: a core team of six full-time operators joined February and touched approximately 500 events in under two months. Capital markets handled 294 events and 3,393 meetings, up 59% year over year. Goldman Sachs at 340 meetings (+128%), JP Morgan at 244 (+66%), 283 hotline calls, SpaceX IPO underway. Podium 2.0 rolling out across GCS. Edgar on the production team flagged Claude Code as enabling complex client page builds.",
        angle: "Edgar’s Claude Code mention confirms AI tooling is already spreading organically into the production team — Mithun’s Open Montage work is pushing on a door that’s already open.",
      },
      {
        title: "ZCM Thursday Standup — Joe, Max, Akash, Mithun",
        summary: "ZCM-99 (increasing part count to 500) is done. The open question is whether the part SIZE (100MB) can go higher. Plan: change configuration to 200MB, run a file over 2GB, observe the error. April 18th release reminder: tags expanding to 40 characters, to be tested Monday morning. Post-release plan confirmed: rerun existing IFRS batch to re-patch tags; create a new batch of five entities with captions for end-to-end validation. If both pass before the IFRS call next Thursday, begin full migration at 200–300 entities at a time.",
        angle: "Monday is go-time — both the tag fix and caption behavior need to pass cleanly before the IFRS client call the following Thursday.",
      },
      {
        title: "Michael Morales Follow-Up — Implementation Guide",
        summary: "Short follow-up: a few button labels in the Claude SEO implementation guide were misleading. Michael confirmed he will update the first word of those buttons himself without touching underlying logic.",
        angle: "Implementation guide is in active use.",
      },
      {
        title: "Zoom Partnership Team Weekly — Q2 Pipeline Review",
        summary: "Two weeks into Q2: $44K closed against a $1.2M quota (4%), total pipeline $525K. Andrew believed the real picture is healthier since known renewals like Databricks and Intuit are not yet in Salesforce. Emilia pushed for all known renewals at SQL stage using last year’s revenue as a placeholder. Peter demoed a Claude pricing tool he built in approximately 10 minutes for EMEA/APAC quoting. Mithun contributed asks around app submission support and bundling webcasting with migration for the education segment.",
        angle: "Q2 Zoom pipeline is thin on paper — the education segment bundling pitch and the managed agent Marketplace path are the two near-term items Mithun can actively move forward.",
      },
      {
        title: "Open Montage Video Editor Deep Dive — Casey and Devin",
        summary: "Mithun demoed all three Open Montage versions to Casey and Devin using the CVS Health earnings call. The Claude Opus 4.6 version came within three seconds of the target length. Known error: when a speaker ends a sentence and the next take starts from the last three words, the agent misses the duplicate. Casey confirmed the tool is useful and would save meaningful production time. The full workflow was mapped: gather files, agent processes, human editor reviews in Premiere, uploads to Novio for client review, live stream driver downloads the final MP4. Opus 4.7 released mid-call.",
        angle: "Open Montage is demo-ready with Casey; the workflow doc from Casey and the duplicate-detection fix are the two items needed before it can run on a live earnings call.",
      },
      {
        title: "SE Sync — Emilia",
        summary: "Migration bot: Alan is excited after seeing it. Four steps remain — full development, managed service agent setup (cost), S3-to-S3 agreement with Vijay, and Zoom Marketplace submission. Mithun has deliberately held off telling Joe since Joe is a rigorous engineer and Mithun wants to come in fully prepared. Emilia’s read: Zoom is focused on competing with Teams and would not prioritize a migration bot internally — OE building and listing it on the Marketplace is exactly what Zoom would want. Open Montage at 90% accuracy. Emilia told Mithun explicitly to keep pursuing the AI and product ideas — the role is evolving.",
        angle: "Emilia’s explicit endorsement gives Mithun internal license to invest time in the migration bot, video editor, and OE Central agent without waiting for a formal product brief.",
      },
      {
        title: "Okta / Circle HD Discovery Call — Kara, Max, Mithun, Camden, Vijay, Kenneth, Andrew, Bri",
        summary: "Full discovery call for the Okta migration from Circle HD to ZVM. Circle HD has approximately 130 flat channels with videos and transcript files; no quizzes or polls; chapters only for marquee events including Oktane. Okta’s desired end state: hierarchical channel structure by org and team, personalized content (Netflix-style), access control by org/team/level, and embed support into Confluence, Cornerstone LMS, and their intranet. SSO via Okta push groups. Max outlined three to six months as a conservative timeline. Hard constraint: Okta’s team is unavailable mid-August through end of September for the Oktane annual conference. Vijay confirmed S3-to-S3 transfer launches in April. Quote and detailed plan due Monday.",
        angle: "The Oktane deadline (mid-August) is the hard constraint that sets the entire project timeline — MSA procurement could take two to three weeks, time that cannot be wasted.",
      },
      {
        title: "Okta Post-Call Debrief — Kara, Max, Mithun, Camden",
        summary: "Max’s read: content itself is straightforward but channel restructuring and stakeholder coordination will drive PM hours. Chapter migration depends on Vijay building the required API. Pricing: original $30K estimate to be raised to $40–45K given PM hours for hierarchy design, stakeholder management, onboarding, and post-migration support. Kara’s direction: go high, send a detailed plan with line-item breakdown by Monday. Mithun flagged wanting to understand Okta’s dealbreakers (chapters, hierarchical structure, Cornerstone embedding) before the quote goes out.",
        angle: "The detailed SOW by Monday is the priority — a line-by-line breakdown of PM hours, infrastructure, and post-migration support is what will hold the $40–45K price against pushback.",
      },
    ],
  },
  {
    day: "Friday",
    date: "April 18",
    meetingCount: 5,
    meetings: [
      {
        title: "ZCM Friday Standup — Max, Kiran, Mithun",
        summary: "Akash was out. The 100MB-per-part limit was confirmed for the second time — same error returned when attempting to exceed that ceiling. Joe’s message to Zoom: this is the second time OE has flagged this; if Zoom insists the limit is higher, they need to supply a technical resource who actually knows their own APIs. ZCM-37 (updating the transformer job to allow more than five tags) queued for early next week. SRT→VTT conversion done and verified on the IFRS branch. Everything staged for Monday morning.",
        angle: "Monday morning is go-time — tag fix, caption behavior, and the five-entity test batch are the three gates before IFRS gets the green light.",
      },
      {
        title: "Max + Mithun Internal Sync — Pricing Tool & Reporting Gap",
        summary: "Mithun built a Claude-based migration pricing tool overnight, taking the migration document and call transcript as inputs and outputting a rough cost estimate. Max raised a reporting gap: captions and attachments may not be tracked with the same granularity as video files in the current migration report. Alan joined briefly to announce OE’s internal AI support agent (Copilot + Claude, full knowledge base) is now live — 50 historical tickets answered in minutes. Alan asked Max and Mithun to connect with Eric (the engineer who built it) and confirmed OE has a dedicated Zoom ISV support contact (Diana via Max) that should be pushed hard.",
        angle: "The reporting gap Max identified is the kind of issue that surfaces post-migration as client complaints — confirming caption and attachment logging with Joe before the IFRS full run is worth one standup question.",
      },
      {
        title: "Casey + Mithun Part 1 — XML Export Idea & Live UI Build",
        summary: "Casey opened with an idea from Jeremy on his team: instead of the agent exporting an MP4, export an XML file that Premiere can import directly with all cuts pre-loaded in the timeline. Mithun agreed this fits the existing production workflow and eliminates the need for a separate video UI for basic corrections. Mithun then live-built the video editor UI using Claude Code with the Zero orchestrator agent, deploying on Vercel with Neon as the database. Call ended with Mithun saying he would call Casey back once the build progressed further.",
        angle: "The XML export path solves the separate UI problem cleanly by meeting editors in the tool they already live in.",
      },
      {
        title: "Casey + Mithun Part 2 — UI Demo & Practice Edits",
        summary: "Mithun called Casey back with the build further along: project queue with stage labels (queued → processing → ready for review), 97% confidence score in 85 seconds, versioning history, source files, XML download, and Premiere XML download. One issue: XML was exporting as HTML — reprompt needed. Casey shared his full editor training package including a step-by-step editorial workflow document. Casey described a production staffing tool concept — project type, task context, time estimates, and editor availability feeding an LLM to recommend who to staff. Voice cloning/TTS added to Open Montage scope. Opus 4.7 powering the latest build iteration.",
        angle: "Casey’s training doc is the best input Mithun has received yet for improving Open Montage accuracy — it defines exactly how a human editor makes decisions, which is what the agent needs to replicate.",
      },
      {
        title: "Max + Mithun — Okta Quote & Implementation Plan",
        summary: "Mithun argued for $40K (up from $30K), grounded in PM hours: discovery covering channel structure, embedding, access control, and content organization (six hours), onboarding (four hours standard), remaining project management bringing the total to approximately 24–28 hours. Mithun’s angle: take more margin, and offer a case study co-branding deal if Okta pushes back — document the migration as a go-to-market asset to pitch other enterprise SaaS companies in the same vertical. Plan: Mithun drafts the six-phase implementation plan, aligns with Kara Monday afternoon, then sends.",
        angle: "The case study co-branding offer is the right lever if Okta resists the price — a named enterprise SaaS reference this early in the migration practice is worth more than the margin difference.",
      },
    ],
  },
];

export default function Week9Report() {
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
          href="/weekly_report_week9.pdf"
          download="Weekly_Report_Week9_final_1.pdf"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#008285",
            background: "#f0fafa",
            border: "1px solid #e0f0f0",
            borderRadius: 6,
            padding: "7px 16px",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
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
        Week 9
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>April 13 &ndash; 18, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "23", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "9", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 9 Analytics</strong> &nbsp;&middot;&nbsp; April 18th Zoom release is the migration gate &nbsp;&middot;&nbsp; Okta discovery call + debrief + quote in one week &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Okta &middot; Open Montage &middot; OE Central Agent &middot; Migration Bot
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 9 was the week the migration practice gained real institutional weight and the AI tooling agenda moved from concept to working product. The IFRS migration cleared its final pre-run gate — ZVM API gaps documented, April 18th release confirmed as the unlock for tags and captions, post-release validation plan locked with the client call scheduled for the following Thursday. Okta emerged as the largest migration opportunity yet, with a discovery call, debrief, and pricing debate all landing in the same week. Meanwhile two converging threads — the Open Montage video editor and the OE Central agent — both crossed into demo-ready territory. Mithun was formally introduced at the Q1 all-hands as the Zoom partnership SE, with CMS migration and marketing integrations named as the two new strategic growth lines. The week closed with Alan announcing OE&rsquo;s internal AI support agent going live and Opus 4.7 shipping mid-call on Friday.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 10</h2>
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
