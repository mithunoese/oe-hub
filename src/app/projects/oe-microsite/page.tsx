"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { jsPDF } from "jspdf";

const serif = { fontFamily: "Georgia, serif" };
const sans = { fontFamily: "system-ui, -apple-system, sans-serif" };

/* ─── Roles ─── */

const defaultRoles = [
  { id: "event-mgr", title: "Event Manager", icon: "📋", defaultRate: 85 },
  { id: "it-support", title: "IT / Tech Support", icon: "💻", defaultRate: 75 },
  { id: "av-tech", title: "AV Technician", icon: "🎬", defaultRate: 95 },
  { id: "mktg-ops", title: "Marketing Ops", icon: "📊", defaultRate: 70 },
  { id: "exec-admin", title: "Executive Admin", icon: "📎", defaultRate: 55 },
  { id: "crm-admin", title: "CRM / Salesforce Admin", icon: "🗄", defaultRate: 90 },
];

/* ─── Products with DIY (hours + risk) and OE features ─── */

const products = [
  {
    id: "oe-central", emoji: "⌘", name: "OE Central", tag: "Command Center",
    subtitle: "360° organizer dashboard — tracking, scheduling, collaboration",
    diy: [
      { label: "Run-of-Show", desc: "Spreadsheets emailed back and forth", hrs: 8, risk: 2000 },
      { label: "Attendee Tracking", desc: "Manual headcounts, no real-time visibility", hrs: 4, risk: 1500 },
      { label: "Presenter Coordination", desc: "Email chains, hoping speakers show up on time", hrs: 6, risk: 3000 },
      { label: "Scheduling", desc: "Google Sheets, no session-level granularity", hrs: 5, risk: 1000 },
      { label: "Collaboration", desc: "Scattered across Slack, email, docs", hrs: 3, risk: 500 },
      { label: "Day-of Visibility", desc: "Flying blind — no dashboard, gut feel", hrs: 4, risk: 5000 },
    ],
    oe: [
      { label: "360° Dashboard", desc: "Real-time view of every attendee, presenter, session" },
      { label: "Live Attendee Tracking", desc: "See who's where — in real time, not after" },
      { label: "Presenter Management", desc: "Speaker readiness, slides, rehearsal status" },
      { label: "Smart Scheduling", desc: "Drag-and-drop with conflict detection" },
      { label: "Team Collaboration", desc: "Built-in chat, tasks, notes — no external tools" },
      { label: "PM Assigned", desc: "Dedicated OE account manager runs logistics" },
    ],
  },
  {
    id: "oe-passport", emoji: "🎫", name: "OE Passport", tag: "Participant Hub",
    subtitle: "Branded attendee microsite — agendas, one-click access, materials",
    diy: [
      { label: "12 Zoom Links", desc: "Wall of URLs, hope they click the right one", hrs: 3, risk: 2000 },
      { label: "No Personalization", desc: "Same generic email for everyone", hrs: 2, risk: 1000 },
      { label: "PDF Agendas", desc: "Static, outdated by the time they're sent", hrs: 3, risk: 500 },
      { label: "Material Distribution", desc: "Attachments in follow-up emails, half missed", hrs: 4, risk: 800 },
      { label: "On-Demand Access", desc: "Recordings dumped on SharePoint, no tracking", hrs: 5, risk: 1500 },
      { label: "Mobile Experience", desc: "Nothing — Zoom links on a phone browser", hrs: 2, risk: 2000 },
    ],
    oe: [
      { label: "Branded Microsite", desc: "Custom-branded portal with your logo and messaging" },
      { label: "Personalized Agendas", desc: "Sessions relevant to each attendee's role" },
      { label: "One-Click Access", desc: "Smart links — no wrong rooms, no confusion" },
      { label: "Downloadable Materials", desc: "Resources attached to each session" },
      { label: "Video Library", desc: "On-demand replays with viewer tracking" },
      { label: "Responsive Design", desc: "Full mobile experience on any device" },
    ],
  },
  {
    id: "oe-stream", emoji: "▶", name: "OE Stream", tag: "Webcasting",
    subtitle: "HD 1080p live + on-demand — translation, transcription, captioning",
    diy: [
      { label: "Generic Zoom/Teams", desc: "No branding, no lower thirds, no graphics", hrs: 2, risk: 5000 },
      { label: "Amateur Audio/Video", desc: "Webcam quality, inconsistent audio", hrs: 4, risk: 3000 },
      { label: "No Live Translation", desc: "Manual interpreter setup — complex, unreliable", hrs: 6, risk: 4000 },
      { label: "No Captioning", desc: "DIY auto-captions are inaccurate", hrs: 3, risk: 2000 },
      { label: "Awkward Transitions", desc: "Dead air switching between speakers", hrs: 3, risk: 3000 },
      { label: "Pre-Record vs Live", desc: "All-live (risky) or MP4 (clunky)", hrs: 5, risk: 4000 },
    ],
    oe: [
      { label: "Broadcast-Quality", desc: "Custom layouts, lower thirds, HD 1080p output" },
      { label: "Professional A/V", desc: "Multi-camera, audio mixing, live production team" },
      { label: "Live Translation", desc: "Built-in simultaneous translation, multiple languages" },
      { label: "Auto Captioning", desc: "Real-time closed captioning, high accuracy" },
      { label: "Multi-Source Feeds", desc: "Seamless switching — no dead air" },
      { label: "Pre-Record + Live Q&A", desc: "Blend both seamlessly, de-risk your keynote" },
    ],
  },
  {
    id: "oe-podium", emoji: "🎙", name: "OE Podium", tag: "Presenter Panel",
    subtitle: "Backstage portal — slide control, private chat, moderated Q&A",
    diy: [
      { label: "Speakers Mixed In", desc: "No backstage, no preparation space", hrs: 2, risk: 5000 },
      { label: "Hot-Mic Risk", desc: "One unmuted speaker derails everything", hrs: 1, risk: 8000 },
      { label: "Slide Chaos", desc: "Screen share pass-around, awkward handoffs", hrs: 3, risk: 2000 },
      { label: "No Private Comms", desc: "Speakers can't message without audience seeing", hrs: 1, risk: 1500 },
      { label: "Q&A Free-for-All", desc: "Chat floods with no moderation", hrs: 2, risk: 2000 },
      { label: "No Rehearsals", desc: "Speakers test on the live call", hrs: 4, risk: 6000 },
    ],
    oe: [
      { label: "Separate Backstage", desc: "Private portal — audience doesn't see until showtime" },
      { label: "Audio Isolation", desc: "Muted by default, OE controls when mics go live" },
      { label: "Slide Control", desc: "Presenters manage slides from backstage panel" },
      { label: "Private Chat", desc: "Speakers message each other and production team" },
      { label: "Moderated Q&A", desc: "Questions queued, filtered, prioritized" },
      { label: "Full Rehearsals", desc: "24-hour test lines in the same environment" },
    ],
  },
  {
    id: "oe-integrations", emoji: "⚡", name: "OE Integrations", tag: "API Layer",
    subtitle: "Salesforce, marketing automation, analytics — data flows automatically",
    diy: [
      { label: "CSV → Excel → Import", desc: "Download, clean, import to Salesforce every time", hrs: 6, risk: 3000 },
      { label: "No Real-Time Data", desc: "Engagement data only after event ends", hrs: 2, risk: 2000 },
      { label: "Registration Disconnect", desc: "Manual reconciliation between systems", hrs: 4, risk: 1500 },
      { label: "Marketing Blind Spot", desc: "No idea who attended or how engaged", hrs: 3, risk: 4000 },
      { label: "Content Scattered", desc: "Recordings uploaded manually everywhere", hrs: 5, risk: 1000 },
      { label: "Analytics Silos", desc: "Zoom, registration, Salesforce — no single view", hrs: 4, risk: 2500 },
    ],
    oe: [
      { label: "Direct CRM Integration", desc: "Salesforce, HubSpot — data flows automatically" },
      { label: "Real-Time API", desc: "Live engagement data during the event" },
      { label: "Registration Sync", desc: "One registration, everywhere it needs to go" },
      { label: "Marketing Automation", desc: "Auto follow-ups via Marketo, Eloqua, HubSpot" },
      { label: "Embeddable Content", desc: "Embed sessions anywhere via API" },
      { label: "Unified Analytics", desc: "One dashboard — all engagement metrics" },
    ],
  },
  {
    id: "zoom-services", emoji: "🤝", name: "Zoom Services", tag: "Partnership",
    subtitle: "Managed Zoom Webinars + Events — rehearsals, live execution",
    diy: [
      { label: "Self-Service Setup", desc: "Figure out Zoom Webinar settings yourself", hrs: 6, risk: 3000 },
      { label: "No Onboarding", desc: "Hours learning features you'll use once", hrs: 4, risk: 1000 },
      { label: "Untested Events", desc: "First real test is the live event itself", hrs: 2, risk: 8000 },
      { label: "Live Troubleshooting", desc: "You're the IT help desk during your own event", hrs: 3, risk: 5000 },
      { label: "Scaling Struggles", desc: "Multi-track events exponentially harder alone", hrs: 5, risk: 4000 },
      { label: "Post-Event Chaos", desc: "Recordings, reports, follow-ups all manual", hrs: 6, risk: 1500 },
    ],
    oe: [
      { label: "Full Onboarding", desc: "OE configures your Zoom environment" },
      { label: "Training", desc: "Hands-on training for team and presenters" },
      { label: "Structured Rehearsals", desc: "Full dress rehearsals with speakers" },
      { label: "Live Production Team", desc: "OE operators handle everything in real time" },
      { label: "Multi-Track Execution", desc: "Breakout rooms, parallel tracks, attendee routing" },
      { label: "Post-Event Delivery", desc: "Recordings, reports, materials — all delivered" },
    ],
  },
];

