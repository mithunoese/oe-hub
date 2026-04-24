"use client";

import Link from "next/link";
import { useState } from "react";

const TEAL = "#008285";
const TEAL_LIGHT = "#f0fafa";
const TEAL_MID = "#e0f0f0";
const DARK = "#374151";
const MUTED = "#6b7280";
const LIGHT = "#9ca3af";
const BORDER = "#e5e7eb";

type ContribKey = "revenue" | "preSales" | "clientOutcomes" | "product" | "delivery";

interface WeekStats {
  pipelineUSD: number;
  assetsCreated: number;
  rescopings: number;
  insightsFiled: number;
  formalHandoffs: number;
}

interface WeekData {
  week: number;
  dates: string;
  status: "complete" | "current";
  label: string;
  stats: WeekStats;
  contributions: Record<ContribKey, string[]>;
}

// ── DATA ─────────────────────────────────────────────────────────────────────
// To add a new week: append a new entry here. Dashboard auto-updates.

const weeks: WeekData[] = [
  {
    week: 8,
    dates: "Apr 7–11",
    status: "complete",
    label: "IFRS & Okta Discovery",
    stats: { pipelineUSD: 0, assetsCreated: 3, rescopings: 0, insightsFiled: 2, formalHandoffs: 0 },
    contributions: {
      revenue: [
        "Cargill API integration priced via discovery call",
        "Okta/Circle HD migration initiated with Zoom AE Farah",
        "Veltris dry run technical support delivered",
      ],
      preSales: [
        "AI video production POC scoped with Casey",
        "Zoom managed agent concept pitched to Devin",
        "ZCM migration pitch deck iterated",
      ],
      clientOutcomes: [
        "IFRS Veltris dry run executed without re-scoping",
        "Okta requirements captured cleanly on first discovery call",
      ],
      product: [
        "ZCM release notes tracked for IFRS gate criteria",
        "Cargill API integration gap documented",
      ],
      delivery: [
        "IFRS dry run framework and batch checklist prepared",
        "ZCM Jira board active with per-blocker ticket discipline",
      ],
    },
  },
  {
    week: 9,
    dates: "Apr 13–18",
    status: "complete",
    label: "Okta Scoped, IFRS Validation",
    stats: { pipelineUSD: 0, assetsCreated: 3, rescopings: 0, insightsFiled: 3, formalHandoffs: 0 },
    contributions: {
      revenue: [
        "Okta discovery completed — Circle HD confirmed, migration fully scoped",
        "IFRS validation gates on Apr 18 Zoom platform release",
        "Anderson migration signed (first completed ZCM engagement)",
      ],
      preSales: [
        "ZCM migration pricing framework built",
        "CTA optimization analysis for openexc.com",
        "OE internal AI support agent live (Copilot Studio + GitBook MCP)",
      ],
      clientOutcomes: [
        "IFRS validation on schedule — 23 meetings, zero re-scoping",
        "Okta scoped on first pass with no gaps or changes",
      ],
      product: [
        "Apr 18 Zoom release applied to IFRS gate criteria",
        "ZCM blockers identified and escalated to engineering",
        "Circle HD API research initiated (ZCM-96)",
      ],
      delivery: [
        "IFRS migration checklist maintained across dry run sequence",
        "ZCM board tickets tracked per blocker with comments",
      ],
    },
  },
  {
    week: 10,
    dates: "Apr 20–25",
    status: "current",
    label: "Okta Proposal + Indeed Priced",
    stats: { pipelineUSD: 60100, assetsCreated: 5, rescopings: 0, insightsFiled: 4, formalHandoffs: 1 },
    contributions: {
      revenue: [
        "Okta $38K implementation proposal presented to committee (Apr 24)",
        "Indeed migration scoped at $22,100 via automated pricing tool",
        "IFRS migration ready to scale — client review scheduled",
      ],
      preSales: [
        "6-phase Okta implementation plan (SOW template for all ZCM engagements)",
        "Automated migration pricing tool (AI-powered quoting from discovery questionnaire)",
        "Camden ZCM onboarding — full migration motion explained to new BDR",
        "OE Video Editor prototype (Claude transcript-to-cut pipeline)",
        "Power BI → Claude daily briefing agent architecture scoped",
      ],
      clientOutcomes: [
        "IFRS: thumbnail, MOV-to-MP4, tag limit (20→30), captions — all blockers resolved",
        "VOD channel assignment step documented (ZCM-121) before any client-facing run",
        "Zero re-scoping on IFRS throughout full validation cycle",
      ],
      product: [
        "ZCM-118 (thumbnail fix), ZCM-119 (report enhancement), ZCM-121 (VOD channel step) filed",
        "Circle HD API spike closed — ZCM-96 complete",
        "D2L ZVM external file upload blocker formally escalated to Zoom",
        "S3-to-S3 flow architecture scoped with Max for Okta post-IFRS",
      ],
      delivery: [
        "Okta 6-phase SOW — first formal ZCM migration PM handoff template",
        "Migration report spec’d with attachment-level fidelity tracking",
        "IFRS CSV delivered for client embed replacement work",
      ],
    },
  },
];

