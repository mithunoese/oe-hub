"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Comment { id: string; author: string; text: string; timestamp: string; }
interface Theme { title: string; text: string; }
interface LookAhead { title: string; text: string; }
interface Meeting { title: string; summary: string; angle?: string; }
interface DayData { day: string; date: string; meetingCount: number; meetings: Meeting[]; }

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-19";

const themes: Theme[] = [
  {
    title: "Pricing Became the Partnership's Pressure Point",
    text: "The week's central tension was Zoom EMEA's demand for fast migration quotes versus OE's need for discovery-based, scope-accurate pricing. A new Zoom UK rep, Chris, pushed for instant numbers on two opportunities (a 40TB big pharma Kaltura migration and a 30TB Panopto education customer) and floated Zoom potentially absorbing migration costs. Rather than cede control, Mithun built a working pricing calculator in under 25 minutes that produces fast, heavily-caveated estimates while keeping OE in the loop, turning a partner friction point into a reusable commercial asset. Leadership aligned to escalate the underlying engagement-model questions (who pays, partner exclusivity) to Zoom's senior leaders, Stefan and Rajul.",
  },
  {
    title: "The Support Line Crossed From Build to Launch-Ready",
    text: "After weeks of Salesforce authentication blockers, the team cracked the OAuth client-credentials flow mid-week, discovering the consumer key and secret had been entered in reversed fields. Mithun then published version 4 of the Contact Center flow with live customer lookup, and Max demoed the full agent and supervisor experience to both Zoom and OE's own delivery org. With operator-panel access permanently off the table for partners, the pilot will run as a normal-client model, targeting a July 1 soft launch with senior PMs as agents.",
  },
  {
    title: "IFRS Closed, Indeed Opened, and the Playbook Compounded",
    text: "IFRS reached final delivery with the tags repatch, JSON reference files, Citi read-only S3 access, and a $9,500 reconciliation price all closed out. Indeed's CMS migration moved into signature at roughly $19-20K as OE's first repeatable migration deal. The team made a disciplined call to keep near-term migrations on the proven export/import flow rather than the not-yet-security-cleared migration bot, with InfoSec and architecture review (led by Joe) gating the bot's path to production by end of July.",
  },
  {
    title: "Mithun's Role Expanded Beyond Delivery",
    text: "Beyond the CMS mandate, the week saw Mithun shipping pre-sales tooling (the pricing calculator and ZoomInfo MCP enrichment), running two SE candidate interviews and helping sharpen the hiring filter with Joe and Chiwei, and aligning with engineering leadership on hosting strategy and his future role across OE's core products (Central, Passport, OEI). Chiwei, newly director of engineering, framed Mithun's AI-native build-and-ship workflow as a model for the broader engineering department and set up a recurring check-in.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Support Line Soft Launch — Max / Mithun",
    text: "Launch the support line on July 1 and join the Zest team weekly call Tuesday to distribute the link and walk Zoom AEs through the referral process. Steve to provision roughly 15 Contact Center licenses plus a Zoom Virtual Agent pilot for knowledge-base scraping and intelligent handoff.",
  },
  {
    title: "Pricing Calculator Finalization — Mithun",
    text: "Document the underlying cost logic, fix the free-text complexity bug, add the video-format question, swap the IFRS sample report for an anonymized mock, and walk Emilia through it for sign-off before broader sharing with Chris and the Zoom team.",
  },
  {
    title: "Engagement-Model Escalation — Andrew / Emilia",
    text: "Reach Stefan, and then Tyler once he is back Monday, to align Zoom's EMEA and US leadership on who pays for migrations and on OE's partner exclusivity, and follow up on the message sent to Rajul and Tyler about Chris's pricing pushback.",
  },
  {
    title: "Indeed Migration Kickoff — Mithun / Max",
    text: "With the contract signing, start the recurring delivery series and prioritize the ZVM endpoint tickets (CCM-180/181: Kaltura user-ownership extraction, channel creation, access control, and player settings) on the proven export/import flow.",
  },
  {
    title: "Migration Bot and Security Path — Mithun / Akash / Joe",
    text: "Continue ZVM endpoint testing on the OE test account, complete the third-party pen test of the S3 infrastructure, and target end of July to assemble the architecture and InfoSec documentation toward bot productization, bringing in Will for the Zoom security qualification.",
  },
];

