"use client";

import Link from "next/link";
import { useState } from "react";

const serif = { fontFamily: "Georgia, serif" };

/* ─── Roles Data ─── */

const defaultRoles = [
  { id: "event-mgr", title: "Event Manager", desc: "Run-of-show, vendor coordination, scheduling", icon: "📋", defaultRate: 85, phases: ["Planning", "Production", "Post-Event"] },
  { id: "it-support", title: "IT / Tech Support", desc: "Zoom setup, troubleshooting, screen sharing", icon: "💻", defaultRate: 75, phases: ["Production", "Security"] },
  { id: "av-tech", title: "AV Technician", desc: "Audio, video, streaming quality, recording", icon: "🎬", defaultRate: 95, phases: ["Production"] },
  { id: "mktg-ops", title: "Marketing Ops", desc: "Registration, email blasts, follow-ups, analytics", icon: "📊", defaultRate: 70, phases: ["Planning", "Post-Event", "Integrations"] },
  { id: "exec-admin", title: "Executive Admin", desc: "Calendar coordination, VIP handling, logistics", icon: "📎", defaultRate: 55, phases: ["Planning", "Experience"] },
  { id: "crm-admin", title: "CRM / Salesforce Admin", desc: "CSV imports, data cleanup, report building", icon: "🗄", defaultRate: 90, phases: ["Integrations", "Post-Event"] },
];

/* ─── Overview Data ─── */

const manualSteps = [
  { phase: "Planning", items: ["Spreadsheets & email chains for run-of-show", "Separate RSVP tools, manual check-in", "No structured rehearsals"] },
  { phase: "Production", items: ["Generic Zoom/Teams, amateur look", "One screen share, awkward transitions", "All-live (risky) or MP4 (clunky)"] },
  { phase: "Experience", items: ["Zoom link in an email", "Wrong rooms, dropoffs", "DIY captioning"] },
  { phase: "Security", items: ["Standard passcodes", "Speakers mixed with attendees"] },
  { phase: "Post-Event", items: ["Zoom CSV, manual reconciliation", "YouTube upload, no tracking"] },
  { phase: "Integrations", items: ["CSV → Excel → Salesforce", "Manual multi-platform uploads"] },
];

const oeSteps = [
  { num: 1, id: "oe-central", name: "OE Central", tag: "Command Center", desc: "360° organizer dashboard — tracking, scheduling, collaboration" },
  { num: 2, id: "oe-passport", name: "OE Passport", tag: "Participant Hub", desc: "Branded attendee microsite — agendas, one-click access, materials" },
  { num: 3, id: "oe-stream", name: "OE Stream", tag: "Webcasting", desc: "HD 1080p live + on-demand — translation, transcription, captioning" },
  { num: 4, id: "oe-podium", name: "OE Podium", tag: "Presenter Panel", desc: "Backstage portal — slide control, private chat, Q&A" },
  { num: 5, id: "oe-integrations", name: "OE Integrations", tag: "API Layer", desc: "Salesforce, marketing automation, analytics — data flows automatically" },
  { num: 6, id: "zoom-services", name: "Zoom Services", tag: "Partnership", desc: "Managed Zoom Webinars + Events — rehearsals, live execution" },
];

const pillars = [
  { name: "Investor Relations", sub: "Earnings calls · Investor Days · LP updates", color: "#008285" },
  { name: "Corporate Engagement", sub: "Town halls · Kickoffs · Product launches", color: "#0f766e" },
  { name: "Institutional Banks", sub: "Corporate access · Capital markets", color: "#115e59" },
  { name: "Investment Managers", sub: "Virtual meetings · Expanded reach", color: "#134e4a" },
];

/* ─── Product Detail Data ─── */

