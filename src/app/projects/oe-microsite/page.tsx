"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { jsPDF } from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — inspired by trumprx.gov
   • Warm off-white bg  • Big bold serif headlines  • Clean rows
   • Generous whitespace  • Simple borders  • Authoritative feel
   ═══════════════════════════════════════════════════════════════ */

const font = {
  serif: { fontFamily: "'Georgia', 'Times New Roman', serif" },
  sans: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  mono: { fontFamily: "'SF Mono', 'Fira Code', monospace" },
};

const color = {
  bg: "#FAF8F5",
  card: "#FFFFFF",
  border: "#E8E4DF",
  text: "#1A1A1A",
  muted: "#6B6560",
  subtle: "#A8A19A",
  teal: "#008285",
  tealDark: "#006B6E",
  tealLight: "#E8F5F5",
  green: "#2B5E49",
  greenLight: "#EBF5F0",
  red: "#C23B22",
  redLight: "#FDF0ED",
  amber: "#92660A",
  amberLight: "#FDF7E8",
};

/* ─── Products ─── */

const products = [
  {
    id: "oe-central", icon: "⌘", name: "OE Central", tag: "Command Center",
    oneLiner: "360-degree organizer dashboard for tracking, scheduling, and collaboration",
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
    id: "oe-passport", icon: "🎫", name: "OE Passport", tag: "Participant Hub",
    oneLiner: "Branded attendee microsite with personalized agendas and one-click access",
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
    id: "oe-stream", icon: "▶", name: "OE Stream", tag: "Webcasting",
    oneLiner: "HD 1080p live and on-demand with translation, transcription, and captioning",
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
    id: "oe-podium", icon: "🎙", name: "OE Podium", tag: "Presenter Panel",
    oneLiner: "Backstage portal with slide control, private chat, and moderated Q&A",
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
    id: "oe-integrations", icon: "⚡", name: "OE Integrations", tag: "API Layer",
    oneLiner: "Salesforce, marketing automation, and analytics — data flows automatically",
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
    id: "zoom-services", icon: "🤝", name: "Zoom Services", tag: "Partnership",
    oneLiner: "Managed Zoom Webinars and Events with rehearsals and live execution",
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

/* ─── Roles ─── */
const defaultRoles = [
  { id: "event-mgr", title: "Event Manager", defaultRate: 85 },
  { id: "it-support", title: "IT / Tech Support", defaultRate: 75 },
  { id: "av-tech", title: "AV Technician", defaultRate: 95 },
  { id: "mktg-ops", title: "Marketing Ops", defaultRate: 70 },
  { id: "exec-admin", title: "Executive Admin", defaultRate: 55 },
  { id: "crm-admin", title: "CRM / Salesforce Admin", defaultRate: 90 },
];

/* ─── Soft Benefits ─── */
const defaultSoftBenefits = [
  { id: "brand", label: "Brand Authority", desc: "Polished delivery signals operational maturity to the street", defaultValue: 250000 },
  { id: "experience", label: "Attendee Experience", desc: "Higher NPS means analysts come back next quarter", defaultValue: 120000 },
  { id: "productivity", label: "Team Productivity", desc: "IR should target investors, not troubleshoot audio", defaultValue: 150000 },
  { id: "speed", label: "Speed to Market", desc: "Activist shows up — you're live in 24 hours, not 2 weeks", defaultValue: 100000 },
  { id: "compliance", label: "Compliance Assurance", desc: "Reg FD violations are existential risk", defaultValue: 200000 },
  { id: "data", label: "Engagement Intelligence", desc: "Know which analyst watched which slide, for how long", defaultValue: 120000 },
  { id: "csuite", label: "C-Suite Confidence", desc: "Your CFO thinks about guidance, not screen-sharing", defaultValue: 80000 },
  { id: "retention", label: "Investor Retention", desc: "Analysts cover 30+ names. Friction makes you the one they drop", defaultValue: 200000 },
];

const pillars = [
  { name: "Investor Relations", sub: "Earnings calls, Investor Days, LP updates" },
  { name: "Corporate Engagement", sub: "Town halls, Kickoffs, Product launches" },
  { name: "Institutional Banks", sub: "Corporate access, Capital markets" },
  { name: "Investment Managers", sub: "Virtual meetings, Expanded reach" },
];

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtk = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;

/* ─── Editable value ─── */
function Editable({ value, onChange, prefix = "", suffix = "" }: {
  value: number; onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
        {prefix && <span style={{ ...font.mono, fontSize: 13, color: color.subtle }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
          autoFocus
          style={{ width: 64, border: "none", outline: "none", background: "transparent", ...font.mono, fontSize: 15, fontWeight: 600, color: color.text }}
        />
        {suffix && <span style={{ ...font.mono, fontSize: 13, color: color.subtle }}>{suffix}</span>}
      </span>
    );
  }
  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 2, cursor: "text", borderBottom: `1px dashed ${color.border}` }}
    >
      {prefix && <span style={{ ...font.mono, fontSize: 13, color: color.subtle }}>{prefix}</span>}
      <span style={{ ...font.mono, fontSize: 15, fontWeight: 600, color: color.text }}>{fmt(value)}</span>
      {suffix && <span style={{ ...font.mono, fontSize: 13, color: color.subtle }}>{suffix}</span>}
    </span>
  );
}

