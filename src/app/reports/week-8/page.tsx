"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Meeting {
  id: string;
  day: string;
  title: string;
  type: string;
  summary: string;
  decisions: string[];
  actions: string[];
}

const meetings: Meeting[] = [
  { id:"m1",day:"Monday",title:"IFRS Dry Run Standup",type:"Internal",summary:"Post dry-run debrief. 14 videos moved, 2 expected failures (live streams). New issue: 20-char tag limit, 5 of 16 entities failed. 6 entities had SRT files — Zoom only supports VTT, dropped. Plan: delete all dry runs, wait for Zoom April 18 release, re-run. Jira process enforcement reminder.",decisions:["Wait for April 18 Zoom release before re-run","Delete all dry run content and restart clean"],actions:["Log all issues to Jira","Confirm Zoom release date with Vijay","Set up re-run calendar for April 23"]},
  { id:"m2",day:"Monday",title:"OE All-Hands — Q2 Kickoff",type:"Internal",summary:"Q1 closed as record quarter — exceeded targets. 15 deals closed on final Monday and Tuesday. Mizuho $400K, Etsy $22K renewal, Volunteer CJ $31K. Brunswick new partner added. Camden BDR starts today. Delivery prepping for busy season — dates and products needed in Salesforce. LinkedIn: 82 new followers, 6%+ engagement. Mithun: FSPHP integration done, IFRS migration kicking off, Laurentian discovery starting.",decisions:["Q2 focus: delivery velocity and partner expansion","Camden BDR onboarding begins immediately"],actions:["Confirm product details in Salesforce for delivery","Add IFRS and Laurentian milestones to pipeline","Share LinkedIn metrics template with team"]},
  { id:"m3",day:"Monday",title:"IFRS App Token Debug",type:"Internal",summary:"Joe, Max, Mithun debugging 3 Kaltura entities failing GET calls. Root cause: special entitlements on those entities require disable_entitlement session privileges. Attempted to regenerate app token with elevated session type. Unresolved by end of call — deep debug session.",decisions:["Regenerate app token with disable_entitlement session privileges as next attempt"],actions:["Joe to test regenerated token against failing entities","Document entitlement edge cases in Jira","Loop in Kaltura support if token fix fails"]},
  { id:"m4",day:"Monday",title:"Laurentian Scoping Call",type:"Client",summary:"FSPHP Foundation fertility summit April 18, 9 speakers, 9am–3:30pm. Needs OBS setup with lower thirds (custom designed), 1 pre-recorded speaker, day-before rehearsals. Client (Karen) new to Zoom events production. Kara to send quote including weekend rate.",decisions:["Quote to include weekend rate","Lower thirds to be custom designed for FSPHP branding"],actions:["Kara to send quote by end of week","Confirm OBS setup requirements with production team","Schedule rehearsal day (April 17)"]},
  { id:"m5",day:"Monday",title:"Laurentian Pricing Sync",type:"Internal",summary:"Landed on $14K USD for Laurentian migration. Includes up to 15TB, 8 hours PM, 30-day post-migration support. Overage rates: $300/hr, $500/TB. Standard metadata mapping included. D2L/Brightspace relinking carved out — not in scope.",decisions:["$14K USD final price","D2L/Brightspace relinking excluded from scope"],actions:["Send SOW to Laurentian by end of week","Confirm 15TB data volume estimate with client","Add to Salesforce pipeline"]},
  { id:"m6",day:"Tuesday",title:"Veltris Migration Standup",type:"Internal",summary:"Post dry-run code review. 14 moved, live stream fix deployed, tag char limit fix in April 18 release. SRT→VTT conversion needed — OE to add. Tickets created for Circle HD and Panopto as low priority. ZVM confirmed as target — but ZVM has NO metadata API (Joe flagged). Next: kick off Laurentian/Panopto discovery.",decisions:["OE to build SRT→VTT conversion","ZVM confirmed as migration target despite no metadata API"],actions:["Build SRT to VTT converter","Create Laurentian Panopto discovery ticket","Wait for April 18 release before re-running"]},
  { id:"m7",day:"Tuesday",title:"Michael Morales 1:1 — CTA Tool Demo",type:"Internal",summary:"Mithun demoed auto-research CTA optimization tool. Ran 115 experiments: improved from 19/162 to 156/162 (11.7% → 96.3%). Walked through Claude Code CLI workflow. Enabled Michael to run it against his LinkedIn posts. Discussion of SE role evolution with AI tooling.",decisions:["Michael to run CTA tool on his own LinkedIn content","Continue sharing AI productivity tools across SE team"],actions:["Share CTA tool repo/instructions with Michael","Document workflow for other SEs","Follow up on Michael's results next week"]},
  { id:"m8",day:"Tuesday",title:"Max + Mithun IFRS Pre-Call Prep",type:"Internal",summary:"Quick sync before IFRS client call. Reviewed 14 migrated videos. Fan flagged license may not be assigned to hub. Plan: show working videos, keep Zoom platform gap discussion minimal on client call. Focus on progress not problems.",decisions:["Show working videos, downplay platform gaps on client call"],actions:["Fan to verify hub license assignment before call","Prepare list of working video IDs to demo"]},
  { id:"m9",day:"Tuesday",title:"IFRS Implementation Check-In",type:"Client",summary:"Full dry run status with Ryan, Priya, Fan, Zoom team. License fixed live by Fan during call. Tag limits (5 tags, 20 chars) → April 18 fix (30 tags, 40 chars). SRT→VTT conversion needed, OE to add. Caption upload blocked by auto-transcription until April 18. Dual-stream slide+presenter issue: Kaltura proprietary encoding, Zoom can't replicate — IFRS frustrated, discussed 1.5 months ago. Timeline: April 18 release → April 23 new run → mapping report to Ensemble/Trudeau.",decisions:["April 23 as target for next full migration run","OE to build SRT→VTT conversion for caption files","Dual-stream slide issue documented as known gap"],actions:["Fan to confirm April 18 release scope with Vijay","OE to build caption converter","Send timeline confirmation to IFRS team","Document dual-stream issue formally in Jira"]},
  { id:"m10",day:"Tuesday",title:"Alan Internal Debrief",type:"Internal",summary:"Joe: Zoom API not prime time — transient errors, OE acting as Zoom QA. IFRS may keep Kaltura player. ZVM has no metadata API. Clean-up strategy: migrate first, clean up metadata later (moving house analogy). Discovery pricing: carve out $5K phase. Joe stepping back — Mithun and Max own next client with Veltris.",decisions:["Migrate first, clean up later as standard approach","$5K discovery phase to be carved out separately","Mithun and Max own Veltris going forward"],actions:["Document discovery phase pricing in SOW template","Mithun to lead Veltris next steps","Brief Alan on Veltris scope"]},
  { id:"m11",day:"Wednesday",title:"Peter (Zoom BD) 1:1 — Integrations Overview",type:"Partner",summary:"Mithun walked Peter through OE's integrations capability: MCP/Claude for third-party CRMs, Zapier/Workato as iPaaS layer, Amgen and FSPHP as live case studies. Shared migration one-pager. Peter: Europe not ready yet, will start flagging US opportunities. Recurring gap — Zoom pre-OE would just say 'we don't support that.'",decisions:["Peter to flag US integration opportunities to OE","Europe deprioritized for now"],actions:["Send integrations one-pager to Peter","Follow up in 2 weeks on any US leads","Add Peter to OE partner update cadence"]},
  { id:"m12",day:"Wednesday",title:"Cargill API Integration Call",type:"Client",summary:"Jules, Max, Mithun, Neil and Igor from Cargill. Walked through OE Stream/novio showcase report endpoints. Pricing confirmed: $3K setup + $500/year. 10K row limit confirmed NOT enforced via API. Cargill use case: automate monthly metrics refresh. Neil and Igor to bring to internal IT. 6-week check-in cadence.",decisions:["$3K setup + $500/year pricing confirmed","6-week check-in before next action"],actions:["Send API documentation to Neil and Igor","Create Cargill opportunity in Salesforce","Follow up in 6 weeks"]},
  { id:"m13",day:"Wednesday",title:"Okta/Circle HD ZVM Discovery",type:"Client",summary:"Farah, Adam, Vijay (Zoom), Fan, Frank, Mithun, Max. Live discovery questionnaire walkthrough. Key gaps: no historical analytics, no domain whitelisting (roadmap), no quiz migration, player branding on roadmap, dual-stream slide layout same issue as IFRS. Multi-SSO embedding flagged by Frank. ZVM has no metadata API. Vijay: separate OE migration scope from Zoom platform functionality. April 18 release critical.",decisions:["Separate migration scope from platform gaps formally","April 18 release is the gate for next steps"],actions:["Frank to investigate multi-SSO embedding","Vijay to confirm April 18 scope","OE to complete discovery questionnaire","Schedule proper discovery call with Okta stakeholders"]},
  { id:"m14",day:"Wednesday",title:"Okta Internal Debrief",type:"Internal",summary:"Max, Mithun, Kara. Questionnaire is not a real discovery call — need actual stakeholder conversation before any quote. SSO gap is a red flag. Another university RFP in from Nick Porter. Kara worked all night on OE Central/Sparkle issue. Max on PTO Mon–Wed next week. No quote without proper discovery.",decisions:["No quote without a proper discovery call","Kara to own OE Central/Sparkle resolution"],actions:["Book proper Okta discovery call with decision makers","Review Nick Porter university RFP","Kara to update OE Central status post-Sparkle"]},
  { id:"m15",day:"Thursday",title:"Devin Weekly Check-In",type:"Partner",summary:"Mithun in Atlanta. IR agent concept: package fragmented IR data (transcripts, attendee data, Q&A) into real-time insights for IR officers. Ontology idea as moat using Gib Smith SME knowledge. Private non-deal roadshow transcripts as unique data asset. Auto-research tool handed off to Michael. Next: loop in Tommaso on OE Central endpoints, prototype IR agent.",decisions:["IR agent POC to use OE private NDR transcripts as core data asset","Tommaso to be looped in on OE Central endpoints"],actions:["Mithun to prototype IR agent skeleton","Loop in Tommaso on endpoints","Next check-in Thursday 1pm"]},
  { id:"m16",day:"Thursday",title:"Veltris Zoom UI Walkthrough",type:"Client",summary:"Max walked Akash and Kiran through Advanced CMS hub. Covered: video management tab, video configuration (title, description, tags, thumbnails, resources, polls), two-location architecture (hub UI + zoom.us cloud recording), how to find video IDs and org/hub IDs in URL, caption file validation, custom vs auto-transcribed captions. Akash and Kiran added as Video CMS editors. Seats issue resolved. Shoba couldn't join.",decisions:["Akash and Kiran added as Video CMS editors","Channels and playlists noted as future scope"],actions:["Confirm Shoba gets onboarded separately","Document hub URL structure for Veltris team","Share recording of walkthrough"]},
  { id:"m17",day:"Friday",title:"Veltris Friday Standup",type:"Internal",summary:"ZVM confirmed: no API documentation, cannot upload external files. Max: explore Clips APIs as potential workaround — Vijay referenced them. Tickets created for Circle HD, Panopto as low priority. Laurentian went a different direction. Akash confirmed hub access working. Kiran and Meat to get hub access today.",decisions:["Explore Zoom Clips API as potential ZVM workaround","Laurentian project closed — different direction"],actions:["Research Clips API for metadata upload capability","Grant Kiran and Meat hub access today","Update Jira with ZVM API gap finding"]},
  { id:"m18",day:"Friday",title:"Max + Mithun 1:1 — Managed Agent Concept",type:"Internal",summary:"Mithun pitched building a Zoom marketplace app plus Claude managed service agent to automate end-to-end migration. Customer messages Zoom app → managed agent handles discovery, credentials, migration, report. Would reduce friction for customers like Laurentian. Vijay's S3-to-S3 approach could streamline further. Also discussed RFP agent and GDPR/EU compliance. Max on PTO. Mithun to write up concept.",decisions:["Mithun to own managed agent write-up","S3-to-S3 architecture to be incorporated into concept"],actions:["Write up Zoom app + managed agent concept doc","Include GDPR considerations","Share with Alan and Max on return"]},
  { id:"m19",day:"Friday",title:"Casey + Devin — AI Video Production Discovery",type:"Internal",summary:"Exploring agentic video editing for earnings calls. Current workflow: Zoom recording → MP4 → Premiere edit → Novio review link → client notes same night → final MP4. Pain points: manual script-based cutting, slide insertion, last-minute pickups. Proposed multi-agent orchestrator to auto-cut, auto-insert slides, process client notes. Voice cloning (11labs/open source) for pickup line replacement.",decisions:["Build POC against a real sample earnings call recording","Voice cloning flagged as enhancement — not in v1 scope"],actions:["Mithun to source sample recording for POC","Draft agent architecture for auto-cut + slide insert","Follow up with Casey on Premiere export format"]},
  { id:"m20",day:"Friday",title:"Alan 1:1 — Managed Agent Pitch",type:"Internal",summary:"Mithun pitched Zoom app plus Claude managed agent concept to Alan. Alan supportive — wants it written up and properly structured. Noted it doesn't have to be a Zoom app specifically. Wants alignment across Mithun, Max, Amelia, Alex, Joe. Claude usage flagged: $1,300 last month from Mithun — conversation needed on focus and structure.",decisions:["Managed agent concept to be formally documented","All stakeholders (Max, Amelia, Alex, Joe) to align before build"],actions:["Write formal concept doc","Send to Alan for review","Book alignment call with full stakeholder group","Prepare Claude spend breakdown for Alan"]},
  { id:"m21",day:"Friday",title:"Devin Weekly Check-In — IR Agent Deep Dive",type:"Partner",summary:"Devin presented IR intelligence platform: analyst profiles, sentiment tracking, predicted Q&A, rehearsal mode using private NDR and non-deal roadshow transcripts. Mithun redlined: strengthen 'why OE' differentiation, highlight agentic and API infrastructure moat, OE's unique data = private NDR transcripts from deals they deliver. Claude managed agents as enabling tech. Devin to share with Andrew. Weekly check-ins on Tuesdays.",decisions:["OE's private NDR transcripts are the core differentiator for IR agent","Devin to present to Andrew before next check-in"],actions:["Mithun to send redlined doc back to Devin","Devin to share with Andrew","Next check-in Tuesday"]}
];