const productDetails = [
  {
    id: "oe-central",
    emoji: "⌘",
    name: "OE Central",
    tag: "Logistics Command Center",
    subtitle: "The back-end dashboard where organizers see everything. Your 360° control room.",
    diyTitle: "Without OE Central",
    diySubtitle: "What event planning looks like today",
    oeTitle: "With OE Central",
    oeSubtitle: "How OE Central handles it",
    diy: [
      { label: "Run-of-Show", desc: "Spreadsheets emailed back and forth — no single source of truth, version control nightmares" },
      { label: "Attendee Tracking", desc: "Manual headcounts, no real-time visibility into who's where during a live event" },
      { label: "Presenter Coordination", desc: "Email chains, WhatsApp groups, hoping speakers show up on time with the right slides" },
      { label: "Scheduling", desc: "Google Sheets or Outlook calendars, no session-level granularity, conflicts missed" },
      { label: "Collaboration", desc: "Scattered across Slack, email, docs — no centralized hub for the event team" },
      { label: "Day-of Visibility", desc: "Flying blind. No dashboard. Relying on walkie-talkies and gut feel" },
    ],
    oe: [
      { label: "360° Dashboard", desc: "Real-time view of every attendee, presenter, and session — all in one screen. No tab-switching." },
      { label: "Live Attendee Tracking", desc: "See who's in which session, who dropped off, who hasn't joined — in real time, not after the event." },
      { label: "Presenter Management", desc: "Track speaker readiness, slide uploads, rehearsal completion, and live status from one panel." },
      { label: "Smart Scheduling", desc: "Drag-and-drop session builder with conflict detection, timezone handling, and auto-notifications." },
      { label: "Team Collaboration", desc: "Built-in chat, task assignment, and notes for the entire event team — no external tools needed." },
      { label: "Project Manager Assigned", desc: "Dedicated OE account manager runs the logistics. You set the strategy, they execute the details." },
    ],
  },
  {
    id: "oe-passport",
    emoji: "🎫",
    name: "OE Passport",
    tag: "Participant Hub",
    subtitle: "The front-end for attendees. A branded microsite that replaces \"here's 12 Zoom links in an email.\"",
    diyTitle: "Without OE Passport",
    diySubtitle: "The attendee experience today",
    oeTitle: "With OE Passport",
    oeSubtitle: "How OE Passport transforms it",
    diy: [
      { label: "12 Zoom Links in an Email", desc: "Attendees get a wall of URLs, have to figure out which session is which, and hope they click the right one" },
      { label: "No Personalization", desc: "Everyone gets the same generic email — no tailored agenda, no relevant recommendations" },
      { label: "PDF Agendas", desc: "Static documents that are outdated by the time they're sent. No live updates, no interactivity" },
      { label: "Material Distribution", desc: "Attachments in follow-up emails. Half the audience misses them, the other half can't find them later" },
      { label: "On-Demand Access", desc: "Recordings dumped on SharePoint or YouTube with no organization, no tracking, no context" },
      { label: "Mobile Experience", desc: "Nothing. Zoom links on a phone browser. No app, no optimized view, no offline access" },
    ],
    oe: [
      { label: "Branded Microsite", desc: "Custom-branded event portal with your logo, colors, and messaging. Looks like your company built it." },
      { label: "Personalized Agendas", desc: "Each attendee sees sessions relevant to them based on role, interest, or track — automatically curated." },
      { label: "One-Click Session Access", desc: "Smart links that always route to the right room. No wrong links, no confusion, no dropoffs." },
      { label: "Downloadable Materials", desc: "Slides, PDFs, and resources attached directly to each session. Available before, during, and after." },
      { label: "Video Library", desc: "On-demand replays organized by session with viewer tracking. Know who watched what and for how long." },
      { label: "Responsive Design", desc: "Full mobile experience — attendees can browse, join, and watch from any device, anywhere." },
    ],
  },
  {
    id: "oe-stream",
    emoji: "▶",
    name: "OE Stream",
    tag: "Webcasting Engine",
    subtitle: "Live and on-demand video that looks like broadcast TV, not a conference call.",
    diyTitle: "Without OE Stream",
    diySubtitle: "The livestreaming experience today",
    oeTitle: "With OE Stream",
    oeSubtitle: "How OE Stream delivers it",
    diy: [
      { label: "Generic Zoom/Teams", desc: "No branding, no lower thirds, no graphics. Looks like every other internal call, not a produced event." },
      { label: "Amateur Audio/Video", desc: "Webcam quality, inconsistent audio, no production value. Presenters look unprepared." },
      { label: "No Live Translation", desc: "Global audience? Too bad. Manual interpreter setup is complex, expensive, and unreliable." },
      { label: "No Captioning", desc: "Accessibility is an afterthought. DIY auto-captions are inaccurate and embarrassing." },
      { label: "Awkward Transitions", desc: "One screen share at a time. Switching between speakers means dead air and confused viewers." },
      { label: "Pre-Record vs Live", desc: "Either go all-live (risky) or play an MP4 (clunky). No way to blend both seamlessly." },
    ],
    oe: [
      { label: "Broadcast-Quality Production", desc: "Custom layouts, lower thirds, branded graphics, and HD 1080p output. Looks like TV, not a Zoom call." },
      { label: "Professional Audio/Video", desc: "Multi-camera support, audio mixing, and production team managing transitions in real time." },
      { label: "Live Translation", desc: "Built-in simultaneous translation for global audiences. Multiple language channels, zero setup for you." },
      { label: "Auto Transcription & Captioning", desc: "Real-time closed captioning with high accuracy. Meets accessibility standards out of the box." },
      { label: "Multi-Source Feeds", desc: "Seamless switching between presenters, locations, and content sources. No dead air, no awkward pauses." },
      { label: "Pre-Record + Live Q&A", desc: "Mix pre-recorded segments with live Q&A seamlessly. De-risk your keynote while keeping it interactive." },
    ],
  },
  {
    id: "oe-podium",
    emoji: "🎙",
    name: "OE Podium",
    tag: "Presenter Panel",
    subtitle: "A separate backstage portal for speakers — keeping presenters separated from the audience.",
    diyTitle: "Without OE Podium",
    diySubtitle: "The presenter experience today",
    oeTitle: "With OE Podium",
    oeSubtitle: "How OE Podium handles speakers",
    diy: [
      { label: "Speakers Mixed with Attendees", desc: "Presenters join the same Zoom room as everyone else. No backstage, no preparation space, no privacy." },
      { label: "Hot-Mic Risk", desc: "One unmuted speaker can derail the entire event. No isolation between presenters and audience." },
      { label: "Slide Chaos", desc: "Screen share pass-around. One person shares at a time, handoffs are awkward, slides get lost." },
      { label: "No Private Communication", desc: "Speakers can't message each other during the event without the audience seeing it." },
      { label: "Q&A Free-for-All", desc: "Chat box floods with questions and comments mixed together. No moderation, no prioritization." },
      { label: "No Rehearsal Environment", desc: "Speakers test on the live call. If something breaks, everyone sees it." },
    ],
    oe: [
      { label: "Separate Backstage", desc: "Presenters have their own private portal. They see the event, but the audience doesn't see them until showtime." },
      { label: "Audio Isolation", desc: "Speakers are muted to the audience by default. OE team controls when each mic goes live. Zero hot-mic risk." },
      { label: "Slide Control", desc: "Presenters manage their own slides from the backstage panel. No screen share handoffs needed." },
      { label: "Private Chat", desc: "Speakers can message each other and the production team privately during the live event." },
      { label: "Moderated Q&A", desc: "Questions are queued, filtered, and prioritized by moderators before reaching the speakers." },
      { label: "Full Dress Rehearsals", desc: "24-hour test lines and structured rehearsals in the same environment as the live event." },
    ],
  },
  {
    id: "oe-integrations",
    emoji: "⚡",
    name: "OE Integrations",
    tag: "API Layer",
    subtitle: "The connective tissue — CRMs, marketing tools, and analytics, all wired together.",
    diyTitle: "Without OE Integrations",
    diySubtitle: "The data management nightmare",
    oeTitle: "With OE Integrations",
    oeSubtitle: "How OE connects everything",
    diy: [
      { label: "CSV Export → Excel → Import", desc: "After every event: download CSV from Zoom, clean it in Excel, then manually import to Salesforce. Every. Single. Time." },
      { label: "No Real-Time Data", desc: "Engagement data only available after the event ends. No live insights during the event itself." },
      { label: "Registration Disconnect", desc: "Registration tool doesn't talk to the event platform. Manual reconciliation between systems." },
      { label: "Marketing Blind Spot", desc: "Marketing automation has no idea who attended, what they watched, or how engaged they were." },
      { label: "Content Scattered", desc: "Recordings uploaded manually to multiple platforms. No centralized management, no tracking." },
      { label: "Analytics Silos", desc: "Zoom has some data, registration tool has other data, Salesforce has different data. No single view." },
    ],
    oe: [
      { label: "Direct CRM Integration", desc: "OE connects directly to Salesforce, HubSpot, and other CRMs. Attendee data flows automatically — no CSV gymnastics." },
      { label: "Real-Time API Access", desc: "Live engagement data available via API during the event. Build dashboards, trigger automations, act in the moment." },
      { label: "Registration Sync", desc: "Registration tools, RSVP systems, and event platform all connected. One registration, everywhere it needs to go." },
      { label: "Marketing Automation", desc: "Engagement signals flow to Marketo, Eloqua, or HubSpot. Automatic follow-ups based on who attended and what they did." },
      { label: "Embeddable Content", desc: "Embed recorded sessions on any website via API. Centralized management with viewer tracking across all destinations." },
      { label: "Unified Analytics", desc: "One dashboard with all engagement metrics — attendance, watch time, polls, Q&A, downloads — across all channels." },
    ],
  },
  {
    id: "zoom-services",
    emoji: "🤝",
    name: "Zoom Events Services",
    tag: "Partnership",
    subtitle: "Preferred managed services partner for Zoom Webinars and Zoom Events.",
    diyTitle: "Without Managed Services",
    diySubtitle: "Running Zoom events on your own",
    oeTitle: "With OE Zoom Services",
    oeSubtitle: "How OE manages your Zoom events",
    diy: [
      { label: "Self-Service Zoom Setup", desc: "Figure out Zoom Webinar settings yourself. Panelist roles, Q&A config, registration — all trial and error." },
      { label: "No Onboarding Support", desc: "Zoom documentation is massive. Teams spend hours learning features they'll use once." },
      { label: "Untested Events", desc: "First real test is the live event itself. No structured rehearsal, no tech check, fingers crossed." },
      { label: "Live Troubleshooting", desc: "Audio doesn't work? Presenter can't share? You're the IT help desk during your own event." },
      { label: "Scaling Struggles", desc: "Multi-session, multi-track events are exponentially harder to manage alone on Zoom." },
      { label: "Post-Event Chaos", desc: "Recordings, reports, follow-ups all manual. No process, no templates, no support." },
    ],
    oe: [
      { label: "Full Onboarding", desc: "OE's team configures your Zoom Webinar or Zoom Events environment. Settings, roles, permissions — done for you." },
      { label: "Training & Enablement", desc: "Hands-on training for your team and presenters. Everyone knows the platform before day one." },
      { label: "Structured Rehearsals", desc: "Full dress rehearsals with your speakers. Test every slide, every transition, every backup plan." },
      { label: "Live Production Team", desc: "OE operators manage the event in real time. Audio, video, transitions, troubleshooting — all handled." },
      { label: "Multi-Track Execution", desc: "Complex multi-session events with breakout rooms, parallel tracks, and seamless attendee routing." },
      { label: "Post-Event Delivery", desc: "Recordings processed, reports generated, and follow-up materials delivered — all part of the service." },
    ],
  },
];