// ── CATEGORY DEFINITIONS ─────────────────────────────────────────────────────

const categories: {
  id: string;
  name: string;
  oeWeight: number;
  myWeight: number;
  oeTarget: string;
  key: ContribKey;
  statLabel: (v: number) => string;
  statValue: (ws: WeekData[]) => number;
  getStatus: (v: number) => "exceeds" | "on-track" | "building";
}[] = [
  {
    id: "revenue",
    name: "Revenue Influence",
    oeWeight: 35,
    myWeight: 25,
    oeTarget: "ACV set quarterly · Win Rate >x%",
    key: "revenue",
    statLabel: (v) => `$${(v / 1000).toFixed(0)}K pipeline`,
    statValue: (ws) => ws.reduce((s, w) => s + w.stats.pipelineUSD, 0),
    getStatus: (v) => (v >= 50000 ? "on-track" : "building"),
  },
  {
    id: "preSales",
    name: "Pre-Sales Enablement",
    oeWeight: 15,
    myWeight: 25,
    oeTarget: "2–3 assets per quarter · Demo score ≥4.5",
    key: "preSales",
    statLabel: (v) => `${v} assets`,
    statValue: (ws) => ws.reduce((s, w) => s + w.stats.assetsCreated, 0),
    getStatus: (v) => (v > 3 ? "exceeds" : v >= 2 ? "on-track" : "building"),
  },
  {
    id: "clientOutcomes",
    name: "Client Outcomes",
    oeWeight: 25,
    myWeight: 20,
    oeTarget: "≥95% launch without re-scoping · PM satisfaction ≥4.5",
    key: "clientOutcomes",
    statLabel: (v) => `${v} re-scopings`,
    statValue: (ws) => ws.reduce((s, w) => s + w.stats.rescopings, 0),
    getStatus: (v) => (v === 0 ? "exceeds" : v <= 1 ? "on-track" : "building"),
  },
  {
    id: "product",
    name: "Product & Partner Impact",
    oeWeight: 15,
    myWeight: 20,
    oeTarget: "3–4 insights · ≥40% adoption rate",
    key: "product",
    statLabel: (v) => `${v} insights filed`,
    statValue: (ws) => ws.reduce((s, w) => s + w.stats.insightsFiled, 0),
    getStatus: (v) => (v > 4 ? "exceeds" : v >= 3 ? "on-track" : "building"),
  },
  {
    id: "delivery",
    name: "Delivery Readiness",
    oeWeight: 10,
    myWeight: 10,
    oeTarget: "PM Readiness Score ≥4.5",
    key: "delivery",
    statLabel: (v) => `${v} handoff${v !== 1 ? "s" : ""}`,
    statValue: (ws) => ws.reduce((s, w) => s + w.stats.formalHandoffs, 0),
    getStatus: (v) => (v >= 2 ? "exceeds" : v === 1 ? "on-track" : "building"),
  },
];

