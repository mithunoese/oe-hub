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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-14";

const themes: Theme[] = [
  {
    title: "IFRS Migration: Live Execution and Edge Cases in Real Time",
    text: "Three distinct technical blockers surfaced and were resolved in sequence during live migration: the Zoom tag hub limit (revealed Friday to be 4,612 unique tags against a 1,000 ceiling), thumbnail patching timing requiring a wait-then-repatch cycle, and Zoom video processing delays affecting transcript metadata. Each was caught internally before the client saw the account. A late-breaking IFRS request to consolidate UK and US Zoom accounts was immediately escalated to Zoom commercially, with Peter confirming OE will charge for any repeated scope. The team completed Phase 1 extraction in under three days — a full week ahead of the original June 1 deadline.",
  },
  {
    title: "CMS Pipeline: ABA, Lab Roots, and Four Concurrent Opportunities",
    text: "The American Bankers Association discovery call confirmed 150 webinars per year across two programs and a clean On24 displacement narrative given Cvent’s acquisition by Blackstone. Lab Roots surfaced Thursday as a strong inbound lead: 500–600 annual webinars, 1,500 videos to migrate from WebinarNet and Chatty, paying $84K per year on current stack, with their Zoom AE not pitching migration. Together with Indeed at contract stage, Okta onboarding complete, and the Workato integration partnership executed, Week 14 established the clearest multi-opportunity CMS pipeline view to date.",
  },
  {
    title: "Zoom Support Line: From 6-Month Plan to 90-Day Launch",
    text: "Alan’s Friday session collapsed the support line timeline from a speculative six-month build to a 90-day active deployment. Core decisions: launch using the existing Passport website registration flow immediately without waiting for Zoom Contact Center, build a branded AE one-pager Mithun owns, have Max simplify the business plan to the 90-day arc, and schedule a call with Tyler at Zoom presenting four specific asks — free Contact Center for a year, OP access on existing laptops, a formal escalation path, and AE distribution materials. The support line is now a live project with deliverables assigned.",
  },
  {
    title: "Internal Infrastructure: Workato, ZVM Architecture, and the AI Agent Foundation",
    text: "The Workato referral agreement was negotiated across three sessions and sent to Workato for execution, establishing OE’s first formal integration middleware partnership at the Silver referral tier (10%). Max documented the ZVM API architecture differences from the IFRS Hub model — clip-first upload with per-video and per-channel ownership — to prepare for the next migration client. Alan formally assigned Mithun and Brian Copping to work with Alex Duncan on extending the Level 1 support agent with delivery-side Teams channel data, and both will shadow live events through Annalisa’s scheduling to build operational depth.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Tag Resolution and Metadata Repatch",
    text: "Max to get Zoom’s position on the 4,612 unique tag ceiling — raise the hub limit or agree on a per-video cap with IFRS. Once resolved, run the full metadata repatch early in the week after Zoom finishes processing all uploaded videos. Owner: Max, Akash.",
  },
  {
    title: "IFRS Account Consolidation — Commercial Path",
    text: "Peter to email Chris Milne and Stefan to establish whether IFRS will defer the UK/US account consolidation. If remigration is required, price it at the original engagement rate with a minor discount. Route through Zoom first, not IFRS directly. Owner: Peter, Mithun.",
  },
  {
    title: "ABA Pricing Package and POC Rehearsal",
    text: "Kristen to deliver pricing across one-off, multi-pack, and full-prepay structures for 150 events per year and coordinate a proof-of-concept rehearsal event to advance the ABA engagement to contract. Owner: Kristen.",
  },
  {
    title: "Lab Roots Discovery Call — Tuesday",
    text: "Kara and Mithun to join the Lab Roots call. Mithun to assess WebinarNet extraction feasibility and scope the 1,500-video migration. Confirm whether Zoom AE Tyler Copeland will support the engagement or whether OE needs to self-source. Owner: Kara, Mithun.",
  },
  {
    title: "Zoom Support Line One-Pager and Tyler Call",
    text: "Mithun to build the AE-facing one-pager with the Passport registration link. Max to update the business plan to a 90-day timeline removing the phased roadmap section. Schedule the Tyler call with Amelia and Alan this week. Owner: Mithun, Max.",
  },
  {
    title: "ZVM Internal Testing and Brian Copping Onboarding",
    text: "Max to write ZVM test tickets for Akash and Kiran to begin Zoom Video Management API exploration using the demo Kaltura account as source. Mithun and Max to run the Brian Copping delivery orientation session and connect with Alex Duncan on LLM hydration. Owner: Max, Mithun.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "May 18",
    meetingCount: 4,
    meetings: [
      {
        title: "IFRS Kaltura Migration — Engineering Kickoff",
        summary: "The IFRS dev team (Agash, Kiran) walked Mithun and Max through the finalized two-phase migration plan ahead of Tuesday’s start. Phase 1 pulls all Kaltura content and metadata into OE’s S3 bucket; Phase 2 pushes from S3 to Zoom. The team decided to keep the existing staging infrastructure and agreed to run a metadata patch on all dry-run videos before the main migration begins, correcting thumbnails and category mappings updated since the dry run. Mithun requested that the final migration report include both the original Kaltura URL and the new Zoom URL per asset.",
        angle: "Pre-migration metadata patch ensures IFRS’s Zoom account is clean at go-live, so the client’s first view of the full library reflects corrected categories and working thumbnails.",
      },
      {
        title: "OE Monday All-Hands — Weekly Sales Kickoff",
        summary: "Andrew opened by welcoming Lorna, a new hire who spent 25 years at Credit Suisse on the sell side and IR and joins OE from Switzerland. Last week’s KPIs were the strongest on record: 52 meetings booked against a goal of 40, 38 opportunities created for $444K, and 19 closed. Standout developments included B of A’s Project Apex — described as the largest IPO in history, targeting retail financial advisors at scale with a June 3 go-live — and a Wells Fargo institutional investor campaign kicking off May 26. Kristen surfaced a 100K-plus ABA opportunity as a potential On24 takeaway. Mithun gave a brief update noting IFRS migration is officially launching this week.",
        angle: "Mithun’s public callout of the IFRS migration start in front of the full sales team plants a live reference story for CMS migration and reinforces delivery credibility at a high-visibility moment.",
      },
      {
        title: "Technical Candidate Interview — Observer",
        summary: "Mithun was present on a technical coding interview session, likely as an observer. The interviewer walked a candidate through a browser-based coding environment. Only the introduction of the session is captured in the transcript.",
        angle: "Participation in technical hiring reflects OE’s growing engineering depth requirements as the platform’s integration and migration business scales.",
      },
      {
        title: "Citi Veracast Media Extraction Review",
        summary: "Mithun joined Andrew and a delivery team member to review progress on extracting Citi Velocity’s historical media archive from Veracast. Title-plus-date and speaker-plus-date cross-referencing yielded only partial matches across 144 events due to inconsistent naming. Very old events had S3 archive paths for potential recovery; the rest either exist in the current media project folder or are lost. The team resolved to deliver all available media without manual filtering and let Citi perform their own deduplication. SFTP delivery planned before Andrew’s leave the following week.",
        angle: "Delivering the full set rather than filtering protects OE from liability over missed content and moves the project to client-side review before the end-of-month handoff deadline.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "May 19",
    meetingCount: 4,
    meetings: [
      {
        title: "IFRS Kaltura Migration — Day 1 Status Update",
        summary: "The engineering team reported approximately 300 entities successfully extracted from Kaltura to OE’s S3 staging bucket after starting at 4am with batches of 100, 200, then 400. Roughly 90 entries were placed in permanent hold due to missing media flavors. Max confirmed approximately 816 live-stream-only entries in the IFRS account, explaining the high hold volume. Target: finish extracting all 2,700 entities to S3 by Wednesday, begin the S3-to-Zoom phase Thursday. Akash moved ZCM-40 to in-progress. Separately, the Citi Veracast F4V audio files were discussed: approximately 450 webcast events need conversion to MP3 and SFTP delivery to Citi by June 1.",
        angle: "Day 1 completing cleanly with 300 entities in staging confirms the two-phase pipeline is production-ready; the permanent hold logic prevents IFRS from receiving empty live-stream records at go-live.",
      },
      {
        title: "American Bankers Association Discovery Call",
        summary: "OE presented to ABA’s webinar leadership team: Lauren St. Pierre and Kristen Shoop running 50 professional development webinars per year (up to 600 attendees), and Mark managing 80–100 complementary webinars per year (up to 1,000 registrants). ABA currently runs all events on On24 across both programs. The conversation focused on three concerns: content management without On24’s storyboard upload workflow, the multi-window complexity of Zoom production studio versus a single-pane producer view, and consistent dedicated team assignment across 150-plus events per year. OE addressed each point with Production Studio, a two-operator delivery model, and a named project manager with a client profile. Andrew positioned OE’s managed-services DNA as a structural advantage and noted On24’s acquisition by Cvent and Blackstone as a service degradation risk.",
        angle: "ABA represents the archetypal On24 displacement opportunity: 150 events per year with a production-first culture, a platform mid-acquisition, and a client team already describing degraded service.",
      },
      {
        title: "Annalisa Sync — Brian Copping Onboarding",
        summary: "Annalisa briefed Mithun on Brian Copping rejoining OE — a former employee from 2021–22 who understood the platform during the high-growth era and is returning to provide US-hours delivery coverage. The conversation also touched on the challenge of finding staffing tooling that scales to OE’s operating complexity. Mithun noted several areas where deeper system access would let him build tools more quickly, citing the Teams AI agent and S3 access as examples.",
        angle: "Brian’s onboarding creates a new SE training partnership; the access conversation surfaced a legitimate internal opportunity worth raising to Alan.",
      },
      {
        title: "Andrew — Claude Code Artifact Export (Informal)",
        summary: "Andrew pulled Mithun into a brief informal session after using Claude to generate a list of ViAvid and GlobalMeet direct customers for BDR prospecting. He needed to make the HTML artifact shareable with Sean without requiring a Claude subscription. Mithun walked him through downloading the file locally, previewing it in the browser, and converting it to a PDF with clickable links via Claude Code.",
        angle: "Mithun’s Claude Code fluency is now being pulled on directly by sales leadership for competitive prospecting workflows, quietly reinforcing the SE-as-AI-practitioner positioning.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "May 20",
    meetingCount: 1,
    meetings: [
      {
        title: "IFRS Migration Phase 2 Standup — Zoom Tag Limit Hit",
        summary: "Moving into the S3-to-Zoom phase, the team immediately hit a blocker: Zoom’s content hub enforces a limit on unique tags and 35 entities failed with a tag-related error. Akash ran a Claude-assisted audit and confirmed 633 unique tags across the IFRS library — only 133 above Zoom’s current 999-tag hub limit. Max confirmed Zoom’s June release will raise the limit but the fix won’t land this week. The team aligned on the workaround: drop tags entirely for the current migration pass, load all other metadata cleanly, and patch tags back after the June Zoom release. Max will review the already-migrated content in the IFRS hub and give the go-ahead in the group chat for the team to resume the following morning without tags.",
        angle: "Identifying the tag limit early — and immediately quantifying the 633 unique tag scope — allowed the team to make a clear proceed-without-tags decision the same day rather than stalling the migration waiting on Zoom’s roadmap.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "May 21",
    meetingCount: 7,
    meetings: [
      {
        title: "IFRS Migration Day 3 Standup",
        summary: "Phase 2 resumed without tags per Wednesday’s decision. Zoom confirmed the same day that the tag limit had been bumped to 1,000. Thumbnail validation was confirmed via API GET calls returning exact counts matching what was pushed. Citi MP3 conversion running in parallel: approximately 450 webcast events identified in S3, some already converted, full conversion expected by Friday. Max to review migrated content in the IFRS Zoom hub and give the go-ahead in the group chat before the next batch proceeds.",
        angle: "Zoom’s same-day tag limit fix confirms the escalation channel to Zoom engineering is functioning; having 633 tags already documented means the repatch pass will be fast once the main upload clears.",
      },
      {
        title: "OE Salesforce Monthly Review — Internal",
        summary: "Ali ran the monthly Salesforce check-in. Key updates: the delivery/billing status split completes in two weeks, after which the main status bar becomes delivery-only. Ali asked all AEs to verify their names appear correctly as business leads on child orders to ensure commission mapping works. Camus requested a report of orders where non-sales staff appear as business leads. Jacob proposed an account-level earnings provider field to enable competitive tracking — Ali confirmed it is an admin-level change she can implement. Email domain matching was proposed as a more reliable duplicate account prevention method than fuzzy name matching. Dashboard migration from opportunity-based to order-based reporting committed before Q2 close.",
        angle: "The account-level earnings provider field, if implemented, gives the full sales team a competitive intelligence layer that feeds directly into the earnings automation product concept Mithun and Casey have been developing.",
      },
      {
        title: "OE PM/Delivery Weekly Standup — Kara",
        summary: "Kara ran the Thursday delivery standup. David flagged Eastern Star Church as a live risk: a client on a 1-2K attendee license expecting 7,000 registrants, with a plan to present options and set clear boundaries on scope. Kristen updated on ABA: pricing being built across one-off, multi-pack, and full-prepay structures; a proof-of-concept rehearsal event is required before ABA commits. Mithun gave the first public IFRS migration update: all roughly 2,800 files are out of Kaltura and in S3, partial upload to Zoom underway. A significant new CMS opportunity surfaced through Kara — Lab Roots, which runs 500–600 webinars per year on WebinarNet and Chatty, has 1,500 videos to migrate, and pays $84K per year. The Zoom AE had told them not to migrate their content, making this a clear OE opportunity. Camden reported first cold calls and identified Zoom office hours attendees as warm prospects.",
        angle: "Lab Roots is the strongest new CMS migration lead of the week: 500–600 events per year, 1,500 videos, $84K current spend, and a Zoom AE actively not pitching migration — exactly the gap OE fills.",
      },
      {
        title: "Max and Mithun — Workato Redlines and ZVM Architecture",
        summary: "Max and Mithun worked through Jamie’s Workato contract redlines before bringing the document to Alan: accepted the pre-sales use language edit, reverted OE’s two contested additions (post-termination referral protection, “no activity” definition) back to Workato’s original language. The session also covered ZVM API architecture planning for the next migration after IFRS. Unlike the current IFRS Zoom Hub model, ZVM requires creating clips first, then assigning them to channels with per-video and per-channel ownership — a multi-step flow. Max proposed a dry-run test using the demo Kaltura account to get familiar with ZVM endpoints before the next live client migration.",
        angle: "Mapping ZVM API differences now — while the IFRS team has bandwidth — means OE enters the next migration without architectural unknowns, removing the discovery delay that slowed IFRS’s early weeks.",
      },
      {
        title: "Mithun 1:1 Check-in — Andrew",
        summary: "Andrew asked Mithun what he enjoys most, wants more of, and least enjoys. Mithun expressed genuine enthusiasm for the sales culture and team energy. He surfaced two areas to develop: deeper access into internal systems to build tools more quickly, and stronger cross-functional knowledge sharing. He named the Teams AI sales agent as an example of something he could build with the right access. Andrew validated the observations and offered to raise the topic with Alan and Amelia.",
        angle: "The access and knowledge-sharing themes Mithun raised with Annalisa earlier in the week are now on Andrew’s radar as well — two independent conversations surfacing the same opportunity creates a stronger case for addressing it at the leadership level.",
      },
      {
        title: "Workato Contract Final Review — Mithun and Alan",
        summary: "Mithun briefed Alan on the final state of the Workato referral agreement after working through Jamie’s redlines with Max. He walked through three material changes: accepted the pre-sales use language (OE can use the platform for demonstrations and pre-sales activities to prospects), reverted OE’s two contested additions back to Workato’s original language, and confirmed the remaining clauses were clean. Alan reviewed the tracked changes on screen and gave approval to send the final document back to Workato for execution as a referral-only partner.",
        angle: "Alan’s sign-off closes the Workato referral partnership — OE can now formally recommend Workato as the middleware layer for marketing integrations and begin earning referral commissions at the Silver tier.",
      },
      {
        title: "Alan, Max, and Mithun — Strategic Session",
        summary: "Three workstreams covered in one extended session. Workato contract: closed, approved for execution. LLM hydration: Alan tasked Mithun and Brian Copping to work with Alex Duncan on extending the existing Level 1 support agent — already strong on engineering knowledge — with delivery-side data including PM chat logs, event run-of-show documents, and client preferences stored in Teams channels. Brian will also shadow live events via Annalisa’s delivery scheduling. Zoom Support Line business plan: Max walked Alan through the full document. Alan’s feedback: rename “video specialist” to “certified Zoom platform expert,” lead with the free 30–90 day/5-visit tier before transitioning to subscription pricing, compress the launch timeline from 6 months to 60–90 days, and produce a one-pager for Zoom AE use.",
        angle: "Alan’s endorsement of the support line with a 60–90 day target puts Mithun in position as technical co-architect alongside Max, and the IFRS migration experience creates direct credibility for the Zoom-facing pitch to Tyler and the partner team.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 22",
    meetingCount: 5,
    meetings: [
      {
        title: "IFRS Migration Day 4 — Final Standup",
        summary: "Major correction surfaced: the 633 unique tag count reported Wednesday was calculated from only 100 entities. The actual count across all 1,942 entities is 4,612 — well above Zoom’s 1,000-tag hub limit. Max confirmed he is escalating to Zoom. Citi: approximately 80 videos remain to convert to MP3, all content is in OE’s US East 1 S3 bucket, and the team is waiting on Citi’s SFTP destination credentials. Metadata repatch postponed until early next week to give Zoom time to finish processing all uploaded videos. Max outlined that once IFRS wraps, the team will shift to internal ZVM testing using the demo Kaltura account to prepare for the next migration client.",
        angle: "Discovering the 4,612 true tag count before the client sees the account gives OE time to escalate cleanly to Zoom and propose a path forward rather than hitting the limit mid-delivery in front of IFRS.",
      },
      {
        title: "IFRS and Zoom Strategic Sync — Chris Milne Introduction",
        summary: "Max and Mithun met Chris Milne, Zoom’s new EMEA and rest-of-world video specialist, who joined three weeks prior. Chris surfaced a new complication: IFRS wants to consolidate their separate UK and US Zoom accounts for SSO functionality, which would potentially require remigrating all content to a new account. Max clarified the remigration impact: approximately five days to rerun the import from OE’s S3 staging. Mithun flagged the conflict with IFRS’s own UK data residency requirement. Chris committed to pushing IFRS to defer the consolidation until after migration. The 4,612-tag issue was escalated to Fan and Zoom engineering. The agenda slide resource attachments were explained as a best-effort workaround. A bi-weekly check-in between Max, Mithun, Chris, and Andrew was proposed.",
        angle: "Chris’s involvement — three weeks in, commercially motivated to make IFRS a reference account — gives OE an escalation path into Zoom that cuts through the normal partner channel and creates a named Zoom sponsor for both the migration and the future support line partnership.",
      },
      {
        title: "Max and Mithun — Post-Call Debrief",
        summary: "Max confirmed the only viable near-term path is to propose a tag cap to IFRS (for instance, migrating only the top 10–15 tags per video) and build a pre-migration tag audit into the standard scoping process for all future clients. Max confirmed he will handle the Brian Copping onboarding orientation with Mithun joining as co-trainer.",
        angle: "Institutionalizing a pre-migration metadata audit (tag count, category count, per-video limits) as a standard scoping step would prevent the tag ceiling issue from surfacing mid-delivery on future migrations at any scale.",
      },
      {
        title: "IFRS Remigration Commercial Discussion — Mithun and Peter",
        summary: "Mithun briefed Peter on the IFRS account consolidation scenario and whether OE should charge for a potential second migration. Peter was unambiguous: the scope change warrants a charge, framed at roughly the same rate as the initial engagement with a potential minor discount given the discovery work is already complete. Peter’s proposed approach — bring it to Zoom first rather than IFRS directly, and let Zoom decide whether to absorb the cost or pass it to IFRS — was aligned with what Max and Mithun had discussed with Chris. Peter offered to email Chris Milne and Stefan before the US holiday weekend. Mithun also mentioned a Spanish-language LATAM customer inquiry involving API integrations to discuss with Kara separately.",
        angle: "Routing the commercial conversation through Zoom rather than IFRS directly protects the client relationship and positions OE as the professional party in the triangle — the right framing for a client that is supposed to become a reference account.",
      },
      {
        title: "Zoom Support Line Launch Planning — Alan, Amelia, Max, Mithun",
        summary: "Alan convened an urgent session to move the support line from planning to execution. He outlined four things OE needs from Zoom: Contact Center free for one year, OP access on current laptops, a defined escalation path back into Zoom support for L2 and L3 issues, and a review of a one-pager AEs can send clients to access the support line immediately. The group agreed to launch now using the existing Passport website registration flow and backfill Contact Center once it is stood up. Mithun was tasked with building the one-pager for AEs; Max was asked to revise the business plan to remove the phased roadmap section and compress to a 90-day rollout timeline. A call with Tyler at Zoom was proposed for next week to present all four asks together.",
        angle: "Alan’s decision to launch without Contact Center removes the dependency that had been the primary blocker — the 90-day timeline with a live registration link means OE can begin generating Zoom AE referrals before the end of Q2.",
      },
    ],
  },
];

export default function Week14Report() {
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
          href="/api/report-pdf/week-14"
          download="Weekly_Report_Week14_final_1.pdf"
          style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
        >
          <span style={{ fontSize: 14 }}>&darr;</span> Download PDF
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 14</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>May 18 &ndash; 22, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "21", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "14", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 14 Analytics</strong> &nbsp;&middot;&nbsp; IFRS migration live and complete &nbsp;&middot;&nbsp; 5 CMS opportunities active &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; ABA &middot; Lab Roots &middot; Indeed &middot; Okta &middot; Zoom Support Line
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 14 was defined by the IFRS Kaltura migration executing live and clearing every major technical blocker in real time. The engineering team extracted roughly 2,800 files — nearly two terabytes of video content — from Kaltura to OE’s S3 staging bucket in under three days, a full week ahead of the original June 1 extraction deadline, with the S3-to-Zoom upload phase substantially complete by Friday. On the commercial side, the American Bankers Association emerged as the largest new opportunity of the week — 150 events per year, currently on On24 — while Lab Roots surfaced as a strong organic CMS migration lead with 500–600 annual webinars and 1,500 videos sitting on WebinarNet. The Workato referral partnership was formally executed, and Alan fast-tracked the Zoom Support Line from a six-month plan to a 90-day active launch with clear deliverables assigned to Mithun and Max.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 15</h2>
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
