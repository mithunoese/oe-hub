"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { jsPDF } from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — inspired by trumprx.gov
   • Warm off-white bg  • Big bold serif headlines  • Clean rows
   • Generous whitespace  • Simple borders  • Full-width layout
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

/* ─── Roles ─── */
const defaultRoles = [
  { id: "event-mgr", title: "Event Manager", abbr: "EM", defaultRate: 85, color: "#7C3AED" },
  { id: "it-support", title: "IT / Tech Support", abbr: "IT", defaultRate: 75, color: "#2563EB" },
  { id: "av-tech", title: "AV Technician", abbr: "AV", defaultRate: 95, color: "#DC2626" },
  { id: "mktg-ops", title: "Marketing Ops", abbr: "MK", defaultRate: 70, color: "#D97706" },
  { id: "exec-admin", title: "Executive Admin", abbr: "EA", defaultRate: 55, color: "#059669" },
  { id: "crm-admin", title: "CRM / Salesforce Admin", abbr: "CRM", defaultRate: 90, color: "#0891B2" },
];

const roleMap = Object.fromEntries(defaultRoles.map((r) => [r.id, r]));

/* ─── Products with role assignments per DIY task ─── */

const products = [
  {
    id: "oe-central", name: "OE Central", tag: "Command Center", annualCost: 25000,
    oneLiner: "360-degree organizer dashboard for tracking, scheduling, and collaboration",
    diy: [
      { label: "Run-of-Show", desc: "Spreadsheets emailed back and forth", hrs: 8, risk: 2000, roles: ["event-mgr", "exec-admin"] },
      { label: "Attendee Tracking", desc: "Manual headcounts, no real-time visibility", hrs: 4, risk: 1500, roles: ["event-mgr", "it-support"] },
      { label: "Presenter Coordination", desc: "Email chains, hoping speakers show up on time", hrs: 6, risk: 3000, roles: ["event-mgr", "exec-admin"] },
      { label: "Scheduling", desc: "Google Sheets, no session-level granularity", hrs: 5, risk: 1000, roles: ["event-mgr", "mktg-ops"] },
      { label: "Collaboration", desc: "Scattered across Slack, email, docs", hrs: 3, risk: 500, roles: ["event-mgr", "exec-admin", "mktg-ops"] },
      { label: "Day-of Visibility", desc: "Flying blind — no dashboard, gut feel", hrs: 4, risk: 5000, roles: ["event-mgr", "it-support", "av-tech"] },
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
    id: "oe-passport", name: "OE Passport", tag: "Participant Hub", annualCost: 20000,
    oneLiner: "Branded attendee microsite with personalized agendas and one-click access",
    diy: [
      { label: "12 Zoom Links", desc: "Wall of URLs, hope they click the right one", hrs: 3, risk: 2000, roles: ["it-support", "exec-admin"] },
      { label: "No Personalization", desc: "Same generic email for everyone", hrs: 2, risk: 1000, roles: ["mktg-ops"] },
      { label: "PDF Agendas", desc: "Static, outdated by the time they're sent", hrs: 3, risk: 500, roles: ["event-mgr", "mktg-ops"] },
      { label: "Material Distribution", desc: "Attachments in follow-up emails, half missed", hrs: 4, risk: 800, roles: ["exec-admin", "mktg-ops"] },
      { label: "On-Demand Access", desc: "Recordings dumped on SharePoint, no tracking", hrs: 5, risk: 1500, roles: ["it-support", "mktg-ops"] },
      { label: "Mobile Experience", desc: "Nothing — Zoom links on a phone browser", hrs: 2, risk: 2000, roles: ["it-support"] },
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
    id: "oe-stream", name: "OE Stream", tag: "Webcasting", annualCost: 35000,
    oneLiner: "HD 1080p live and on-demand with translation, transcription, and captioning",
    diy: [
      { label: "Generic Zoom/Teams", desc: "No branding, no lower thirds, no graphics", hrs: 2, risk: 5000, roles: ["av-tech", "it-support"] },
      { label: "Amateur Audio/Video", desc: "Webcam quality, inconsistent audio", hrs: 4, risk: 3000, roles: ["av-tech"] },
      { label: "No Live Translation", desc: "Manual interpreter setup — complex, unreliable", hrs: 6, risk: 4000, roles: ["event-mgr", "av-tech", "it-support"] },
      { label: "No Captioning", desc: "DIY auto-captions are inaccurate", hrs: 3, risk: 2000, roles: ["av-tech", "it-support"] },
      { label: "Awkward Transitions", desc: "Dead air switching between speakers", hrs: 3, risk: 3000, roles: ["av-tech"] },
      { label: "Pre-Record vs Live", desc: "All-live (risky) or MP4 (clunky)", hrs: 5, risk: 4000, roles: ["av-tech", "event-mgr"] },
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
    id: "oe-podium", name: "OE Podium", tag: "Presenter Panel", annualCost: 15000,
    oneLiner: "Backstage portal with slide control, private chat, and moderated Q&A",
    diy: [
      { label: "Speakers Mixed In", desc: "No backstage, no preparation space", hrs: 2, risk: 5000, roles: ["event-mgr", "av-tech"] },
      { label: "Hot-Mic Risk", desc: "One unmuted speaker derails everything", hrs: 1, risk: 8000, roles: ["av-tech", "it-support"] },
      { label: "Slide Chaos", desc: "Screen share pass-around, awkward handoffs", hrs: 3, risk: 2000, roles: ["it-support", "exec-admin"] },
      { label: "No Private Comms", desc: "Speakers can't message without audience seeing", hrs: 1, risk: 1500, roles: ["event-mgr"] },
      { label: "Q&A Free-for-All", desc: "Chat floods with no moderation", hrs: 2, risk: 2000, roles: ["event-mgr", "mktg-ops"] },
      { label: "No Rehearsals", desc: "Speakers test on the live call", hrs: 4, risk: 6000, roles: ["event-mgr", "av-tech", "it-support"] },
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
    id: "oe-integrations", name: "OE Integrations", tag: "API Layer", annualCost: 15000,
    oneLiner: "Salesforce, marketing automation, and analytics — data flows automatically",
    diy: [
      { label: "CSV → Excel → Import", desc: "Download, clean, import to Salesforce every time", hrs: 6, risk: 3000, roles: ["crm-admin", "mktg-ops"] },
      { label: "No Real-Time Data", desc: "Engagement data only after event ends", hrs: 2, risk: 2000, roles: ["crm-admin", "it-support"] },
      { label: "Registration Disconnect", desc: "Manual reconciliation between systems", hrs: 4, risk: 1500, roles: ["crm-admin", "event-mgr"] },
      { label: "Marketing Blind Spot", desc: "No idea who attended or how engaged", hrs: 3, risk: 4000, roles: ["mktg-ops", "crm-admin"] },
      { label: "Content Scattered", desc: "Recordings uploaded manually everywhere", hrs: 5, risk: 1000, roles: ["it-support", "mktg-ops"] },
      { label: "Analytics Silos", desc: "Zoom, registration, Salesforce — no single view", hrs: 4, risk: 2500, roles: ["crm-admin", "mktg-ops", "it-support"] },
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
    id: "zoom-services", name: "Zoom Services", tag: "Partnership", annualCost: 10000,
    oneLiner: "Managed Zoom Webinars and Events with rehearsals and live execution",
    diy: [
      { label: "Self-Service Setup", desc: "Figure out Zoom Webinar settings yourself", hrs: 6, risk: 3000, roles: ["it-support", "event-mgr"] },
      { label: "No Onboarding", desc: "Hours learning features you'll use once", hrs: 4, risk: 1000, roles: ["event-mgr", "it-support"] },
      { label: "Untested Events", desc: "First real test is the live event itself", hrs: 2, risk: 8000, roles: ["event-mgr", "av-tech", "it-support"] },
      { label: "Live Troubleshooting", desc: "You're the IT help desk during your own event", hrs: 3, risk: 5000, roles: ["it-support", "av-tech"] },
      { label: "Scaling Struggles", desc: "Multi-track events exponentially harder alone", hrs: 5, risk: 4000, roles: ["event-mgr", "it-support", "av-tech"] },
      { label: "Post-Event Chaos", desc: "Recordings, reports, follow-ups all manual", hrs: 6, risk: 1500, roles: ["exec-admin", "mktg-ops", "crm-admin"] },
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

/* ─── Soft Benefits (defaultPct = 1 so users explicitly set them) ─── */
const defaultSoftBenefits = [
  { id: "brand", label: "Brand Authority", desc: "Polished delivery signals operational maturity to the street", defaultValue: 250000, defaultPct: 1 },
  { id: "experience", label: "Attendee Experience", desc: "Higher NPS means analysts come back next quarter", defaultValue: 120000, defaultPct: 1 },
  { id: "productivity", label: "Team Productivity", desc: "IR should target investors, not troubleshoot audio", defaultValue: 150000, defaultPct: 1 },
  { id: "speed", label: "Speed to Market", desc: "Activist shows up — you're live in 24 hours, not 2 weeks", defaultValue: 100000, defaultPct: 1 },
  { id: "compliance", label: "Compliance Assurance", desc: "Reg FD violations are existential risk", defaultValue: 200000, defaultPct: 1 },
  { id: "data", label: "Engagement Intelligence", desc: "Know which analyst watched which slide, for how long", defaultValue: 120000, defaultPct: 1 },
  { id: "csuite", label: "C-Suite Confidence", desc: "Your CFO thinks about guidance, not screen-sharing", defaultValue: 80000, defaultPct: 1 },
  { id: "retention", label: "Investor Retention", desc: "Analysts cover 30+ names. Friction makes you the one they drop", defaultValue: 200000, defaultPct: 1 },
];

const pillars = [
  { name: "Investor Relations", sub: "Earnings calls, Investor Days, LP updates" },
  { name: "Corporate Engagement", sub: "Town halls, Kickoffs, Product launches" },
  { name: "Institutional Banks", sub: "Corporate access, Capital markets" },
  { name: "Investment Managers", sub: "Virtual meetings, Expanded reach" },
];

const BURDEN_RATE = 1.3; // Fully-loaded multiplier (benefits, taxes, overhead, facilities)

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtk = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;

/* ─── Role pill badge ─── */
function RolePill({ roleId, roles }: { roleId: string; roles?: Record<string, (typeof defaultRoles)[0]> }) {
  const role = (roles || roleMap)[roleId];
  if (!role) return null;
  return (
    <span
      title={role.title}
      style={{
        ...font.sans,
        fontSize: 9,
        fontWeight: 700,
        color: role.color,
        background: `${role.color}14`,
        border: `1px solid ${role.color}30`,
        padding: "1px 6px",
        borderRadius: 4,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {role.abbr}
    </span>
  );
}

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

export default function OEValueCalculator() {
  /* ─ Selection state ─ */
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [projectionYears] = useState(3);
  const [yearRamps, setYearRamps] = useState([75, 90, 100]); // adoption ramp % per year

  /* ─ Editable data ─ */
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(defaultRoles.map((r) => [r.id, r.defaultRate]))
  );
  const [diyData, setDiyData] = useState<Record<string, { hrs: number; risk: number }[]>>(
    Object.fromEntries(products.map((p) => [p.id, p.diy.map((d) => ({ hrs: d.hrs, risk: d.risk }))]))
  );
  const [eventsPerYear, setEventsPerYear] = useState(12);

  /* ─ Per-product costs (editable) ─ */
  const [productCosts, setProductCosts] = useState<Record<string, number>>(
    Object.fromEntries(products.map((p) => [p.id, p.annualCost]))
  );

  const [softBenefits, setSoftBenefits] = useState<Record<string, number>>(
    Object.fromEntries(defaultSoftBenefits.map((b) => [b.id, b.defaultValue]))
  );
  const [softBenefitPcts, setSoftBenefitPcts] = useState<Record<string, number>>(
    Object.fromEntries(defaultSoftBenefits.map((b) => [b.id, b.defaultPct]))
  );
  const [enabledBenefits, setEnabledBenefits] = useState<Set<string>>(
    new Set(defaultSoftBenefits.map((b) => b.id))
  );
  const [burdenRate, setBurdenRate] = useState(BURDEN_RATE);

  /* ─ Custom roles ─ */
  const [customRoles, setCustomRoles] = useState<Array<{ id: string; title: string; abbr: string; defaultRate: number; color: string }>>([]);
  const allRoles = [...defaultRoles, ...customRoles];
  const allRoleMap: Record<string, (typeof defaultRoles)[0]> = Object.fromEntries(allRoles.map((r) => [r.id, r]));

  /* ─ Add custom role form state ─ */
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleAbbr, setNewRoleAbbr] = useState("");
  const [newRoleRate, setNewRoleRate] = useState(60);
  const [newRoleColorIdx, setNewRoleColorIdx] = useState(0);
  const customRoleColors = ["#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16"];

  /* ─ Customer branding ─ */
  const [customerName, setCustomerName] = useState("");
  const [customerLogo, setCustomerLogo] = useState<string | null>(null); // base64 data URL

  /* ─ Configure panel state ─ */
  const [configOpen, setConfigOpen] = useState(true);

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

  /* ─ Calculations (only selected products, with burden rate) ─ */
  const selectedProducts = products.filter((p) => selected.has(p.id));
  const selectedDiyEntries = Object.entries(diyData).filter(([id]) => selected.has(id));

  /* ─ oePlatformCost is computed from selected product costs ─ */
  const oePlatformCost = selectedProducts.reduce((sum, p) => sum + (productCosts[p.id] || 0), 0);

  const totalHrsPerEvent = selectedDiyEntries.flatMap(([, items]) => items).reduce((a, b) => a + b.hrs, 0);
  const totalRiskPerEvent = selectedDiyEntries.flatMap(([, items]) => items).reduce((a, b) => a + b.risk, 0);
  const blendedRate = Object.values(rates).reduce((a, b) => a + b, 0) / Object.keys(rates).length;
  const fullyLoadedRate = blendedRate * burdenRate;
  const laborCostPerEvent = totalHrsPerEvent * fullyLoadedRate;
  const annualDiyCost = (laborCostPerEvent + totalRiskPerEvent) * eventsPerYear;
  const totalSoftBenefits = defaultSoftBenefits.reduce((sum, b) => sum + (enabledBenefits.has(b.id) ? Math.round(softBenefits[b.id] * (softBenefitPcts[b.id] / 100)) : 0), 0);
  const totalAnnualValue = annualDiyCost + totalSoftBenefits;
  const annualSavings = totalAnnualValue - oePlatformCost;
  const roi = oePlatformCost > 0 ? ((annualSavings / oePlatformCost) * 100) : 0;
  const costOfDelayPerMonth = annualSavings / 12;

  // 3-Year Projection (with adoption ramp)
  const yearlyProjection = (() => {
    let cumDiy = 0, cumOe = 0, cumSavings = 0, cumSoft = 0;
    return Array.from({ length: projectionYears }, (_, i) => {
      const year = i + 1;
      const ramp = (yearRamps[i] ?? 100) / 100;
      const yearDiy = annualDiyCost; // DIY cost stays full regardless of ramp
      const yearOe = oePlatformCost; // OE cost stays full (you pay full price)
      const yearSavings = (annualDiyCost - oePlatformCost) * ramp;
      const yearSoft = totalSoftBenefits * ramp;
      cumDiy += yearDiy;
      cumOe += yearOe;
      cumSavings += yearSavings;
      cumSoft += yearSoft;
      return {
        year, ramp: yearRamps[i] ?? 100,
        yearDiy, yearOe, yearSavings, yearSoft,
        diyCost: cumDiy, oeCost: cumOe,
        cumulativeSavings: cumSavings,
        cumulativeSoftBenefits: cumSoft,
        totalValue: cumSavings + cumSoft,
      };
    });
  })();
  const threeYearTotal = yearlyProjection[projectionYears - 1];

  // Auto-set active tab when selection changes
  const effectiveActiveProduct = activeProduct && selected.has(activeProduct) ? activeProduct : selectedProducts[0]?.id || null;

  /* ─ PDF Export ─ */
  const exportPDF = useCallback(() => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 54;
    const contentW = W - M * 2;
    let y = 0;
    const tealC: [number, number, number] = [0, 130, 133];
    const dark: [number, number, number] = [26, 26, 26];
    const gray: [number, number, number] = [107, 101, 96];
    const redC: [number, number, number] = [194, 59, 34];
    const greenC: [number, number, number] = [43, 94, 73];

    // Helper: check page break
    const checkPage = (needed: number) => {
      if (y + needed > H - 60) { doc.addPage(); y = 50; }
    };

    // ── Cover Page ──
    doc.setFillColor(...tealC);
    doc.rect(0, 0, W, H, "F");

    // Top-left branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("OPENEXCHANGE", M, 80);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Value Analysis", M, 106);

    // Customer logo (centered)
    let coverY = 300;
    if (customerLogo) {
      try {
        doc.addImage(customerLogo, "PNG", (W - 200) / 2, coverY, 200, 60);
        coverY += 80;
      } catch {
        // If image fails, skip it
      }
    }

    // Customer name (centered)
    if (customerName) {
      doc.setFontSize(32);
      doc.setFont("times", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(customerName, W / 2, coverY + 30, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("times", "italic");
      doc.setTextColor(220, 240, 240);
      doc.text(`Prepared exclusively for ${customerName}`, W / 2, coverY + 60, { align: "center" });
    }

    // Subtle horizontal divider
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(M, H - 120, W - M, H - 120);

    // Bottom section: date and confidentiality
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 230, 230);
    doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), M, H - 90);
    doc.setFontSize(9);
    doc.setTextColor(180, 220, 220);
    doc.text("Confidential — Prepared by OpenExchange, Inc.", M, H - 74);

    // Start a new page for the main content
    doc.addPage();
    y = 0;

    // ── Header bar ──
    doc.setFillColor(...tealC);
    doc.rect(0, 0, W, 72, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(customerName ? `OpenExchange — ROI Analysis for ${customerName}` : "OpenExchange — ROI Analysis", M, 46);
    y = 96;

    // Date & context
    doc.setTextColor(...gray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, M, y);
    if (selectedProducts.length > 0) {
      doc.text(`Products: ${selectedProducts.map((p) => p.name).join(", ")}`, M, y + 14);
    }
    doc.text(`Burden rate multiplier: ${burdenRate}x  |  Events/year: ${eventsPerYear}`, M, y + 28);
    y += 52;

    // ── Executive Summary — 4 big stat boxes ──
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Executive Summary", M, y);
    y += 18;

    const boxW = (contentW - 18) / 4;
    const boxH = 60;

    // Box 1: Annual DIY Cost (red)
    doc.setFillColor(253, 240, 237);
    doc.roundedRect(M, y, boxW, boxH, 4, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...redC);
    doc.text("ANNUAL DIY COST", M + 10, y + 16);
    doc.setFontSize(18);
    doc.text(`$${fmt(Math.round(annualDiyCost))}`, M + 10, y + 40);

    // Box 2: OE Investment (teal)
    const box2X = M + boxW + 6;
    doc.setFillColor(232, 245, 245);
    doc.roundedRect(box2X, y, boxW, boxH, 4, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...tealC);
    doc.text("OE INVESTMENT", box2X + 10, y + 16);
    doc.setFontSize(18);
    doc.text(`$${fmt(oePlatformCost)}`, box2X + 10, y + 40);

    // Box 3: Net Savings (green)
    const box3X = M + (boxW + 6) * 2;
    doc.setFillColor(235, 245, 240);
    doc.roundedRect(box3X, y, boxW, boxH, 4, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...greenC);
    doc.text("NET SAVINGS", box3X + 10, y + 16);
    doc.setFontSize(18);
    doc.text(`$${fmt(Math.round(annualSavings))}`, box3X + 10, y + 40);

    // Box 4: ROI % (dark)
    const box4X = M + (boxW + 6) * 3;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(box4X, y, boxW, boxH, 4, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("ROI", box4X + 10, y + 16);
    doc.setFontSize(18);
    doc.text(`${roi.toFixed(0)}%`, box4X + 10, y + 40);

    y += boxH + 24;

    // ── Key Metrics Breakdown ──
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Key Metrics", M, y);
    y += 18;

    const metrics = [
      ["Hours per event (DIY)", `${totalHrsPerEvent} hrs`],
      ["Blended hourly rate (base)", `$${blendedRate.toFixed(0)}/hr`],
      [`Fully-loaded rate (${burdenRate}x)`, `$${fullyLoadedRate.toFixed(0)}/hr`],
      ["Labor cost per event", `$${fmt(Math.round(laborCostPerEvent))}`],
      ["Risk exposure per event", `$${fmt(totalRiskPerEvent)}`],
      ["Events per year", `${eventsPerYear}`],
      ["Annual DIY cost (loaded)", `$${fmt(Math.round(annualDiyCost))}`],
      ["OE platform cost", `$${fmt(oePlatformCost)}`],
      ["Strategic soft benefits", `$${fmt(totalSoftBenefits)}`],
      ["Net annual savings", `$${fmt(Math.round(annualSavings))}`],
      ["Return on investment", `${roi.toFixed(0)}%`],
      ["Cost of delay (per month)", `$${fmt(Math.round(costOfDelayPerMonth))}`],
    ];
    metrics.forEach(([label, val], i) => {
      const rowY = y + i * 20;
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, rowY - 3, contentW, 18, "F"); }
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(55, 65, 81);
      doc.text(label, M + 10, rowY + 9);
      doc.setFont("helvetica", "bold");
      doc.text(val, W - M - 10, rowY + 9, { align: "right" });
    });
    y += metrics.length * 20 + 20;

    // ── Product Cost Breakdown ──
    if (selectedProducts.length > 0) {
      checkPage(80);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text("Product Cost Summary", M, y);
      y += 18;

      // Header row
      doc.setFillColor(232, 245, 245);
      doc.rect(M, y - 2, contentW, 16, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...gray);
      doc.text("PRODUCT", M + 10, y + 9);
      doc.text("OE ANNUAL COST", W - M - 10, y + 9, { align: "right" });
      y += 20;

      selectedProducts.forEach((prod, i) => {
        if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, y - 4, contentW, 20, "F"); }
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(`${prod.name} (${prod.tag})`, M + 10, y + 10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...tealC);
        doc.text(`$${fmt(productCosts[prod.id])}`, W - M - 10, y + 10, { align: "right" });
        y += 22;
      });

      // Total
      doc.setDrawColor(200, 230, 220);
      doc.setLineWidth(0.5);
      doc.line(M, y, W - M, y);
      y += 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text("Total OE Investment", M + 10, y + 10);
      doc.setTextColor(...tealC);
      doc.text(`$${fmt(oePlatformCost)}`, W - M - 10, y + 10, { align: "right" });
      y += 28;
    }

    // ── 3-Year Projection Table ──
    checkPage(120);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("3-Year Cost Projection", M, y);
    y += 20;

    // Column headers
    doc.setFillColor(232, 245, 245);
    doc.rect(M, y - 2, contentW, 16, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    const cols3yr = [
      { label: "YEAR", x: M + 10, align: "left" as const },
      { label: "RAMP", x: M + 70, align: "left" as const },
      { label: "DIY COST", x: M + 150, align: "right" as const },
      { label: "OE COST", x: M + 230, align: "right" as const },
      { label: "SAVINGS", x: M + 310, align: "right" as const },
      { label: "SOFT BENEFITS", x: M + 400, align: "right" as const },
      { label: "TOTAL VALUE", x: W - M - 10, align: "right" as const },
    ];
    cols3yr.forEach((c) => doc.text(c.label, c.x, y + 9, { align: c.align }));
    y += 20;

    yearlyProjection.forEach((row, i) => {
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, y - 4, contentW, 20, "F"); }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(`Year ${row.year}`, M + 10, y + 10);
      doc.setTextColor(146, 102, 10);
      doc.text(`${row.ramp}%`, M + 70, y + 10);
      doc.setTextColor(55, 65, 81);
      doc.text(`$${fmt(Math.round(row.diyCost))}`, M + 150, y + 10, { align: "right" });
      doc.text(`$${fmt(Math.round(row.oeCost))}`, M + 230, y + 10, { align: "right" });
      doc.text(`$${fmt(Math.round(row.cumulativeSavings))}`, M + 310, y + 10, { align: "right" });
      doc.text(`$${fmt(Math.round(row.cumulativeSoftBenefits))}`, M + 400, y + 10, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...tealC);
      doc.text(`$${fmt(Math.round(row.totalValue))}`, W - M - 10, y + 10, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      y += 22;
    });

    // Total row
    doc.setDrawColor(200, 230, 220);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 4;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("3-Year Total", M + 10, y + 10);
    doc.text(`$${fmt(Math.round(threeYearTotal.diyCost))}`, M + 150, y + 10, { align: "right" });
    doc.text(`$${fmt(Math.round(threeYearTotal.oeCost))}`, M + 230, y + 10, { align: "right" });
    doc.text(`$${fmt(Math.round(threeYearTotal.cumulativeSavings))}`, M + 310, y + 10, { align: "right" });
    doc.text(`$${fmt(Math.round(threeYearTotal.cumulativeSoftBenefits))}`, M + 400, y + 10, { align: "right" });
    doc.setTextColor(...tealC);
    doc.text(`$${fmt(Math.round(threeYearTotal.totalValue))}`, W - M - 10, y + 10, { align: "right" });
    y += 32;

    // ── Per-product DIY breakdown ──
    if (selectedProducts.length > 0) {
      checkPage(60);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text("Product DIY Breakdown", M, y);
      y += 8;
      selectedProducts.forEach((prod) => {
        checkPage(100);
        y += 18;
        doc.setFillColor(...tealC);
        doc.rect(M, y - 2, 4, 16, "F");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dark);
        doc.text(prod.name, M + 12, y + 10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        doc.setFontSize(9);
        doc.text(`${prod.tag}  |  OE: $${fmt(productCosts[prod.id])}/yr`, M + 12 + doc.getTextWidth(prod.name + "  ") + 10, y + 10);
        y += 22;
        const items = diyData[prod.id];
        doc.setFillColor(250, 248, 245);
        doc.rect(M + 12, y, contentW - 12, 16, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("ACTIVITY", M + 16, y + 11);
        doc.text("ROLES", M + 200, y + 11);
        doc.text("HRS", W - M - 80, y + 11, { align: "right" });
        doc.text("RISK", W - M - 10, y + 11, { align: "right" });
        y += 18;
        items.forEach((item, i) => {
          checkPage(20);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(55, 65, 81);
          doc.text(prod.diy[i].label, M + 16, y + 10);
          const roleLabels = prod.diy[i].roles.map((r) => allRoleMap[r]?.abbr || r).join(", ");
          doc.setTextColor(...gray);
          doc.setFontSize(8);
          doc.text(roleLabels, M + 200, y + 10);
          doc.setFontSize(9);
          doc.setTextColor(55, 65, 81);
          doc.text(`${item.hrs}`, W - M - 80, y + 10, { align: "right" });
          doc.setTextColor(...redC);
          doc.text(`$${fmt(item.risk)}`, W - M - 10, y + 10, { align: "right" });
          y += 16;
        });
        const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
        const prodRisk = items.reduce((a, b) => a + b.risk, 0);
        doc.setDrawColor(232, 228, 223);
        doc.setLineWidth(0.5);
        doc.line(M + 12, y, W - M, y);
        y += 4;
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dark);
        doc.text("Subtotal", M + 16, y + 10);
        doc.text(`${prodHrs} hrs`, W - M - 80, y + 10, { align: "right" });
        doc.setTextColor(...redC);
        doc.text(`$${fmt(prodRisk)}`, W - M - 10, y + 10, { align: "right" });
        y += 24;
      });
    }

    // ── Staffing ──
    checkPage(180);
    y += 10;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Staffing Rates", M, y);
    y += 20;
    allRoles.forEach((role, i) => {
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, y - 4, contentW, 20, "F"); }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(`${role.title} (${role.abbr})`, M + 10, y + 10);
      doc.setFont("helvetica", "bold");
      doc.text(`$${rates[role.id] ?? role.defaultRate}/hr  ->  $${Math.round((rates[role.id] ?? role.defaultRate) * burdenRate)}/hr loaded`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });
    y += 10;

    // ── Soft benefits ──
    checkPage(100);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Strategic Benefits (Probability-Weighted)", M, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("Each benefit is weighted by a confidence percentage reflecting likelihood of realization.", M, y + 10);
    y += 20;

    // Column headers
    doc.setFillColor(235, 245, 240);
    doc.rect(M, y - 2, contentW, 16, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("BENEFIT", M + 10, y + 9);
    doc.text("CONFIDENCE", W - M - 140, y + 9, { align: "right" });
    doc.text("RAW VALUE", W - M - 70, y + 9, { align: "right" });
    doc.text("WEIGHTED", W - M - 10, y + 9, { align: "right" });
    y += 20;
    const activeBenefits = defaultSoftBenefits.filter((b) => enabledBenefits.has(b.id));
    activeBenefits.forEach((b, i) => {
      checkPage(24);
      if (i % 2 === 0) { doc.setFillColor(250, 248, 245); doc.rect(M, y - 4, contentW, 20, "F"); }
      const pct = softBenefitPcts[b.id];
      const weighted = Math.round(softBenefits[b.id] * (pct / 100));
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.text(b.label, M + 10, y + 10);
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      doc.text(`${pct}%`, W - M - 140, y + 10, { align: "right" });
      doc.setTextColor(55, 65, 81);
      doc.text(`$${fmt(softBenefits[b.id])}`, W - M - 70, y + 10, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...tealC);
      doc.text(`$${fmt(weighted)}`, W - M - 10, y + 10, { align: "right" });
      y += 22;
    });
    doc.setDrawColor(200, 230, 220);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 4;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...tealC);
    doc.text("Total Strategic Value (weighted)", M + 10, y + 10);
    doc.text(`$${fmt(totalSoftBenefits)}`, W - M - 10, y + 10, { align: "right" });
    y += 30;

    // ── Visual Charts ──
    doc.addPage();
    y = 50;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Visual Breakdown", M, y);
    y += 24;

    // Chart 1: Annual Cost Comparison (horizontal bars)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("ANNUAL COST COMPARISON", M, y);
    y += 14;
    const chartW = contentW;
    const maxCostVal = Math.max(annualDiyCost, oePlatformCost, 1);
    // DIY bar
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...redC);
    doc.text("DIY Cost", M, y - 2);
    const diyBarW = Math.max(4, (annualDiyCost / maxCostVal) * chartW);
    doc.setFillColor(194, 59, 34);
    doc.roundedRect(M, y, diyBarW, 24, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`$${fmt(Math.round(annualDiyCost))}`, M + 8, y + 16);
    y += 34;
    // OE bar
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...tealC);
    doc.text("OE Platform", M, y - 2);
    const oeBarW = Math.max(4, (oePlatformCost / maxCostVal) * chartW);
    doc.setFillColor(0, 130, 133);
    doc.roundedRect(M, y, oeBarW, 24, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`$${fmt(oePlatformCost)}`, M + 8, y + 16);
    y += 34;
    // Savings bar
    const savBarW = Math.max(4, (Math.abs(annualSavings) / maxCostVal) * chartW);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 94, 73);
    doc.text("You Save", M, y - 2);
    doc.setFillColor(43, 94, 73);
    doc.roundedRect(M, y, savBarW, 24, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`$${fmt(Math.round(annualSavings))}`, M + 8, y + 16);
    y += 40;

    // Chart 2: Per-product cost bars
    if (selectedProducts.length > 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...gray);
      doc.text("COST PER PRODUCT (per event)", M, y);
      y += 14;
      const pdfProdCosts = selectedProducts.map((prod) => {
        const items = diyData[prod.id];
        const hrs = items.reduce((a, b) => a + b.hrs, 0);
        const risk = items.reduce((a, b) => a + b.risk, 0);
        const labor = Math.round(hrs * fullyLoadedRate);
        return { name: prod.name, labor, risk, total: labor + risk };
      });
      const maxPdf = Math.max(...pdfProdCosts.map((p) => p.total), 1);
      pdfProdCosts.forEach((p) => {
        checkPage(40);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(`${p.name}`, M, y + 10);
        y += 14;
        const laborW = Math.max(2, (p.labor / maxPdf) * chartW);
        const riskW = Math.max(2, (p.risk / maxPdf) * chartW);
        doc.setFillColor(146, 102, 10);
        doc.rect(M, y, laborW, 16, "F");
        doc.setFillColor(194, 59, 34);
        doc.rect(M + laborW, y, riskW, 16, "F");
        // Value label on bar
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        if (laborW > 40) {
          doc.text(`$${fmt(p.labor)}`, M + 4, y + 11);
        }
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(8);
        doc.text(`$${fmt(p.total)}`, M + laborW + riskW + 6, y + 11);
        y += 24;
      });
      // Legend
      doc.setFillColor(146, 102, 10);
      doc.rect(M, y, 8, 8, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      doc.text("Labor", M + 12, y + 7);
      doc.setFillColor(194, 59, 34);
      doc.rect(M + 50, y, 8, 8, "F");
      doc.text("Risk", M + 62, y + 7);
      y += 24;
    }

    // Chart 3: Time by role
    if (selectedProducts.length > 0) {
      checkPage(180);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...gray);
      doc.text("DIY TIME BY ROLE", M, y);
      y += 14;
      const pdfRoleHours: Record<string, number> = {};
      selectedProducts.forEach((prod) => {
        const items = diyData[prod.id];
        prod.diy.forEach((d, i) => {
          const hrsPerRole = items[i].hrs / d.roles.length;
          d.roles.forEach((r) => { pdfRoleHours[r] = (pdfRoleHours[r] || 0) + hrsPerRole; });
        });
      });
      const pdfRoleEntries = Object.entries(pdfRoleHours).sort((a, b) => b[1] - a[1]);
      const totalPdfRoleHrs = pdfRoleEntries.reduce((a, [, h]) => a + h, 0);
      pdfRoleEntries.forEach(([id, hrs]) => {
        checkPage(20);
        const role = allRoleMap[id];
        const pct = ((hrs / totalPdfRoleHrs) * 100).toFixed(0);
        const barW = (hrs / totalPdfRoleHrs) * chartW;
        const roleColor = role?.color || "#999";
        const r = parseInt(roleColor.slice(1, 3), 16);
        const g = parseInt(roleColor.slice(3, 5), 16);
        const b = parseInt(roleColor.slice(5, 7), 16);
        doc.setFillColor(r, g, b);
        const roleBarW = Math.max(4, barW);
        doc.roundedRect(M, y, roleBarW, 16, 2, 2, "F");
        // Label on bar if wide enough
        if (roleBarW > 30) {
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(`${Math.round(hrs)}h`, M + 4, y + 11);
        }
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        doc.text(`${role?.abbr || id}  ${Math.round(hrs)}h (${pct}%)`, M + roleBarW + 8, y + 12);
        y += 22;
      });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(`Total: ${Math.round(totalPdfRoleHrs)} hours/event`, M, y + 4);
      y += 24;
    }

    // ── Chart 4: 3-Year Projection (grouped bar chart) ──
    doc.addPage();
    y = 50;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("3-Year Cost Projection — Visual", M, y);
    y += 24;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("ANNUAL DIY vs OE COST BY YEAR", M, y);
    y += 18;

    const projChartH = 140;
    const projMaxVal = Math.max(annualDiyCost * 3, 1);
    const yearGroupW = contentW / 3;
    const barGap = 8;
    const projBarW = 40;

    // Y-axis baseline
    const projBaseY = y + projChartH;

    // Draw gridlines
    for (let g = 0; g <= 4; g++) {
      const gy = y + (projChartH * g) / 4;
      doc.setDrawColor(232, 228, 223);
      doc.setLineWidth(0.3);
      doc.line(M, gy, W - M, gy);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      const gridVal = Math.round(projMaxVal - (projMaxVal * g) / 4);
      doc.text(`$${fmtk(gridVal)}`, M - 4, gy + 3, { align: "right" });
    }

    yearlyProjection.forEach((row, i) => {
      const groupX = M + i * yearGroupW + yearGroupW / 2;

      // DIY bar (red)
      const diyH = (row.diyCost / projMaxVal) * projChartH;
      doc.setFillColor(194, 59, 34);
      doc.roundedRect(groupX - projBarW - barGap / 2, projBaseY - diyH, projBarW, diyH, 2, 2, "F");
      // Value on DIY bar
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      if (diyH > 14) doc.text(`$${fmtk(Math.round(row.diyCost))}`, groupX - projBarW - barGap / 2 + projBarW / 2, projBaseY - diyH + 10, { align: "center" });

      // OE bar (teal)
      const oeH = (row.oeCost / projMaxVal) * projChartH;
      doc.setFillColor(0, 130, 133);
      doc.roundedRect(groupX + barGap / 2, projBaseY - oeH, projBarW, oeH, 2, 2, "F");
      // Value on OE bar
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      if (oeH > 14) doc.text(`$${fmtk(Math.round(row.oeCost))}`, groupX + barGap / 2 + projBarW / 2, projBaseY - oeH + 10, { align: "center" });

      // Year label
      doc.setTextColor(...dark);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Year ${row.year}`, groupX, projBaseY + 16, { align: "center" });

      // Savings label below
      doc.setTextColor(43, 94, 73);
      doc.setFontSize(8);
      doc.text(`Save $${fmtk(Math.round(row.cumulativeSavings))}`, groupX, projBaseY + 28, { align: "center" });
    });

    y = projBaseY + 42;

    // Legend
    doc.setFillColor(194, 59, 34);
    doc.rect(M, y, 10, 10, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("DIY Cost", M + 14, y + 8);
    doc.setFillColor(0, 130, 133);
    doc.rect(M + 65, y, 10, 10, "F");
    doc.text("OE Platform", M + 79, y + 8);
    y += 30;

    // ── Chart 5: Value Waterfall ──
    checkPage(220);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...gray);
    doc.text("VALUE WATERFALL", M, y);
    y += 18;

    const waterfallItems = [
      { label: "DIY Cost", value: annualDiyCost, color: redC },
      { label: "OE Cost", value: oePlatformCost, color: tealC },
      { label: "Hard Savings", value: annualDiyCost - oePlatformCost, color: greenC },
      { label: "Soft Benefits", value: totalSoftBenefits, color: [146, 102, 10] as [number, number, number] },
      { label: "Total Value", value: annualSavings + totalSoftBenefits, color: dark },
    ];
    const waterfallMax = Math.max(...waterfallItems.map((w) => Math.abs(w.value)), 1);
    const wfBarH = 28;
    const wfBarMaxW = contentW * 0.7;

    waterfallItems.forEach((item) => {
      checkPage(50);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(item.label, M, y + 10);

      const barW = Math.max(4, (Math.abs(item.value) / waterfallMax) * wfBarMaxW);
      const barX = M + 100;
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.roundedRect(barX, y, barW, wfBarH, 3, 3, "F");

      // Value label on bar
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      if (barW > 50) {
        doc.text(`$${fmt(Math.round(item.value))}`, barX + 8, y + 18);
      } else {
        doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        doc.text(`$${fmt(Math.round(item.value))}`, barX + barW + 6, y + 18);
      }

      y += wfBarH + 10;
    });
    y += 10;

    // ── Assumptions ──
    checkPage(120);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Assumptions & Methodology", M, y);
    y += 16;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    const assumptions = [
      `Labor costs include a ${burdenRate}x burden rate multiplier applied to base hourly wages to account for benefits, payroll taxes, overhead, and facilities.`,
      "Time estimates are based on industry benchmarks for financial services event production and may vary by organization.",
      "Risk exposure values represent potential financial impact from errors, delays, or reputational damage — not guaranteed losses.",
      "Strategic soft benefits are estimated annual values and should be validated against your organization's specific context.",
      "All values are editable — adjust to match your actual costs and experience.",
    ];
    assumptions.forEach((a) => {
      checkPage(30);
      const lines = doc.splitTextToSize(`  ${a}`, contentW - 20);
      doc.text(lines, M + 10, y + 10);
      y += lines.length * 10 + 6;
    });

    // ── DISCLAIMER ──
    checkPage(180);
    y += 16;
    // Gray background box
    doc.setFillColor(240, 240, 240);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    const disclaimerText = "This document is provided by OpenExchange, Inc. for informational purposes only and does not constitute a binding offer, guarantee, or warranty of any kind. All cost estimates, savings projections, and ROI calculations are based on assumptions, industry benchmarks, and user-provided inputs that may not reflect your organization\u2019s actual experience. Actual results will vary based on organizational complexity, team composition, event volume, vendor pricing, and market conditions. Strategic soft benefits are subjective estimates and should be validated by your finance and operations teams. Past performance indicators and industry benchmarks referenced herein do not guarantee future outcomes. This analysis is intended as a planning tool and conversation starter \u2014 not a contractual commitment. OpenExchange recommends that all purchasing decisions be made in consultation with appropriate internal stakeholders and subject to your organization\u2019s procurement policies. All figures are user-editable and the exported values reflect customized inputs at time of generation.";
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentW - 40);
    const disclaimerBoxH = disclaimerLines.length * 10 + 60;

    // Check if we need a new page for the disclaimer
    if (y + disclaimerBoxH > H - 60) { doc.addPage(); y = 50; }

    doc.roundedRect(M, y, contentW, disclaimerBoxH, 4, 4, "FD");

    // DISCLAIMER header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("DISCLAIMER", M + 20, y + 22);

    // Divider line under header
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(M + 20, y + 28, M + contentW - 20, y + 28);

    // Disclaimer body text
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(disclaimerLines, M + 20, y + 40);

    // Date and page reference at bottom of disclaimer
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(`Document generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} | Refer to pages 1\u2013${doc.getNumberOfPages()} for full analysis details.`, M + 20, y + disclaimerBoxH - 12);

    y += disclaimerBoxH + 16;

    // ── Footer on every page ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pH = doc.internal.pageSize.getHeight();
      doc.setFillColor(...tealC);
      doc.rect(0, pH - 28, W, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(customerName ? `Prepared for ${customerName} — Confidential` : "OpenExchange — Confidential", M, pH - 10);
      doc.text(`Page ${i} of ${pageCount}`, W - M, pH - 10, { align: "right" });
    }

    doc.save("OE-ROI-Analysis.pdf");
  }, [diyData, rates, eventsPerYear, oePlatformCost, annualDiyCost, annualSavings, roi, totalHrsPerEvent, totalRiskPerEvent, blendedRate, fullyLoadedRate, laborCostPerEvent, costOfDelayPerMonth, softBenefits, softBenefitPcts, totalSoftBenefits, totalAnnualValue, selectedProducts, burdenRate, yearlyProjection, threeYearTotal, projectionYears, productCosts, enabledBenefits, yearRamps, customerName, customerLogo, customRoles, allRoles, allRoleMap]);

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  // Find the active product object for tabbed comparison
  const activeProductObj = effectiveActiveProduct ? products.find((p) => p.id === effectiveActiveProduct) : null;

  return (
    <div style={{
      width: "100vw",
      marginLeft: "calc(-50vw + 50%)",
      background: color.bg,
      paddingBottom: 80,
      overflowX: "hidden" as const,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>

        {/* ─── HERO ─── */}
        <div style={{ paddingTop: 48 }}>
          <Link href="/projects" style={{ ...font.sans, fontSize: 13, color: color.subtle, textDecoration: "none", letterSpacing: "0.02em" }}>
            ← Back to Projects
          </Link>

          {/* ─── PREPARED FOR ─── */}
          <div style={{ marginTop: 20, marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <label style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: color.subtle, whiteSpace: "nowrap" }}>
                Prepared for
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter company name..."
                style={{
                  ...font.sans,
                  fontSize: 14,
                  color: color.text,
                  background: color.card,
                  border: `1px solid ${color.border}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  outline: "none",
                  flex: 1,
                  maxWidth: 320,
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: color.subtle, whiteSpace: "nowrap" }}>
                Logo
              </label>
              {customerLogo ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={customerLogo} alt="Logo" style={{ maxHeight: 60, maxWidth: 120, objectFit: "contain", borderRadius: 4, border: `1px solid ${color.border}` }} />
                  <button
                    onClick={() => setCustomerLogo(null)}
                    style={{
                      ...font.sans,
                      fontSize: 14,
                      fontWeight: 500,
                      color: color.red,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 6px",
                      borderRadius: 4,
                      lineHeight: 1,
                    }}
                    title="Remove logo"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{
                  ...font.sans,
                  fontSize: 12,
                  fontWeight: 500,
                  color: color.teal,
                  background: color.tealLight,
                  border: `1px solid ${color.teal}40`,
                  borderRadius: 8,
                  padding: "7px 14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  Upload logo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setCustomerLogo(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: color.teal, marginTop: 24, marginBottom: 8 }}>
            OpenExchange ROI Calculator
          </div>

          <h1 style={{
            ...font.serif,
            fontSize: 42,
            fontWeight: 700,
            color: color.text,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginTop: 0,
            marginBottom: 12,
          }}>
            What does it actually cost to do it yourself?
          </h1>
          <p style={{
            ...font.serif,
            fontSize: 17,
            color: color.muted,
            lineHeight: 1.6,
            maxWidth: 640,
            marginBottom: 40,
          }}>
            Select the products you need. See the hours, risk, and hidden costs of doing it manually — versus the OpenExchange platform.
          </p>
        </div>

        {/* ─── PRODUCT PICKER ─── */}
        <div style={{ marginBottom: 40 }}>
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
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: 14,
                    background: isOn ? color.card : color.bg,
                    border: `2px solid ${isOn ? color.teal : color.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${isOn ? color.teal : color.border}`,
                      background: isOn ? color.teal : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}>
                      {isOn && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ ...font.serif, fontSize: 14, fontWeight: 700, color: color.text }}>
                      {p.name}
                    </span>
                  </div>
                  <div style={{ ...font.sans, fontSize: 11, color: color.subtle, lineHeight: 1.4 }}>
                    {p.oneLiner}
                  </div>
                  <div style={{ ...font.mono, fontSize: 11, color: color.teal, fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>
                    <Editable
                      value={productCosts[p.id]}
                      onChange={(v) => setProductCosts((prev) => ({ ...prev, [p.id]: v }))}
                      prefix="$"
                      suffix="/yr"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ROLE LEGEND ─── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle }}>
              Roles
            </span>
            {allRoles.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <RolePill roleId={r.id} roles={allRoleMap} />
                <span style={{ ...font.sans, fontSize: 11, color: color.muted }}>{r.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CONFIGURE YOUR MODEL PANEL ─── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ height: 1, background: color.border, marginBottom: 24 }} />
          <button
            onClick={() => setConfigOpen(!configOpen)}
            style={{
              ...font.sans,
              fontSize: 14,
              fontWeight: 600,
              color: color.text,
              background: color.card,
              border: `1px solid ${color.border}`,
              borderRadius: 10,
              padding: "14px 24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              justifyContent: "space-between",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>⚙</span>
              <span>Configure Your Model</span>
              <span style={{ ...font.sans, fontSize: 11, color: color.muted, fontWeight: 400 }}>
                — Staffing rates, event parameters, product costs
              </span>
            </div>
            <span style={{ fontSize: 14, color: color.subtle, transition: "transform 0.2s ease", transform: configOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▼
            </span>
          </button>

          {configOpen && (
            <div style={{
              marginTop: 12,
              background: color.card,
              border: `1px solid ${color.border}`,
              borderRadius: 12,
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 28,
            }}>

              {/* Column 1: Staffing Rates */}
              <div>
                <h4 style={{ ...font.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14, marginTop: 0 }}>
                  Staffing Rates
                </h4>
                <div style={{ border: `1px solid ${color.border}`, borderRadius: 8, overflow: "hidden" }}>
                  {allRoles.map((role, i) => {
                    const isCustom = customRoles.some((cr) => cr.id === role.id);
                    return (
                      <div key={role.id} style={{
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: i < allRoles.length - 1 ? `1px solid ${color.border}` : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <RolePill roleId={role.id} roles={allRoleMap} />
                          <span style={{ ...font.sans, fontSize: 12, color: color.text }}>{role.title}</span>
                          {isCustom && (
                            <button
                              onClick={() => {
                                setCustomRoles((prev) => prev.filter((cr) => cr.id !== role.id));
                                setRates((prev) => { const next = { ...prev }; delete next[role.id]; return next; });
                              }}
                              style={{ ...font.sans, fontSize: 11, color: color.red, background: "none", border: "none", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
                              title="Remove custom role"
                            >
                              x
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Editable value={rates[role.id] ?? role.defaultRate} onChange={(v) => setRates((prev) => ({ ...prev, [role.id]: v }))} prefix="$" suffix="/hr" />
                          </div>
                          <span style={{ ...font.mono, fontSize: 10, color: color.subtle }} title={`${burdenRate}x loaded`}>
                            → ${Math.round((rates[role.id] ?? role.defaultRate) * burdenRate)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Burden rate */}
                <div style={{
                  marginTop: 8,
                  padding: "10px 14px",
                  background: color.amberLight,
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ ...font.sans, fontSize: 12, color: color.amber, fontWeight: 600 }}>
                    Burden rate multiplier
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    <Editable value={Number((burdenRate * 100).toFixed(0))} onChange={(v) => setBurdenRate(v / 100)} suffix="%" />
                    <span style={{ ...font.sans, fontSize: 11, color: color.amber }}>({burdenRate}x)</span>
                  </div>
                </div>
                {/* Add custom role */}
                {!showAddRole ? (
                  <button
                    onClick={() => setShowAddRole(true)}
                    style={{
                      marginTop: 8,
                      width: "100%",
                      padding: "8px 14px",
                      ...font.sans,
                      fontSize: 12,
                      fontWeight: 600,
                      color: color.teal,
                      background: color.tealLight,
                      border: `1px dashed ${color.teal}60`,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    + Add Role
                  </button>
                ) : (
                  <div style={{
                    marginTop: 8,
                    padding: "10px 12px",
                    background: color.tealLight,
                    border: `1px solid ${color.teal}40`,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        type="text"
                        placeholder="Title"
                        value={newRoleTitle}
                        onChange={(e) => setNewRoleTitle(e.target.value)}
                        style={{ ...font.sans, fontSize: 11, padding: "4px 8px", border: `1px solid ${color.border}`, borderRadius: 4, outline: "none", flex: 1, minWidth: 0 }}
                      />
                      <input
                        type="text"
                        placeholder="Abbr"
                        value={newRoleAbbr}
                        maxLength={4}
                        onChange={(e) => setNewRoleAbbr(e.target.value.toUpperCase())}
                        style={{ ...font.sans, fontSize: 11, padding: "4px 8px", border: `1px solid ${color.border}`, borderRadius: 4, outline: "none", width: 48 }}
                      />
                      <input
                        type="number"
                        placeholder="$/hr"
                        value={newRoleRate}
                        onChange={(e) => setNewRoleRate(Number(e.target.value) || 0)}
                        style={{ ...font.mono, fontSize: 11, padding: "4px 8px", border: `1px solid ${color.border}`, borderRadius: 4, outline: "none", width: 52 }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ ...font.sans, fontSize: 10, color: color.muted }}>Color:</span>
                      {customRoleColors.map((c, ci) => (
                        <button
                          key={c}
                          onClick={() => setNewRoleColorIdx(ci)}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            background: c,
                            border: ci === newRoleColorIdx ? "2px solid #333" : "2px solid transparent",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        />
                      ))}
                      <div style={{ flex: 1 }} />
                      <button
                        onClick={() => { setShowAddRole(false); setNewRoleTitle(""); setNewRoleAbbr(""); setNewRoleRate(60); }}
                        style={{ ...font.sans, fontSize: 11, color: color.muted, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!newRoleTitle.trim() || !newRoleAbbr.trim()) return;
                          const id = `custom-${newRoleTitle.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
                          setCustomRoles((prev) => [...prev, { id, title: newRoleTitle.trim(), abbr: newRoleAbbr.trim(), defaultRate: newRoleRate, color: customRoleColors[newRoleColorIdx] }]);
                          setRates((prev) => ({ ...prev, [id]: newRoleRate }));
                          setNewRoleTitle(""); setNewRoleAbbr(""); setNewRoleRate(60); setShowAddRole(false);
                        }}
                        style={{ ...font.sans, fontSize: 11, fontWeight: 600, color: "#fff", background: color.teal, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer" }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Event Parameters */}
              <div>
                <h4 style={{ ...font.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14, marginTop: 0 }}>
                  Event Parameters
                </h4>
                <div style={{ border: `1px solid ${color.border}`, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    padding: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${color.border}`,
                  }}>
                    <span style={{ ...font.sans, fontSize: 13, color: color.text }}>Events per year</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Editable value={eventsPerYear} onChange={setEventsPerYear} />
                    </div>
                  </div>
                  <div style={{
                    padding: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ ...font.sans, fontSize: 13, color: color.text }}>Burden rate</span>
                    <span style={{ ...font.mono, fontSize: 13, fontWeight: 600, color: color.amber }}>{burdenRate}x</span>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: "16px", background: color.tealLight, borderRadius: 8 }}>
                  <div style={{ ...font.sans, fontSize: 11, fontWeight: 600, color: color.tealDark, marginBottom: 8 }}>
                    Computed Values
                  </div>
                  {[
                    { label: "Blended base rate", value: `$${blendedRate.toFixed(0)}/hr` },
                    { label: "Fully-loaded rate", value: `$${fullyLoadedRate.toFixed(0)}/hr` },
                    { label: "Hours/event (DIY)", value: `${totalHrsPerEvent} hrs` },
                    { label: "Labor cost/event", value: `$${fmt(Math.round(laborCostPerEvent))}` },
                    { label: "Risk/event", value: `$${fmt(totalRiskPerEvent)}` },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                      <span style={{ ...font.sans, fontSize: 12, color: color.muted }}>{row.label}</span>
                      <span style={{ ...font.mono, fontSize: 12, fontWeight: 600, color: color.text }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Product Costs */}
              <div>
                <h4 style={{ ...font.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14, marginTop: 0 }}>
                  Product Costs
                </h4>
                <div style={{ border: `1px solid ${color.border}`, borderRadius: 8, overflow: "hidden" }}>
                  {products.map((p, i) => {
                    const isSelected = selected.has(p.id);
                    return (
                      <div key={p.id} style={{
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: i < products.length - 1 ? `1px solid ${color.border}` : "none",
                        opacity: isSelected ? 1 : 0.4,
                        background: isSelected ? "transparent" : `${color.bg}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ ...font.sans, fontSize: 12, color: color.text, fontWeight: isSelected ? 600 : 400 }}>
                            {p.name}
                          </span>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Editable
                            value={productCosts[p.id]}
                            onChange={(v) => setProductCosts((prev) => ({ ...prev, [p.id]: v }))}
                            prefix="$"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Total */}
                <div style={{
                  marginTop: 8,
                  padding: "12px 14px",
                  background: color.tealLight,
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ ...font.sans, fontSize: 13, fontWeight: 700, color: color.tealDark }}>
                    Total OE Investment
                  </span>
                  <span style={{ ...font.serif, fontSize: 18, fontWeight: 700, color: color.teal }}>
                    ${fmt(oePlatformCost)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── STRATEGIC BENEFITS ─── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
          <h2 style={{ ...font.serif, fontSize: 32, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 6 }}>
            What you can&apos;t put in a spreadsheet
          </h2>
          <p style={{ ...font.serif, fontSize: 15, color: color.muted, marginBottom: 12 }}>
            Strategic benefits that compound over time. Click a card to toggle it on/off. Click values to edit.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ ...font.sans, fontSize: 11, color: color.subtle }}>
              {enabledBenefits.size} of {defaultSoftBenefits.length} included
            </span>
            <button
              onClick={() => {
                if (enabledBenefits.size === defaultSoftBenefits.length) setEnabledBenefits(new Set());
                else setEnabledBenefits(new Set(defaultSoftBenefits.map((b) => b.id)));
              }}
              style={{
                ...font.sans, fontSize: 11, fontWeight: 500, color: color.teal, background: "none",
                border: `1px solid ${color.teal}`, borderRadius: 16, padding: "3px 12px", cursor: "pointer",
              }}
            >
              {enabledBenefits.size === defaultSoftBenefits.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {defaultSoftBenefits.map((b) => {
              const isOn = enabledBenefits.has(b.id);
              const pct = softBenefitPcts[b.id];
              const weighted = Math.round(softBenefits[b.id] * (pct / 100));
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setEnabledBenefits((prev) => {
                      const next = new Set(prev);
                      if (next.has(b.id)) next.delete(b.id);
                      else next.add(b.id);
                      return next;
                    });
                  }}
                  style={{
                    background: isOn ? color.card : color.bg,
                    border: `2px solid ${isOn ? color.green : color.border}`,
                    borderRadius: 10,
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    cursor: "pointer",
                    opacity: isOn ? 1 : 0.5,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        border: `2px solid ${isOn ? color.green : color.border}`,
                        background: isOn ? color.green : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s ease",
                      }}>
                        {isOn && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                      </div>
                      <div style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: isOn ? color.text : color.muted }}>
                        {b.label}
                      </div>
                    </div>
                    {isOn && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Editable
                          value={pct}
                          onChange={(v) => setSoftBenefitPcts((prev) => ({ ...prev, [b.id]: Math.max(0, Math.min(100, v)) }))}
                          suffix="%"
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ ...font.sans, fontSize: 11, color: color.muted, lineHeight: 1.5, flex: 1 }}>
                    {b.desc}
                  </div>
                  {isOn && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Editable value={softBenefits[b.id]} onChange={(v) => setSoftBenefits((prev) => ({ ...prev, [b.id]: v }))} prefix="$" />
                        </div>
                        {pct < 100 && (
                          <span style={{ ...font.mono, fontSize: 11, color: color.teal, fontWeight: 600 }}>
                            → ${fmt(weighted)}
                          </span>
                        )}
                      </div>
                      <div style={{ height: 3, background: `${color.border}`, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: pct >= 80 ? color.green : pct >= 50 ? color.amber : color.red,
                          borderRadius: 2,
                          transition: "width 0.2s ease, background 0.2s ease",
                        }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 14,
            padding: "14px 20px",
            background: color.tealLight,
            border: `1px solid ${color.teal}`,
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <span style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: color.tealDark }}>
                Total strategic value (probability-weighted)
              </span>
              <div style={{ ...font.sans, fontSize: 11, color: color.muted, marginTop: 2 }}>
                {enabledBenefits.size} benefits enabled · Weighted by confidence %
              </div>
            </div>
            <span style={{ ...font.serif, fontSize: 22, fontWeight: 700, color: color.teal }}>
              ${fmt(totalSoftBenefits)}
            </span>
          </div>
        </div>

        {/* ─── TABBED PRODUCT COMPARISON ─── */}
        {selectedProducts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
            <h2 style={{
              ...font.serif,
              fontSize: 32,
              fontWeight: 700,
              color: color.text,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}>
              The real cost of DIY
            </h2>
            <p style={{ ...font.serif, fontSize: 15, color: color.muted, marginBottom: 24 }}>
              Compare what you get with OE versus doing it yourself. Click any number to edit.
            </p>

            {/* Product tabs */}
            <div style={{
              display: "flex",
              gap: 0,
              borderBottom: `2px solid ${color.border}`,
              marginBottom: 0,
            }}>
              {selectedProducts.map((prod) => {
                const isActive = prod.id === effectiveActiveProduct;
                return (
                  <button
                    key={prod.id}
                    onClick={() => setActiveProduct(prod.id)}
                    style={{
                      ...font.sans,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? color.teal : color.muted,
                      background: isActive ? color.card : "transparent",
                      border: "none",
                      borderBottom: isActive ? `3px solid ${color.teal}` : "3px solid transparent",
                      padding: "10px 20px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      marginBottom: -2,
                    }}
                  >
                    {prod.name}
                  </button>
                );
              })}
            </div>

            {/* Active product comparison table */}
            {activeProductObj && (() => {
              const items = diyData[activeProductObj.id];
              const prodHrs = items.reduce((a, b) => a + b.hrs, 0);
              const prodRisk = items.reduce((a, b) => a + b.risk, 0);
              const prodLaborCost = Math.round(prodHrs * fullyLoadedRate);

              return (
                <div style={{
                  border: `1px solid ${color.border}`,
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  overflow: "hidden",
                  background: color.card,
                }}>
                  {/* Card header */}
                  <div style={{
                    padding: "14px 24px",
                    background: color.tealLight,
                    borderBottom: `1px solid ${color.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div>
                        <div style={{ ...font.serif, fontSize: 18, fontWeight: 700, color: color.text }}>
                          {activeProductObj.name}
                        </div>
                        <div style={{ ...font.sans, fontSize: 11, color: color.muted }}>{activeProductObj.tag} — {activeProductObj.oneLiner}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...font.mono, fontSize: 13, color: color.red, fontWeight: 600 }}>
                        {prodHrs}h · ${fmt(prodRisk)} risk
                      </div>
                      <div style={{ ...font.mono, fontSize: 11, color: color.muted }}>
                        ${fmt(prodLaborCost)} labor/event · OE: ${fmt(productCosts[activeProductObj.id])}/yr
                      </div>
                    </div>
                  </div>

                  {/* Two-column: OE vs DIY */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

                    {/* LEFT — With OE */}
                    <div style={{ borderRight: `1px solid ${color.border}` }}>
                      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${color.border}`, background: "#FAFEF9" }}>
                        <span style={{ ...font.sans, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.green }}>
                          With OpenExchange
                        </span>
                      </div>
                      {activeProductObj.oe.map((f, i) => (
                        <div key={f.label} style={{
                          padding: "10px 20px",
                          borderBottom: i < activeProductObj.oe.length - 1 ? `1px solid ${color.border}` : "none",
                        }}>
                          <div style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: color.text, marginBottom: 2 }}>
                            {f.label}
                          </div>
                          <div style={{ ...font.sans, fontSize: 12, color: color.muted, lineHeight: 1.5 }}>
                            {f.desc}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RIGHT — DIY */}
                    <div style={{ background: color.redLight }}>
                      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${color.border}` }}>
                        <span style={{ ...font.sans, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.red }}>
                          DIY Manual Process
                        </span>
                      </div>
                      {activeProductObj.diy.map((d, dIdx) => (
                        <div key={d.label} style={{
                          padding: "10px 20px",
                          borderBottom: dIdx < activeProductObj.diy.length - 1 ? `1px solid rgba(194,59,34,0.1)` : "none",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <span style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: color.text }}>
                              {d.label}
                            </span>
                            <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                              <Editable value={items[dIdx].hrs} onChange={(v) => updateDiy(activeProductObj.id, dIdx, "hrs", v)} suffix="h" />
                              <Editable value={items[dIdx].risk} onChange={(v) => updateDiy(activeProductObj.id, dIdx, "risk", v)} prefix="$" />
                            </div>
                          </div>
                          <div style={{ ...font.sans, fontSize: 12, color: color.muted, lineHeight: 1.4, marginBottom: 4 }}>
                            {d.desc}
                          </div>
                          {/* Role pills */}
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {d.roles.map((r) => <RolePill key={r} roleId={r} roles={allRoleMap} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ─── ROI SUMMARY (new layout: 4 stat cards + breakdown table) ─── */}
        {selectedProducts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
            <h2 style={{ ...font.serif, fontSize: 32, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 24 }}>
              ROI Summary
            </h2>

            {/* Top row: 4 big stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {/* Annual DIY Cost (red) */}
              <div style={{ background: color.redLight, border: `1px solid ${color.red}30`, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.red, marginBottom: 8 }}>
                  Annual DIY Cost
                </div>
                <div style={{ ...font.serif, fontSize: 30, fontWeight: 700, color: color.red }}>
                  ${fmtk(Math.round(annualDiyCost))}
                </div>
              </div>

              {/* OE Investment (teal) */}
              <div style={{ background: color.tealLight, border: `1px solid ${color.teal}30`, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.tealDark, marginBottom: 8 }}>
                  OE Investment
                </div>
                <div style={{ ...font.serif, fontSize: 30, fontWeight: 700, color: color.teal }}>
                  ${fmtk(oePlatformCost)}
                </div>
              </div>

              {/* Net Savings (green) */}
              <div style={{ background: color.greenLight, border: `1px solid ${color.green}30`, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.green, marginBottom: 8 }}>
                  Net Savings
                </div>
                <div style={{ ...font.serif, fontSize: 30, fontWeight: 700, color: color.green }}>
                  ${fmtk(Math.round(annualSavings))}
                </div>
              </div>

              {/* ROI % (dark) */}
              <div style={{ background: color.text, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                  Return on Investment
                </div>
                <div style={{ ...font.serif, fontSize: 30, fontWeight: 700, color: "#fff" }}>
                  {roi.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              {[
                { label: "Hours per event (DIY)", value: `${totalHrsPerEvent} hrs`, c: color.amber },
                { label: "Blended hourly rate (base)", value: `$${blendedRate.toFixed(0)}/hr`, c: color.text },
                { label: `Fully-loaded rate (${burdenRate}x)`, value: `$${fullyLoadedRate.toFixed(0)}/hr`, c: color.amber },
                { label: "Labor cost per event", value: `$${fmt(Math.round(laborCostPerEvent))}`, c: color.text },
                { label: "Risk exposure per event", value: `$${fmt(totalRiskPerEvent)}`, c: color.red },
                { label: "Events per year", value: `${eventsPerYear}`, c: color.text },
                { label: "Annual DIY cost (loaded labor + risk)", value: `$${fmt(Math.round(annualDiyCost))}`, c: color.red },
                { label: "OE platform cost", value: `$${fmt(oePlatformCost)}`, c: color.teal },
                { label: "Strategic soft benefits", value: `$${fmt(totalSoftBenefits)}`, c: color.green },
                { label: "Net annual savings", value: `$${fmt(Math.round(annualSavings))}`, c: color.green },
                { label: "Return on investment", value: `${roi.toFixed(0)}%`, c: color.teal },
                { label: "Cost of delay / month", value: `$${fmt(Math.round(costOfDelayPerMonth))}`, c: color.text },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderBottom: i < 11 ? `1px solid ${color.border}` : "none",
                  background: i % 2 === 0 ? color.card : color.bg,
                }}>
                  <span style={{ ...font.sans, fontSize: 13, color: color.muted }}>{row.label}</span>
                  <span style={{ ...font.mono, fontSize: 14, fontWeight: 700, color: row.c }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Export PDF button */}
            <button
              onClick={exportPDF}
              style={{
                width: "100%",
                padding: "16px 0",
                ...font.sans,
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                background: color.teal,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = color.tealDark; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = color.teal; }}
            >
              Export ROI Report (PDF) →
            </button>
          </div>
        )}

        {/* ─── 3-YEAR COST PROJECTION ─── */}
        {selectedProducts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
            <h2 style={{ ...font.serif, fontSize: 32, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 6 }}>
              3-Year Cost Projection
            </h2>
            <p style={{ ...font.serif, fontSize: 15, color: color.muted, marginBottom: 20 }}>
              Cumulative cost comparison and value creation over three years. Adjust adoption ramp to reflect realistic rollout.
            </p>

            {/* Adoption Ramp Sliders */}
            <div style={{
              background: color.card,
              border: `1px solid ${color.border}`,
              borderRadius: 10,
              padding: "20px 24px",
              marginBottom: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}>
              <div style={{ ...font.sans, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, gridColumn: "1 / -1", marginBottom: -8 }}>
                Adoption Ramp — % of value realized each year
              </div>
              {yearRamps.map((val, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: color.text }}>Year {i + 1}</span>
                    <span style={{ ...font.mono, fontSize: 15, fontWeight: 700, color: val === 100 ? color.green : val >= 75 ? color.teal : color.amber }}>{val}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={val}
                    onChange={(e) => {
                      const next = [...yearRamps];
                      next[i] = Number(e.target.value);
                      setYearRamps(next);
                    }}
                    style={{
                      width: "100%",
                      height: 6,
                      borderRadius: 3,
                      appearance: "none",
                      WebkitAppearance: "none",
                      background: `linear-gradient(to right, ${color.teal} 0%, ${color.teal} ${val}%, ${color.border} ${val}%, ${color.border} 100%)`,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ ...font.sans, fontSize: 10, color: color.muted, marginTop: 4 }}>
                    Savings: ${fmtk(Math.round((annualDiyCost - oePlatformCost) * val / 100))}
                  </div>
                </div>
              ))}
            </div>

            {/* Projection Table — full width */}
            <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", ...font.mono, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: color.tealLight }}>
                    {["Year", "Ramp", "DIY Cost", "OE Cost", "Savings", "Soft Benefits", "Total Value"].map((h) => (
                      <th key={h} style={{ ...font.sans, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: color.tealDark, padding: "12px 16px", textAlign: (h === "Year" || h === "Ramp") ? "left" : "right", borderBottom: `1px solid ${color.border}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yearlyProjection.map((row, i) => (
                    <tr key={row.year} style={{ background: i % 2 === 0 ? color.card : color.bg }}>
                      <td style={{ ...font.sans, fontSize: 13, fontWeight: 600, color: color.text, padding: "12px 16px" }}>Year {row.year}</td>
                      <td style={{ ...font.sans, fontSize: 12, padding: "12px 16px", color: row.ramp === 100 ? color.green : color.amber, fontWeight: 600 }}>{row.ramp}%</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: color.red }}>${fmt(Math.round(row.diyCost))}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: color.teal }}>${fmt(Math.round(row.oeCost))}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: color.green }}>${fmt(Math.round(row.cumulativeSavings))}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: color.amber }}>${fmt(Math.round(row.cumulativeSoftBenefits))}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: color.teal }}>${fmt(Math.round(row.totalValue))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: color.tealLight, borderTop: `2px solid ${color.teal}` }}>
                    <td style={{ ...font.sans, fontSize: 13, fontWeight: 700, color: color.text, padding: "14px 16px" }}>3-Year Total</td>
                    <td style={{ padding: "14px 16px" }}></td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: color.red }}>${fmt(Math.round(threeYearTotal.diyCost))}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: color.teal }}>${fmt(Math.round(threeYearTotal.oeCost))}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: color.green }}>${fmt(Math.round(threeYearTotal.cumulativeSavings))}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: color.amber }}>${fmt(Math.round(threeYearTotal.cumulativeSoftBenefits))}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, fontSize: 14, color: color.teal }}>${fmt(Math.round(threeYearTotal.totalValue))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Stat cards row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={{ background: color.green, borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                  3-Year Savings
                </div>
                <div style={{ ...font.serif, fontSize: 28, fontWeight: 700, color: "#fff" }}>
                  ${fmtk(Math.round(threeYearTotal.cumulativeSavings))}
                </div>
              </div>
              <div style={{ background: color.teal, borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                  3-Year Total Value
                </div>
                <div style={{ ...font.serif, fontSize: 28, fontWeight: 700, color: "#fff" }}>
                  ${fmtk(Math.round(threeYearTotal.totalValue))}
                </div>
              </div>
              <div style={{ background: color.text, borderRadius: 10, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ ...font.sans, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                  Cost of Delay / Month
                </div>
                <div style={{ ...font.serif, fontSize: 28, fontWeight: 700, color: "#fff" }}>
                  ${fmtk(Math.round(costOfDelayPerMonth))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CHARTS ─── */}
        {selectedProducts.length > 0 && (() => {
          // Per-product cost data for bar chart
          const prodCosts = selectedProducts.map((prod) => {
            const items = diyData[prod.id];
            const hrs = items.reduce((a, b) => a + b.hrs, 0);
            const risk = items.reduce((a, b) => a + b.risk, 0);
            const labor = Math.round(hrs * fullyLoadedRate);
            return { name: prod.name, labor, risk, total: labor + risk };
          });
          const maxProdCost = Math.max(...prodCosts.map((p) => p.total), 1);

          // Role hour breakdown for pie chart
          const roleHours: Record<string, number> = {};
          selectedProducts.forEach((prod) => {
            const items = diyData[prod.id];
            prod.diy.forEach((d, i) => {
              const hrsPerRole = items[i].hrs / d.roles.length;
              d.roles.forEach((r) => { roleHours[r] = (roleHours[r] || 0) + hrsPerRole; });
            });
          });
          const roleEntries = Object.entries(roleHours).sort((a, b) => b[1] - a[1]);
          const totalRoleHrs = roleEntries.reduce((a, [, h]) => a + h, 0);

          // Pie chart SVG segments
          const pieColors = roleEntries.map(([id]) => allRoleMap[id]?.color || "#999");
          let pieAngle = 0;
          const pieSegments = roleEntries.map(([id, hrs], i) => {
            const pct = hrs / totalRoleHrs;
            const startAngle = pieAngle;
            const endAngle = pieAngle + pct * 360;
            pieAngle = endAngle;
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            const r = 90;
            const cx = 100;
            const cy = 100;
            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);
            const largeArc = pct > 0.5 ? 1 : 0;
            const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            return { id, hrs, pct, path, color: pieColors[i] };
          });

          return (
            <div style={{ marginBottom: 40 }}>
              <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
              <h2 style={{ ...font.serif, fontSize: 32, fontWeight: 700, color: color.text, letterSpacing: "-0.02em", marginBottom: 6 }}>
                Visual breakdown
              </h2>
              <p style={{ ...font.serif, fontSize: 15, color: color.muted, marginBottom: 24 }}>
                Where the money goes — and where the time goes.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

                {/* CHART 1: Annual comparison bar */}
                <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, padding: "20px" }}>
                  <div style={{ ...font.sans, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14 }}>
                    Annual Cost Comparison
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* DIY bar */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ ...font.sans, fontSize: 12, fontWeight: 600, color: color.red }}>DIY Cost</span>
                        <span style={{ ...font.mono, fontSize: 12, fontWeight: 700, color: color.red }}>${fmtk(Math.round(annualDiyCost))}</span>
                      </div>
                      <div style={{ height: 28, background: `${color.red}15`, borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min((annualDiyCost / Math.max(annualDiyCost, oePlatformCost)) * 100, 100)}%`, background: color.red, borderRadius: 5, minWidth: 4 }} />
                      </div>
                    </div>
                    {/* OE bar */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ ...font.sans, fontSize: 12, fontWeight: 600, color: color.teal }}>OE Platform</span>
                        <span style={{ ...font.mono, fontSize: 12, fontWeight: 700, color: color.teal }}>${fmtk(oePlatformCost)}</span>
                      </div>
                      <div style={{ height: 28, background: `${color.teal}15`, borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min((oePlatformCost / Math.max(annualDiyCost, oePlatformCost)) * 100, 100)}%`, background: color.teal, borderRadius: 5, minWidth: 4 }} />
                      </div>
                    </div>
                    {/* Savings bar */}
                    <div style={{ borderTop: `1px solid ${color.border}`, paddingTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ ...font.sans, fontSize: 12, fontWeight: 600, color: color.green }}>You Save</span>
                        <span style={{ ...font.mono, fontSize: 12, fontWeight: 700, color: color.green }}>${fmtk(Math.round(annualSavings))}</span>
                      </div>
                      <div style={{ height: 28, background: `${color.green}15`, borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min((annualSavings / Math.max(annualDiyCost, oePlatformCost)) * 100, 100)}%`, background: color.green, borderRadius: 5, minWidth: 4 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHART 2: Per-product stacked bars */}
                <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, padding: "20px" }}>
                  <div style={{ ...font.sans, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14 }}>
                    Cost Per Product (per event)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {prodCosts.map((p) => (
                      <div key={p.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ ...font.sans, fontSize: 11, fontWeight: 600, color: color.text }}>{p.name}</span>
                          <span style={{ ...font.mono, fontSize: 11, color: color.muted }}>${fmt(p.total)}</span>
                        </div>
                        <div style={{ height: 18, background: `${color.border}50`, borderRadius: 3, overflow: "hidden", display: "flex" }}>
                          <div style={{ height: "100%", width: `${(p.labor / maxProdCost) * 100}%`, background: color.amber, minWidth: 2 }} title={`Labor: $${fmt(p.labor)}`} />
                          <div style={{ height: "100%", width: `${(p.risk / maxProdCost) * 100}%`, background: color.red, minWidth: 2 }} title={`Risk: $${fmt(p.risk)}`} />
                        </div>
                      </div>
                    ))}
                    {/* Legend */}
                    <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: color.amber }} />
                        <span style={{ ...font.sans, fontSize: 10, color: color.muted }}>Labor</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: color.red }} />
                        <span style={{ ...font.sans, fontSize: 10, color: color.muted }}>Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHART 3: Pie — time by role */}
                <div style={{ background: color.card, border: `1px solid ${color.border}`, borderRadius: 10, padding: "20px" }}>
                  <div style={{ ...font.sans, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color.subtle, marginBottom: 14 }}>
                    DIY Time by Role
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <svg viewBox="0 0 200 200" width="130" height="130" style={{ flexShrink: 0 }}>
                      {pieSegments.map((s) => (
                        <path key={s.id} d={s.path} fill={s.color} stroke={color.card} strokeWidth="2" />
                      ))}
                      <circle cx="100" cy="100" r="40" fill={color.card} />
                      <text x="100" y="96" textAnchor="middle" style={{ ...font.mono, fontSize: 16, fontWeight: 700, fill: color.text }}>{Math.round(totalRoleHrs)}</text>
                      <text x="100" y="112" textAnchor="middle" style={{ ...font.sans, fontSize: 9, fill: color.muted }}>hrs/event</text>
                    </svg>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      {pieSegments.map((s) => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                            <span style={{ ...font.sans, fontSize: 11, color: color.text }}>{allRoleMap[s.id]?.abbr}</span>
                          </div>
                          <span style={{ ...font.mono, fontSize: 11, color: color.muted }}>{Math.round(s.hrs)}h ({(s.pct * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── FOUNDATION PILLARS ─── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ height: 1, background: color.border, marginBottom: 32 }} />
          <div style={{ textAlign: "center", marginBottom: 20 }}>
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
                padding: "20px 16px",
                textAlign: "center",
              }}>
                <div style={{ ...font.serif, fontSize: 14, fontWeight: 700, color: color.text, marginBottom: 4 }}>
                  {p.name}
                </div>
                <div style={{ ...font.sans, fontSize: 11, color: color.muted, lineHeight: 1.5 }}>
                  {p.sub}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: color.teal, borderRadius: 2, marginTop: 14 }} />
        </div>

        {/* ─── ASSUMPTIONS, METHODOLOGY & SOURCES ─── */}
        <div>
          <div style={{ height: 1, background: color.border, marginBottom: 28 }} />
          <div style={{
            background: color.card,
            border: `1px solid ${color.border}`,
            borderRadius: 12,
            padding: "32px 36px",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
              <h3 style={{ ...font.serif, fontSize: 24, fontWeight: 700, color: color.text, letterSpacing: "-0.02em" }}>
                Assumptions & Methodology
              </h3>
              <span style={{ ...font.sans, fontSize: 11, color: color.subtle, fontStyle: "italic" }}>
                How we built this model
              </span>
            </div>

            {/* Narrative */}
            <div style={{ ...font.serif, fontSize: 14, color: color.muted, lineHeight: 1.85, marginBottom: 28, maxWidth: 800 }}>
              This analysis models the fully-loaded cost of running virtual and hybrid events in-house versus using the OpenExchange platform. We apply a <strong style={{ color: color.text }}>{burdenRate}x burden rate multiplier</strong> to all base hourly wages — the industry-standard method for calculating the true cost of an employee, accounting for benefits, payroll taxes, overhead, and management time. Time estimates are derived from interviews with IR teams and event operations leaders at mid-to-large financial services firms. Risk values reflect probability-weighted downside exposure, not guaranteed losses.
            </div>

            {/* Assumptions grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 28px", marginBottom: 28 }}>
              {[
                {
                  num: "01",
                  title: `${burdenRate}x Burden Rate`,
                  text: "Applied to all hourly wages. Covers health/dental/vision, 401k match, FICA (7.65%), FUTA, state unemployment, workers comp, facilities, equipment, software licenses, and management overhead. BLS data shows total compensation is 1.25x-1.4x base wages for professional services.",
                },
                {
                  num: "02",
                  title: "Time Estimates",
                  text: "Hours per activity reflect median time observed across financial services firms with 10-50 events per year. Actual time varies by team maturity, event complexity, and tooling. All values are editable to match your experience.",
                },
                {
                  num: "03",
                  title: "Risk Exposure",
                  text: "Probability-weighted financial impact from errors, delays, compliance failures, or reputational damage. Derived from incident reports and post-mortem analyses in regulated industries. Not guaranteed losses — reflects downside exposure.",
                },
                {
                  num: "04",
                  title: "Strategic Benefits",
                  text: "Annual value estimates for intangible benefits (brand, experience, compliance, intelligence). Benchmarked against comparable programs at firms with $1B-$50B AUM. Inherently subjective — adjust to your context.",
                },
                {
                  num: "05",
                  title: `${eventsPerYear} Events/Year`,
                  text: "Includes earnings calls (4), investor days (1-2), town halls (4-6), and ad-hoc events. Based on typical corporate event calendar for publicly traded firms. Scale up or down to match your calendar.",
                },
                {
                  num: "06",
                  title: "Editable Model",
                  text: "Every number — hours, risk, rates, benefits, events, platform cost — can be clicked and edited. The PDF export captures your customized values. This is a conversation starter, not a fixed quote.",
                },
              ].map((item) => (
                <div key={item.num}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span style={{ ...font.mono, fontSize: 11, fontWeight: 700, color: color.teal }}>{item.num}</span>
                    <span style={{ ...font.sans, fontSize: 12, fontWeight: 700, color: color.text }}>{item.title}</span>
                  </div>
                  <div style={{ ...font.sans, fontSize: 11, color: color.muted, lineHeight: 1.7 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Sources */}
            <div style={{ borderTop: `1px solid ${color.border}`, paddingTop: 20 }}>
              <div style={{ ...font.sans, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: color.subtle, marginBottom: 10 }}>
                Sources & References
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 20px" }}>
                {[
                  "U.S. Bureau of Labor Statistics — Employer Costs for Employee Compensation (ECEC), 2024",
                  "NIRI Annual Survey — IR Program Budgets & Event Operations Benchmarks",
                  "Deloitte — The True Cost of Employee Turnover & Overhead Analysis",
                  "Gartner — Event Technology Total Cost of Ownership Framework",
                  "SEC Regulation FD — Compliance Risk Assessment Guidelines",
                  "OpenExchange — Customer Time-to-Value Studies, 2023-2024",
                ].map((src, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ ...font.mono, fontSize: 9, color: color.teal, marginTop: 2, flexShrink: 0 }}>[{i + 1}]</span>
                    <span style={{ ...font.sans, fontSize: 11, color: color.muted, lineHeight: 1.5 }}>{src}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fine print */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${color.border}` }}>
              <p style={{ ...font.sans, fontSize: 10, color: color.subtle, lineHeight: 1.7, fontStyle: "italic" }}>
                This analysis is provided for informational and planning purposes only. All estimates are assumptions based on industry benchmarks and should be validated against your organization&apos;s specific context. The {burdenRate}x burden rate multiplier reflects the fully-loaded cost of employment and is applied consistently to all hourly wages to account for benefits, payroll taxes, overhead, facilities, and management time. Past performance and industry benchmarks do not guarantee future results. OpenExchange makes no representations regarding the accuracy of these estimates for any specific organization. All values are user-editable and the exported PDF will reflect your customized inputs.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ─── STICKY FLOATING EXPORT PDF BUTTON ─── */}
      {selectedProducts.length > 0 && (
        <button
          onClick={exportPDF}
          style={{
            position: "fixed" as const,
            bottom: 32,
            right: 32,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            ...font.sans,
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            background: color.teal,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,130,133,0.35), 0 2px 8px rgba(0,0,0,0.15)",
            letterSpacing: "0.02em",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = color.tealDark; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,130,133,0.45), 0 4px 12px rgba(0,0,0,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = color.teal; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,130,133,0.35), 0 2px 8px rgba(0,0,0,0.15)"; }}
        >
          Export PDF
        </button>
      )}
    </div>
  );
}