/* ─── Soft Benefits (OE side value) ─── */

const defaultSoftBenefits = [
  { id: "brand", label: "Brand Authority", desc: "One bad earnings call can move your stock. Polished delivery signals operational maturity.", icon: "🏛", defaultValue: 250000 },
  { id: "experience", label: "Attendee Experience", desc: "Higher NPS means analysts come back. Zoom fatigue means they don't.", icon: "✦", defaultValue: 120000 },
  { id: "productivity", label: "Team Productivity", desc: "Your IR team should be targeting investors, not troubleshooting audio.", icon: "⚡", defaultValue: 150000 },
  { id: "speed", label: "Speed to Market", desc: "When an activist shows up, you need to be live in 24 hours, not 2 weeks.", icon: "🚀", defaultValue: 100000 },
  { id: "compliance", label: "Compliance Assurance", desc: "Reg FD violations and AGM procedural defects are existential risks.", icon: "🛡", defaultValue: 200000 },
  { id: "data", label: "Engagement Intelligence", desc: "Know which analyst watched which slide for how long — changes your follow-up.", icon: "📈", defaultValue: 120000 },
  { id: "csuite", label: "C-Suite Confidence", desc: "Your CFO should be thinking about guidance, not screen-sharing.", icon: "👔", defaultValue: 80000 },
  { id: "retention", label: "Investor Retention", desc: "Analysts cover 30+ names. Friction makes you the one they drop.", icon: "🔗", defaultValue: 200000 },
];