const days: DayData[] = [
  {
    day: "Monday", date: "June 22", meetingCount: 5,
    meetings: [
      {
        title: "IFRS Migration Close-Out and Citi S3 Access — Internal",
        summary: "Akash confirmed the IFRS migration report was generated for review and that the Zoom hub now supports 10,000 tags, clearing the way for the tags metadata repatch. The team aligned on uploading the ~1,400 reference JSON files as a single compressed folder rather than individually, pending a check that each filename carries the Kaltura entry ID. Citi reversed course on SFTP and now wants read-only S3 access to fetch the files via a script, which Akash is scoping as IAM read-only permissions. Max floated having Claude auto-validate report metadata counts on future migrations to replace manual cross-checking.",
        angle: "OE's first end-to-end Kaltura-to-Zoom engagement reached final delivery, and the Claude-based report-validation idea positions Mithun's tooling as a repeatable QA layer across migrations.",
      },
      {
        title: "New Migration Pricing: Big Pharma and Panopto — with Peter (EMEA)",
        summary: "Mithun briefed Peter on two new CMS opportunities sourced by Chris at Zoom: a Big Pharma Kaltura-to-Zoom migration at ~40TB with a GDPR/EU-residency requirement, and a ~30TB Panopto education customer. He walked Peter through scope-based pricing and the Indeed and Okta proposal templates, emphasized that migration timing is no longer a constraint, and recommended Peter consult Kara on the sales motion and lead with higher pricing.",
        angle: "These are the first OE-originated EMEA CMS migration deals flowing through Mithun's pricing framework, scaling the playbook he built into a second region.",
      },
      {
        title: "OE Weekly Sales Pipeline Call — Q4 Close Push",
        summary: "The full revenue team reviewed Q4 standing near $10M against a $10.875M target with eight days to close, working NIRI follow-ups (Papa John's via OEMeet, Cumulus, Chevron, OneSpan) and the around-the-horn pipeline across the AE and institutional teams, including Indeed, Atlassian, HubSpot, and a B of A Faircast extension.",
        angle: "Mithun's migration deals sit adjacent to this earnings and events revenue engine, and the team's Zoom-client overlap surfaces warm CMS-displacement targets.",
      },
      {
        title: "ZCC Salesforce Integration Troubleshooting — with Max",
        summary: "Mithun and Max worked the persistent Salesforce authentication blocker stalling the support-line Contact Center lookup. Mithun pivoted to creating a new Salesforce External Client App with OAuth and client-credentials flow, which looked correct but still needed a run-as service-account user. They confirmed the virtual agent is missing required CVA SKUs and flagged that the Vercel-hosted demo will need a durable hosting and storage plan (AWS over the default storage).",
        angle: "Mithun is hands-on building the Salesforce-to-Zoom Contact Center integration that underpins OE's new support-line product, demonstrating OE's technical depth to Zoom.",
      },
      {
        title: "Support Line Kickoff and Demo Review — with Alan, Emilia, Max, Annalisa",
        summary: "Zoom has revoked operator-panel access org-wide except for engineering, so OE will run the support line as a normal client during a one-month pilot targeting a July 1 soft launch ahead of the Zest call on the 30th. Staffing will use senior PMs marking themselves ready, with Max and David as supervisors. Alan pushed to rework the demo into a marketing and expectation-setting page and to define a differentiated experience for paying support-line customers versus first-time callers.",
        angle: "Mithun is the technical owner of the customer-facing layer for a Zoom-sponsored support service that directly offloads work from Zoom's own support teams.",
      },
    ],
  },
  {
    day: "Tuesday", date: "June 23", meetingCount: 5,
    meetings: [
      {
        title: "Salesforce OAuth Credentials Working Session — with Nilesh",
        summary: "Mithun worked through the Salesforce authentication blocker with Nilesh, scoping V1 to a basic account lookup that checks whether an inbound caller is known and routes accordingly. Nilesh walked him through enabling the OAuth-flows checkbox, setting the run-as user, and generating the consumer key and secret, and recommended a middleware connector pattern, citing OE's Power BI integration as precedent.",
        angle: "Mithun is personally engineering the Salesforce-to-Zoom lookup that powers customer recognition for the support line, the kind of cross-platform integration that proves OE's value to Zoom.",
      },
      {
        title: "CMS Pricing Strategy Pre-Call — Internal (Cara, Peter, Joshua)",
        summary: "Ahead of a live sync with Chris, the team aligned on handling Zoom's push for instant quotes and met Joshua, a new North America AE. They agreed Chris's expectation of pricing two large deals off a secondhand brief was unworkable, and resolved to offer a discount per project while firmly setting the expectation that a discovery call with the customer is non-negotiable for accurate pricing.",
        angle: "Mithun is coaching OE's EMEA and new NA sellers on the migration go-to-market motion he built, scaling his playbook across the partnership while protecting OE from underpriced deals.",
      },
      {
        title: "CMS Migration Pricing and Go-To-Market Alignment — with Chris (Zoom)",
        summary: "Cara, Mithun, and Peter pressed Chris on process, explaining OE's discovery-call requirement after Chris flagged the preliminary quotes were too high. Chris laid out Zoom's strategy to make migration a non-issue by getting to value in the first customer meeting and revealed Zoom is exploring absorbing migration costs to capture share, with leadership presenting the model the following week. The group agreed Mithun would build a pricing calculator for fast preliminary estimates, while Chris acknowledged the big pharma deal had likely gone cold during the pricing delay.",
        angle: "This call defined the commercial model for the entire Zoom CMS-migration partnership, with Mithun positioned to own the calculator that becomes the front door to every future migration deal.",
      },
      {
        title: "IFRS Close-Out and Citi Access Standup — Internal (Akash, Max)",
        summary: "Akash confirmed Citi S3 access would be granted shortly, the JSON files carry the Kaltura entity ID and can be compressed under the 15MB limit, and the tags repatch is pending one more report. He has fetched Kaltura files into the Zoom bot and will test a small file into ZVM, and Mithun pushed to feed the bot context from the Jira tickets, proposing an end-of-July deadline before bringing in Will for the Zoom security qualification.",
        angle: "Mithun is driving the migration bot from prototype toward a security-reviewed, productizable Zoom App, with Jira-as-context a reusable QA pattern that strengthens OE's delivery reliability.",
      },
      {
        title: "Chris Debrief, Pricing Tool and Support-Line UI — with Max",
        summary: "Mithun debriefed Max on the Chris call and they agreed the pricing calculator should be paired with a small set of cost-driving trigger questions so estimates are not built on nothing. They finalized Citi's reconciliation pricing at $9,500 (roughly 30 hours at the standard rate) and confirmed Citi gets temporary S3 access before revocation. Mithun also agreed to generate redesigned support-line landing-page variations.",
        angle: "Mithun is converting partner friction into durable OE assets, a reusable pricing calculator and a polished support-line UI, both institutionalizing OE's value rather than relying on one-off effort.",
      },
    ],
  },
  {
    day: "Wednesday", date: "June 24", meetingCount: 8,
    meetings: [
      {
        title: "CMS Partnership Escalation Strategy — Internal",
        summary: "The team regrouped on the Chris situation, agreeing the core issue is misaligned expectations between Zoom's EMEA and US sides on who pays for migrations and partner exclusivity. The recommendation was to have Andrew reach Stefan to level-set before pulling Tyler in the following Monday, and to reinforce that OE's pricing is scope-based, not a fixed fraction of the Zoom license value.",
        angle: "Mithun is helping steer the commercial governance of OE's flagship Zoom partnership, keeping the migration model profitable and OE-controlled rather than commoditized.",
      },
      {
        title: "Salesforce OAuth Resolution — with Nilesh and Max",
        summary: "The team finally cracked the Salesforce authentication blocker after discovering the consumer key and secret had been entered in reversed fields. Once corrected, the token call succeeded, and Nilesh advised dropping the legacy username/password approach and tightening the refresh-token window for production.",
        angle: "Resolving this unblocks the Salesforce-to-Zoom customer lookup at the heart of the support line, a concrete proof of OE's ability to wire Zoom Contact Center into enterprise CRM.",
      },
      {
        title: "Associate Solution Engineer Interview — Candidate Screen",
        summary: "Mithun interviewed a candidate for the Associate Solution Engineer role, probing beyond technical depth to assess the more important competency for the role: translating customer requirements into solutions and communicating them back in a digestible way, and noting the interview process should focus more on customer-facing fluency.",
        angle: "Building out the SE bench directly expands OE's capacity to run the pre-sales and technical-translation work Mithun currently shoulders across the Zoom partnership.",
      },
      {
        title: "CMS Pricing Calculator Demo — with Chris (Zoom) and Peter",
        summary: "The follow-up with Chris went markedly better. Mithun demoed the pricing calculator he built in 24 minutes, which walks through the discovery questionnaire using AI to produce a preliminary, heavily-caveated quote, and Chris called it exactly what they needed. Chris affirmed OE is the preferred partner given proximity to customers, and Mithun showed the customer-facing assets while asking Chris to hold off sharing the tool until OE signs off.",
        angle: "Mithun converted partner friction into a tangible tool that collapses Zoom's quoting bottleneck, cementing OE as the go-to migration partner.",
      },
      {
        title: "Associate Solution Engineer Interview — Second Candidate Screen",
        summary: "Mithun ran a second SE candidate interview, again steering toward whether the candidate could operate in ambiguous, fast-moving client situations, and explaining the role's position as the connective tissue between sales, product, and engineering, with concrete internal AI use cases.",
        angle: "Each SE hire multiplies OE's ability to staff technical pre-sales and internal automation, the leverage OE needs to scale the Zoom migration and support-line products.",
      },
      {
        title: "Contact Center V4 Flow Review — with Max",
        summary: "Mithun and Max reviewed and published version 4 of the support-line Contact Center flow, walking through the token fetch, Salesforce record lookup, known-customer branch, operating-hours check, and routing. Testing surfaced an invalid-auth-header error on the record-lookup call, which Mithun took away to debug, and they aligned on the no-match path creating a Salesforce lead.",
        angle: "This is the live, customer-facing engine of the July 1 launch, with Mithun owning the build end to end inside Zoom's Contact Center.",
      },
      {
        title: "ZoomInfo Enrichment and Marketing Sync — with Michael",
        summary: "Mithun worked with Michael to enrich a contact list using the ZoomInfo MCP rather than guessing emails, confirming credit limits and getting the integration working in Claude Code. They also agreed to revisit the long-deferred SEO project.",
        angle: "Wiring ZoomInfo directly into Mithun's AI tooling makes OE's prospecting and enrichment faster and reusable, compounding across the sales team's outreach.",
      },
      {
        title: "Pricing Calculator Build Session — with Max",
        summary: "Mithun and Max ran a detailed session through the discovery questionnaire to identify cost drivers, mapping the internal cost basis against margin targets and deciding to bucket drivers into broad categories rather than exposing line-item pricing. Max demonstrated hosting the support-line page in Freshdesk as a no-added-cost option, and they sketched the no-match Salesforce lead flow. Eric Costello accepted a full-time SE offer starting in August.",
        angle: "This session turned OE's ad-hoc pricing knowledge into a structured, reusable calculator and clarified the support-line CRM data flow, institutionalizing OE's value.",
      },
    ],
  },
  {
    day: "Thursday", date: "June 25", meetingCount: 4,
    meetings: [
      {
        title: "IFRS Close-Out, Migration Bot and Pen-Test Setup — Internal",
        summary: "Akash confirmed the IFRS JSON reference files are ready to chunk and share, and hit a snag where a test transfer triggered a full metadata re-scan, prompting a switch to the internal OE test account. Joe directed that before the bot can touch customer data it must pass an updated architecture and InfoSec review, so the team agreed to keep the upcoming Indeed migration on the traditional export/import flow and set up the third-party pen test against the internal S3 bucket with listing disabled.",
        angle: "Mithun is steering the bot toward a security-cleared state while keeping near-term client delivery on the proven flow, balancing innovation against the InfoSec rigor that protects OE's data story.",
      },
      {
        title: "Support-Line Licenses and POC Planning — with Steve and Jamie (Zoom)",
        summary: "Max and Mithun aligned with Zoom on extending and adding Contact Center licenses for the July 1 pilot (~10-11 senior PMs as agents plus supervisors), defined simple POC success criteria, and discussed OE becoming Zoom's level-one support for Webinar Plus and Events. Jamie clarified the Zoom Virtual Agent (a consumption SKU with a $0 order form for testing) is the path to knowledge-base scraping and intelligent handoff into Contact Center.",
        angle: "Mithun demoed the support-line site to Zoom and is positioning OE to adopt Zoom's Virtual Agent and Workforce Management, deepening the integration that could turn the pilot into a paid contract.",
      },
      {
        title: "Workforce Management Review and SE Recruitment — with Annalisa",
        summary: "Mithun and Annalisa reviewed Zoom Workforce Management tutorials to evaluate whether it could augment or replace OE's current staffing tool, and discussed the open SE role, with Mithun raising the need for stakeholder-facing communication skills and noting Eric Costello starts in August. Annalisa walked Mithun through LinkedIn's AI recruiting assistant.",
        angle: "Mithun is evaluating whether Zoom's Workforce Management can displace an incumbent internal tool, surfacing another OE-internal expansion use case for the Zoom platform.",
      },
      {
        title: "OE Weekly Team Sync — Migration, Support Line and Pipeline",
        summary: "The team confirmed the support line launches July 1 with a slot on Tuesday's Zest call, discussed escalation channels and a lead-scoring model, and noted operator-panel access is permanently off the table for partners. Indeed is in contracting at ~$19-20K (OE's first CMS deal with them), Lab Roots keeps slipping, and a CrowdStrike comms-team opportunity is in early pitch. Peter raised a GSK earnings event at the LSEG venue and a potential Philips opportunity.",
        angle: "Mithun's migration and support-line work anchors the partnership narrative in this revenue meeting, with the Indeed signature validating OE's CMS delivery and the support line opening a lead engine.",
      },
    ],
  },
  {
    day: "Friday", date: "June 26", meetingCount: 5,
    meetings: [
      {
        title: "IFRS and Migration Bot Standup — Internal (Akash, Max)",
        summary: "Akash reported he resolved the ZVM permission issue but cautioned the first real migration into ZVM will take another 2-3 days, and confirmed he will prioritize the scrape-flow tickets over the bot. Mithun flagged that Chris wanted to share the pricing calculator internally at Zoom and that he had given the go-ahead.",
        angle: "Mithun keeps the migration delivery track and the Zoom-facing pricing tool moving in parallel, maintaining OE's credibility on both execution and commercial enablement.",
      },
      {
        title: "Pricing Calculator Logic Session — with Max",
        summary: "Mithun and Max worked through the calculator's cost logic, establishing that development effort scales from a baseline of ~36 hours to ~72 for complex jobs, with embed replacement adding more on top toward a practical ceiling near 100 hours. They validated that a 20TB project lands around $35K, agreed Mithun needs to document the logic and fix a free-text bug, and decided to swap the IFRS sample report for an anonymized mock and add a video-format question.",
        angle: "Mithun is hardening the pricing calculator into a defensible, documented tool that gives OE control over migration quoting, the asset Chris asked to share across Zoom's sales motion.",
      },
      {
        title: "Contact Center Supervisor Demo and Staffing — with Max, Annalisa and delivery team",
        summary: "Max walked the team through the live Contact Center supervisor and agent experience ahead of launch, demonstrating the monitoring views, inbound engagement flow, and the wrap-up that auto-generates an AI engagement brief with sentiment and next steps. The team noted the live-transcript view could replace their current tooling and discussed regional staffing coverage across APAC and EMEA as license provisioning lands.",
        angle: "Mithun's Salesforce-integrated Contact Center build is now demo-ready for OE's own delivery org and positioned as a potential replacement for incumbent internal tooling.",
      },
      {
        title: "SE Recruitment Feedback Loop — with Joe and Chiwei",
        summary: "Joe proposed a tighter feedback loop on SE hiring, urging Mithun and Chiwei to compare interview notes and feed signals back to HR earlier so weaker candidates are screened out before late-stage interviews, given 200+ applicants in the pipeline, and coached Mithun to be more decisive in written feedback. They agreed to a recurring short weekly sync.",
        angle: "Sharpening the SE hiring filter protects the quality of the team being built to scale Mithun's pre-sales and technical-translation function.",
      },
      {
        title: "Role Alignment and Project Walkthrough — with Chiwei (Director of Engineering)",
        summary: "Chiwei used the call to understand Mithun's scope, and Mithun walked him through his three workstreams: CMS migration pre-sales, integration services, and the support-line Contact Center build. They agreed production tools should likely move to an OE-managed AWS environment for security and governance, and Chiwei expressed strong interest in Mithun's AI build-and-ship workflow as a model for the engineering department, setting up a recurring Friday check-in.",
        angle: "This elevates Mithun's visibility with engineering leadership, framing his AI-native workflow as a model for the wider org and opening a path to influence OE's core product roadmap.",
      },
    ],
  },
];

