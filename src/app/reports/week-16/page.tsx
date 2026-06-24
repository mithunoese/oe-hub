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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-16";

const themes: Theme[] = [
  {
    title: "IFRS Migration: Final Mile Complications",
    text: "The last week of the IFRS engagement surfaced a cascade of late-stage technical issues that required rapid resolution before the Tuesday client presentation. An SRT-to-VTT caption conversion function was discovered to be written but not wired into the pipeline, causing caption files to be silently dropped across a large portion of the migration. A second linking bug followed when Zoom returned 500 errors during the caption patch run, leaving captions uploaded but disconnected from their entity IDs. Both issues were diagnosed and fixed within 24 hours. Separately, four manually migrated entries hit a tag character limit, eight Kaltura quiz videos required manual recreation in Zoom due to a platform timing-gap difference, and one entity remains under Zoom engineering investigation. The final report and client presentation are scheduled for early Week 17.",
  },
  {
    title: "Indeed Retention Crisis Resolved at Platform Level",
    text: "A legal-triggered 30-day clips retention policy, already live on Indeed’s Zoom account, threatened to auto-delete all 7,000 migrated Kaltura videos within a month of migration. The team escalated directly to Zoom ZVM product manager Vijay and engineering lead Bo on Friday. Vijay confirmed Zoom Whiteboard already supports a “save starred” exemption from retention deletion and committed to implementing the same for Clips, including a bulk API so OE can programmatically star clips on behalf of users during the migration run. A second exemption for clips added to ZVM channels is also under discussion. Vijay also provided the embed-code construction pattern, enabling OE to deliver a dual-link report mapping old Kaltura URLs to new Zoom URLs for Indeed’s re-embedding work.",
  },
  {
    title: "Vault Jump: Bot Architecture and Go-to-Market Taking Shape",
    text: "The migration bot — internally named Vault Jump, with the virtual assistant persona “Dot” — moved from experimental to structured this week. Akash deployed major architecture changes and confirmed the bot is testing successfully in the sandbox account. Mithun and Akash aligned on a customer questionnaire flow requiring a minimal set of required fields (source platform, destination, credentials, data residency region), with all other information ingested optionally. A GitHub MCP connector will give the bot persistent, always-current API context from the migration repo. Zoom’s in-app framework supports both free trials and direct payment, making in-app monetization viable. Akash was directed to move testing to the corporate Zoom account where ZVM licenses live, as the next two migrations (Okta and Indeed) both target Zoom Video Management.",
  },
  {
    title: "SE Fluency: Earnings Model, Contact Center, and Client Enablement",
    text: "Week 16 delivered a concentrated cross-functional education. Devin walked Mithun through OE’s earnings and investor-day business: four-pack and eight-pack pricing starting at roughly $2,950 per call, investor days ranging from $10K to $100K, the full delivery workflow from kickoff through 24-hour post-event deliverables, and the managed-service moat against Q4 and Notified. A Contact Center strategy call with Alan and Tyler confirmed June 15 as the support-line go-live date, with 10 Zoom-issued Mac laptops shipping to OE agents and a trial Elite license providing AI engagement briefs. The American Bankers Association loss on the slide-upload gap was formalized as product feedback for Zoom. Energized Marketing’s HubSpot-to-Zoom Webinar Plus integration was established end to end.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Final Report + Client Presentation — Max, Mithun",
    text: "Mithun and Max to meet Monday to polish the migration report, incorporating the caption patch results, JSON file counts, permanent-hold reason columns, and manual migration notes. Full IFRS client presentation call scheduled for Tuesday.",
  },
  {
    title: "Indeed Monday Call — Max, Kara, Andrew",
    text: "Present Zoom’s retention solution (starred clips exemption and bulk API, mid-July target with acceleration intent), the embed-code mapping approach for the dual-link handoff report, and scope the Google Drive backup request as a potential added-scope line item.",
  },
  {
    title: "Caption File Audit — Akash",
    text: "Audit approximately 1,200 SRT-flagged caption files in S3 against Kaltura API metadata to confirm whether Kaltura is misreporting file types. Fix the migration script to handle the mismatch before it recurs on subsequent engagements.",
  },
  {
    title: "Vault Jump OAuth + ZVM Testing — Akash",
    text: "Create an OAuth app under the corporate Zoom account to begin testing the migration bot against real ZVM licenses, in preparation for the Okta and Indeed migrations that both target Zoom Video Management.",
  },
  {
    title: "Zoom Enablement Call — Mithun, Max",
    text: "Amelia to schedule the 30-minute call with Mithun, Max, and the Zoom enablement team to align on talk tracks and deliverables. Max requested the same Zoom contacts attend as prior calls to avoid repeating prior briefings.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "June 1",
    meetingCount: 5,
    meetings: [
      {
        title: "Power BI MCP Connector Enablement — Internal",
        summary: "Connor walked the OE team through the Power BI MCP connector that allows natural-language queries against OE’s semantic models in Claude via VS Code. Authentication was blocked by an IT permissions loop affecting both Max and Michael; Connor committed to resolving the connector with Alex Keefe this week. Two relevant semantic models were identified: financial reports and the delivery-manager reports with Salesforce data. Mithun asked whether earnings and investor-day presenter names, registrant counts, and attendee data could be surfaced; Connor confirmed the delivery-manager model with Salesforce data should cover most of it, though PII registrant data is intentionally excluded from Power BI.",
        angle: "OE’s Power BI semantic models contain the deal and event data Mithun needs to self-serve pipeline reporting and prep for earnings-call prospects, making resolution of the connector a direct SE productivity unlock.",
      },
      {
        title: "Migration Internal Sync — Citi, IFRS Close-out, ZVM Bot Architecture — Internal",
        summary: "Mithun, Max, Akash, and Meet covered three threads. On Citi (635 GB staged in OE’s S3), Mithun reframed the delivery decision around client ownership and cost, recommending Citi own their S3 with OE providing credentials and maintenance. On IFRS, 15 entities that failed on the old tag limit were remigrated; Meet ran a blanket repatch of tags, metadata, and thumbnails. Two corrupt source files and one post-cutoff entry were logged manually. On the ZVM bot, the S3-to-S3 proof of concept works but Lambda’s 15-minute timeout and 3 GB memory limit forced an architecture redo for the MVP; Mithun pushed for a self-serve customer experience from questionnaire intake through implementation plan to pricing.",
        angle: "Mithun’s ownership-and-cost framing for Citi de-risks a protracted delivery negotiation and positions OE as a neutral technical advisor rather than a vendor trying to monetize the transfer infrastructure.",
      },
      {
        title: "Citi Data Transfer Escalation — Internal",
        summary: "Andrew, Alan, Joe, Max, and Mithun escalated the Citi handoff after Citi could not stand up their SFTP server. With 635 GB ready in OE’s bucket, Joe and Alan agreed the move is to get Citi on a call and let their technical contact name a bank-approved transfer method, with OE granting limited bucket permissions. The team decided against standing up an OE-side SFTP, and a Zoom-based transfer was ruled out for lack of an agreement. Andrew to reach out and push Ian for an early-week call.",
        angle: "Routing the transfer decision back to the client keeps OE out of an ongoing server-maintenance obligation and demonstrates delivery discipline to internal leadership.",
      },
      {
        title: "GCS Sales Weekly Kickoff + NIRI Prep — Internal",
        summary: "Andrew and Amelia framed the Q2 push with four weeks remaining and roughly $825K per week needed to hit target. IRO advisor Lorna (ex-Credit Suisse) coached the team ahead of NIRI in Chicago: lead with topical conversation such as the sitting SEC chair’s appearance and the 2x-vs-4x reporting debate, position OE as a problem-solver, and pursue younger or less-jaded attendees. Pipeline highlights included Lenovo migrating from Veracast to Novio for a World Cup press event, the American Bankers Association at roughly $200K for 175 webinars per year, DocuSign town halls, and Agilent. Peter showcased proactive Bain outreach off a luxury-brand event. The team discussed competitor Octus for bot-based session recording and the “corporate bot agent controlling the narrative” theme as a NIRI conversation opener.",
        angle: "NIRI and the emerging agentic AI theme around corporate communications are direct openings for Mithun, alongside migration displacement deals like the Lenovo/Veracast opportunity that sit squarely in SE territory.",
      },
      {
        title: "Energized Marketing — Webinars Plus + HubSpot Integration Setup — Client",
        summary: "David and Mithun supported Michael and Melissa of Energized Marketing in standing up their Webinar Plus license and Zoom Events hub branded as Tech Talks. They created a single-session simulive event for an IBM webinar on June 25 on intelligent modernization. The bulk of the session was troubleshooting the Zoom Events–HubSpot integration: a prior install had left a dummy account, and reinstalling from the Zoom App Marketplace re-established the connection. The team built a HubSpot workflow (form-submission trigger to register users in Zoom Events using the event ID and ticket type) and discussed unique versus group join links. A custom-domain branding question was left open for follow-up.",
        angle: "Getting the Zoom Events–HubSpot connector working end to end is a repeatable enablement play that Mithun can use as a reference when any marketing-led Zoom customer asks about integrating their CRM into the events flow.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "June 2",
    meetingCount: 3,
    meetings: [
      {
        title: "IFRS Close-out + Migration Bot App-Store Strategy — Internal",
        summary: "Mithun joined an internal call with Alan, Joe, and Max. On IFRS, metadata had been repatched over the weekend; Mithun was running manual QA and rebuilding playlists, with a completion report and paid onboarding package push to follow. Active pipeline: Indeed raised platform concerns ahead of a meeting the next day; Okta reduced scope by dropping embed-replacement work, leaving a simpler content migration with an updated proposal sent. The strategic thread centered on productizing the migration bot into a source-agnostic Zoom App Store app that ingests a questionnaire, generates a pre-migration discovery report, stands up infrastructure per migration, and gates users to engage OE support first as a white-glove, one-and-done app. Alan pushed for a test data set and regression suite before submission; an app is already deployed but not yet public.",
        angle: "This positions OE’s migration tooling as a productized, support-gated Zoom App Store offering that drives white-glove engagement and differentiates OE within the Zoom partnership, with Mithun owning the build, regression rigor, and go-to-market alignment.",
      },
      {
        title: "WWE/TKO Zoom Consolidation — Technical Discovery — Client",
        summary: "A formal implementation-plan review was rescheduled when Rich and Tim Quinlan were left off the invite, but Peter, Brian, McKinsey, and Mithun used the slot for productive technical discovery with Terry, Lenny, and stand-in Brandon. The plan: consolidate WWE and TKO under one Zoom portal via Okta SSO using two user groups, one for WWE and a TKO group for all other entities (UFC, PBR, etc.), with branding driven per group through SAML assertions. Okta currently sends all groups via regex; Zoom selects by response-mapping priority, so a user must never sit in both groups. Phone configurations stay intact. Because both WWE and TKO Okta environments exist and the environment will migrate to TKO Okta, identical groups must be staged in both, effectively four groups. The admin’s marching orders: create and stage those groups in both Okta environments, with a follow-up to be rescheduled including Rich, Brooke, and Tim Quinlan.",
        angle: "Turning a rescheduled call into productive SSO discovery reinforces Mithun’s value as the technical SE who keeps an enterprise merger consolidation moving even when the formal review slips.",
      },
      {
        title: "Migration Bot Monetization + Contact Center Strategy — Internal",
        summary: "Mithun and Max held a strategy screen-share on productizing the migration bot and the Zoom Contact Center. Mithun demonstrated that Zoom’s in-app framework supports free trials and direct payment natively. He clarified the bot is used internally (the OE team ingests Jira tickets and the bot executes migrations in Zoom’s environment) and proposed a GitHub MCP connector for persistent LLM context. Max enabled Zoom AI Studio; they explored knowledge bases, the virtual agent, and the workflow builder (web chat, collect input, skills-based routing, Salesforce HTTP connectors). Max set Mithun up as a Contact Center agent. The open problem: gating support access by inheriting Fresh Desk authentication, validating against Salesforce, and tracking session limits, which Mithun framed as a KYC challenge. The S3-to-S3 migration with Vijay was named the next priority.",
        angle: "This positions OE to ship the migration bot as a self-serve, in-app monetized Zoom product, leveraging OE’s premier developer support and Zoom-native integration to turn Mithun’s SE discovery flow into a repeatable, billable customer journey.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "June 3",
    meetingCount: 6,
    meetings: [
      {
        title: "Migration Standup — Final IFRS Report, JSON Scope, Vault Jump — Internal",
        summary: "Akash posted updated implementation and architecture documentation. The main thread was the final IFRS report: the team debated columns, with Mithun and Max requesting a JSON-file count column to explain why only one of two attachments migrated (Zoom does not yet support JSON attachments in video metadata), permanent-hold reason and phase columns to flag entries with no media or zero size, and a Zoom video-link column. Zoom only exposes a shareable link once a video is added to a channel, so that column was deferred. One failed entry (07U52KELC) remains under Zoom investigation; three of four other failures were handled manually. One-on-one with Akash: aligned on persistent LLM memory from Jira, a GitHub MCP connector, a four-field required questionnaire flow, and in-app monetization, with a Friday reconnect.",
        angle: "Mithun’s insistence on a JSON-file count column ensures the client report proactively explains every attachment discrepancy, removing a potential client question about missing files and reinforcing OE’s migration transparency standard.",
      },
      {
        title: "Indeed Migration Blocked by Zoom Clips Retention Gap — Client",
        summary: "On a joint call with Indeed, OE (Max, Mithun, Kara) and Zoom (Andrew) worked through a retention crisis triggered by Indeed’s legal team tightening content retention from 180 days to 30 days, already live. The core blocker: Zoom Clips has no retention exemption and no do-not-delete option, so migrating Indeed’s roughly 7,000 Kaltura videos into Clips would see them purged in 30 days. Indeed had already permanently deleted 400,000 videos and wants only keepers migrated. Their preferred ask: one-to-one migration into cloud recordings with a do-not-delete flag, linked to unpublished ZVM channels. A key reframe emerged: Indeed uses ZVM purely as a hosting library to embed videos into LMS, Huddle, and global comms — not as an internal viewing platform. Indeed also requested a full Google Drive backup. Kara scheduled a Friday call with Zoom product (Vijay); OE confirmed all content staged in S3.",
        angle: "OE’s S3 staging posture directly protected the client relationship here — being able to say the content is safe and redirectable regardless of how Zoom resolves the platform gap is what kept the engagement credible.",
      },
      {
        title: "Indeed Retention Call — Internal Debrief — Internal",
        summary: "Mithun and Max confirmed Indeed is using ZVM purely as a hosting library to embed content into other platforms, mirroring how IFRS uses the advanced CMS. Core migration work stays largely intact; the Google Drive backup request is modest added effort that should factor into pricing. Both agreed platform limitations are Zoom’s to answer, so platform questions were cleanly routed to Zoom with Kara coordinating the Friday call with Vijay. Being on these calls surfaced Indeed’s true embed-only use case that the client had never stated, sharpening scoping for the engagement.",
        angle: "OE’s presence on the client call surfaced a use-case reframe the client had never explicitly stated, which would not have emerged from email exchanges alone — the SE-on-call model directly improved delivery accuracy.",
      },
      {
        title: "Quick Logistics Sync — Internal",
        summary: "Brief sync on a low-priority Salesforce data task for the following week and confirmation of an event registration link ahead of an upcoming work trip.",
      },
      {
        title: "Earnings Practice Deep-Dive with Devin — Internal",
        summary: "Devin walked Mithun through OE’s earnings and investor-day business. Devin reported roughly $805K closed this year ($418K in Q1, $313K in Q2 to date) with very low closed-lost, and several recent Computershare European wins. He explained pricing: four-packs (about 5% off) or eight-packs (about 10% off) at roughly $2,950 per call plus add-ons including recording, international lines, rush transcription, and on-site technical directors; investor days range $10K to $100K averaging $15K to $20K but reaching $140K with full AV. The service runs from date confirmation through 24-hour post-event deliverables. ON24 skews to marketing webinars; Q4 and Notified are the main earnings-call competitors; OE’s managed service and people are the real moat. Mithun also demoed Vault Jump including its S3-to-S3 path for platforms like Okta’s Circle HD.",
        angle: "Understanding OE’s earnings and investor-day economics lets Mithun position Vault Jump and the Zoom partnership against Q4 and Notified where managed service, not the commoditized embed front end, is the deciding factor.",
      },
      {
        title: "OE Support Line + Contact Center Buildout Strategy — Internal",
        summary: "Mithun joined Alan, Max, and Tyler (Zoom) to align on the OE Support Line and Zoom Contact Center buildout ahead of a June 15 go-live. About 10 agents provisioned; Zoom-issued Mac laptops shipping around June 12–13 with an IT setup call to follow. The chat-to-video workflow already runs end to end. OE holds four trial Elite licenses valued for AI engagement briefs and quality-management analysis. Tyler will raise licensing and possible Zoom PSO implementation help with Rajul and Chris Morrissey. Alan favored proving value first with roughly five free support visits before charging. Both Mithun and Max noted AI agents can be built in AI Studio against Zoom support docs. Next step: bring the OE team in via Amelia for a launch and knowledge-alignment call.",
        angle: "This positions Mithun as the technical lead bridging OE and Zoom on a support-line buildout that drives sticky Zoom license adoption, generates OE event-management leads, and feeds product and case-deflection feedback back to Zoom.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "June 4",
    meetingCount: 2,
    meetings: [
      {
        title: "IFRS Migration Standup — Caption Bug, Manual Migration Status — Internal",
        summary: "In the Thursday standup with Max, Meet, Kiran, and Akash, a major issue surfaced: the migration report showed a large number of videos had dropped caption files. Kiran traced the root cause — an SRT-to-VTT conversion function written but never wired into the pipeline, causing SRT caption files to be silently dropped. Kiran committed to a fix within the hour; spot-checking confirmed three of four sampled videos had WebVTT captions and only the SRT-sourced one was missing. Max had a call with IFRS client Ryan scheduled for 6pm UK time. On manual migration: all error-ingestion Kaltura entries were migrated with metadata, with two exceptions where underlying files were corrupt. Four of eight manually migrated entries had tags exceeding Zoom’s character limit (the tag was the full video title), an edge case not seen across the 2,000-plus main run. Max rebuilt eight Kaltura quiz videos into Zoom by adding polls manually, noting Kaltura supports time-stamped questions at multiple video points while Zoom allows only a single poll at one timestamp. Channel assignment remained pending on Zoom’s side.",
        angle: "Being included in the Ryan evening call positioned Mithun at a critical migration quality checkpoint, reinforcing OE’s SE accountability and creating direct visibility into Zoom platform gaps that may need escalation.",
      },
      {
        title: "GCS / Zoom Sales Team Weekly — Internal",
        summary: "KC closed Paul Hastings; DocuSign is pending at approximately $25K. Peter had a positive Louis Vuitton call (two events per year, single event committed) and received a CMS inbound from a Zoom AE after months of outreach. The most significant loss: American Bankers Association, representing approximately $200K and roughly 175 webinars per year, declined due to Zoom’s lack of a native slide-upload feature that ON24 provides, with the client citing screen-sharing risk. The team formalized this as recurring product feedback for Zoom. David confirmed 10 Zoom-issued Mac laptops shipping around June 15, granting OE staff OP portal access for viewing customer account settings and licensing. Amelia is coordinating a 30-minute Zoom enablement call with Mithun and Max for the coming weeks.",
        angle: "The ABA loss on slide upload is a documented, recurring displacement blocker against ON24 that Mithun should formalize as product feedback for the Zoom rep, while the upcoming enablement call and OP access are direct tools for accelerating technical credibility in the field.",
      },
    ],
  },
  {
    day: "Friday",
    date: "June 5",
    meetingCount: 3,
    meetings: [
      {
        title: "IFRS Migration — Caption Fix Progress, Citi Hours, Corporate OAuth — Internal",
        summary: "Kiran resolved the SRT-to-VTT bug and reran the caption script, but a second issue surfaced: captions were uploading to S3 and Zoom but failing to link to the correct entity IDs due to Zoom returning 500 errors mid-run. Kiran built a polling script checking every minute for missing caption URL links; the fresh report was expected within 2.5 to 3 hours. One failed video (07U52KELC) remains with Zoom’s Bo. On Citi, Max asked for an effort estimate for sales; Akash estimated 24 to 30 hours over 3 to 4 days, and Max contributed roughly 10 hours of script writing and weekend monitoring, putting the combined total at approximately 40 hours. For Vault Jump, Max noted testing has been in the sandbox Zoom account, but Okta and Indeed target ZVM licenses in the corporate account; Akash was directed to create an OAuth app under the corporate account after completing the caption work. Mithun and Max plan to finalize the IFRS report Monday ahead of the full client call Tuesday.",
        angle: "The 40-hour Citi effort estimate gives Mithun a concrete data point on migration complexity and OE’s hands-on support model when positioning against self-service alternatives in future Zoom deals.",
      },
      {
        title: "Indeed Retention-Policy Resolution — ZVM Clips Exemption Confirmed — Internal",
        summary: "Kara, Max, and Mithun joined Vijay (Zoom ZVM PM), Andrew (Zoom video-management), and Bo (Zoom engineering) to resolve the 30-day clips deletion risk. Vijay confirmed Zoom Whiteboard already supports a “save starred” exemption from retention deletion, and since Clips shares the same architecture, the same feature is straightforward to implement. Vijay has written the engineering story targeting mid-July with intent to accelerate, and the build includes a bulk API so OE can programmatically star migrated clips on behalf of users during migration. Vijay is also scoping a second exemption for clips added to ZVM channels. On embed codes, the list-channel-videos API returns a play_link field from which OE can construct embed codes programmatically, enabling a dual-link handoff report (old Kaltura URLs and new Zoom URLs) for Indeed’s re-embedding work. Vijay will update Indeed via the shared chat channel; Andrew will be on Monday’s client call.",
        angle: "OE now has a concrete, Zoom-committed technical path to protect migrated content from premature deletion and can deliver a dual-link embed report, both directly defensible with Indeed’s legal and IT stakeholders on Monday.",
      },
      {
        title: "Kaltura Caption File Type Mismatch Investigation — Internal",
        summary: "Max, Akash, and Mithun investigated caption processing failures. Max identified that Kaltura’s API reports certain files as SRT while the actual downloaded files are already in VTT format, and hypothesized OE’s script was performing a redundant conversion on files already in VTT, producing output Zoom could not process. This mirrored the earlier corrupt video issue where Kaltura reported MP4 but the actual content was a different format. Akash confirmed approximately 1,200 SRT-flagged caption files exist in S3 and committed to auditing actual file types against Kaltura API metadata to confirm root cause before the client call.",
        angle: "Confirming this metadata-versus-actual-file mismatch as the root cause allows OE to patch the migration script defensively against Kaltura’s unreliable API responses, strengthening the reliability story for future Kaltura-to-Zoom migrations.",
      },
    ],
  },
];

export default function Week16Report() {
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
          href="/weekly_report_week16.pdf"
          download="Weekly_Report_Week16_final_1.pdf"
          style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
        >
          <span style={{ fontSize: 14 }}>&darr;</span> Download PDF
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 16</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>June 1 &ndash; 5, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "19", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "16", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 16 Analytics</strong> &nbsp;&middot;&nbsp; IFRS final mile &nbsp;&middot;&nbsp; Indeed retention crisis resolved &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Indeed &middot; Okta &middot; Vault Jump Bot &middot; Contact Center
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 16 was defined by three converging threads: closing the final mile of the IFRS Kaltura-to-Zoom migration while catching and fixing a series of late-breaking technical issues, escalating and resolving a Zoom platform gap that threatened to invalidate the entire Indeed migration, and advancing the Vault Jump migration bot toward Zoom App Store productization. A caption file bug — an SRT-to-VTT conversion function written but never wired into the pipeline — required rapid triage, and a second caption-linking failure followed before both were resolved within 24 hours. On the Indeed front, a legal-triggered 30-day clips retention policy was escalated directly to Zoom’s ZVM product manager, resulting in a committed roadmap item: a bulk API to star clips on behalf of users during migration, exempting them from deletion. The week also brought deep cross-functional education through a session with Devin on OE’s earnings and investor-day pricing model, a Contact Center strategy call with Alan and Tyler, and an end-to-end HubSpot-to-Zoom Webinar Plus setup for Energized Marketing.
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
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 17</h2>
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
