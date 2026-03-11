"use client";

import Link from "next/link";
import { useState } from "react";
import { saveToQueue } from "@/app/agents/outreach/page";

const serif = { fontFamily: "Georgia, serif" };
const sans = { fontFamily: "system-ui, sans-serif" };

type SeedFilter = "all" | "intuit" | "siena" | "gibson";

interface Company {
  name: string;
  industry: string;
  size: string;
  hq: string;
  similarTo: "intuit" | "siena" | "gibson";
  description: string;
  eventTypes: string[];
  whyItFits: string;
  targetRoles: string[];
  outreachAngle: string;
}

const companies: Company[] = [
  // ── Like Intuit ──────────────────────────────────────────────────────────────
  {
    name: "Workday",
    industry: "Enterprise HCM / Finance SaaS",
    size: "~18,000 employees",
    hq: "Pleasanton, CA",
    similarTo: "intuit",
    description: "Workday serves 10,000+ enterprise customers across HR, finance, and planning. Their flagship Workday Rising conference draws 30k+ attendees; they run quarterly product launches and ongoing customer education across 45k+ users.",
    eventTypes: ["Annual user conference (30k+ attendees)", "Quarterly product webinars", "Partner certification events", "Internal L&D broadcasts"],
    whyItFits: "Multi-business-unit event cadence, massive customer base that needs scalable virtual delivery, and a brand that demands a polished experience — not a generic webinar.",
    targetRoles: ["Director of Event Technology", "VP of Customer Education", "Head of Partner Programs", "Enterprise Events Manager"],
    outreachAngle: "Workday Rising is one of the biggest enterprise SaaS events on the calendar. If they're running it partially virtual, that's a Zoom Events conversation — branded lobby, breakout sessions, analytics at scale.",
  },
  {
    name: "ADP",
    industry: "HR / Payroll SaaS + Services",
    size: "~60,000 employees",
    hq: "Roseland, NJ",
    similarTo: "intuit",
    description: "ADP serves 1M+ businesses. They run constant compliance webinars, product update broadcasts, and the annual ReThink conference for HR leaders. Their event volume is enormous across client-facing and internal channels.",
    eventTypes: ["Compliance update webinars (weekly)", "Product launch events", "ReThink HR conference", "Certified practitioner training"],
    whyItFits: "ADP's compliance-driven webinar cadence is one of the highest-volume in enterprise software. Volume + brand = a natural Zoom Events upgrade conversation.",
    targetRoles: ["VP of Client Events", "Director of Training & Certification", "Head of HR Tech Partnerships", "Enterprise Events Manager"],
    outreachAngle: "ADP runs more compliance webinars than most companies run all-hands. If they're still on a legacy platform, the Zoom Events ROI story practically writes itself.",
  },
  {
    name: "Veeva Systems",
    industry: "Life Sciences SaaS (CRM / Vault)",
    size: "~7,000 employees",
    hq: "Pleasanton, CA",
    similarTo: "intuit",
    description: "Veeva is the dominant CRM and content platform for pharma and biotech. They run the annual Veeva Commercial Summit (flagship), regional roadshows, and ongoing training webinars for 1,000+ life sciences clients.",
    eventTypes: ["Veeva Commercial Summit (flagship)", "Regional education roadshows", "Product training webinars", "Partner certifications"],
    whyItFits: "Life sciences has strict compliance requirements for recorded/virtual events. Veeva's clients expect enterprise-grade control. Zoom Events with admin reporting checks those boxes.",
    targetRoles: ["VP of Customer Success Events", "Head of Commercial Marketing", "Director of Partner Education", "Field Events Manager"],
    outreachAngle: "Pharma and biotech clients hold events to a higher compliance standard. Zoom Events' recording controls and attendee reporting are differentiators in this vertical.",
  },
  {
    name: "Brex",
    industry: "Fintech SaaS (Corporate Cards / Spend Management)",
    size: "~1,200 employees",
    hq: "San Francisco, CA",
    similarTo: "intuit",
    description: "Brex targets CFOs and finance teams at high-growth companies. They run CFO roundtables, finance leader webinar series, and customer education events — all positioned as premium executive experiences.",
    eventTypes: ["CFO roundtables", "Finance leader webinar series", "Customer onboarding broadcasts", "Partner co-marketing events"],
    whyItFits: "Brex's audience is CFOs and VPs of Finance — they expect a polished, modern event experience. A consumer-feeling webinar tool doesn't match the brand.",
    targetRoles: ["Head of Events", "Director of Customer Marketing", "VP of Revenue Marketing", "Head of Executive Programs"],
    outreachAngle: "Brex hosts premium executive events for CFOs. Their event platform should feel as premium as their product. That's Zoom Events with custom branding, not a generic tool.",
  },

  // ── Like Siena AI ────────────────────────────────────────────────────────────
  {
    name: "Intercom",
    industry: "AI Customer Support SaaS",
    size: "~900 employees",
    hq: "San Francisco, CA",
    similarTo: "siena",
    description: "Intercom builds AI-powered customer messaging. They run a high-frequency customer education series, product launch webinars, and partner enablement — all recurring, all tied to product adoption metrics.",
    eventTypes: ["Monthly customer education webinars", "Product launch events", "Partner enablement series", "Developer onboarding sessions"],
    whyItFits: "Intercom's event model is exactly what Zoom Events was built for: recurring series, registration, post-event analytics tied to product adoption. High volume, growth-stage energy.",
    targetRoles: ["Head of Customer Education", "Director of Partner Marketing", "VP of Community", "Customer Success Programs Lead"],
    outreachAngle: "Intercom runs a webinar series every month for customer education. If they're measuring attendee-to-adoption conversion, Zoom Events' analytics are the upgrade.",
  },
  {
    name: "Gong",
    industry: "Revenue Intelligence AI",
    size: "~1,300 employees",
    hq: "San Francisco, CA",
    similarTo: "siena",
    description: "Gong runs Celebrate — one of the best mid-size SaaS conferences (~5k attendees). They also run a weekly enablement webinar series and industry panels for revenue leaders. Event marketing is core to their growth motion.",
    eventTypes: ["Celebrate annual conference (5k+ attendees)", "Weekly revenue enablement webinars", "Industry panels", "Sales training broadcasts"],
    whyItFits: "Gong has a big event brand. Celebrate is growing. Their event platform should scale with it — and the transition from Zoom Meetings to Zoom Events is a natural conversation.",
    targetRoles: ["VP of Marketing Events", "Director of Revenue Enablement", "Head of Field Marketing", "Community Programs Manager"],
    outreachAngle: "Celebrate is one of the best events in SaaS. If they're running it on legacy tools, there's a clear upgrade conversation around branded lobbies, breakouts, and attendee analytics.",
  },
  {
    name: "Highspot",
    industry: "Sales Enablement AI",
    size: "~1,200 employees",
    hq: "Seattle, WA",
    similarTo: "siena",
    description: "Highspot runs Spark — their annual summit — plus monthly customer webinars and partner training. They're in the same AI SaaS category as Siena AI with a similar event growth curve.",
    eventTypes: ["Spark annual summit", "Monthly customer webinars", "Partner training events", "Enablement certification programs"],
    whyItFits: "Highspot's Spark conference is growing annually. Same pattern as Siena AI — education-first event strategy where the event experience reflects product quality.",
    targetRoles: ["Director of Customer Events", "Head of Field Marketing", "VP of Partner Success", "Events & Community Manager"],
    outreachAngle: "Spark is Highspot's flagship moment every year. If the event experience doesn't match the product experience, there's a gap Zoom Events closes.",
  },
  {
    name: "Salesloft",
    industry: "Revenue AI Platform",
    size: "~800 employees",
    hq: "Atlanta, GA",
    similarTo: "siena",
    description: "Salesloft runs Rainmaker — a flagship revenue conference — plus a weekly webinar series for SDRs and AEs. Strong event marketing DNA, growing into the AI sales category.",
    eventTypes: ["Rainmaker annual conference", "Weekly SDR/AE webinar series", "Customer success broadcasts", "Partner co-marketing events"],
    whyItFits: "Rainmaker is one of the best revenue-focused conferences in SaaS. Same ICP pattern as Siena AI — AI SaaS, customer education-forward, event marketing as top-of-funnel.",
    targetRoles: ["Director of Marketing Events", "Head of Customer Success Programs", "VP of Revenue Marketing", "Field Marketing Manager"],
    outreachAngle: "Rainmaker attendance has been growing. If they're hitting the ceiling on what their current platform can handle, that's the conversation opener.",
  },

  // ── Like Gibson Dunn ─────────────────────────────────────────────────────────
  {
    name: "Kirkland & Ellis",
    industry: "Law Firm — AmLaw #1",
    size: "~3,400 attorneys",
    hq: "Chicago, IL (offices in LA, NY, London, HK)",
    similarTo: "gibson",
    description: "Kirkland is the highest-grossing law firm in the world. They run CLE webinars across 30+ practice groups weekly, private equity deal education events, and client alert broadcasts. Event volume is enormous.",
    eventTypes: ["Weekly CLE webinars (30+ practice groups)", "Private equity deal education events", "Client alert broadcasts", "Lateral partner recruiting events"],
    whyItFits: "Kirkland runs more webinars per week than most media companies. A modern event platform with CLE credit tracking and attendee reporting is a direct ROI conversation.",
    targetRoles: ["Director of Client Development", "Head of Knowledge Management", "Marketing Technology Director", "Director of Business Development"],
    outreachAngle: "Kirkland's CLE cadence is one of the highest in AmLaw. If they're running 30+ webinars a week and still on legacy infrastructure, the operational savings alone justify the switch.",
  },
  {
    name: "Latham & Watkins",
    industry: "Law Firm — AmLaw Top 3",
    size: "~3,500 attorneys",
    hq: "Los Angeles, CA (30+ global offices)",
    similarTo: "gibson",
    description: "Latham has 30+ offices globally and runs a massive global webinar calendar across practice groups. Client entertainment events, regulatory update webinars, and global panels are all part of their business development engine.",
    eventTypes: ["Global webinar series (practice groups)", "Regulatory update client events", "Client entertainment events", "Cross-border deal education"],
    whyItFits: "Latham's global footprint means events span time zones and offices. A unified platform with centralized reporting across 30+ offices is a clear upgrade from fragmented tools.",
    targetRoles: ["Chief Marketing Officer", "Director of Digital Programs", "Knowledge Management Partner", "Global Events Director"],
    outreachAngle: "Running events across 30+ offices globally means fragmented reporting and inconsistent brand. Zoom Events centralizes that — one platform, one dashboard, global reach.",
  },
  {
    name: "Orrick, Herrington & Sutcliffe",
    industry: "Law Firm — AmLaw Top 35 (Tech Focus)",
    size: "~1,100 attorneys",
    hq: "San Francisco, CA",
    similarTo: "gibson",
    description: "Orrick focuses heavily on tech, energy, and finance clients. They run tech industry CLE events, startup founder education, and ESG thought leadership webinars. Strong brand in Silicon Valley legal.",
    eventTypes: ["Tech industry CLE webinars", "Startup founder education events", "ESG thought leadership panels", "Client entertainment events"],
    whyItFits: "Orrick's tech-focused clients are digital-native. Their clients expect modern event experiences. A law firm running consumer-grade webinar tools creates a brand mismatch.",
    targetRoles: ["CMO", "Director of Business Development Events", "Knowledge Management Director", "Head of Client Experience"],
    outreachAngle: "Orrick's clients are tech companies. When a law firm runs a webinar for a Series C startup, the event platform signals something about the firm's sophistication.",
  },
  {
    name: "Mayer Brown",
    industry: "Law Firm — AmLaw Top 15 (Financial Services Focus)",
    size: "~1,700 attorneys",
    hq: "Chicago, IL (offices in London, NY, Houston, Asia)",
    similarTo: "gibson",
    description: "Mayer Brown is a global firm with one of the deepest financial services practices. They run regulatory update events for banking clients, structured finance CLE, and client education across capital markets.",
    eventTypes: ["Regulatory update events for banking clients", "Structured finance CLE webinars", "Capital markets client education", "Cross-border deal briefings"],
    whyItFits: "Financial services CLE is compliance-heavy and high-frequency. Mayer Brown's event volume for bank and PE clients is one of the highest in AmLaw.",
    targetRoles: ["Director of Events", "CMO", "Partner Development Lead", "Head of Client Marketing"],
    outreachAngle: "Banking clients expect precision in everything — including the event experience. If Mayer Brown's current platform doesn't deliver on that, there's a conversation to be had.",
  },
];