export default function Week19Report() {
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
        <a href="/weekly_report_week19.pdf" download="Weekly_Report_Week19_final_1.pdf" style={{ fontSize: 12, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 6, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}><span style={{ fontSize: 14 }}>&darr;</span> Download PDF</a>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weekly Report</p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>Week 19</h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>June 22 &ndash; 26, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>Mithun Manjunatha &mdash; Sales Engineer</p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[{ n: "27", l: "Meetings" }, { n: "5", l: "Days" }, { n: "4", l: "Themes" }, { n: "19", l: "Week" }].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 19 Analytics</strong> &nbsp;&middot;&nbsp; Pricing calculator shipped &nbsp;&middot;&nbsp; Salesforce auth resolved &nbsp;&middot;&nbsp; <strong style={{ color: teal }}>Active:</strong> Support Line &middot; Indeed &middot; Chris ZVM opps &middot; Pricing Tool &middot; SE hiring &nbsp;&middot;&nbsp; <em style={{ color: "#9ca3af" }}>Support line soft launch &mdash; July 1</em>
      </div>
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>Week 19 centered on three converging fronts: the commercial model for the Zoom CMS-migration partnership, the July 1 launch of the partner support line, and the close-out of the IFRS engagement. A new Zoom EMEA rep pushed hard for instant migration quotes, which Mithun answered by building a working pricing calculator in under 25 minutes that Zoom called exactly what they needed. The support-line Contact Center cleared its last technical blocker when the Salesforce authentication was finally resolved, and the end-to-end flow was demoed to both Zoom and OE&rsquo;s own delivery team ahead of a soft launch. Indeed&rsquo;s CMS migration moved into signature (~$19&ndash;20K) as OE&rsquo;s first repeatable migration deal, while Mithun&rsquo;s role visibly expanded into pre-sales tooling, SE hiring, and engineering-leadership alignment.</p>
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
              <span style={{ fontSize: 11, fontWeight: 600, color: teal, background: "#f0fafa", padding: "3px 10px", borderRadius: 20 }}>{day.meetingCount} meeting{day.meetingCount > 1 ? "s" : ""} &rsaquo;</span>
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
      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 20</h2>
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