const dayOrder = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const typeColors: Record<string,string> = {
  Internal: "bg-blue-100 text-blue-800",
  Client: "bg-green-100 text-green-800",
  Partner: "bg-purple-100 text-purple-800",
};

const themes = [
  { title: "Migration Platform at an Inflection Point", description: "IFRS and Veltris dry runs exposed systemic gaps: ZVM has no metadata API, Zoom's tag and caption limits break real content, and dual-stream Kaltura encoding is a hard blocker. The April 18 release is the gate for everything — after that, the team runs clean migrations and resets client timelines." },
  { title: "Managed Agent as the Next Product Bet", description: "Two separate conversations — with Max and Alan — converged on the same idea: a Zoom marketplace app plus a Claude-powered managed agent that handles migration end-to-end. Mithun owns the write-up. Alan flagged $1,300/month in Claude spend and wants the investment structured properly." },
  { title: "AI Tooling Spreading Across the Team", description: "CTA optimization tool handed off to Michael Morales. AI video production workflow scoped with Casey and Devin for earnings calls. IR agent concept developed with Devin using OE's private NDR transcripts as the core data moat. The SE role is actively evolving through these tools." },
  { title: "New Revenue on the Table", description: "Cargill API integration priced at $3K setup plus $500/year. Okta/Circle HD discovery underway — needs a proper stakeholder call before any quote. Nick Porter sent another university RFP. Peter (Zoom BD) will start flagging US integration opportunities to OE." },
];

