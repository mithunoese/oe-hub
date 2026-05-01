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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-11";

const themes: Theme[] = [
  {
    title: "IFRS Migration Ready to Execute",
    text: "The ZCM engineering team resolved the final technical question around ZCM-104 — Kiran confirmed the two-phase batch approach is the correct path, with a separate metadata and transcript pass following video ingestion. The migration report was refined with drop-reason visibility and entry-type columns, and the client confirmed readiness for a live run. The team is cleared to execute the full migration in batches, with a polished OE-branded report to accompany the final delivery to the IFRS client.",
  },
  {
    title: "CMS Migration Pipeline Reaches Board-Level Visibility",
    text: "Indeed’s discovery call completed with 6,949 videos and 79TB scoped, producing a $15K implementation proposal sent through Zoom AE Jason. Okta activated its vendor onboarding process and the security architecture review confirmed OE’s infrastructure meets enterprise-grade requirements. The S3-to-S3 technical architecture was formally aligned with the Zoom engineering team, with APIs targeted for mid-May and a 50-video test run planned before any live client migration. By Friday, Mark and Alan named the CMS migration effort and Mithun and Max specifically during the company all-hands as a driver of OE’s Zoom revenue trajectory toward $1M per month.",
  },
  {
    title: "Go-to-Market Collateral and Zoom AE Presentation Finalized",
    text: "Mithun and Kara aligned the Tuesday Zoom AE presentation into a focused three-slide format covering the migration workflow, active pipeline, and pricing — with integration services removed to keep the audience’s attention on the single most actionable topic. The migration questionnaire was updated with data residency questions and simplified choice formatting, and both the questionnaire and pricing document will be distributed via the Zoom AE referral form. A contact at the Zoom App Marketplace team was identified as a potential path to expediting migration bot app submission.",
  },
  {
    title: "AI Infrastructure Expanding Across the Business",
    text: "Podium 2.0 went live for Earnings Reimagined and written Q&A events, and the OE Support Assistant powered by Claude and Copilot Studio was deployed in Microsoft Teams with GitBook documentation and Freshdesk ticket creation. Mithun scoped a Salesforce CMS migration agent with Eric and Ali that would auto-populate opportunity fields from discovery call transcripts, with a Monday planning session confirmed. Akash received Zoom sandbox credentials and is building the Zoom App authentication flow for the migration bot. The Q1 all-hands confirmed over 50 Claude licenses in use company-wide with delivery automation targeting 30% of workflows by year-end.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "Tuesday Zoom AE Team Presentation — May 5",
    text: "Mithun and Max present the CMS migration service overview to Rajul’s team of 30-plus Zoom event sales reps. Kara opens, distributes the updated one-pager and questionnaire via chat, and the team fields Q&A. The goal is to enable the AE team to identify and refer CMS migration opportunities directly. Owner: Mithun, Max, Kara.",
  },
  {
    title: "IFRS Live Migration Kickoff",
    text: "With client confirmation received and ZCM-104 resolved, Akash and the engineering team begin the first live migration run in batches of 100 to 200 entries. The two-phase approach loads all video files first, waits for Zoom processing confirmation, then runs metadata and transcripts. Owner: Akash, Max.",
  },
  {
    title: "S3-to-S3 Test Run Planning",
    text: "Mithun and Akash prepare a 50-video test dataset and coordinate with Joe to be ready for a smoke test the moment the Zoom S3 APIs are released in mid-May. No real client data is used until OE has validated the end-to-end flow independently. Owner: Mithun, Akash, Joe.",
  },
  {
    title: "Indeed and Okta Proposal Follow-Up",
    text: "Kara follows up with Zoom AE Jason on the Indeed $15K proposal and monitors Okta’s security review with Will and the IT team as onboarding progresses. Both deals are expected to be close to signature pending legal and vendor approval processes. Owner: Kara, Mithun.",
  },
  {
    title: "Salesforce CMS Copilot Agent Scoping — Monday 10:30 AM",
    text: "Mithun, Eric, and Ali meet to scope the transcript-to-Salesforce auto-population agent using Copilot Studio’s Salesforce MCP connector. The target output is an agent that takes a CMS migration discovery call transcript and auto-populates opportunity fields in Salesforce, removing manual data entry. Owner: Mithun, Eric, Ali.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "April 27",
    meetingCount: 5,
    meetings: [
      {
        title: "ZCM / IFRS Migration Technical Standup",
        summary: "The engineering team confirmed the two-phase batch approach for IFRS as the correct resolution to ZCM-104. Zoom’s API returns errors when custom captions are submitted immediately after video ingestion because the video is still processing. The agreed workaround loads all video files first, obtains written confirmation from Zoom that processing is complete, then runs the metadata and transcript upload pass. Tags are confirmed working, SRT-to-VTT conversion was successful, and categories will be validated via a GET metadata API call since the Zoom UI will not surface them until mid-May. A scope boundary was also clarified: OE’s responsibility covers extraction to OE’s own S3 bucket and granting Zoom access from there — direct connection to a client’s AWS environment remains out of scope.",
        angle: "Mithun bridged the Zoom API issue into a structured two-phase delivery plan that protects the IFRS timeline while transparently documenting Zoom’s platform gap for the project managers.",
      },
      {
        title: "Monday Company All-Hands — Weekly Revenue Review",
        summary: "The full company sales standup covered results across GCS, Institutional, and the Zoom squad. GCS closed approximately $29K last week with standout deals from Zencore, Johnson Controls, and a new town hall logo. Pipeline reached $39M against a $41M target. The Sandoz ELA contract went out Monday morning with internal procurement pre-approval in place. The institutional team reported $623K in orders, placing the team at 41% of quarterly target with less than one full month elapsed. The Zoom/CMS squad created $456K in new pipeline. Peter closed a last-minute on-site event in Paris for a luxury goods association with Chanel, Hermes, and LVMH in attendance. Devin noted that Danaher’s first OE Meet event ran without issue and the client committed to an expanded offering next quarter.",
        angle: "Mithun updated the full company on IFRS dry run progress and the Okta/Indeed pipeline, reinforcing the Zoom CMS squad’s contribution to overall pipeline health heading into a key prospecting week.",
      },
      {
        title: "Indeed — Kaltura to ZVM Migration Discovery Call",
        summary: "Mithun and Max led a structured discovery session with Skyler, Indeed’s internal video platform owner, alongside Zoom AE Jason. Indeed currently has 6,949 video entries and 79TB of stored media in Kaltura, used primarily as a Zoom recording repository with content embedded into Degreed, Huddle, and Confluence. Key findings: historical analytics cannot be migrated and the client accepted this; chapter support is a low-priority nice-to-have; custom human-edited captions exist for high-visibility meetings and can be migrated; branding requirements are minimal; and the June 30 target date is self-imposed with the actual Kaltura contract expiring September 30. The most complex element identified is embedded video link remediation across three platforms. Legacy content from departed employees will be remapped to Skyler’s admin account. Skyler flagged that Indeed’s vendor onboarding and legal review process is extremely slow due to the company’s PII sensitivity posture.",
        angle: "Mithun’s discovery framework surfaced the embed complexity, ownership gap, and legal onboarding risk early — directly enabling accurate scoping and protecting OE from a discovery-to-delivery timeline mismatch.",
      },
      {
        title: "Post-Indeed Pricing Debrief — Internal",
        summary: "Immediately following the Indeed call, Mithun and Kara aligned on pricing strategy. The figure communicated to Jason ahead of the call was $23K–$25K. Mithun argued that at 79TB the data volume is large but the migration itself is among the simplest OE has scoped — basic metadata only, no chapters, minimal configuration — and that a number closer to $15K would improve close probability and position Indeed as a reference customer. Kara flagged Citi as a future large-scale CMS prospect with 50TB-plus pending Zoom feature completions. The team agreed to hold on adjusting the proposal until Jason reports back, and Mithun added embedded video source link remediation as an explicit line item subject to scope confirmation.",
        angle: "Mithun is actively managing the pricing-to-close balance, keeping OE competitive on a simple deal while building a repeatable reference case that anchors future CMS pricing conversations with larger prospects.",
      },
      {
        title: "Akash 1:1 — Managed Agent Architecture Exploration",
        summary: "Mithun connected with Akash from the ZCM engineering team to explore whether Claude Managed Service Agents could be used to build an automated self-service migration pipeline. The concept is a chatbot-style interface where a customer specifies their migration parameters and a coordinated multi-agent backend executes the full Kaltura-to-ZVM workflow on OE’s servers. Akash confirmed familiarity with agent frameworks and expressed confidence in prototyping the approach. Mithun noted that deployment will likely require building a Zoom App, introducing a security review and a more deliberate timeline. Next steps are to review the architecture with Joe and obtain leadership alignment.",
        angle: "This initiative has the potential to dramatically expand OE’s addressable TAM for CMS migration by reducing per-customer delivery cost and time, positioning OE ahead of any competing migration vendors.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "April 28",
    meetingCount: 3,
    meetings: [
      {
        title: "ZCM / IFRS Engineering Standup",
        summary: "Kiran reported on the ZCM-104 investigation into the duration-polling approach for detecting when Zoom has finished processing uploaded video. Testing confirmed that the method works — once a duration value is returned by the API, the video can be treated as fully processed and subsequent metadata uploads succeed. However, the approach introduces a significant performance concern: the batch job remains blocked while repeatedly polling for a response that may take anywhere from minutes to hours. The team aligned on Joe’s two-phase batch architecture as the correct path forward and confirmed ZCM-104 is resolved. The team is ready to initiate the full migration run.",
        angle: "Mithun coordinated the technical resolution across the engineering team and confirmed readiness for live execution, keeping the IFRS delivery timeline intact.",
      },
      {
        title: "IFRS Status, Indeed Proposal, and Presentation Prep — Max and Mithun 1:1",
        summary: "Max and Mithun aligned on three active work streams. On IFRS, Max had sent a status update to the client team and the team agreed to push for a kick-off call with the IFRS project managers. On Indeed, Mithun committed to drafting the implementation proposal at $15K by end of day for Max to review before submission to Zoom AE Jason. On presentation preparation, Mithun shared the draft framework for the upcoming leadership review with Amelia’s team: a two-track structure covering migration services and integration services under an OE professional services umbrella. Max also walked Mithun through the Zoom AE referral form and proposed adding a migration services option ahead of Tuesday’s Zoom team presentation.",
        angle: "Mithun is simultaneously managing active delivery on IFRS, closing the Indeed proposal, and building the go-to-market collateral that will be presented to Zoom leadership — a direct demonstration of the SE function’s full scope.",
      },
      {
        title: "Devin 1:1 — Earnings Call AI, Pipeline Update, and Analyst Database Concept",
        summary: "Mithun and Devin covered several intersecting initiatives. On the earnings call AI project, Devin reported that the primary barrier is compliance around routing bank data directly to corporate issuers, with Mark in discussions with Citi about serving as a pilot program. Mithun updated Devin on the migration pipeline: Indeed is tracking toward a $15K close, the IFRS second-phase dry run is ready to execute, and the migration bot concept is progressing. Mithun demonstrated the OE KPI dashboard and the migration pricing analysis tool. Devin shared updates including a Luxottica event targeted for June via a Spanish freelancer partnership, and a London Stock Exchange partnership in development that would give OE access to all 1,600 listed companies currently using LSE’s Spark Live webcasting service.",
        angle: "The conversation reinforced Mithun’s role as a connector across the delivery, sales, and product sides of the business, with the migration pricing tool serving as a concrete example of AI-assisted SE productivity.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "April 29",
    meetingCount: 8,
    meetings: [
      {
        title: "ZCM / IFRS Engineering Standup",
        summary: "A brief standup with Akash covered two items. Max indicated he had reviewed the updated migration report and requested a follow-up working session with Akash and Meat to provide detailed feedback. The team also discussed caption file prioritization logic — the current behavior selects the first file returned in the Kaltura API array rather than applying any file-type hierarchy, and Akash committed to confirming whether Kaltura surfaces a default caption flag at the extraction level. The S3-to-S3 flow call with Vijay at Zoom was confirmed for Friday.",
        angle: "Mithun connected the technical readiness confirmation with the upcoming Friday Zoom call, setting up the S3 architecture discussion that will inform the broader migration bot infrastructure.",
      },
      {
        title: "Migration Report Deep Dive — Max and Meat",
        summary: "Max and Meat walked through the updated report fields in detail, including Kaltura title, media file size, flavor count, thumbnail and attachment counts, and corresponding migrated resource counters. Max identified a key gap: when a file is dropped — for example, an SRT converted to VTT, or an unsupported JSON file excluded from the migration — the report surfaces a count discrepancy without explaining what was dropped or why. Max requested a column surfacing Kaltura entry type so that permanent holds are self-explanatory, and a mechanism to indicate which files were dropped with the associated reason. Mithun noted the current CSV format is too raw to share directly with the IFRS client and pushed for a polished, OE-branded visual report for the final delivery package.",
        angle: "This session closed the last significant gap in the IFRS migration report before client delivery, and Mithun’s drive toward a client-ready visual output elevates OE’s presentation standard for all future migration engagements.",
      },
      {
        title: "April Company Product Update — All Hands",
        summary: "The quarterly product update covered several significant platform milestones. Podium 2.0 is live for Earnings Reimagined calls and written Q&A events, featuring registration-based attendee capture, drag-and-drop question prioritization, chat reactions, and a full questions audit log with AI topic filtering on the near-term roadmap. An AI-powered internal support assistant was launched in Microsoft Teams, built on a GitBook knowledge base auto-populated from Jira release notes via Claude Code. OE Meet was demonstrated with Bank of America as a prospective deployment. The next-gen player now supports independent live configuration for main and mirror Novio streams. The Citi Velocity migration from Veracast to OE Central is targeting a mid-June go-live. Jeffries post-event reporting integration went live the same day.",
        angle: "Podium 2.0 and the OE Support Assistant are direct differentiators for Mithun’s Zoom partnership conversations — both demonstrate OE’s product velocity and enterprise-grade tooling to customers evaluating the migration and integration services offering.",
      },
      {
        title: "Migration Bot Architecture Session — Akash 1:1",
        summary: "Akash demonstrated a working prototype supporting Kaltura, Zoom Clips, and Panopto as source platforms through a chat-based migration interface. Mithun walked through the end-state vision: a Zoom-native chat app requiring no separate UI, in which customers authenticate, select source platform, answer a concise set of scoping questions, and trigger the managed agent to execute the migration. Mithun outlined a tiered gating model — migrations below a defined terabyte threshold proceed automatically, while larger projects trigger an OE representative contact flow. Data residency routing will be handled conditionally. Akash committed to exploring the Zoom App framework, building a demo authentication flow, and reporting findings at the next standup.",
        angle: "This session moved the migration bot from individual prototyping to active collaborative engineering development, establishing the architecture that could eventually automate sub-10TB migrations at scale.",
      },
      {
        title: "Okta Onboarding and Data Architecture Review — Kara and Mithun",
        summary: "Kara informed Mithun that Okta had officially initiated the onboarding process and sent documentation. Will Worthington from OE’s IT team had been brought in to respond to security review questions about how customer video data is staged and moved from Circle HD through OE’s environment to Zoom. Mithun located Joe McPherson’s existing S3-based data architecture diagram from Confluence and confirmed it is sufficient to address the initial security questionnaire. A formal Thursday meeting was being scheduled to advance the onboarding.",
        angle: "Okta onboarding activation is a strong indicator of deal momentum, and Mithun’s ability to surface the correct architecture documentation without engineering escalation positions OE as a security-ready vendor during a sensitive procurement review.",
      },
      {
        title: "AI Industry Briefing — The Download Panel",
        summary: "Mithun attended an external AI industry briefing covering the enterprise AI competitive landscape. Key themes: Anthropic’s Claude maintains a strong enterprise position due to its safety posture and resistance to prompt injection, making it the leading choice for always-on agentic workloads. Google Gemini leads on context window size and deep research capabilities. The Microsoft Copilot framework’s ability to toggle between Claude, ChatGPT, and Gemini was highlighted as a meaningful enterprise differentiator. Of particular relevance to OE’s work, the panel noted that buy-side financial firms are paying significant sums for AI-processed event transcription data — directly validating the commercial opportunity in OE’s Citi transcription project discussed later the same day.",
        angle: "The buy-side transcription demand insight validates the strategic framing for the Citi engagement and strengthens the case for OE building a scalable post-event transcription and data service layer.",
      },
      {
        title: "Professional Services Deck Review and Migration Bot Update — Max 1:1",
        summary: "Mithun and Max aligned on the professional services presentation ahead of Tuesday’s Zoom team meeting. Max confirmed the Zoom AE referral form is the right channel to host the migration questionnaire and pricing document. The team set an ambitious goal to update both documents before Tuesday, with Max taking ownership of the questionnaire revisions and Mithun handling the pricing document. On the migration bot, Mithun confirmed Akash has been provisioned with Zoom sandbox credentials.",
        angle: "Mithun is managing the go-to-market documentation timeline and the technical migration bot track in parallel, keeping both on schedule for the Tuesday Zoom presentation.",
      },
      {
        title: "Citi Transcription / Veracast Archive Project Kickoff",
        summary: "Joe McPherson convened a kickoff meeting to scope a new project: Citi has requested AI-generated transcriptions of approximately 1,500 legacy event recordings archived in the Veracast system, intending to use them for downstream analysis and knowledge mining. Andrew briefed the group on the file inventory — approximately 1,100 recordings are accessible via direct download, around 360 reside on S3, and a further set exists in a disconnected pre-acquisition archive. Transcripts from September 2024 onward have already been delivered and will be excluded from scope. The remaining recordings will be staged on S3, run through AWS Transcribe, and packaged with event metadata. Joe noted the same pipeline could be offered proactively to Bank of America and other Veracast clients ahead of decommissioning. A check-in is scheduled for the following Wednesday.",
        angle: "This project positions Mithun and Max as operational owners of a new data services offering that extends OE’s commercial relationship with Citi beyond live event delivery.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "April 30",
    meetingCount: 9,
    meetings: [
      {
        title: "ZCM / IFRS Engineering Standup",
        summary: "Akash confirmed the caption file prioritization logic: when both VTT and SRT files exist for the same language, the VTT is always selected to avoid introducing conversion errors. The default caption designation from Kaltura carries over to Zoom directly. Akash requested provisioning of a Zoom sandbox account to begin building the migration Zoom App. Mithun flagged that the Okta and Circle HD migration may progress soon. Joe clarified the S3-to-S3 architecture boundary: if a client controls their own S3 bucket and will not grant OE access, the pipeline must extract content via the source platform’s API into OE’s staging bucket before passing it to Zoom. The Indian team noted May 2 as a holiday and agreed to cancel Friday’s standup.",
        angle: "Mithun successfully signaled Okta deal momentum to the engineering team while the architecture boundary clarification protects OE from scope ambiguity in the Okta onboarding security review.",
      },
      {
        title: "Zoom App Provisioning and Architecture Session — Max and Akash",
        summary: "Max provisioned Akash with access to OE’s Zoom sandbox account with scoped permissions for ZVM and Clips APIs, noting that OE operates two separate Zoom environments — one carrying the Advanced CMS license and one with the ZVM license — requiring separate OAuth app configurations. Mithun clarified the technical architecture: the Claude API is the right choice for connecting to third-party platforms like Kaltura and Zoom, while Managed Service Agents are suited for local system operations. Mithun outlined the near-term demo plan using the IFRS Kaltura sandbox and OE’s own Zoom accounts to mock a full automated migration.",
        angle: "This session moved Akash from exploration to active hands-on development with the correct credentials and architecture clarity, directly advancing the migration bot toward a demoable prototype.",
      },
      {
        title: "OE Support Assistant Demo — Eric, Max, and Mithun",
        summary: "Max and Mithun met with Eric, a product intern who built OE’s internal AI support assistant, for a detailed product walkthrough. Eric demonstrated the Copilot Studio agent deployed in Microsoft Teams, capable of answering product questions, troubleshooting, and creating Freshdesk tickets from within the same chat. Mithun drew a direct parallel to the migration bot and noted that the Salesforce MCP connector visible in Copilot Studio could enable a separate agent to auto-populate Salesforce opportunity fields from CMS migration discovery call transcripts. Eric confirmed this is feasible and that Salesforce already has a native Copilot integration. A Monday morning planning session was scheduled with Eric and Ali.",
        angle: "The meeting confirmed technical feasibility for the Salesforce auto-population concept and established a concrete collaboration pathway with Eric before his internship concludes.",
      },
      {
        title: "Security Architecture Review — Joe, Bill, Kara, Mithun, and Omar",
        summary: "Joe McPherson led a formal security review of the CMS migration infrastructure for Bill from IT/Security. Key design principles confirmed: each migration runs on fully isolated AWS infrastructure with a unique encryption key per project, no multi-tenancy, a single configurable AWS region to accommodate data residency requirements, and complete infrastructure destruction within seven days of the client confirming migration completion. Bill confirmed satisfaction with the architecture. One open item: security monitoring tools including Macie and Security Hub have not yet been enabled on the zoom-migration AWS account. Omar was assigned to enable these immediately.",
        angle: "The security review confirmed OE’s migration infrastructure meets enterprise-grade requirements, resolving the last significant obstacle in the Okta onboarding process.",
      },
      {
        title: "Thursday Weekly Revenue and Sales Team Call",
        summary: "The weekly GCS and Zoom squad review covered delivery readiness, pipeline status, and the upcoming May 6 and 7 delivery surge. Thirteen contracts were closed for the week totaling $74K, and May delivered revenue has already reached $435K against an all-time monthly high of $475K. The HealthEdge event setup error was flagged as a high-priority issue requiring five operators instead of one. Peter shared a Zoom Info prospecting technique using technology filters to identify Zoom users as a targeting base. Kara updated the team that Okta’s procurement team has a Monday meeting with the Zoom AE. Mithun updated the group that the IFRS dry run is ready to execute and highlighted that Okta and Indeed are progressing.",
        angle: "Mithun’s IFRS and CMS migration pipeline activity was highlighted in front of the full team as contributing meaningfully to the Zoom squad’s pipeline recovery.",
      },
      {
        title: "Tuesday Zoom Presentation Prep — Kara, Max, and Mithun",
        summary: "Kara, Max, and Mithun reviewed and refined the professional services presentation deck. Kara made a clear scope decision: the presentation should focus exclusively on migration services and drop the integration services section. The agreed structure is a brief introduction, three focused slides covering the migration workflow, active pipeline (Okta, Indeed, Andersen), and pricing with a firm caveat that all engagements require a discovery call before formal proposals. Kara will open the call, introduce the OE team, and distribute the migration one-pager and questionnaire via chat. Kara also identified Abe Queen on the Zoom App Marketplace team as a potential resource to expedite migration bot app approval.",
        angle: "Mithun’s presentation work was validated and sharpened into a focused, actionable format that directly supports AE enablement — the most important output of the Tuesday meeting.",
      },
      {
        title: "Eric 1:1 Follow-Up — Salesforce CMS Agent Planning",
        summary: "Mithun reconnected with Eric to begin scoping the Salesforce CMS migration Copilot agent: a Teams-based agent that takes a CMS migration discovery call transcript and auto-populates Salesforce opportunity fields, removing manual data entry from the post-call workflow. Eric confirmed the Salesforce MCP server is already available in Copilot Studio. A Monday 10:30 AM working session was scheduled with Mithun, Eric, and Ali. Mithun also flagged the 24/7 Zoom onboarding support agent as a third workstream to explore once the Salesforce agent is scoped.",
        angle: "Mithun is moving from ideation to active build on a tool that could save the sales team significant administrative time and demonstrate measurable AI ROI in the sales function.",
      },
      {
        title: "Amelia 1:1 — SE Quarterly Check-In",
        summary: "Mithun met with Amelia for his regular check-in. Amelia confirmed the right approach for Tuesday is two to three focused slides with maximum time for questions. She confirmed the delivery team has formal targets to automate 30% of capacity in 2026 via AI and expressed strong interest in Mithun’s Salesforce auto-population agent. She shared that the board discussed a longer-term strategy around monetizing OE’s event transcription data — aggregating and exposing it to buy-side clients through AI-powered tools, potentially integrating with Bloomberg, FactSet, and IRWIN. She flagged that May 6 and 7 will require all hands on deck for delivery monitoring.",
        angle: "Amelia’s direct endorsement of AI-driven sales productivity and her briefing on the data monetization strategy provide Mithun with executive alignment for his Salesforce agent work and a longer-term product vision to contribute toward.",
      },
      {
        title: "Max and Mithun 1:1 — Questionnaire Edit and Indeed Proposal Review",
        summary: "Max pulled Mithun in to review the migration questionnaire before sending it to Danielle at Zoom. The team consolidated two redundant analytics questions into one, added a data residency and compliance requirements question, and simplified the platform section. Mithun suggested using the Claude add-in for Microsoft Word to convert static checkbox symbols into interactive fillable checkboxes, which Max successfully deployed in real time. Max also reviewed the Indeed implementation proposal before sending. Both confirmed high confidence that Okta and Indeed are approaching close.",
        angle: "The questionnaire refinements incorporate learnings from the Indeed and Okta discovery calls, while the Claude add-in workflow is a concrete example of AI accelerating day-to-day SE work.",
      },
    ],
  },
  {
    day: "Friday",
    date: "May 1",
    meetingCount: 2,
    meetings: [
      {
        title: "Q1 Company All-Hands — Board Results and Q2 Outlook",
        summary: "Mark presented Q1 financial results to the full company. Q1 revenues came in at $92M, up 40% year over year, with profit levels reaching $762K at an 83% margin — a new company high-water mark. Revenue grew approximately 25% each month across the quarter. The sales team closed 107 new logos and hit 86% of quota attainment. Corporate and GCS grew 152% year over year. Capital markets produced approximately $600K in April alone. Q2 bookings are already at 62% of forecast. OE is positioned on the SpaceX IPO ($75B) and Mark confirmed OE has been selected to run the anticipated Anthropic and OpenAI IPOs. Alan and Mark called out the CMS migration effort and named Mithun and Max specifically as drivers of OE’s Zoom revenue trajectory toward $1M per month. OE was described as an AI-centric company with over 50 Claude licenses deployed.",
        angle: "Mithun and Max were mentioned by name on the company all-hands as directly contributing to one of OE’s highest-priority growth vectors, with the CMS migration pipeline elevated to board-level visibility.",
      },
      {
        title: "Zoom S3-to-S3 Migration Technical Architecture Call — Joe, Vijay, BJ, Bo, Max, Mithun",
        summary: "Joe McPherson, Vijay, BJ, and Bo from the Zoom ZVM engineering team met with Max and Mithun to walk through the S3-to-S3 import architecture. The full sequence: OE stages content in its own S3 bucket and grants Zoom a scoped IAM role with KMS decrypt permissions → Zoom copies the content into an internal relay bucket → OE calls Zoom’s batch import APIs to convert raw files into clip objects receiving clip IDs → OE uses those clip IDs to attach metadata, transcripts, thumbnails, and ownership. For clients like Okta who already store content in their own S3 bucket, OE facilitates the IAM handoff and Zoom handles the transfer directly. APIs are expected in mid-May. Zoom will update documentation with concrete worked examples. Joe emphasized that OE should run its own smoke test with approximately 50 sample videos before using any real client data. Transcript format is VTT only on Zoom’s side.",
        angle: "This call confirmed the technical path for the S3-to-S3 flow that will unlock Okta and other clients who already manage their own cloud storage, and Mithun is positioned to coordinate the test execution between OE engineering and Zoom once APIs are released.",
      },
    ],
  },
];

export default function Week11Report() {
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
          href="/api/report-pdf/week-11"
          download="Weekly_Report_Week11_final_1.pdf"
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
        Week 11
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>April 27 &ndash; May 1, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "27", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "11", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 11 Analytics</strong> &nbsp;&middot;&nbsp; Indeed $15K proposal sent &nbsp;&middot;&nbsp; Okta onboarding activated &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Okta &middot; Indeed &middot; Migration Bot &middot; Citi Transcription &middot; Salesforce Agent
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        The week of April 27 was defined by simultaneous execution on multiple fronts: the IFRS migration cleared its last technical blocker and was greenlit for live execution, the CMS pipeline advanced with a completed Indeed discovery, Okta onboarding activation, and the S3-to-S3 Zoom architecture confirmed for mid-May release. Mithun and Max finalized the go-to-market presentation for the Tuesday Zoom AE team meeting, while internal AI infrastructure expanded with the OE Support Assistant going live in Teams and a Salesforce Copilot agent scoped with Eric and Ali. The week closed with the Q1 company all-hands confirming $92M in revenue, 40% year-over-year growth, and a board-level call-out of the CMS migration work by name as one of OE&rsquo;s highest-priority growth initiatives.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 12</h2>
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