// ── STATUS CHIP ───────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: "exceeds" | "on-track" | "building" }) {
  const cfg = {
    exceeds: { label: "Exceeds", bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
    "on-track": { label: "On Track", bg: TEAL_LIGHT, color: TEAL, dot: TEAL },
    building: { label: "Building", bg: "#f9fafb", color: MUTED, dot: LIGHT },
  }[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 10px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function SEKPIDashboard() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const selected = selectedWeek !== null ? weeks.find((w) => w.week === selectedWeek) : null;
  const activeWeeks = selected ? [selected] : weeks;

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 72px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/reports" style={{ fontSize: 13, color: LIGHT, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          &larr; Back to Reports
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: LIGHT, marginBottom: 6 }}>SE Performance</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 4, letterSpacing: "-0.02em" }}>Q2 KPI Dashboard</h1>
            <p style={{ fontSize: 13, color: MUTED }}>April – June 2026 · {weeks.length} week{weeks.length !== 1 ? "s" : ""} tracked</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/solutions_engineer_kpi.pdf" target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 6, padding: "7px 12px", textDecoration: "none" }}>
              ↓ Original KPI Plan
            </a>
            <a href="/se_kpi_response.pdf" target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 6, padding: "7px 12px", textDecoration: "none" }}>
              ↓ My Q2 Response
            </a>
          </div>
        </div>
      </div>

      {/* Q2 Snapshot row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 28 }}>
        {categories.map((cat) => {
          const val = cat.statValue(weeks);
          const status = cat.getStatus(val);
          return (
            <div key={cat.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginBottom: 6, letterSpacing: "0.03em" }}>{cat.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 6 }}>{cat.statLabel(val)}</div>
              <StatusChip status={status} />
              <div style={{ marginTop: 8, fontSize: 10, color: LIGHT }}>OE {cat.oeWeight}% · Mine {cat.myWeight}%</div>
            </div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Left: Week list */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 10 }}>Q2 Weeks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {weeks.map((w) => (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(selectedWeek === w.week ? null : w.week)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: 8,
                  border: selectedWeek === w.week ? `1.5px solid ${TEAL}` : `1px solid ${BORDER}`,
                  background: selectedWeek === w.week ? TEAL_LIGHT : "#fff",
                  cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: w.status === "current" ? TEAL : DARK }}>Week {w.week}</span>
                    {w.status === "current" && <span style={{ fontSize: 9, fontWeight: 700, background: TEAL, color: "#fff", borderRadius: 3, padding: "1px 5px" }}>NOW</span>}
                  </div>
                  <div style={{ fontSize: 10, color: LIGHT }}>{w.dates}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 1, lineHeight: 1.3 }}>{w.label}</div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {w.status === "complete" && (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 9 }}>✓</span>
                    </div>
                  )}
                  {w.status === "current" && (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: TEAL_LIGHT, border: `2px solid ${TEAL}` }} />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: LIGHT, lineHeight: 1.6 }}>
            Click a week to see that week only. Click again for Q2 totals.
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: DARK, marginBottom: 4 }}>Adding Week 11+</div>
            <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.5 }}>Append to the <code style={{ fontSize: 9, background: BORDER, padding: "1px 3px", borderRadius: 3 }}>weeks</code> array in <code style={{ fontSize: 9, background: BORDER, padding: "1px 3px", borderRadius: 3 }}>se-kpi/page.tsx</code>. Stats and totals update automatically.</div>
          </div>
        </div>

        {/* Right: Category cards */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 14, padding: "10px 16px", background: selected ? TEAL_LIGHT : "#f9fafb", borderRadius: 8, border: `1px solid ${selected ? TEAL_MID : BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {selected ? (
              <><span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Week {selected.week}</span><span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{selected.dates} — {selected.label}</span></>
            ) : (
              <><span style={{ fontSize: 12, fontWeight: 600, color: DARK }}>Q2 Cumulative</span><span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>All {weeks.length} weeks combined</span></>
            )}
            {selected && (
              <button onClick={() => setSelectedWeek(null)} style={{ fontSize: 11, color: MUTED, background: "none", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>× Q2 totals</button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categories.map((cat) => {
              const val = cat.statValue(activeWeeks);
              const status = cat.getStatus(cat.statValue(weeks));
              const items = activeWeeks.flatMap((w) => w.contributions[cat.key]);
              return (
                <div key={cat.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{cat.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 4, padding: "2px 7px" }}>OE {cat.oeWeight}%</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 7px" }}>Mine {cat.myWeight}%</span>
                      <StatusChip status={status} />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: TEAL, flexShrink: 0, marginLeft: 12 }}>{cat.statLabel(val)}</div>
                  </div>
                  <div style={{ fontSize: 11, color: LIGHT, fontStyle: "italic", marginBottom: 12 }}>Target: {cat.oeTarget}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, marginTop: 7, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: DARK, lineHeight: 1.5 }}>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