const seedLabels: Record<SeedFilter, string> = {
  all: "All",
  intuit: "Like Intuit",
  siena: "Like Siena AI",
  gibson: "Like Gibson Dunn",
};

const seedColors: Record<"intuit" | "siena" | "gibson", { bg: string; border: string; text: string }> = {
  intuit: { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
  siena: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  gibson: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
};

export default function ProspectingReport20260310() {
  const [filter, setFilter] = useState<SeedFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [draftLoading, setDraftLoading] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});
  const [savedToQueue, setSavedToQueue] = useState<Record<string, boolean>>({});

  const draftEmail = async (co: Company, role: string) => {
    const key = `${co.name}__${role}`;
    setDraftLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: co.name,
          industry: co.industry,
          size: co.size,
          hq: co.hq,
          eventTypes: co.eventTypes,
          targetRole: role,
          outreachAngle: co.outreachAngle,
        }),
      });
      const data = await res.json();
      if (res.ok && data.email) {
        setDrafts((prev) => ({ ...prev, [key]: data.email }));
      }
    } finally {
      setDraftLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const addToQueue = (co: Company, role: string) => {
    const key = `${co.name}__${role}`;
    const draft = drafts[key];
    if (!draft) return;
    saveToQueue({
      companyName: co.name,
      industry: co.industry,
      targetRole: role,
      subject: draft.subject,
      body: draft.body,
    });
    setSavedToQueue((prev) => ({ ...prev, [key]: true }));
  };

  const filtered = filter === "all" ? companies : companies.filter((c) => c.similarTo === filter);

  const counts = {
    intuit: companies.filter((c) => c.similarTo === "intuit").length,
    siena: companies.filter((c) => c.similarTo === "siena").length,
    gibson: companies.filter((c) => c.similarTo === "gibson").length,
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 96px", ...serif }}>
      {/* Back */}
      <Link href="/reports/prospecting" style={{ fontSize: 12, color: "#9ca3af", ...sans, textDecoration: "none" }}>
        &larr; Prospecting Reports
      </Link>

      {/* Header */}
      <div style={{ marginTop: 24, marginBottom: 40 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#c0c0c0", ...sans, marginBottom: 12 }}>
          Prospecting Report
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          Week of Mar 10, 2026
        </h1>
        <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 16px 0" }}>
          12 lookalike companies for the Zoom Events pipeline — seeded from Intuit, Siena AI, and Gibson Dunn.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, marginBottom: 16 }}>
          {[
            { value: "12", label: "Companies" },
            { value: counts.intuit.toString(), label: "Like Intuit" },
            { value: counts.siena.toString(), label: "Like Siena AI" },
            { value: counts.gibson.toString(), label: "Like Gibson Dunn" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 16px", textAlign: "center" as const, minWidth: 70 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#008285", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#6b7280", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2 }} />
      </div>

      {/* Seed Client Reference */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", ...sans, marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
          ICP Seeds
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
          {[
            { name: "Intuit", desc: "Large fintech SaaS — multi-dept events, partner webinars, training", key: "intuit" as const },
            { name: "Siena AI", desc: "AI SaaS startup — customer education, product demos, partner enablement", key: "siena" as const },
            { name: "Gibson Dunn", desc: "AmLaw 200 — CLE webinars, client events, thought leadership", key: "gibson" as const },
          ].map((seed) => (
            <div key={seed.key} style={{ background: seedColors[seed.key].bg, border: `1px solid ${seedColors[seed.key].border}`, borderRadius: 8, padding: "10px 14px", flex: "1 1 180px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: seedColors[seed.key].text, marginBottom: 4 }}>{seed.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, ...sans }}>{seed.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
        {(["all", "intuit", "siena", "gibson"] as SeedFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              ...sans,
              padding: "6px 14px",
              borderRadius: 20,
              border: filter === f ? "1px solid #008285" : "1px solid #e5e7eb",
              background: filter === f ? "#008285" : "#fff",
              color: filter === f ? "#fff" : "#6b7280",
              cursor: "pointer",
            }}
          >
            {seedLabels[f]}
            {f !== "all" && (
              <span style={{ marginLeft: 6, opacity: 0.8 }}>
                {counts[f as keyof typeof counts]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Company Cards */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
        {filtered.map((co) => {
          const isExpanded = expanded === co.name;
          const colors = seedColors[co.similarTo];
          return (
            <div
              key={co.name}
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : co.name)}
                style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{co.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, ...sans, color: colors.text, background: colors.bg, border: `1px solid ${colors.border}`, padding: "2px 8px", borderRadius: 20 }}>
                      Like {co.similarTo === "siena" ? "Siena AI" : co.similarTo === "gibson" ? "Gibson Dunn" : "Intuit"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", ...sans, marginBottom: 6 }}>
                    {co.industry} &middot; {co.size} &middot; {co.hq}
                  </div>
                  <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>
                    {co.description}
                  </p>
                </div>
                <span style={{ fontSize: 18, color: "#d1d5db", flexShrink: 0, marginTop: 2, transform: isExpanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s" }}>
                  &rsaquo;
                </span>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid #f9fafb" }}>
                  {/* Event Types */}
                  <div style={{ marginBottom: 16, paddingTop: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>
                      Event Types They Run
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                      {co.eventTypes.map((et) => (
                        <span key={et} style={{ fontSize: 12, color: "#374151", background: "#f9fafb", border: "1px solid #f0f0f0", padding: "4px 10px", borderRadius: 20, ...sans }}>
                          {et}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Why It Fits */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>
                      Why It Fits
                    </div>
                    <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, margin: 0 }}>{co.whyItFits}</p>
                  </div>

                  {/* Who to Hit Up */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>
                      Who to Hit Up — Find on LinkedIn
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                      {co.targetRoles.map((role) => {
                        const liUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(role + " " + co.name)}&origin=GLOBAL_SEARCH_HEADER`;
                        return (
                          <div key={role} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fafa", border: "1px solid #e0f0f0", borderRadius: 8, padding: "8px 12px" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#008285", ...sans }}>{role}</span>
                            <a
                              href={liUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ fontSize: 11, fontWeight: 700, color: "#0077b5", background: "#fff", border: "1px solid #0077b5", borderRadius: 6, padding: "3px 10px", textDecoration: "none", ...sans, whiteSpace: "nowrap" as const }}
                            >
                              Find on LinkedIn →
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Outreach Angle */}
                  <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>
                      Outreach Hook
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                      &ldquo;{co.outreachAngle}&rdquo;
                    </p>
                  </div>

                  {/* Draft Emails */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>
                      Draft Outreach Emails
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                      {co.targetRoles.slice(0, 2).map((role) => {
                        const key = `${co.name}__${role}`;
                        const draft = drafts[key];
                        const loading = draftLoading[key];
                        const saved = savedToQueue[key];
                        const liUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(role + " " + co.name)}&origin=GLOBAL_SEARCH_HEADER`;
                        return (
                          <div key={role} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                            {/* Role header + draft button */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fafb", gap: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", ...sans }}>{role}</span>
                                <a href={liUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 10, fontWeight: 700, color: "#0077b5", textDecoration: "none", ...sans }}>
                                  LinkedIn →
                                </a>
                              </div>
                              {!draft ? (
                                <button
                                  onClick={() => draftEmail(co, role)}
                                  disabled={loading}
                                  style={{ fontSize: 11, fontWeight: 700, ...sans, padding: "5px 12px", borderRadius: 6, border: "none", background: loading ? "#f3f4f6" : "#008285", color: loading ? "#9ca3af" : "#fff", cursor: loading ? "default" : "pointer" }}
                                >
                                  {loading ? "Drafting…" : "Draft Email"}
                                </button>
                              ) : (
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`)}
                                    style={{ fontSize: 11, fontWeight: 600, ...sans, padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}
                                  >
                                    Copy
                                  </button>
                                  <button
                                    onClick={() => addToQueue(co, role)}
                                    disabled={saved}
                                    style={{ fontSize: 11, fontWeight: 700, ...sans, padding: "5px 10px", borderRadius: 6, border: "none", background: saved ? "#f0fdf4" : "#008285", color: saved ? "#15803d" : "#fff", cursor: saved ? "default" : "pointer" }}
                                  >
                                    {saved ? "✓ In Queue" : "Add to Queue"}
                                  </button>
                                </div>
                              )}
                            </div>
                            {/* Draft content */}
                            {draft && (
                              <div style={{ padding: "12px 14px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", ...sans, marginBottom: 4 }}>SUBJECT</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 10 }}>{draft.subject}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", ...sans, marginBottom: 4 }}>BODY</div>
                                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-line" }}>{draft.body}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Link to queue */}
                    <div style={{ marginTop: 10, textAlign: "right" as const }}>
                      <Link href="/agents/outreach" style={{ fontSize: 11, color: "#008285", ...sans, textDecoration: "none", fontWeight: 600 }}>
                        View Outreach Queue →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, marginTop: 48, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#c0c0c0", ...sans }}>
        <span>Open Exchange &middot; Confidential</span>
        <span>Prospecting Report &middot; Mar 10, 2026</span>
      </div>
    </div>
  );
}
