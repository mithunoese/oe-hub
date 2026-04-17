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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-8";

const themes: Theme[] = [
  {
    title: "Migration Platform at an Inflection Point",
    text: "IFRS and Veltris dry runs exposed systemic gaps in Zoom\u2019s API readiness: ZVM has no metadata API, tag limits break real content, SRT captions are unsupported, and the dual-stream Kaltura encoding issue remains unresolved. The April 18 Zoom release is the gate for everything \u2014 tag limits expand from 5 to 30, caption upload unblocks, and the April 23 full migration run becomes possible. Until then, OE is effectively acting as Zoom\u2019s QA team.",
  },
  {
    title: "Managed Agent as the Next Product Bet",
    text: "Two independent conversations \u2014 one with Max, one with Alan \u2014 converged on the same concept: a Zoom marketplace app backed by a Claude-powered managed agent that handles migration end-to-end. Customer messages the Zoom app, the agent handles discovery, credentials, migration pipeline, and reporting. Alan flagged $1,300/month in Claude spend from Mithun alone and wants the investment structured properly. Mithun owns the write-up.",
  },
  {
    title: "AI Tooling Spreading Across the Team",
    text: "The CTA optimization tool was handed off to Michael Morales. An AI video production workflow was scoped with Casey and Devin for earnings calls \u2014 auto-cut, slide insertion, multi-agent orchestration. Devin\u2019s IR agent concept took shape with OE\u2019s private NDR transcripts as the core data moat. The SE role is actively evolving from meeting support into tooling infrastructure.",
  },
  {
    title: "New Revenue Surface Opening Up",
    text: "Cargill API integration confirmed at $3K setup + $500/year. Okta/Circle HD discovery underway \u2014 full stakeholder call needed before any quote. Nick Porter sent another university RFP. Peter (Zoom BD) commits to flagging US integration opportunities to OE. The managed agent concept, if productized, becomes a multiplier across all of these.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "April 18 Zoom Release \u2014 The Critical Gate",
    text: "Tag limits expand (5 \u2192 30 tags, 20 \u2192 40 chars), caption upload unblocks, and the transcript conflict resolves. IFRS and Veltris re-runs both depend on this. Confirm scope with Vijay and Fan the moment it ships.",
  },
  {
    title: "IFRS Full Migration Run \u2014 April 23 Target",
    text: "Post-April 18 release, Joe re-runs the full 813-entity migration. OE needs SRT\u2192VTT converter built and deployed before this runs. Mapping report goes to Ensemble and Trudeau on completion.",
  },
  {
    title: "Managed Agent Concept Write-Up",
    text: "Mithun to write up the Zoom marketplace app + Claude managed agent architecture. Needs to cover S3-to-S3 flow, GDPR/EU compliance, and the managed service model. Alan wants alignment from Max, Amelia, Alex, and Joe before any build begins.",
  },
  {
    title: "Okta/Circle HD Proper Discovery Call",
    text: "The questionnaire walkthrough was not a real discovery. Need actual stakeholder conversation with Farah, Adam, and their IT team before scoping or quoting. SSO embedding gap and dual-stream issue need to be addressed directly.",
  },
  {
    title: "AI Video Production POC",
    text: "Mithun to source a sample earnings call recording and prototype the auto-cut + slide insertion workflow. Casey needs the Premiere export format confirmed. Voice cloning (11labs) is v2 scope.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "April 7",
    meetingCount: 5,
    meetings: [
      {
        title: "IFRS Dry Run Standup \u2014 Internal",
        summary: "Post dry-run debrief after the first full run. 14 videos moved successfully, 2 expected failures (live stream entries). New issue discovered: 20-character tag limit caused 5 of 16 entities to fail. 6 entities had SRT caption files \u2014 Zoom only supports VTT format, so all were dropped. Plan: delete all dry run content, wait for the April 18 Zoom release (tag limit fix + caption unblock), then re-run. Jira process enforcement reiterated \u2014 all issues must be logged.",
        angle: "The tag and caption issues are both Zoom\u2019s problem to fix. OE needs to build the SRT\u2192VTT converter before April 23. Everything waits on April 18.",
      },
      {
        title: "OE All-Hands \u2014 Q2 Kickoff",
        summary: "Q1 confirmed as a record quarter. 15 deals closed on the final Monday and Tuesday. Highlights: Mizuho $400K, Etsy $22K renewal, Volunteer CJ $31K, Brunswick new partner added. Camden BDR starts today \u2014 100% Zoom partnership focus. Delivery prepping for busy season, needs dates and products confirmed in Salesforce. LinkedIn at 82 new followers and 6%+ engagement. Mithun updates: FSPHP integration complete, IFRS migration kicking off, Laurentian discovery starting.",
        angle: "Q2 opens with real momentum. The migration and integrations practice is now part of the standard all-hands update \u2014 it\u2019s officially on the company\u2019s radar.",
      },
      {
        title: "IFRS App Token Debug \u2014 Joe, Max, Mithun",
        summary: "Deep debug session on 3 Kaltura entities failing GET calls. Root cause identified: those entities have special entitlements that require disable_entitlement session privileges to access. Attempted to regenerate the app token with elevated session type. Unresolved by end of call \u2014 Joe to continue testing with the regenerated token.",
        angle: "Kaltura\u2019s entitlement system has edge cases that aren\u2019t documented. This is the kind of thing that should go into a migration intake checklist as a pre-check.",
      },
      {
        title: "Laurentian Scoping Call \u2014 Kara + Client",
        summary: "FSPHP Foundation fertility summit on April 18: 9 speakers, 9am\u20133:30pm. Needs OBS setup with custom lower thirds, one pre-recorded speaker, and day-before rehearsals. Client (Karen) is new to Zoom events production. Kara to send a formal quote including weekend rate.",
        angle: "Production complexity is the real scope here, not the tech setup. Weekend rate and lower thirds design need to be spelled out clearly in the quote.",
      },
      {
        title: "Laurentian Pricing Sync \u2014 Internal",
        summary: "Landed on $14K USD for the Laurentian migration. Includes up to 15TB data, 8 hours of project management, and 30-day post-migration support. Overage rates: $300/hr and $500/TB. Standard metadata mapping included. D2L/Brightspace LMS relinking explicitly carved out as out of scope.",
        angle: "The LMS relinking carve-out is the right call \u2014 it\u2019s a fundamentally different scope from video migration and should be a separate engagement.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "April 8",
    meetingCount: 5,
    meetings: [
      {
        title: "Veltris Migration Standup \u2014 Internal",
        summary: "Post dry-run code review. 14 entities migrated, live stream fix deployed, tag character limit fix confirmed for April 18 release. SRT\u2192VTT conversion identified as a gap \u2014 OE to build. Tickets created for Circle HD and Panopto as low-priority follow-ons. ZVM confirmed as the migration target, but Joe flagged a critical constraint: ZVM has no metadata API. Clean-up strategy set: migrate first, fix metadata later.",
        angle: "ZVM having no metadata API is a structural problem for every future ZVM migration. This needs to be documented and disclosed to clients upfront.",
      },
      {
        title: "Michael Morales 1:1 \u2014 CTA Tool Demo",
        summary: "Mithun demoed the auto-research CTA optimization tool. Results: ran 115 experiments, improved openexc.com from 19/162 passing (11.7%) to 156/162 (96.3%). Walked Michael through the Claude Code CLI workflow. Enabled Michael to run it against his own LinkedIn posts. Conversation on how the SE role is evolving with AI tooling embedded in the workflow.",
        angle: "The 8.2x improvement number is the headline. Michael running it himself is the multiplier \u2014 once SEs adopt this tooling, it compounds.",
      },
      {
        title: "Max + Mithun \u2014 IFRS Pre-Call Prep",
        summary: "Quick sync before the IFRS client call. Reviewed 14 migrated videos. Fan flagged that the license may not be properly assigned to the hub. Plan: lead with the working videos, keep the Zoom platform gap discussion minimal during the client call, focus on progress over problems.",
        angle: "Right call. Client calls are for building confidence, not airing internal debugging sessions.",
      },
      {
        title: "IFRS Implementation Check-In \u2014 Client Call",
        summary: "Full dry run status presented to Ryan, Priya, Fan, and the Zoom team. License issue fixed live by Fan during the call. Tag limits (5 tags, 20 chars) confirmed fixed in April 18 release (expands to 30 tags, 40 chars). SRT\u2192VTT conversion confirmed as OE\u2019s responsibility. Caption upload blocked by auto-transcription conflict until April 18. Dual-stream slide+presenter issue raised again: Kaltura proprietary encoding that Zoom cannot replicate \u2014 IFRS frustrated, this was discussed 1.5 months ago. Timeline confirmed: April 18 release \u2192 April 23 re-run \u2192 mapping report to Ensemble and Trudeau.",
        angle: "The dual-stream issue is the hardest conversation. Kaltura\u2019s proprietary encoding is a genuine technical wall. IFRS needs to be managed carefully on this one.",
      },
      {
        title: "Alan Internal Debrief \u2014 Post IFRS",
        summary: "Joe honest assessment: Zoom API is not prime time \u2014 transient errors, OE acting as Zoom\u2019s QA. IFRS may keep the Kaltura player even post-migration. ZVM has no metadata API. Strategy confirmed: migrate first, clean up metadata later (moving house analogy). Discovery pricing model: carve out a $5K discovery phase separately. Joe stepping back deliberately \u2014 Mithun and Max own the next client engagement with Veltris.",
        angle: "Joe stepping back is the right move structurally. The practice needs to run without him in the room. Mithun and Max owning Veltris is the proving ground.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "April 9",
    meetingCount: 4,
    meetings: [
      {
        title: "Peter (Zoom BD) 1:1 \u2014 Integrations Overview",
        summary: "Mithun walked Peter through OE\u2019s integrations capability: MCP/Claude for third-party CRMs, Zapier/Workato as the iPaaS layer, Amgen and FSPHP as live case studies. Shared the migration one-pager. Peter\u2019s read: Europe not ready yet, but he will start flagging US integration opportunities to OE. Recurring historical gap noted \u2014 pre-OE, Zoom would just say \u2018we don\u2019t support that.\u2019",
        angle: "Peter as an internal referral channel for integration work is the unlock. Getting both migration and integrations on the Zoom referral form is the distribution play.",
      },
      {
        title: "Cargill API Integration Call",
        summary: "Jules, Max, Mithun with Neil and Igor from Cargill. Walked through OE Stream/novio showcase report endpoints. Pricing confirmed: $3K setup + $500/year maintenance. 10K row limit confirmed as not enforced via API. Cargill use case: automate their monthly metrics refresh from showcase reports. Neil and Igor to bring it to internal IT. 6-week check-in cadence set.",
        angle: "Clean, low-friction deal. The $3K + $500/yr model should be the standard template for API access integrations.",
      },
      {
        title: "Okta/Circle HD ZVM Discovery \u2014 Client Call",
        summary: "Farah, Adam, Vijay (Zoom), Fan, Frank, Mithun, Max on the call. Live walkthrough of the discovery questionnaire. Key gaps identified: no historical analytics support, no domain whitelisting (roadmap), no quiz or poll migration, player branding on roadmap, dual-stream slide layout is the same issue as IFRS. Frank flagged multi-SSO embedding for investigation. ZVM has no metadata API. Vijay\u2019s position: keep OE migration scope separate from Zoom platform functionality gaps. April 18 release is critical for this project too.",
        angle: "The dual-stream issue showing up again in Okta confirms it\u2019s a pattern, not a one-off. Needs formal documentation as a known platform gap for all ZVM migrations.",
      },
      {
        title: "Okta Internal Debrief \u2014 Max, Mithun, Kara",
        summary: "Kara\u2019s read: the questionnaire walkthrough was not a real discovery call. Need an actual conversation with decision-makers before any quote goes out. SSO gap is a red flag that needs direct resolution. Another university RFP in from Nick Porter. Kara worked through the night on an OE Central issue for the Sparkle conference. Max is out Mon\u2013Wed next week. Consensus: no quote without a proper discovery call.",
        angle: "Kara is right. Quoting without discovery is how scope creep starts. Farah is a pushy closer \u2014 don\u2019t let urgency substitute for diligence.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "April 10",
    meetingCount: 2,
    meetings: [
      {
        title: "Devin Weekly Check-In \u2014 IR Agent Concept",
        summary: "Mithun joining from Atlanta. Devin walked through an IR intelligence platform concept: analyst profiles, sentiment tracking, predicted Q&A, and rehearsal mode powered by private NDR transcripts and non-deal roadshow recordings. Mithun\u2019s angle: OE\u2019s unique data asset is the private transcripts from deals they deliver \u2014 no one else has that. Ontology idea as moat using Gib Smith\u2019s SME knowledge. Auto-research tool handed off to Michael. Next: loop Tommaso into OE Central endpoints, prototype IR agent skeleton.",
        angle: "The private NDR transcripts are genuinely differentiated. That\u2019s the moat. Everything else in the IR platform can be replicated \u2014 that data can\u2019t.",
      },
      {
        title: "Veltris Zoom UI Walkthrough \u2014 Client",
        summary: "Max walked Akash and Kiran through the Advanced CMS hub interface. Covered: video management tab, full video configuration (title, description, tags, thumbnails, resources, polls), two-location content architecture (hub UI + zoom.us cloud recording), how to locate video IDs and org/hub IDs in the URL, caption file validation, and custom vs auto-transcribed captions. Akash and Kiran added as Video CMS editors. Seats issue resolved during the call. Shoba couldn\u2019t join. Channels and playlists flagged as future scope.",
        angle: "Getting Akash and Kiran as CMS editors is the operational unlock. Veltris can now manage content directly without going through OE for every change.",
      },
    ],
  },
  {
    day: "Friday",
    date: "April 11",
    meetingCount: 5,
    meetings: [
      {
        title: "Veltris Friday Standup \u2014 Internal",
        summary: "ZVM confirmed: no API documentation available, cannot upload external files via API. Max suggested exploring the Zoom Clips API as a potential workaround \u2014 Vijay had referenced it previously. Tickets created for Circle HD and Panopto as low-priority follow-ons. Laurentian confirmed as going a different direction. Akash confirmed hub access working. Kiran and Meat to receive hub access today.",
        angle: "The Clips API is worth a deep-dive. If it supports metadata operations that ZVM doesn\u2019t, it could change the architecture for all future ZVM migrations.",
      },
      {
        title: "Max + Mithun 1:1 \u2014 Managed Agent Concept",
        summary: "Mithun pitched building a Zoom marketplace app plus a Claude-powered managed service agent to automate the end-to-end migration workflow. Customer messages the Zoom app, the managed agent handles discovery, credential setup, migration pipeline execution, and final reporting \u2014 removing the friction that overwhelmed clients like Laurentian. Vijay\u2019s S3-to-S3 architecture would streamline this further. Also discussed: RFP agent and GDPR/EU compliance requirements. Max on PTO. Mithun to produce the write-up.",
        angle: "This is the right product direction. The managed agent removes OE as the bottleneck in every migration. The Zoom app as the entry point also creates a distribution channel inside the Zoom ecosystem.",
      },
      {
        title: "Casey + Devin \u2014 AI Video Production Discovery",
        summary: "Scoping agentic video editing for earnings calls. Current workflow: Zoom recording \u2192 MP4 download \u2192 Premiere edit \u2192 Novio review link \u2192 client notes same night \u2192 final MP4. Pain points: manual script-based cutting to match the transcript, manual slide insertion, last-minute pickup shots after recording. Proposed: multi-agent orchestrator to auto-cut based on transcript alignment, auto-insert slides, and process client feedback as structured input. Voice cloning (11labs or open source) for pickup line replacement flagged as an enhancement.",
        angle: "The auto-cut + slide insertion use case is concrete enough to build a POC against. Get a real sample recording from Casey and prototype before scoping further.",
      },
      {
        title: "Alan 1:1 \u2014 Managed Agent Pitch",
        summary: "Mithun presented the Zoom app + Claude managed agent concept to Alan. Alan supportive but wants it formally written up and properly structured before anything is built. His note: it doesn\u2019t have to be a Zoom app specifically to achieve the same outcome. Wants alignment across Mithun, Max, Amelia, Alex, and Joe before moving forward. Claude spend flagged: $1,300 last month from Mithun alone \u2014 conversation on structuring that investment more deliberately coming next week.",
        angle: "Alan\u2019s $1,300 flag is a signal, not a block. He\u2019s asking for ROI framing, not a shutdown. The write-up needs to connect spend to outcomes clearly.",
      },
      {
        title: "Devin Weekly Check-In \u2014 IR Agent Deep Dive",
        summary: "Devin presented the full IR intelligence platform design: analyst profiles, sentiment tracking, predicted Q&A generation, and rehearsal mode using private NDR and non-deal roadshow transcripts. Mithun\u2019s redline feedback: strengthen the \u2018why OE\u2019 angle, lean harder into the agentic and API infrastructure moat, use OE\u2019s private NDR transcripts as the explicit differentiator, and flesh out the legal and compliance section. Claude managed agents as the enabling infrastructure. Devin to share with Andrew next. Weekly check-ins moving to Tuesdays.",
        angle: "The compliance and legal section is the one that will unlock enterprise buyers. Don\u2019t leave it thin.",
      },
    ],
  },
];

export default function Week8Report() {
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
      <Link
        href="/reports"
        style={{ ...serif, fontSize: 13, color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}
      >
        &larr; Back to Reports
      </Link>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        Weekly Report
      </p>
      <h1 style={{ ...serif, fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 4 }}>
        Week 8
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>April 7 &ndash; 11, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "21", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "8", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 8 Analytics</strong> &nbsp;&middot;&nbsp; April 18 Zoom release is the critical gate &nbsp;&middot;&nbsp; Managed agent concept pitched to Max and Alan &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Active:</strong> IFRS &middot; Veltris &middot; Okta &middot; Cargill &middot; IR Agent
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 8 was the week the migration platform hit its real constraints and the next product bet came into focus. The IFRS and Veltris dry runs exposed a set of compounding Zoom API gaps \u2014 no metadata API in ZVM, tag limits breaking real content, SRT captions unsupported, dual-stream encoding a hard wall. Every path forward runs through the April 18 Zoom release. Meanwhile two separate conversations, one with Max and one with Alan, independently arrived at the same idea: a Zoom marketplace app backed by a Claude-powered managed agent that handles the entire migration workflow end-to-end. Mithun owns the write-up. On the AI tooling side, the CTA tool was handed off to Michael, an earnings call video production POC was scoped with Casey and Devin, and Devin&rsquo;s IR agent concept crystallized around OE&rsquo;s private NDR transcripts as the core data moat. Commercially, Cargill API integration was priced and closed, Okta discovery is underway, and Peter from Zoom BD is now flagging US integration opportunities to OE.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 9</h2>
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