const pillars = [
  { name: "Investor Relations", sub: "Earnings calls · Investor Days · LP updates", color: "#008285" },
  { name: "Corporate Engagement", sub: "Town halls · Kickoffs · Product launches", color: "#0f766e" },
  { name: "Institutional Banks", sub: "Corporate access · Capital markets", color: "#115e59" },
  { name: "Investment Managers", sub: "Virtual meetings · Expanded reach", color: "#134e4a" },
];

/* ─── Editable value component ─── */

function EditableVal({ value, onChange, prefix = "", suffix = "", color = "#374151", bg = "#f9fafb" }: {
  value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; color?: string; bg?: string;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 2, background: bg, borderRadius: 6, padding: "2px 6px" }}>
        {prefix && <span style={{ fontSize: 10, color: "#9ca3af" }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
          autoFocus
          style={{ width: 40, border: "none", outline: "none", background: "transparent", fontSize: 11, fontWeight: 700, color, ...sans }}
        />
        {suffix && <span style={{ fontSize: 10, color: "#9ca3af" }}>{suffix}</span>}
      </span>
    );
  }
  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 2, background: bg, borderRadius: 6, padding: "2px 6px", cursor: "text", borderBottom: "1px dashed #d1d5db" }}
    >
      {prefix && <span style={{ fontSize: 10, color: "#9ca3af" }}>{prefix}</span>}
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
      {suffix && <span style={{ fontSize: 10, color: "#9ca3af" }}>{suffix}</span>}
    </span>
  );
}

