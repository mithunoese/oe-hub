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

const COMMENTS_STORAGE_KEY = "oe-hub-comments-week-7";

const themes: Theme[] = [
  {
    title: "Q1 Closes at $10M+ with Record New Logos",
    text: "Monday\u2019s all-hands confirmed over $10M in bookings for Q1 \u2014 likely a record outside of COVID. GCS hit 116% of target with 92 deals (vs 56 last year) and 31 new logos. The IR Impact Awards cocktail at the Cornell Club drew 120+ attendees. Every pillar of OE was represented \u2014 institutional clients, GCS, Zoom, and partners.",
  },
  {
    title: "IFRS Dry Run Confirmed \u2014 Veltris Team Onboarded",
    text: "The Veltris execution team (tech lead Akash, developer Kiran, PM Shoba) was formally introduced and trained on the pipeline\u2019s retry workflow. Joe confirmed the IFRS dry run for April 7. Two remaining Zoom API blockers \u2014 tag limit (5 vs documented 20) and transcript conflict (auto-transcription collides with custom caption upload) \u2014 both have Plan B workarounds. EU data residency flagged as a new intake checklist item.",
  },
  {
    title: "MemberClicks Integration Resolved and Documented",
    text: "The FSPHP MemberClicks-to-Zoom Events integration was debugged and resolved in a live Thursday session. Root causes: wrong Zapier connector (standard Zoom vs. Zoom Events) and conflicting settings (Fast Join + Registration Required simultaneously). Mithun built a formal 2-page integration report \u2014 the first client-facing integration deliverable OE has produced.",
  },
  {
    title: "First Proactive Deliverables Shipped",
    text: "Two deliverables built independently: the FSPHP integration report (client-facing, documenting root causes and fix) and the OE CTA Optimization Report (internal, 10-slide deck showing an 8.2x improvement in CTA effectiveness across openexc.com using an autonomous AI experimentation framework). Both demonstrate the SE role producing tangible artifacts beyond meeting support.",
  },
];

const lookAhead: LookAhead[] = [
  {
    title: "IFRS Dry Run \u2014 April 7",
    text: "Joe loading trial assets into sandbox. Veltris team observing and learning. 11 edge-case items plus additions for long videos, live stream entries, and high-tag items. First live test of the Veltris execution model.",
  },
  {
    title: "Laurentian University Quote \u2014 Monday",
    text: "Kara sending formal quote (~$19-21K CAD) for 12,000 Panopto videos. Scope tightly defined with asterisk on LMS relinking. First education vertical migration and first Panopto source.",
  },
  {
    title: "Camden BDR Starts \u2014 April 13",
    text: "100% focused on Zoom partnership outreach. Mithun\u2019s prospecting tools become his primary target list generation engine. 30/60/90 day plan already built by Kara, Kristen, and Peter.",
  },
  {
    title: "Q2 SE KPI Session",
    text: "Amelia wants to sit down with Mithun and Andrew to workshop what to track for Q2. First formal performance measurement conversation for the SE role.",
  },
  {
    title: "Workato Reseller Agreement",
    text: "In legal review. Once signed, OE can formally refer clients and earn commission on middleware deals alongside implementation PS revenue.",
  },
];