export default function Week8Page() {
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerOffset, setTickerOffset] = useState(0);

  const tickerItems = [
    "21 meetings across 5 days",
    "April 18 Zoom release — the critical gate",
    "Managed agent concept: Zoom app + Claude end-to-end",
    "$14K Laurentian SOW locked",
    "Cargill API: $3K setup + $500/yr",
    "ZVM confirmed: no metadata API",
    "IFRS April 23 re-run target",
    "CTA tool handed off to Michael",
    "AI video production POC scoped",
    "IR agent: OE private NDR transcripts as moat",
    "$1,300/mo Claude spend — Alan wants structure",
    "Okta discovery: no quote without stakeholder call",
  ];

  const animate = useCallback(() => {
    setTickerOffset(prev => {
      const next = prev - 0.5;
      const itemWidth = 300;
      const resetPoint = -(tickerItems.length * itemWidth);
      return next <= resetPoint ? 0 : next;
    });
  }, [tickerItems.length]);

  useEffect(() => {
    const id = setInterval(animate, 16);
    return () => clearInterval(id);
  }, [animate]);

  const days = ["All", ...dayOrder];
  const types = ["All", "Internal", "Client", "Partner"];

  const filtered = meetings.filter(m => {
    const dayMatch = selectedDay === "All" || m.day === selectedDay;
    const typeMatch = selectedType === "All" || m.type === selectedType;
    const searchMatch = searchQuery === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return dayMatch && typeMatch && searchMatch;
  });

  const grouped = dayOrder.reduce((acc, day) => {
    const dayMeetings = filtered.filter(m => m.day === day);
    if (dayMeetings.length > 0) acc[day] = dayMeetings;
    return acc;
  }, {} as Record<string, Meeting[]>);

  const stats = {
    total: meetings.length,
    days: 5,
    clients: meetings.filter(m => m.type === "Client").length,
    partners: meetings.filter(m => m.type === "Partner").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href="/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">← All Reports</Link>
        <span className="text-sm text-gray-500">Week 8 — April 7–11, 2026</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Week 8</h1>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">April 7–11</span>
          </div>
          <p className="text-gray-500 text-sm">Mithun Manjunatha · Open Ecosystem Sales Engineering</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Meetings", value: stats.total },
            { label: "Days", value: stats.days },
            { label: "Client Calls", value: stats.clients },
            { label: "Partner Calls", value: stats.partners },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden mb-8 py-3">
          <div className="overflow-hidden relative">
            <div
              className="flex gap-0 whitespace-nowrap"
              style={{ transform: `translateX(${tickerOffset}px)`, transition: "none" }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-6 text-sm text-gray-300" style={{ minWidth: 300 }}>
                  <span className="text-blue-400">◆</span> {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Themes</h2>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{t.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              {days.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedDay === d ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{d}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedType === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-gray-400">No meetings match your filters.</div>
        ) : (
          Object.entries(grouped).map(([day, dayMeetings]) => (
            <div key={day} className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>{day}</span>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{dayMeetings.length}</span>
              </h2>
              <div className="space-y-3">
                {dayMeetings.map(m => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[m.type]}`}>{m.type}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{m.title}</h3>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{m.summary}</p>
                      </div>
                      <span className="text-gray-400 text-lg mt-1">{expandedId === m.id ? "−" : "+"}</span>
                    </button>
                    {expandedId === m.id && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{m.summary}</p>
                        {m.decisions.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Decisions</h4>
                            <ul className="space-y-1">
                              {m.decisions.map((d, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-blue-500 mt-0.5 flex-shrink-0">◆</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {m.actions.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Actions</h4>
                            <ul className="space-y-1">
                              {m.actions.map((a, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-green-500 mt-0.5 flex-shrink-0">→</span>
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