/* ─── Page ─── */

export default function OEMicrosite() {
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(defaultRoles.map((r) => [r.id, r.defaultRate]))
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [diyData, setDiyData] = useState<Record<string, { hrs: number; risk: number }[]>>(
    Object.fromEntries(products.map((p) => [p.id, p.diy.map((d) => ({ hrs: d.hrs, risk: d.risk }))]))
  );
  const [eventsPerYear, setEventsPerYear] = useState(12);
  const [oePlatformCost, setOePlatformCost] = useState(120000);
  const [softBenefits, setSoftBenefits] = useState<Record<string, number>>(
    Object.fromEntries(defaultSoftBenefits.map((b) => [b.id, b.defaultValue]))
  );

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const updateDiy = (productId: string, idx: number, field: "hrs" | "risk", val: number) => {
    setDiyData((prev) => {
      const items = [...prev[productId]];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, [productId]: items };
    });
  };

  // Calculations
  const totalHrsPerEvent = Object.values(diyData).flat().reduce((a, b) => a + b.hrs, 0);
  const totalRiskPerEvent = Object.values(diyData).flat().reduce((a, b) => a + b.risk, 0);
  const blendedRate = Object.values(rates).reduce((a, b) => a + b, 0) / Object.keys(rates).length;
  const laborCostPerEvent = totalHrsPerEvent * blendedRate;
  const annualDiyCost = (laborCostPerEvent + totalRiskPerEvent) * eventsPerYear;
  const totalSoftBenefits = Object.values(softBenefits).reduce((a, b) => a + b, 0);
  const totalAnnualValue = annualDiyCost + totalSoftBenefits;
  const annualSavings = totalAnnualValue - oePlatformCost;
  const roi = oePlatformCost > 0 ? ((annualSavings / oePlatformCost) * 100) : 0;
  const costOfDelayPerMonth = annualSavings / 12;

  // PDF Export
  const exportPDF = useCallback(() => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const M = 50;
    let y = 50;

    const teal = [0, 130, 133] as [number, number, number];
    const darkTeal = [19, 78, 74] as [number, number, number];
    const red = [220, 38, 38] as [number, number, number];
    const gray = [107, 114, 128] as [number, number, number];

    // Header bar
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("OpenExchange — ROI Analysis", M, 44);
    y = 95;

    // Date
    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, M, y);
    y += 30;

    // Executive summary box
    doc.setFillColor(240, 250, 250);
    doc.roundedRect(M, y, W - M * 2, 100, 8, 8, "F");
    doc.setDrawColor(...teal);
    doc.setLineWidth(1);
    doc.roundedRect(M, y, W - M * 2, 100, 8, 8, "S");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Executive Summary", M + 16, y + 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    doc.text(`Annual DIY Cost (labor + risk): $${annualDiyCost.toLocaleString()}`, M + 16, y + 42);
    doc.text(`Strategic Soft Benefits: $${totalSoftBenefits.toLocaleString()}`, M + 16, y + 58);
    doc.text(`OE Platform Investment: $${oePlatformCost.toLocaleString()}`, M + 16, y + 74);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...teal);
    doc.text(`Net Annual Savings: $${annualSavings.toLocaleString()}`, M + 16, y + 94);
    doc.text(`ROI: ${roi.toFixed(0)}%`, M + 280, y + 94);
    y += 120;

    // Key metrics
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Key Metrics", M, y);
    y += 20;

    const metrics = [
      ["Hours per event (DIY)", `${totalHrsPerEvent} hrs`],
      ["Blended hourly rate", `$${blendedRate.toFixed(0)}/hr`],
      ["Labor cost per event", `$${laborCostPerEvent.toLocaleString()}`],
      ["Risk exposure per event", `$${totalRiskPerEvent.toLocaleString()}`],
      ["Events per year", `${eventsPerYear}`],
      ["Cost of delay (per month)", `$${Math.round(costOfDelayPerMonth).toLocaleString()}`],
    ];

    metrics.forEach(([label, val], i) => {
      const rowY = y + i * 22;
      if (i % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(M, rowY - 4, W - M * 2, 20, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(label, M + 10, rowY + 10);
      doc.setFont("helvetica", "bold");
      doc.text(val, W - M - 10, rowY + 10, { align: "right" });
    });
    y += metrics.length * 22 + 20;

    // Per-product breakdown
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Product-by-Product Breakdown", M, y);
    y += 8;

    products.forEach((prod) => {
      if (y > 680) { doc.addPage(); y = 50; }
      y += 18;
      doc.setFillColor(...teal);
      doc.rect(M, y - 2, 4, 16, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text(`${prod.name}`, M + 12, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      doc.setFontSize(9);
      doc.text(prod.tag, M + 12 + doc.getTextWidth(prod.name + "  ") + 10, y + 10);
      y += 22;

      const items = diyData[prod.id];
      const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
      const prodRisk = items.reduce((a, b) => a + b.risk, 0);

      // Table header
      doc.setFillColor(249, 250, 251);
      doc.rect(M + 12, y, W - M * 2 - 12, 16, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...gray);
      doc.text("ACTIVITY", M + 16, y + 11);
      doc.text("HRS", W - M - 80, y + 11, { align: "right" });
      doc.text("RISK", W - M - 10, y + 11, { align: "right" });
      y += 18;

      items.forEach((item, i) => {
        if (y > 720) { doc.addPage(); y = 50; }
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(prod.diy[i].label, M + 16, y + 10);
        doc.text(`${item.hrs}`, W - M - 80, y + 10, { align: "right" });
        doc.setTextColor(...red);
        doc.text(`$${item.risk.toLocaleString()}`, W - M - 10, y + 10, { align: "right" });
        y += 16;
      });

      // Subtotal
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(M + 12, y, W - M, y);
      y += 4;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text("Subtotal", M + 16, y + 10);
      doc.text(`${prodHrs} hrs`, W - M - 80, y + 10, { align: "right" });
      doc.setTextColor(...red);
      doc.text(`$${prodRisk.toLocaleString()}`, W - M - 10, y + 10, { align: "right" });
      y += 20;
    });

    // Staffing breakdown
    if (y > 580) { doc.addPage(); y = 50; }
    y += 10;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Staffing Cost", M, y);
    y += 20;

    defaultRoles.forEach((role, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(M, y - 4, W - M * 2, 20, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(role.title, M + 10, y + 10);
      doc.setFont("helvetica", "bold");
      doc.text(`$${rates[role.id]}/hr`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });

    // Soft benefits
    if (y > 500) { doc.addPage(); y = 50; }
    y += 10;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Strategic Soft Benefits (Annual)", M, y);
    y += 20;

    defaultSoftBenefits.forEach((b, i) => {
      if (y > 720) { doc.addPage(); y = 50; }
      if (i % 2 === 0) {
        doc.setFillColor(240, 253, 249);
        doc.rect(M, y - 4, W - M * 2, 20, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(b.label, M + 10, y + 10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...teal);
      doc.text(`$${softBenefits[b.id].toLocaleString()}`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });

    // Soft benefits total
    doc.setDrawColor(167, 243, 208);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 4;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkTeal);
    doc.text("Total Strategic Value", M + 10, y + 10);
    doc.text(`$${totalSoftBenefits.toLocaleString()}`, W - M - 10, y + 10, { align: "right" });
    y += 30;

    // Footer bar
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pH = doc.internal.pageSize.getHeight();
      doc.setFillColor(...teal);
      doc.rect(0, pH - 30, W, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("OpenExchange — Confidential", M, pH - 12);
      doc.text(`Page ${i} of ${pageCount}`, W - M, pH - 12, { align: "right" });
    }

    doc.save("OE-ROI-Analysis.pdf");
  }, [diyData, rates, eventsPerYear, oePlatformCost, annualDiyCost, annualSavings, roi, totalHrsPerEvent, totalRiskPerEvent, blendedRate, laborCostPerEvent, costOfDelayPerMonth, softBenefits, totalSoftBenefits, totalAnnualValue]);

  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      {/* Back link */}
      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af" }}>← Back to Projects</Link>
      </div>

      {/* Header */}
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <h1 style={{ ...serif, fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 6 }}>
          Manual Process vs. OpenExchange
        </h1>
        <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.5 }}>
          Click each product to expand. Edit hours, risk, and rates — then export a branded PDF.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 12 }} />
      </div>

      {/* ─── PRODUCT ROWS (accordion) ─── */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {products.map((prod, pIdx) => {
          const isOpen = expanded[prod.id];
          const items = diyData[prod.id];
          const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
          const prodRisk = items.reduce((a, b) => a + b.risk, 0);

          return (
            <div key={prod.id} style={{ border: `2px solid ${isOpen ? "#008285" : "#e5e7eb"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.15s ease" }}>
              {/* Collapsed header row */}
              <div
                onClick={() => toggle(prod.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                }}
              >
                {/* LEFT: OE Product */}
                <div style={{ padding: "14px 18px", background: isOpen ? "#ecfdf5" : "#f9fefb", display: "flex", alignItems: "center", gap: 10, borderRight: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: 20 }}>{prod.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#111827" }}>{prod.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "2px 8px", borderRadius: 10 }}>{prod.tag}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{prod.subtitle}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "#008285", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▾</span>
                </div>

                {/* RIGHT: DIY summary */}
                <div style={{ padding: "14px 18px", background: isOpen ? "#fef2f2" : "#fefafa", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: "#991b1b", fontWeight: 600 }}>DIY Cost</span>
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>⏱ <strong>{prodHrs}</strong> hrs</span>
                      <span style={{ fontSize: 12, color: "#dc2626" }}>⚠ <strong>${prodRisk.toLocaleString()}</strong> risk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded: side by side detail */}
              {isOpen && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #e5e7eb" }}>
                  {/* LEFT: OE features */}
                  <div style={{ background: "#f0fdf9", padding: "12px 14px", borderRight: "1px solid #e5e7eb" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#059669", marginBottom: 8 }}>
                      ✓ With {prod.name}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {prod.oe.map((f) => (
                        <div key={f.label} style={{ background: "#fff", borderRadius: 8, padding: "8px 12px" }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 2 }}>{f.label}</p>
                          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.4 }}>{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: DIY pains with time + risk */}
                  <div style={{ background: "#fef8f8", padding: "12px 14px" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#dc2626", marginBottom: 8 }}>
                      ✕ Without — Time &amp; Risk
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {prod.diy.map((d, dIdx) => (
                        <div key={d.label} style={{ background: "#fff", borderRadius: 8, padding: "8px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444" }}>{d.label}</p>
                            <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                              <EditableVal value={items[dIdx].hrs} onChange={(v) => updateDiy(prod.id, dIdx, "hrs", v)} suffix="h" color="#b45309" bg="#fef3c7" />
                              <EditableVal value={items[dIdx].risk} onChange={(v) => updateDiy(prod.id, dIdx, "risk", v)} prefix="$" color="#dc2626" bg="#fee2e2" />
                            </div>
                          </div>
                          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.4 }}>{d.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── SOFT BENEFITS (OE Value) ─── */}
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)", marginBottom: 16 }} />
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#008285", marginBottom: 4 }}>
          Strategic Value — What OE Unlocks (Annual)
        </p>
        <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>
          Softer benefits that compound over time. Click values to edit.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {defaultSoftBenefits.map((b) => (
            <div key={b.id} style={{ background: "#f0fdf9", border: "1px solid #d1fae5", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#065f46" }}>{b.label}</span>
              </div>
              <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.4, marginBottom: 6 }}>{b.desc}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <EditableVal value={softBenefits[b.id]} onChange={(v) => setSoftBenefits((prev) => ({ ...prev, [b.id]: v }))} prefix="$" color="#008285" bg="#ecfdf5" />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: "8px 14px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#065f46" }}>Total strategic value (annual)</span>
          <span style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#008285" }}>${totalSoftBenefits.toLocaleString()}</span>
        </div>
      </div>

      {/* ─── ROLES & COST SUMMARY ─── */}
      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)", marginBottom: 20 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* LEFT: Roles */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", marginBottom: 10 }}>
              Staffing — Blended Rate
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {defaultRoles.map((role) => (
                <div key={role.id} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{role.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{role.title}</p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <EditableVal value={rates[role.id]} onChange={(v) => setRates((prev) => ({ ...prev, [role.id]: v }))} prefix="$" suffix="/h" color="#374151" bg="#f9fafb" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Summary + Export */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", marginBottom: 10 }}>
              ROI Summary
            </p>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Hours per event (DIY)</span>
                  <strong style={{ color: "#b45309" }}>{totalHrsPerEvent} hrs</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Risk exposure per event</span>
                  <strong style={{ color: "#dc2626" }}>${totalRiskPerEvent.toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Blended hourly rate</span>
                  <strong>${blendedRate.toFixed(0)}/hr</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Labor cost per event</span>
                  <strong>${laborCostPerEvent.toLocaleString()}</strong>
                </div>
                <div style={{ height: 1, background: "#e5e7eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, alignItems: "center" }}>
                  <span style={{ color: "#6b7280" }}>Events per year</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <EditableVal value={eventsPerYear} onChange={setEventsPerYear} color="#374151" bg="#fff" />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, alignItems: "center" }}>
                  <span style={{ color: "#6b7280" }}>OE platform cost (annual)</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <EditableVal value={oePlatformCost} onChange={setOePlatformCost} prefix="$" color="#008285" bg="#f0fafa" />
                  </div>
                </div>
                <div style={{ height: 1, background: "#e5e7eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Annual DIY cost (labor + risk)</span>
                  <strong style={{ color: "#dc2626" }}>${annualDiyCost.toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Strategic soft benefits</span>
                  <strong style={{ color: "#008285" }}>${totalSoftBenefits.toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#6b7280" }}>Total annual value</span>
                  <strong>${totalAnnualValue.toLocaleString()}</strong>
                </div>
                <div style={{ height: 1, background: "#e5e7eb" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#065f46", fontWeight: 600 }}>Net annual savings</span>
                  <strong style={{ color: "#008285", fontSize: 15 }}>${annualSavings.toLocaleString()}</strong>
                </div>
              </div>

              {/* Big ROI + Cost of Delay */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div style={{ background: "#008285", borderRadius: 10, padding: "12px 14px", textAlign: "center", color: "#fff" }}>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginBottom: 4 }}>ROI</p>
                  <p style={{ ...serif, fontSize: 22, fontWeight: 700 }}>{roi.toFixed(0)}%</p>
                </div>
                <div style={{ background: "#991b1b", borderRadius: 10, padding: "12px 14px", textAlign: "center", color: "#fff" }}>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginBottom: 4 }}>Cost of Delay / mo</p>
                  <p style={{ ...serif, fontSize: 22, fontWeight: 700 }}>${Math.round(costOfDelayPerMonth).toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={exportPDF}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  background: "#008285",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  ...sans,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#006b6e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#008285"; }}
              >
                Export ROI Report (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOUNDATION: 4 VERTICAL PILLARS ─── */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)", marginBottom: 20 }} />
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9ca3af", textAlign: "center", marginBottom: 10 }}>
          Foundation — Who This Serves
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {pillars.map((p) => (
            <div key={p.name} style={{ background: p.color, borderRadius: "0 0 12px 12px", padding: "16px 12px", color: "#fff", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 4, background: "rgba(255,255,255,0.3)", borderRadius: "0 0 4px 4px" }} />
              <h3 style={{ ...serif, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{p.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: "linear-gradient(90deg, #008285, #134e4a)", borderRadius: 2, marginTop: 0 }} />
      </div>
    </div>
  );
}