const days: DayData[] = [
  {
    day: "Monday",
    date: "March 30",
    meetingCount: 3,
    meetings: [
      {
        title: "Zoom Account Access Setup \u2014 IFRS/Ryan",
        summary: "Working session to get Max set up as a hub host in IFRS\u2019s Zoom environment. Ryan added Max as a user with an API role for OAuth app creation. Key reveal: Ryan believes the migration cost is covered by IFRS\u2019s Zoom contract. Alan to clarify with Zoom (Dan is commercial contact, Stefan is technical). Peter has this in his pipeline at ~$10K.",
        angle: "The pricing confusion is urgent \u2014 someone at Zoom needs to confirm whether OE is being paid by Zoom or not. Can\u2019t leave this ambiguous with Peter trying to close it.",
      },
      {
        title: "Weekly All-Hands Sales Meeting \u2014 Q1 Final Push",
        summary: "Salesforce One showing over $10M in bookings for Q1. GCS at 116% of goal, 92 deals, 31 new logos. IR Impact Awards cocktail drew 120+ people to the Cornell Club. Mithun presented migration offering update. Notable deals still closing: Grindr ~$50K, Mizuho ELA renewal, Grail ~$15K with OE Meet, Sandoz $21K. JP Morgan ~$24M tracking for Q2.",
        angle: "The $10M+ quarter with record new logos is the commercial backdrop for everything Mithun is building. Migration practice is now explicitly in the full sales team\u2019s awareness.",
      },
      {
        title: "Anderson Migration Emergency \u2014 Kara + Max + Mithun + Anthony",
        summary: "ON24 contract expires tomorrow. Anthony (website person, brought in late February) downloaded 25 MP4s but no metadata \u2014 speaker bios, headshots, slide decks, documents all still in ON24 and inaccessible after midnight. No signed OE or Zoom contract. Allison (main contact) on maternity leave. Anthony pragmatic \u2014 confirmed he doesn\u2019t want OE doing work without a signed contract. Scope now much simpler: 25 MP4 uploads with mapping report, metadata to be filled in when Allison returns.",
        angle: "Clearest possible argument for a formal intake checklist. Two weeks of unanswered emails, no signed contract, key contact on maternity leave, deadline arrived with no preparation.",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "March 31",
    meetingCount: 3,
    meetings: [
      {
        title: "IFRS Migration Standup \u2014 Internal",
        summary: "Joe tracking two Zoom API blockers: tag limit (API accepts 5 vs documented 20) and transcript conflict (custom captions rejected when auto-transcription runs simultaneously). 10GB file cap handled gracefully. Resources/attachments working end-to-end. EU data residency discovered \u2014 IFRS Partner ID 179 only works against EU APIs. Veltris team onboarded. IFRS commercial confusion escalated \u2014 Stefan frustrated OE raised pricing directly with IFRS. Recommendation: invoice Zoom directly with 30% referral discount.",
        angle: "Tag limit and transcript conflict are the two remaining technical blockers. Both are Zoom\u2019s problem to fix; OE has Plan B workarounds for both. The commercial confusion is urgent.",
      },
      {
        title: "MemberClicks / FSPHP Discovery + Live Debug",
        summary: "First discovery call with the federation. MemberClicks registrations not flowing into Zoom. Max found the likely root cause live: Zapier using standard \u2018Zoom\u2019 connector instead of \u2018Zoom Events\u2019 connector \u2014 different endpoints for different portals (zoom.us vs events.zoom.us). One test registrant did appear, proving the flow works intermittently. Working session scheduled for Thursday to debug end-to-end.",
        angle: "Validated what Max and Mithun suspected \u2014 connector mismatch, not a fundamental MemberClicks blocker. One more working session should resolve it.",
      },
      {
        title: "Andrew 1:1 \u2014 SE Prospecting Tool Demo",
        summary: "Mithun demoed the IR Impact Awards attendee prospecting tool \u2014 cross-referencing attendee list against Salesforce to identify unassigned accounts. A few naming convention issues (Verizon vs \u2018Verizon Communications\u2019). Andrew\u2019s verdict: \u201890% of the way there.\u2019 Mithun to clean up and send to the team.",
        angle: "Andrew is satisfied with trajectory. \u2018Finish Q1 strong, I\u2019ll have a clearer head going into Q2\u2019 is the right signal from leadership.",
      },
    ],
  },
  {
    day: "Wednesday",
    date: "April 1",
    meetingCount: 3,
    meetings: [
      {
        title: "Salesforce/Ops Biweekly \u2014 Ali Product Update",
        summary: "First call of Q2. Shipped: Barclays compliance fields, Event Ran Smoothly checkbox, child order add-ons v2, profitability tab (dollar-for-dollar match confirmed), Total Child Order Amount field. Known issue: Convert to Order bug generating wrong record types. Looking ahead: OE Central to Salesforce integration (Q2 discovery, Q3 execution).",
        angle: "The ops infrastructure being built directly affects how migration deals get billed. The OEC/Salesforce integration is the biggest Q3 horizon item.",
      },
      {
        title: "Cargill API Pricing Sync \u2014 Max, Jules, Mithun",
        summary: "Quick scoping call for Cargill\u2019s request to automate pulling event reports via API for their Microsoft Copilot Studio build. No custom development required. Pricing agreed: $3K setup + $500/year maintenance, added as an addendum to existing contract.",
        angle: "Clean, low-effort API access deal. The pricing model (one-time setup + annual maintenance) is worth formalizing as a template.",
      },
      {
        title: "Devin Weekly Check-In",
        summary: "OE Meet contract signed \u2014 first native OE Meet event delivery. Mithun walked Devin through migration pricing (moving-van framing). Citi context shared: $12M/year Kaltura EVP + $800K live streaming. AI agent ecosystem deep-dive \u2014 144 agents, Agent Zero coordinator. Mithun to put together a deck of AI agent applications relevant to OE\u2019s business.",
        angle: "OE Meet contract signing is the first real commercial signal the native solution works.",
      },
    ],
  },
  {
    day: "Thursday",
    date: "April 3",
    meetingCount: 8,
    meetings: [
      {
        title: "Veltris IFRS Dry Run Planning \u2014 Joe + Kiran",
        summary: "Joe walked Kiran through the pipeline\u2019s retry workflow. Central teaching: fix root cause, update batch config, retry failed entities from current state \u2014 no re-extraction needed. Hub ID confirmed as a required field. IFRS dry run target: April 7.",
        angle: "Kiran hitting the hub ID placeholder blocker on day one is exactly why the intake checklist matters.",
      },
      {
        title: "Zoom Partnership Weekly Sales Sync",
        summary: "First Q2 Zoom sync. Q1 final: 106% of target. Q2 already at ~$600K rolling forward. Camden BDR starting April 13. Anderson resolving positively. Laurentian University scoped (12K videos, Panopto). Migration + marketing integrations to be added to referral form. Peter building $200K+ EMEA pipeline.",
        angle: "Migration and integration work visibly positioned as a Q2 growth engine. Adding both to the referral form is the distribution unlock.",
      },
      {
        title: "Veltris Team Intro / Meet & Greet",
        summary: "Formal introductions: Akash (tech lead/PM), Kiran (developer), Shoba (PM/delivery), Gayathri (relationship manager). Joe set expectations: Max is the project manager, Mithun is the SE-facing layer, Veltris is the execution engine. Joe stepping back deliberately.",
        angle: "This is the moment the migration practice becomes an actual team. Org chart: Veltris executes, Max manages, Mithun presents.",
      },
      {
        title: "Laurentian University Panopto Migration \u2014 Scoping Call",
        summary: "First education vertical migration, first Panopto source. 741 creator licenses, ~12K videos, 8-20TB estimated. Key complication: LMS relinking \u2014 Panopto links embedded in D2L Brightspace courses will break when videos move to Zoom. Quote to be ~$19-21K CAD with scope asterisk.",
        angle: "The LMS relinking problem is the real complexity \u2014 not the video migration itself.",
      },
      {
        title: "MemberClicks/FSPHP Follow-up Debug Session",
        summary: "Full hour of live debugging resolved the integration. Two root causes: (1) wrong Zapier connector (standard Zoom vs Zoom Events), (2) conflicting settings (Fast Join + Registration Required simultaneously). Sandra registered and appeared in Zoom within minutes. Confirmation email delivered.",
        angle: "The integration works. This is exactly the kind of one-time setup/debug work that can be documented and replicated at scale.",
      },
      {
        title: "Amelia + Andrew Weekly Check-In",
        summary: "OE website auto-research demo \u2014 AI tool surfaced generic CTAs. Andrew: \u2018just do it, work with Michael Morales.\u2019 Q2 SE KPIs to be workshopped. Rajul/Tyler update email going out from Alan and Amelia \u2014 Mithun to be pulled into those conversations.",
        angle: "The KPI conversation is overdue \u2014 Q2 is when SE performance starts being tracked formally.",
      },
      {
        title: "Laurentian University Post-Call Debrief",
        summary: "More complex than any migration so far. LMS relinking is a fundamentally different scope than video migration. $14K verbal estimate was based on incomplete information. Kara to scope tightly and carve out LMS relinking as a separate engagement.",
        angle: "Core tension in university migrations: technical work is straightforward but organizational complexity is the real scope driver.",
      },
      {
        title: "Max + Mithun Post-Call Debrief",
        summary: "MemberClicks confirmed working in production. Laurentian ZVM vs hub model clarified: ZVM ties content to individual user licenses (not a hub). 741 faculty creators would each need a Zoom license for proper content attribution \u2014 universities won\u2019t pay for that.",
        angle: "ZVM content ownership model is fundamentally different from Events Hub. This is foundational context for quoting future university clients.",
      },
    ],
  },
  {
    day: "Friday",
    date: "April 4",
    meetingCount: 2,
    meetings: [
      {
        title: "FSPHP MemberClicks Integration Report \u2014 Deliverable Built",
        summary: "Mithun built a formal 2-page integration report on OE letterhead documenting the full troubleshooting process, five red herrings investigated, two actual root causes found, the fix applied, and a complete configuration summary table. First client-facing integration report OE has produced.",
        angle: "This is the first formal integration deliverable. Document what was investigated, what failed, what the root cause was, and what was fixed.",
      },
      {
        title: "OE CTA Optimization Report \u2014 Deliverable Built",
        summary: "Full 10-slide CTA optimization report built using an autonomous AI experimentation framework. Baseline: openexc.com scored 11.7% on CRO criteria. After 3 optimization rounds: 96.3% pass rate \u2014 8.2x improvement. Competitive analysis shows optimized OE CTAs outperform Notified, Q4 Inc, Corbin Advisors, and ON24 on every dimension.",
        angle: "First proactive marketing contribution. The autonomous experimentation methodology should embed in OE\u2019s ongoing marketing cadence.",
      },
    ],
  },
];

export default function Week7Report() {
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
        Week 7
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af" }}>March 30 &ndash; April 4, 2026</p>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 2, marginBottom: 24 }}>
        Mithun Manjunatha &mdash; Sales Engineer
      </p>

      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginBottom: 28 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "19", l: "Meetings" },
          { n: "5", l: "Days" },
          { n: "4", l: "Themes" },
          { n: "7", l: "Week" },
        ].map((s) => (
          <div key={s.l} style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: teal, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        <strong style={{ color: "#111827" }}>Week 7 Analytics</strong> &nbsp;&middot;&nbsp; Q1 closed at $10M+ &nbsp;&middot;&nbsp; Veltris team onboarded &nbsp;&middot;&nbsp; MemberClicks integration resolved &nbsp;&middot;&nbsp;{" "}
        <strong style={{ color: teal }}>Deliverables:</strong> FSPHP Integration Report &middot; CTA Optimization Report
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
      <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 32 }}>
        Week 7 was the week everything started running in parallel. Q1 closed at $10M+ with record new logos while Q2 pipeline was already building. The Veltris execution team was formally onboarded and trained, setting the stage for the April 7 IFRS dry run. The MemberClicks integration was debugged and resolved in a live session, producing OE&rsquo;s first client-facing integration report. Laurentian University surfaced as the first education vertical migration (Panopto source, 12K videos) with a complexity profile unlike anything OE has scoped before. And Mithun shipped two proactive deliverables independently &mdash; the FSPHP integration report and a CTA optimization analysis that showed an 8.2x improvement across openexc.com. The Anderson migration panic (ON24 expiring with no signed contract) reinforced the need for a formal intake checklist before the Zoom AE funnel starts generating more migration leads.
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

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Looking Ahead &mdash; Week 8</h2>
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
