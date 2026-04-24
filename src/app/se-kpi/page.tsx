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

interface WeekContributions {
  revenue: string[];
  preSales: string[];
  clientOutcomes: string[];
  product: string[];
  delivery: string[];
}

interface WeekData {
  week: number;
  dates: string;
  status: "complete" | "current" | "upcoming";
  label: string;
  contributions?: WeekContributions;
}

interface KPICategory {
  id: string;
  name: string;
  oeWeight: number;
  myWeight: number;
  oeMetrics: string[];
  myMetrics: string[];
  oeTargets: string;
  q2Totals: string[];
  q2Stat: string;
  key: ContribKey;
}

const weeks: WeekData[] = [
  {
    week: 8,
    dates: "Apr 7–11",
    status: "complete",
    label: "IFRS & Okta Discovery",
    contributions: {
      revenue: [
        "Cargill API integration priced via discovery call",
        "Okta/Circle HD discovery initiated with Zoom AE Farah",
        "Veltris dry run technical support delivered",
      ],
      preSales: [
        "AI video production POC scoped with Casey",
        "Zoom managed agent concept pitched to Devin",
        "ZCM migration pitch deck iterated",
      ],
      clientOutcomes: [
        "IFRS Veltris dry run executed without re-scoping",
        "Okta technical requirements captured from first discovery call",
      ],
      product: [
        "ZCM release notes monitored for IFRS gate criteria",
        "Cargill API integration gap documented for product team",
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
    contributions: {
      revenue: [
        "Okta discovery completed — Circle HD source confirmed, migration scoped",
        "IFRS pre-migration validation gates on Apr 18 Zoom platform release",
        "Anderson migration signed (19 videos, first completed ZCM engagement)",
      ],
      preSales: [
        "ZCM migration pricing framework built",
        "CTA optimization analysis for openexc.com delivered",
        "OE internal AI support agent went live (Copilot Studio + GitBook MCP)",
      ],
      clientOutcomes: [
        "IFRS pre-migration validation on schedule — 23 meetings, zero re-scoping",
        "Okta requirements fully captured in discovery with no gaps",
      ],
      product: [
        "Apr 18 Zoom release applied to IFRS gate criteria",
        "ZCM pipeline blockers identified and escalated to engineering",
      ],
      delivery: [
        "IFRS migration checklist maintained throughout dry run sequence",
        "ZCM board tickets tracked per blocker with comments",
      ],
    },
  },
  {
    week: 10,
    dates: "Apr 20–25",
    status: "current",
    label: "Okta Proposal + Indeed Priced",
    contributions: {
      revenue: [
        "Okta $38K implementation proposal presented to committee (Apr 24)",
        "Indeed migration scoped at $22,100 via automated pricing tool",
        "IFRS migration ready to scale — client review scheduled",
      ],
      preSales: [
        "6-phase Okta implementation plan delivered (SOW template for all ZCM engagements)",
        "Automated migration pricing tool built (AI-powered quoting from discovery questionnaire)",
        "Camden ZCM onboarding session — full migration motion explained to new BDR",
        "OE Video Editor prototype demonstrated (Claude transcript-to-cut pipeline)",
        "Power BI → Claude daily briefing agent architecture scoped with Connor and Eric",
      ],
      clientOutcomes: [
        "IFRS: thumbnail, MOV-to-MP4, tag limit (20→30), and caption blockers all resolved",
        "VOD channel assignment step identified and ticketed (ZCM-121) before client-facing run",
        "Zero re-scoping on IFRS engagement throughout full validation cycle",
      ],
      product: [
        "ZCM-118 (thumbnail), ZCM-119 (report enhancement), ZCM-121 (VOD channel step) filed",
        "30+ Okta feature requests submitted via Farah/Adam to Zoom product team",
        "Circle HD API spike completed — ZCM-96 closed",
        "D2L ZVM external file upload blocker formally escalated to Zoom",
      ],
      delivery: [
        "Okta 6-phase SOW completed — first formal ZCM migration PM handoff template",
        "Migration report attachment-fidelity spec’d (Kaltura vs. Zoom file-level comparison)",
        "IFRS CSV produced for client embed replacement work",
      ],
    },
  },
  { week: 11, dates: "Apr 27–May 1", status: "upcoming", label: "" },
  { week: 12, dates: "May 4–9", status: "upcoming", label: "" },
  { week: 13, dates: "May 11–16", status: "upcoming", label: "" },
  { week: 14, dates: "May 18–23", status: "upcoming", label: "" },
  { week: 15, dates: "May 25–30", status: "upcoming", label: "" },
  { week: 16, dates: "Jun 1–6", status: "upcoming", label: "" },
  { week: 17, dates: "Jun 8–13", status: "upcoming", label: "" },
  { week: 18, dates: "Jun 15–20", status: "upcoming", label: "" },
  { week: 19, dates: "Jun 22–27", status: "upcoming", label: "" },
];

const categories: KPICategory[] = [
  {
    id: "revenue",
    name: "Revenue Influence",
    oeWeight: 35,
    myWeight: 25,
    oeMetrics: ["Influenced ACV Closed", "Win Rate (SE-supported opps)"],
    myMetrics: ["Technical Win Rate", "Team Pipeline Contribution"],
    oeTargets: "ACV set quarterly · Win Rate >x%",
    q2Totals: [
      "$60,100 in active pipeline — Okta ($38K proposal to committee) + Indeed ($22,100 scoped)",
      "2 formal proposals in flight across 3 active engagements",
      "IFRS approaching close — first ZCM migration go-live",
      "Anderson migration signed (first completed ZCM engagement, W9)",
    ],
    q2Stat: "$60K+ pipeline",
    key: "revenue",
  },
  {
    id: "preSales",
    name: "Pre-Sales Enablement",
    oeWeight: 15,
    myWeight: 25,
    oeMetrics: ["Enablement Assets Delivered", "Demo Effectiveness Score"],
    myMetrics: ["Assets Created + Logged", "AE Feedback"],
    oeTargets: "2–3 assets per quarter · Demo score ≥4.5",
    q2Totals: [
      "8 assets delivered across 3 weeks — already above the 2–3 quarterly target",
      "W8: AI video POC, Zoom managed agent pitch, ZCM pitch deck",
      "W9: ZCM pricing framework, CTA optimization analysis, OE AI support agent",
      "W10: Okta 6-phase SOW, migration pricing tool, Camden onboarding, video editor demo, Power BI agent architecture",
    ],
    q2Stat: "8 assets (W8–10)",
    key: "preSales",
  },
  {
    id: "clientOutcomes",
    name: "Client Outcomes",
    oeWeight: 25,
    myWeight: 20,
    oeMetrics: ["Post-Sale Solution Accuracy", "Client / PM Satisfaction"],
    myMetrics: ["Launch Accuracy (no re-scoping)", "PM Feedback Score"],
    oeTargets: "≥95% launch without re-scoping · Satisfaction ≥4.5",
    q2Totals: [
      "0 re-scopings across all active Q2 engagements — 100% launch accuracy to date",
      "IFRS: all technical blockers resolved before client review, zero surprises",
      "Okta: scoped cleanly on first pass, working document framing absorbed scope changes",
      "Indeed: priced on first contact via automated tool, no iteration required",
    ],
    q2Stat: "0 re-scopings",
    key: "clientOutcomes",
  },
  {
    id: "product",
    name: "Product & Partner Impact",
    oeWeight: 15,
    myWeight: 20,
    oeMetrics: ["Actionable Insights Delivered", "Adoption Rate"],
    myMetrics: ["Insights Filed (Jira + FreshDesk)", "Accepted / Prioritized by Zoom"],
    oeTargets: "3–4 insights · ≥40% adoption rate",
    q2Totals: [
      "35+ insights filed Q2 to date — well above the 3–4 quarterly target",
      "W10: 30+ Okta-specific feature requests via Farah/Adam to Zoom product",
      "ZCM-96 (Circle HD API), ZCM-118 (thumbnail), ZCM-119 (report), ZCM-121 (VOD channel)",
      "D2L ZVM upload blocker + S3-to-S3 flow formally escalated to Zoom engineering",
    ],
    q2Stat: "35+ insights filed",
    key: "product",
  },
  {
    id: "delivery",
    name: "Delivery Readiness",
    oeWeight: 10,
    myWeight: 10,
    oeMetrics: ["PM Readiness Score (1–5)"],
    myMetrics: ["PM Handoff Score (1–5)", "Handoff Documentation Quality"],
    oeTargets: "PM Readiness Score ≥4.5",
    q2Totals: [
      "1 formal PM handoff completed — Okta 6-phase SOW (first ZCM migration template)",
      "Migration report attachment-fidelity spec’d with Kaltura vs. Zoom file-level tracking",
      "VOD channel assignment step documented and ticketed before any client-facing run",
      "IFRS CSV report produced for client embed replacement work",
    ],
    q2Stat: "1 formal handoff",
    key: "delivery",
  },
];

export default function SEKPIDashboard() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const selected = selectedWeek !== null ? weeks.find((w) => w.week === selectedWeek) : null;

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 72px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/reports"
          style={{ fontSize: 13, color: LIGHT, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}
        >
          &larr; Back to Reports
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: LIGHT, marginBottom: 6 }}>SE Performance</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 4, letterSpacing: "-0.02em" }}>Q2 KPI Dashboard</h1>
            <p style={{ fontSize: 13, color: MUTED }}>April – June 2026 · Weeks 8–19 · 3 of 12 weeks tracked</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href="/solutions_engineer_kpi.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 6, padding: "7px 12px", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              ↓ Original KPI Plan
            </a>
            <a
              href="/se_kpi_response.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 6, padding: "7px 12px", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              ↓ My Q2 Response
            </a>
          </div>
        </div>
      </div>

      {/* Weight comparison banner */}
      <div style={{ background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 10, padding: "12px 20px", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: TEAL }}>
            <span style={{ fontWeight: 700 }}>OE original:</span>{" "}
            Revenue 35% · Pre-Sales 15% · Client Outcomes 25% · Product 15% · Delivery 10%
          </div>
          <div style={{ fontSize: 12, color: "#16a34a" }}>
            <span style={{ fontWeight: 700 }}>My Q2 proposal:</span>{" "}
            Revenue 25% · Pre-Sales 25% · Client Outcomes 20% · Product 20% · Delivery 10%
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Left: Week list */}
        <div style={{ width: 210, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 10 }}>Q2 Weeks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {weeks.map((w) => (
              <button
                key={w.week}
                onClick={() => w.status !== "upcoming" && setSelectedWeek(selectedWeek === w.week ? null : w.week)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: selectedWeek === w.week ? `1.5px solid ${TEAL}` : `1px solid ${BORDER}`,
                  background: selectedWeek === w.week ? TEAL_LIGHT : w.status === "upcoming" ? "#fafafa" : "#fff",
                  cursor: w.status === "upcoming" ? "default" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  opacity: w.status === "upcoming" ? 0.55 : 1,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: w.status === "current" ? TEAL : w.status === "upcoming" ? LIGHT : DARK }}>
                      Week {w.week}
                    </span>
                    {w.status === "current" && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: TEAL, color: "#fff", borderRadius: 3, padding: "1px 5px", letterSpacing: "0.04em" }}>NOW</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: LIGHT }}>{w.dates}</div>
                  {w.label && <div style={{ fontSize: 10, color: MUTED, marginTop: 2, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.label}</div>}
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
                  {w.status === "upcoming" && (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: BORDER }} />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: LIGHT, lineHeight: 1.6 }}>
            Click a week to filter the dashboard. Click again to return to Q2 totals.
          </div>
        </div>

        {/* Right: KPI Dashboard */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Context bar */}
          <div style={{ marginBottom: 14, padding: "10px 16px", background: selected ? TEAL_LIGHT : "#f9fafb", borderRadius: 8, border: `1px solid ${selected ? TEAL_MID : BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {selected ? (
                <>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Week {selected.week}</span>
                  <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{selected.dates}{selected.label ? ` — ${selected.label}` : ""}</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 12, fontWeight: 600, color: DARK }}>Q2 Cumulative</span>
                  <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>Weeks 8–10 · 3 weeks tracked</span>
                </>
              )}
            </div>
            {selected && (
              <button
                onClick={() => setSelectedWeek(null)}
                style={{ fontSize: 11, color: MUTED, background: "none", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}
              >
                × Show Q2 totals
              </button>
            )}
          </div>

          {/* Category cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categories.map((cat) => {
              const items = selected?.contributions ? selected.contributions[cat.key] : cat.q2Totals;
              return (
                <div key={cat.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px" }}>
                  {/* Card header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 6 }}>{cat.name}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 4, padding: "2px 8px" }}>
                          OE: {cat.oeWeight}%
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 8px" }}>
                          My Q2: {cat.myWeight}%
                        </span>
                        {cat.myWeight > cat.oeWeight && (
                          <span style={{ fontSize: 10, color: "#16a34a", background: "#f0fdf4", borderRadius: 4, padding: "2px 8px" }}>↑ proposed up</span>
                        )}
                        {cat.myWeight < cat.oeWeight && (
                          <span style={{ fontSize: 10, color: MUTED, background: "#f9fafb", borderRadius: 4, padding: "2px 8px" }}>↓ proposed down</span>
                        )}
                      </div>
                    </div>
                    {!selected && (
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textAlign: "right", flexShrink: 0, marginLeft: 12 }}>{cat.q2Stat}</div>
                    )}
                  </div>

                  {/* Metrics comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div style={{ background: "#f9fafb", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LIGHT, marginBottom: 5 }}>OE Metrics</div>
                      {cat.oeMetrics.map((m, i) => (
                        <div key={i} style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>· {m}</div>
                      ))}
                      <div style={{ fontSize: 10, color: LIGHT, fontStyle: "italic", marginTop: 5 }}>{cat.oeTargets}</div>
                    </div>
                    <div style={{ background: "#f0fdf4", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#86efac", marginBottom: 5 }}>My Q2 Metrics</div>
                      {cat.myMetrics.map((m, i) => (
                        <div key={i} style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>· {m}</div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, marginTop: 7, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: DARK, lineHeight: 1.55 }}>{item}</div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div style={{ fontSize: 12, color: LIGHT, fontStyle: "italic" }}>No entries for this week yet.</div>
                    )}
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