/* ═══════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════ */

export default function OEMicrosite() {
  /* ─ Selection state ─ */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* ─ Editable data ─ */
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(defaultRoles.map((r) => [r.id, r.defaultRate]))
  );
  const [diyData, setDiyData] = useState<Record<string, { hrs: number; risk: number }[]>>(
    Object.fromEntries(products.map((p) => [p.id, p.diy.map((d) => ({ hrs: d.hrs, risk: d.risk }))]))
  );
  const [eventsPerYear, setEventsPerYear] = useState(12);
  const [oePlatformCost, setOePlatformCost] = useState(120000);
  const [softBenefits, setSoftBenefits] = useState<Record<string, number>>(
    Object.fromEntries(defaultSoftBenefits.map((b) => [b.id, b.defaultValue]))
  );

  const toggleProduct = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map((p) => p.id)));
  };

  const updateDiy = (productId: string, idx: number, field: "hrs" | "risk", val: number) => {
    setDiyData((prev) => {
      const items = [...prev[productId]];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, [productId]: items };
    });
  };

  /* ─ Calculations (only selected products) ─ */
  const selectedProducts = products.filter((p) => selected.has(p.id));
  const selectedDiyEntries = Object.entries(diyData).filter(([id]) => selected.has(id));

  const totalHrsPerEvent = selectedDiyEntries.flatMap(([, items]) => items).reduce((a, b) => a + b.hrs, 0);
  const totalRiskPerEvent = selectedDiyEntries.flatMap(([, items]) => items).reduce((a, b) => a + b.risk, 0);
  const blendedRate = Object.values(rates).reduce((a, b) => a + b, 0) / Object.keys(rates).length;
  const laborCostPerEvent = totalHrsPerEvent * blendedRate;
  const annualDiyCost = (laborCostPerEvent + totalRiskPerEvent) * eventsPerYear;
  const totalSoftBenefits = Object.values(softBenefits).reduce((a, b) => a + b, 0);
  const totalAnnualValue = annualDiyCost + totalSoftBenefits;
  const annualSavings = totalAnnualValue - oePlatformCost;
  const roi = oePlatformCost > 0 ? ((annualSavings / oePlatformCost) * 100) : 0;
  const costOfDelayPerMonth = annualSavings / 12;

  /* ─ PDF Export ─ */
  const exportPDF = useCallback(() => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const M = 50;
    let y = 50;
    const teal: [number, number, number] = [0, 130, 133];
    const dark: [number, number, number] = [26, 26, 26];
    const gray: [number, number, number] = [107, 101, 96];
    const redC: [number, number, number] = [194, 59, 34];

    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("OpenExchange — ROI Analysis", M, 44);
    y = 95;

    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, M, y);
    if (selectedProducts.length > 0) {
      doc.text(`Products: ${selectedProducts.map((p) => p.name).join(", ")}`, M, y + 14);
    }
    y += 40;

    // Executive summary
    doc.setFillColor(232, 245, 245);
    doc.roundedRect(M, y, W - M * 2, 110, 6, 6, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Executive Summary", M + 16, y + 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    doc.text(`Annual DIY Cost (labor + risk): $${fmt(annualDiyCost)}`, M + 16, y + 46);
    doc.text(`Strategic Soft Benefits: $${fmt(totalSoftBenefits)}`, M + 16, y + 62);
    doc.text(`OE Platform Investment: $${fmt(oePlatformCost)}`, M + 16, y + 78);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...teal);
    doc.text(`Net Annual Savings: $${fmt(annualSavings)}   |   ROI: ${roi.toFixed(0)}%   |   Cost of Delay: $${fmt(Math.round(costOfDelayPerMonth))}/mo`, M + 16, y + 100);
    y += 130;

    // Key metrics
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Key Metrics", M, y);
    y += 20;
    const metrics = [
      ["Hours per event (DIY)", `${totalHrsPerEvent} hrs`],
      ["Blended hourly rate", `$${blendedRate.toFixed(0)}/hr`],
      ["Labor cost per event", `$${fmt(laborCostPerEvent)}`],
      ["Risk exposure per event", `$${fmt(totalRiskPerEvent)}`],
      ["Events per year", `${eventsPerYear}`],
      ["Cost of delay (per month)", `$${fmt(Math.round(costOfDelayPerMonth))}`],
    ];
    metrics.forEach(([label, val], i) => {
      const rowY = y + i * 22;
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, rowY - 4, W - M * 2, 20, "F"); }
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
      doc.text(label, M + 10, rowY + 10);
      doc.setFont("helvetica", "bold");
      doc.text(val, W - M - 10, rowY + 10, { align: "right" });
    });
    y += metrics.length * 22 + 20;

    // Per-product
    if (selectedProducts.length > 0) {
      doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
      doc.text("Product Breakdown", M, y);
      y += 8;
      selectedProducts.forEach((prod) => {
        if (y > 680) { doc.addPage(); y = 50; }
        y += 18;
        doc.setFillColor(...teal); doc.rect(M, y - 2, 4, 16, "F");
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
        doc.text(prod.name, M + 12, y + 10);
        doc.setFont("helvetica", "normal"); doc.setTextColor(...gray); doc.setFontSize(9);
        doc.text(prod.tag, M + 12 + doc.getTextWidth(prod.name + "  ") + 10, y + 10);
        y += 22;
        const items = diyData[prod.id];
        doc.setFillColor(250, 248, 245); doc.rect(M + 12, y, W - M * 2 - 12, 16, "F");
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...gray);
        doc.text("ACTIVITY", M + 16, y + 11);
        doc.text("HRS", W - M - 80, y + 11, { align: "right" });
        doc.text("RISK", W - M - 10, y + 11, { align: "right" });
        y += 18;
        items.forEach((item, i) => {
          if (y > 720) { doc.addPage(); y = 50; }
          doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
          doc.text(prod.diy[i].label, M + 16, y + 10);
          doc.text(`${item.hrs}`, W - M - 80, y + 10, { align: "right" });
          doc.setTextColor(...redC);
          doc.text(`$${fmt(item.risk)}`, W - M - 10, y + 10, { align: "right" });
          y += 16;
        });
        const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
        const prodRisk = items.reduce((a, b) => a + b.risk, 0);
        doc.setDrawColor(232, 228, 223); doc.setLineWidth(0.5); doc.line(M + 12, y, W - M, y);
        y += 4;
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
        doc.text("Subtotal", M + 16, y + 10);
        doc.text(`${prodHrs} hrs`, W - M - 80, y + 10, { align: "right" });
        doc.setTextColor(...redC);
        doc.text(`$${fmt(prodRisk)}`, W - M - 10, y + 10, { align: "right" });
        y += 20;
      });
    }

    // Staffing
    if (y > 560) { doc.addPage(); y = 50; }
    y += 10;
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
    doc.text("Staffing Cost", M, y); y += 20;
    defaultRoles.forEach((role, i) => {
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, y - 4, W - M * 2, 20, "F"); }
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
      doc.text(role.title, M + 10, y + 10);
      doc.setFont("helvetica", "bold"); doc.text(`$${rates[role.id]}/hr`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });

    // Soft benefits
    if (y > 500) { doc.addPage(); y = 50; }
    y += 10;
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
    doc.text("Strategic Benefits (Annual)", M, y); y += 20;
    defaultSoftBenefits.forEach((b, i) => {
      if (y > 720) { doc.addPage(); y = 50; }
      if (i % 2 === 0) { doc.setFillColor(235, 245, 240); doc.rect(M, y - 4, W - M * 2, 20, "F"); }
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
      doc.text(b.label, M + 10, y + 10);
      doc.setFont("helvetica", "bold"); doc.setTextColor(...teal);
      doc.text(`$${fmt(softBenefits[b.id])}`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });
    doc.setDrawColor(200, 230, 220); doc.setLineWidth(0.5); doc.line(M, y, W - M, y);
    y += 4;
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...teal);
    doc.text("Total Strategic Value", M + 10, y + 10);
    doc.text(`$${fmt(totalSoftBenefits)}`, W - M - 10, y + 10, { align: "right" });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pH = doc.internal.pageSize.getHeight();
      doc.setFillColor(...teal); doc.rect(0, pH - 28, W, 28, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont("helvetica", "normal");
      doc.text("OpenExchange — Confidential", M, pH - 10);
      doc.text(`Page ${i} of ${pageCount}`, W - M, pH - 10, { align: "right" });
    }

    doc.save("OE-ROI-Analysis.pdf");
  }, [diyData, rates, eventsPerYear, oePlatformCost, annualDiyCost, annualSavings, roi, totalHrsPerEvent, totalRiskPerEvent, blendedRate, laborCostPerEvent, costOfDelayPerMonth, softBenefits, totalSoftBenefits, totalAnnualValue, selectedProducts]);

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div style={{ background: color.bg, margin: "-24px", padding: "0 0 80px" }}>

      {/* ─── HERO ─── */}
      <div style={{ padding: "48px 48px 0", maxWidth: 960, margin: "0 auto" }}>
        <Link href="/projects" style={{ ...font.sans, fontSize: 13, color: color.subtle, textDecoration: "none", letterSpacing: "0.02em" }}>
          ← Back to Projects
        </Link>

        <h1 style={{
          ...font.serif,
          fontSize: 56,
          fontWeight: 700,
          color: color.text,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginTop: 32,
          marginBottom: 12,
        }}>
          What does it actually<br />cost to do it yourself?
        </h1>
        <p style={{
          ...font.serif,
          fontSize: 20,
          color: color.muted,
          lineHeight: 1.6,
          maxWidth: 560,
          marginBottom: 40,
        }}>
          Select the products you need. See the hours, risk, and hidden costs of doing it manually — versus the OpenExchange platform.
        </p>
      </div>

      {/* ─── PRODUCT PICKER ─── */}
      <div style={{ padding: "0 48px", maxWidth: 960, margin: "0 auto 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle }}>
            Select Products
          </span>
          <button
            onClick={selectAll}
            style={{
              ...font.sans,
              fontSize: 12,
              fontWeight: 500,
              color: color.teal,
              background: "none",
              border: `1px solid ${color.teal}`,
              borderRadius: 20,
              padding: "4px 14px",
              cursor: "pointer",
            }}
          >
            {selected.size === products.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {products.map((p) => {
            const isOn = selected.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProduct(p.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "18px 20px",
                  background: isOn ? color.card : color.bg,
                  border: `2px solid ${isOn ? color.teal : color.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Checkmark */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${isOn ? color.teal : color.border}`,
                  background: isOn ? color.teal : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  transition: "all 0.15s ease",
                }}>
                  {isOn && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...font.serif, fontSize: 17, fontWeight: 700, color: color.text, marginBottom: 2 }}>
                    {p.name}
                  </div>
                  <div style={{ ...font.sans, fontSize: 11, color: color.subtle, lineHeight: 1.4 }}>
                    {p.oneLiner}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SELECTED PRODUCT BREAKDOWNS ─── */}
      {selectedProducts.length > 0 && (
        <div style={{ padding: "0 48px", maxWidth: 960, margin: "0 auto 48px" }}>
          {/* Section divider */}
          <div style={{ height: 1, background: color.border, marginBottom: 40 }} />

          <h2 style={{
            ...font.serif,
            fontSize: 36,
            fontWeight: 700,
            color: color.text,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}>
            The real cost of DIY
          </h2>
          <p style={{ ...font.serif, fontSize: 16, color: color.muted, marginBottom: 36 }}>
            Side by side. OpenExchange vs. doing it yourself. Click any number to edit.
          </p>

          {selectedProducts.map((prod) => {
            const items = diyData[prod.id];
            const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
            const prodRisk = items.reduce((a, b) => a + b.risk, 0);

            return (
              <div key={prod.id} style={{ marginBottom: 48 }}>
                {/* Product header */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 24 }}>{prod.icon}</span>
                  <h3 style={{ ...font.serif, fontSize: 26, fontWeight: 700, color: color.text, letterSpacing: "-0.02em" }}>
                    {prod.name}
                  </h3>
                  <span style={{
                    ...font.sans,
                    fontSize: 11,
                    fontWeight: 600,
                    color: color.teal,
                    background: color.tealLight,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}>
                    {prod.tag}
                  </span>
                </div>

                {/* Two-column comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 12, overflow: "hidden", border: `1px solid ${color.border}` }}>

                  {/* LEFT — With OE */}
                  <div style={{ background: color.card, borderRight: `1px solid ${color.border}` }}>
                    <div style={{ padding: "16px 24px", borderBottom: `1px solid ${color.border}` }}>
                      <span style={{ ...font.sans, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.green }}>
                        With OpenExchange
                      </span>
                    </div>
                    {prod.oe.map((f, i) => (
                      <div key={f.label} style={{
                        padding: "14px 24px",
                        borderBottom: i < prod.oe.length - 1 ? `1px solid ${color.border}` : "none",
                      }}>
                        <div style={{ ...font.sans, fontSize: 14, fontWeight: 600, color: color.text, marginBottom: 3 }}>
                          {f.label}
                        </div>
                        <div style={{ ...font.sans, fontSize: 13, color: color.muted, lineHeight: 1.5 }}>
                          {f.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT — DIY */}
                  <div style={{ background: color.redLight }}>
                    <div style={{ padding: "16px 24px", borderBottom: `1px solid ${color.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ ...font.sans, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.red }}>
                        DIY Manual Process
                      </span>
                      <span style={{ ...font.mono, fontSize: 12, color: color.red }}>
                        {prodHrs}h · ${fmt(prodRisk)} risk
                      </span>
                    </div>
                    {prod.diy.map((d, dIdx) => (
                      <div key={d.label} style={{
                        padding: "14px 24px",
                        borderBottom: dIdx < prod.diy.length - 1 ? `1px solid rgba(194,59,34,0.1)` : "none",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <span style={{ ...font.sans, fontSize: 14, fontWeight: 600, color: color.text }}>
                            {d.label}
                          </span>
                          <div style={{ display: "flex", gap: 12 }} onClick={(e) => e.stopPropagation()}>
                            <Editable value={items[dIdx].hrs} onChange={(v) => updateDiy(prod.id, dIdx, "hrs", v)} suffix="h" />
                            <Editable value={items[dIdx].risk} onChange={(v) => updateDiy(prod.id, dIdx, "risk", v)} prefix="$" />
                          </div>
                        </div>
                        <div style={{ ...font.sans, fontSize: 13, color: color.muted, lineHeight: 1.5 }}>
                          {d.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── STRATEGIC BENEFITS ─── */}
      <div style={{ padding: "0 48px", maxWidth: 960, margin: "0 auto 48px" }}>
        <div style={{ height: 1, background: color.border, marginBottom: 40 }} />
        <h2 style={{ ...font.serif, fontSize: 36, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
          What you can't put in a spreadsheet
        </h2>
        <p style={{ ...font.serif, fontSize: 16, color: color.muted, marginBottom: 32 }}>
          Strategic benefits that compound over time. Click any value to customize.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {defaultSoftBenefits.map((b) => (
            <div key={b.id} style={{
              background: color.card,
              border: `1px solid ${color.border}`,
              borderRadius: 10,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...font.sans, fontSize: 15, fontWeight: 600, color: color.text, marginBottom: 4 }}>
                  {b.label}
                </div>
                <div style={{ ...font.sans, fontSize: 13, color: color.muted, lineHeight: 1.5 }}>
                  {b.desc}
                </div>
              </div>
              <div style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <Editable value={softBenefits[b.id]} onChange={(v) => setSoftBenefits((prev) => ({ ...prev, [b.id]: v }))} prefix="$" />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16,
          padding: "16px 24px",
          background: color.tealLight,
          border: `1px solid ${color.teal}`,
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ ...font.sans, fontSize: 14, fontWeight: 600, color: color.tealDark }}>
            Total strategic value (annual)
          </span>
          <span style={{ ...font.serif, fontSize: 24, fontWeight: 700, color: color.teal }}>
            ${fmt(totalSoftBenefits)}
          </span>
        </div>
      </div>

      {/* ─── STAFFING & ROI ─── */}
      <div style={{ padding: "0 48px", maxWidth: 960, margin: "0 auto 48px" }}>
        <div style={{ height: 1, background: color.border, marginBottom: 40 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* LEFT — Staffing */}
          <div>
            <h3 style={{ ...font.serif, fontSize: 24, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Staffing rates
            </h3>
            <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, overflow: "hidden" }}>
              {defaultRoles.map((role, i) => (
                <div key={role.id} style={{
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: i < defaultRoles.length - 1 ? `1px solid ${color.border}` : "none",
                }}>
                  <span style={{ ...font.sans, fontSize: 14, color: color.text }}>{role.title}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Editable value={rates[role.id]} onChange={(v) => setRates((prev) => ({ ...prev, [role.id]: v }))} prefix="$" suffix="/hr" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — ROI Summary */}
          <div>
            <h3 style={{ ...font.serif, fontSize: 24, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 20 }}>
              ROI summary
            </h3>
            <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, padding: "24px" }}>

              {[
                { label: "Hours per event (DIY)", value: `${totalHrsPerEvent} hrs`, c: color.amber },
                { label: "Risk exposure per event", value: `$${fmt(totalRiskPerEvent)}`, c: color.red },
                { label: "Blended hourly rate", value: `$${blendedRate.toFixed(0)}/hr`, c: color.text },
                { label: "Labor cost per event", value: `$${fmt(laborCostPerEvent)}`, c: color.text },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${color.border}` }}>
                  <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>{row.label}</span>
                  <span style={{ ...font.mono, fontSize: 14, fontWeight: 600, color: row.c }}>{row.value}</span>
                </div>
              ))}

              {/* Editable inputs */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${color.border}` }}>
                <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>Events per year</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <Editable value={eventsPerYear} onChange={setEventsPerYear} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${color.border}` }}>
                <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>OE platform cost (annual)</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <Editable value={oePlatformCost} onChange={setOePlatformCost} prefix="$" />
                </div>
              </div>

              <div style={{ height: 8 }} />

              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${color.border}` }}>
                <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>Annual DIY cost</span>
                <span style={{ ...font.mono, fontSize: 14, fontWeight: 700, color: color.red }}>${fmt(annualDiyCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${color.border}` }}>
                <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>Strategic benefits</span>
                <span style={{ ...font.mono, fontSize: 14, fontWeight: 600, color: color.teal }}>${fmt(totalSoftBenefits)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ ...font.sans, fontSize: 14, fontWeight: 600, color: color.text }}>Net annual savings</span>
                <span style={{ ...font.serif, fontSize: 20, fontWeight: 700, color: color.teal }}>${fmt(annualSavings)}</span>
              </div>

              {/* Big numbers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                <div style={{ background: color.teal, borderRadius: 10, padding: "20px", textAlign: "center" }}>
                  <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                    Return on Investment
                  </div>
                  <div style={{ ...font.serif, fontSize: 36, fontWeight: 700, color: "#fff" }}>
                    {roi.toFixed(0)}%
                  </div>
                </div>
                <div style={{ background: color.text, borderRadius: 10, padding: "20px", textAlign: "center" }}>
                  <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                    Cost of Delay / Month
                  </div>
                  <div style={{ ...font.serif, fontSize: 36, fontWeight: 700, color: "#fff" }}>
                    ${fmtk(Math.round(costOfDelayPerMonth))}
                  </div>
                </div>
              </div>

              {/* Export button */}
              <button
                onClick={exportPDF}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "14px 0",
                  ...font.sans,
                  fontSize: 14,
                  fontWeight: 600,
                  color: color.text,
                  background: "none",
                  border: `2px solid ${color.text}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = color.text; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = color.text; }}
              >
                Export ROI Report →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOUNDATION PILLARS ─── */}
      <div style={{ padding: "0 48px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ height: 1, background: color.border, marginBottom: 40 }} />
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: color.subtle }}>
            Who this serves
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {pillars.map((p) => (
            <div key={p.name} style={{
              background: color.card,
              border: `1px solid ${color.border}`,
              borderRadius: 10,
              padding: "24px 20px",
              textAlign: "center",
            }}>
              <div style={{ ...font.serif, fontSize: 15, fontWeight: 700, color: color.text, marginBottom: 6 }}>
                {p.name}
              </div>
              <div style={{ ...font.sans, fontSize: 12, color: color.muted, lineHeight: 1.5 }}>
                {p.sub}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: color.teal, borderRadius: 2, marginTop: 16 }} />
      </div>
    </div>
  );
}