/* ─── Page ─── */

export default function OEMicrosite() {
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(defaultRoles.map((r) => [r.id, r.defaultRate]))
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      {/* Back link */}
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div style={{ padding: "0 24px", marginBottom: 40 }}>
        <h1
          style={{
            ...serif,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Manual Process vs. OpenExchange
        </h1>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          Left: everything you juggle today. Right: the end-to-end platform that replaces it all.
          <br />
          Foundation: the four verticals this serves.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      {/* ─── OVERVIEW SIDE BY SIDE ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          padding: "0 24px",
          marginBottom: 48,
        }}
      >
        {/* LEFT: Manual */}
        <div
          style={{
            background: "#fef2f2",
            border: "2px solid #fecaca",
            borderRadius: 16,
            padding: 4,
          }}
        >
          <div
            style={{
              background: "#fee2e2",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>
                Manual / DIY
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>
              Fragmented tools, scattered processes
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {manualSteps.map((phase) => (
              <div
                key={phase.phase}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#ef4444",
                    marginBottom: 6,
                  }}
                >
                  {phase.phase}
                </p>
                {phase.items.map((item) => (
                  <p
                    key={item}
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      lineHeight: 1.5,
                      paddingLeft: 12,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "#fca5a5" }}>—</span>
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: OE End-to-End */}
        <div
          style={{
            background: "#ecfdf5",
            border: "2px solid #a7f3d0",
            borderRadius: 16,
            padding: 4,
          }}
        >
          <div
            style={{
              background: "#d1fae5",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#059669" }}>✓</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>
                OE End-to-End
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>
              6 products, one platform, every stage covered
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {oeSteps.map((step, i) => (
              <a
                key={step.name}
                href={`#${step.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  display: "block",
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 16px",
                  transition: "all 0.15s ease",
                  border: "1px solid transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #008285"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,130,133,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#008285",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ ...serif, fontSize: 13, fontWeight: 700, color: "#111827" }}>{step.name}</span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "#008285",
                          background: "#f0fafa",
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {step.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#008285", marginLeft: "auto" }}>↓</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4, marginTop: 2 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < oeSteps.length - 1 && (
                  <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: 14, marginTop: 4 }}>
                    ↓
                  </div>
                )}
              </a>
            ))}

            {/* Result */}
            <div
              style={{
                background: "#008285",
                borderRadius: 10,
                padding: "14px 16px",
                color: "#fff",
              }}
            >
              <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>
                Result: Peace of Mind
              </span>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 1.4 }}>
                Platform handles the tech. Team handles the execution. You focus on your message.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── WHO'S DOING THIS WORK? ─── */}
      <div style={{ padding: "0 24px", marginBottom: 48 }}>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
            marginBottom: 32,
          }}
        />
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          The Hidden Cost — Who&apos;s Doing All This Work?
        </p>
        <p
          style={{
            ...serif,
            fontSize: 13,
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          Click a role to highlight which manual phases they own. Edit hourly rates to see your real cost.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {defaultRoles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(isSelected ? null : role.id)}
                style={{
                  background: isSelected ? "#fef2f2" : "#fff",
                  border: `2px solid ${isSelected ? "#fca5a5" : "#f0f0f0"}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{role.icon}</span>
                  <span style={{ ...serif, fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {role.title}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4, marginBottom: 10 }}>
                  {role.desc}
                </p>
                {/* Hourly rate */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: isSelected ? "#fee2e2" : "#f9fafb",
                    borderRadius: 8,
                    padding: "6px 10px",
                    width: "fit-content",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span style={{ fontSize: 11, color: "#6b7280" }}>$</span>
                  {editingRole === role.id ? (
                    <input
                      type="number"
                      value={rates[role.id]}
                      onChange={(e) =>
                        setRates((prev) => ({ ...prev, [role.id]: Number(e.target.value) || 0 }))
                      }
                      onBlur={() => setEditingRole(null)}
                      onKeyDown={(e) => { if (e.key === "Enter") setEditingRole(null); }}
                      autoFocus
                      style={{
                        width: 50,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#dc2626",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    />
                  ) : (
                    <span
                      onClick={(e) => { e.stopPropagation(); setEditingRole(role.id); }}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isSelected ? "#dc2626" : "#374151",
                        cursor: "text",
                        borderBottom: "1px dashed #d1d5db",
                        lineHeight: 1,
                      }}
                    >
                      {rates[role.id]}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "#6b7280" }}>/hr</span>
                </div>
                {/* Phase tags */}
                {isSelected && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    {role.phases.map((phase) => (
                      <span
                        key={phase}
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "#dc2626",
                          background: "#fee2e2",
                          padding: "2px 8px",
                          borderRadius: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {phase}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total cost hint */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#991b1b" }}>
            Combined hourly cost of manual event execution
          </span>
          <span style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#dc2626" }}>
            ${Object.values(rates).reduce((a, b) => a + b, 0)}/hr
          </span>
        </div>
      </div>

      {/* ─── PRODUCT DEEP DIVES ─── */}
      {productDetails.map((product, idx) => (
        <div
          key={product.id}
          id={product.id}
          style={{
            padding: "0 24px",
            marginBottom: idx < productDetails.length - 1 ? 56 : 48,
            scrollMarginTop: 24,
          }}
        >
          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
              marginBottom: 32,
            }}
          />

          {/* Product header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{product.emoji}</span>
            <h2 style={{ ...serif, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {product.name}
            </h2>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
              {product.tag}
            </span>
          </div>
          <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65, marginBottom: 20 }}>
            {product.subtitle}
          </p>

          {/* Side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* LEFT: DIY */}
            <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
              <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
                  <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>{product.diyTitle}</span>
                </div>
                <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>{product.diySubtitle}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
                {product.diy.map((item) => (
                  <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: OE */}
            <div style={{ background: "#ecfdf5", border: "2px solid #a7f3d0", borderRadius: 16, padding: 4 }}>
              <div style={{ background: "#d1fae5", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, color: "#059669" }}>✓</span>
                  <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>{product.oeTitle}</span>
                </div>
                <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>{product.oeSubtitle}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
                {product.oe.map((item) => (
                  <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ─── FOUNDATION: 4 VERTICAL PILLARS ─── */}
      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
            marginBottom: 32,
          }}
        />
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Foundation — Who This Serves
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {pillars.map((p) => (
            <div
              key={p.name}
              style={{
                background: p.color,
                borderRadius: "0 0 12px 12px",
                padding: "20px 16px",
                color: "#fff",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: 4,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "0 0 4px 4px",
                }}
              />
              <h3 style={{ ...serif, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                {p.sub}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #008285, #134e4a)",
            borderRadius: 2,
            marginTop: 0,
          }}
        />
      </div>
    </div>
  );
}
