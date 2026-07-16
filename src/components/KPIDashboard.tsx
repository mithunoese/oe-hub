"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const TEAL = "#007a7d";
const TEAL_LIGHT = "#e8f4f4";
const TEAL_MID = "#c5e4e4";
const DARK = "#111827";
const MUTED = "#6b7280";
const LIGHT = "#9ca3af";
const BORDER = "#e8e6e1";

export type ContribKey = "revenue" | "preSales" | "clientOutcomes" | "product" | "delivery";

export interface Deal { name: string; amount: number; status: "confirmed" | "in-signature" | "near-close"; }
export interface WeekStats { pipelineUSD: number; assetsCreated: number; rescopings: number; insightsFiled: number; formalHandoffs: number; }
export interface WeekData { week: number; dates: string; status: "complete" | "current"; label: string; stats: WeekStats; contributions: Record<ContribKey, string[]>; deals?: Deal[]; }

type StatField = keyof WeekStats;

const categories: { id: string; name: string; oeWeight: number; oeTarget: string; key: ContribKey; statField: StatField; statLabel: (v: number) => string; unitLabel: (v: number) => string; statValue: (ws: WeekData[]) => number; getStatus: (v: number) => "exceeds" | "on-track" | "building"; }[] = [
  { id: "revenue", name: "Revenue Influence", oeWeight: 35, oeTarget: "ACV set quarterly · Win Rate >x%", key: "revenue", statField: "pipelineUSD", statLabel: (v) => v === 0 ? "$0 pipeline" : `$${(v / 1000).toFixed(1)}K pipeline`, unitLabel: (v) => `$${(v / 1000).toFixed(1)}K`, statValue: (ws) => ws.reduce((s, w) => s + w.stats.pipelineUSD, 0), getStatus: (v) => (v >= 40000 ? "on-track" : "building") },
  { id: "preSales", name: "Pre-Sales Enablement", oeWeight: 15, oeTarget: "2–3 assets per quarter · Demo score ≥4.5", key: "preSales", statField: "assetsCreated", statLabel: (v) => `${v} assets`, unitLabel: (v) => `${v} asset${v !== 1 ? "s" : ""}`, statValue: (ws) => ws.reduce((s, w) => s + w.stats.assetsCreated, 0), getStatus: (v) => (v > 3 ? "exceeds" : v >= 2 ? "on-track" : "building") },
  { id: "clientOutcomes", name: "Client Outcomes", oeWeight: 25, oeTarget: "≥95% launch without re-scoping · PM satisfaction ≥4.5", key: "clientOutcomes", statField: "rescopings", statLabel: (v) => `${v} re-scopings`, unitLabel: (v) => `${v} re-scoping${v !== 1 ? "s" : ""}`, statValue: (ws) => ws.reduce((s, w) => s + w.stats.rescopings, 0), getStatus: (v) => (v === 0 ? "exceeds" : v <= 1 ? "on-track" : "building") },
  { id: "product", name: "Product & Partner Impact", oeWeight: 15, oeTarget: "3–4 insights · ≥40% adoption rate", key: "product", statField: "insightsFiled", statLabel: (v) => `${v} insights filed`, unitLabel: (v) => `${v} insight${v !== 1 ? "s" : ""}`, statValue: (ws) => ws.reduce((s, w) => s + w.stats.insightsFiled, 0), getStatus: (v) => (v > 4 ? "exceeds" : v >= 3 ? "on-track" : "building") },
  { id: "delivery", name: "Delivery Readiness", oeWeight: 10, oeTarget: "PM Readiness Score ≥4.5", key: "delivery", statField: "formalHandoffs", statLabel: (v) => `${v} handoff${v !== 1 ? "s" : ""}`, unitLabel: (v) => `${v} handoff${v !== 1 ? "s" : ""}`, statValue: (ws) => ws.reduce((s, w) => s + w.stats.formalHandoffs, 0), getStatus: (v) => (v >= 2 ? "exceeds" : v === 1 ? "on-track" : "building") },
];

function StatusChip({ status }: { status: "exceeds" | "on-track" | "building" }) {
  const cfg = { exceeds: { label: "Exceeds", bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" }, "on-track": { label: "On Track", bg: TEAL_LIGHT, color: TEAL, dot: TEAL }, building: { label: "Building", bg: "#f9fafb", color: MUTED, dot: LIGHT } }[status];
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 10px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />{cfg.label}</span>);
}

function DealStatusBadge({ status }: { status: Deal["status"] }) {
  const cfg = {
    confirmed:       { label: "✓ Confirmed",  color: "#16a34a", bg: "#dcfce7" },
    "in-signature":  { label: "In signature",   color: TEAL,      bg: TEAL_LIGHT },
    "near-close":    { label: "Near close",      color: "#d97706", bg: "#fef3c7" },
  }[status];
  return (<span style={{ fontSize: 10, fontWeight: 600, color: cfg.color, background: cfg.bg, borderRadius: 10, padding: "2px 8px", whiteSpace: "nowrap" }}>{cfg.label}</span>);
}

export interface KPIDashboardProps {
  quarterLabel: string;
  dateRangeLabel: string;
  weeksAsc: WeekData[];
  backHref: string;
  responsePdfHref?: string;
}

export default function KPIDashboard({ quarterLabel, dateRangeLabel, weeksAsc, backHref, responsePdfHref }: KPIDashboardProps) {
  const weeks = [...weeksAsc].reverse();
  const defaultWeek = weeks.find((w) => w.status === "current")?.week ?? weeks[0].week;
  const [selectedWeek, setSelectedWeek] = useState<number | null>(defaultWeek);
  const selected = selectedWeek !== null ? weeks.find((w) => w.week === selectedWeek) : null;
  const activeWeeks = selected ? [selected] : weeks;
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const jumpToCategory = (id: string) => {
    setSelectedWeek(null);
    requestAnimationFrame(() => detailRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href={backHref} style={{ fontSize: 13, color: LIGHT, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>&larr; Back to {quarterLabel} Reports</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: LIGHT, marginBottom: 6 }}>SE Performance</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 4, letterSpacing: "-0.02em" }}>{quarterLabel} KPI Dashboard</h1>
            <p style={{ fontSize: 13, color: MUTED }}>{dateRangeLabel} · {weeks.length} week{weeks.length !== 1 ? "s" : ""} tracked</p>
          </div>
          {responsePdfHref && (
            <div style={{ display: "flex", gap: 8 }}>
              <a href={responsePdfHref} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 6, padding: "7px 12px", textDecoration: "none" }}>↓ My {quarterLabel} Response</a>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 28 }}>
        {categories.map((cat) => {
          const val = cat.statValue(weeks);
          const status = cat.getStatus(val);
          return (<button key={cat.id} onClick={() => jumpToCategory(cat.id)} style={{ display: "block", width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", font: "inherit" }} title="Click to see how this number was calculated"><div style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginBottom: 6, letterSpacing: "0.03em" }}>{cat.name}</div><div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 6 }}>{cat.statLabel(val)}</div><StatusChip status={status} /><div style={{ marginTop: 8, fontSize: 10, color: LIGHT }}>Target {cat.oeWeight}% · click for breakdown</div></button>);
        })}
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 10 }}>{quarterLabel} Weeks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {weeks.map((w) => (
              <button key={w.week} onClick={() => setSelectedWeek(selectedWeek === w.week ? null : w.week)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: selectedWeek === w.week ? `1.5px solid ${TEAL}` : `1px solid ${BORDER}`, background: selectedWeek === w.week ? TEAL_LIGHT : "#fff", cursor: "pointer", textAlign: "left", width: "100%" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: w.status === "current" ? TEAL : DARK }}>Week {w.week}</span>
                    {w.status === "current" && <span style={{ fontSize: 9, fontWeight: 700, background: TEAL, color: "#fff", borderRadius: 3, padding: "1px 5px" }}>NOW</span>}
                  </div>
                  <div style={{ fontSize: 10, color: LIGHT }}>{w.dates}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 1, lineHeight: 1.3 }}>{w.label}</div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {w.status === "complete" && (<div style={{ width: 16, height: 16, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 9 }}>✓</span></div>)}
                  {w.status === "current" && (<div style={{ width: 16, height: 16, borderRadius: "50%", background: TEAL_LIGHT, border: `2px solid ${TEAL}` }} />)}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: LIGHT, lineHeight: 1.6 }}>Click a week to filter. Click again for {quarterLabel} totals.</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 14, padding: "10px 16px", background: selected ? TEAL_LIGHT : "#f9fafb", borderRadius: 8, border: `1px solid ${selected ? TEAL_MID : BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {selected ? (<><span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Week {selected.week}</span><span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{selected.dates} — {selected.label}</span></>) : (<><span style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{quarterLabel} Cumulative</span><span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>All {weeks.length} weeks combined</span></>)}
            {selected && (<button onClick={() => setSelectedWeek(null)} style={{ fontSize: 11, color: MUTED, background: "none", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>× {quarterLabel} totals</button>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categories.map((cat) => {
              const val = cat.statValue(activeWeeks);
              const status = cat.getStatus(cat.statValue(weeks));
              const items = activeWeeks.flatMap((w) => w.contributions[cat.key]);
              const activeDeals = cat.id === "revenue" ? activeWeeks.flatMap(w => (w.deals ?? []).map(d => ({ ...d, weekNum: w.week }))) : [];
              const dealTotal = activeDeals.reduce((s, d) => s + d.amount, 0);
              const weeklyBreakdown = activeWeeks.filter((w) => w.stats[cat.statField] > 0).sort((a, b) => a.week - b.week);
              return (
                <div key={cat.id} ref={(el) => { detailRefs.current[cat.id] = el; }} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{cat.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: TEAL, background: TEAL_LIGHT, border: `1px solid ${TEAL_MID}`, borderRadius: 4, padding: "2px 7px" }}>Target {cat.oeWeight}%</span>
                      <StatusChip status={status} />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: TEAL, flexShrink: 0, marginLeft: 12 }}>{cat.statLabel(val)}</div>
                  </div>
                  <div style={{ fontSize: 11, color: LIGHT, fontStyle: "italic", marginBottom: 12 }}>Target: {cat.oeTarget}</div>
                  {cat.id === "revenue" && activeDeals.length > 0 && (
                    <div style={{ marginBottom: 16, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LIGHT, padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, background: "#f9fafb" }}>Pipeline Deals</div>
                      {activeDeals.map((deal, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < activeDeals.length - 1 ? `1px solid ${BORDER}` : "none", background: "#fff" }}>
                          <span style={{ fontSize: 13, color: DARK, flex: 1 }}>{deal.name}</span>
                          <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: LIGHT }}>W{deal.weekNum}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, minWidth: 44, textAlign: "right" }}>${(deal.amount / 1000).toFixed(1)}K</span>
                            <DealStatusBadge status={deal.status} />
                          </div>
                        </div>
                      ))}
                      {activeDeals.length > 1 && (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "8px 14px", background: "#f9fafb", borderTop: `1px solid ${BORDER}` }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Total: ${(dealTotal / 1000).toFixed(1)}K</span>
                        </div>
                      )}
                    </div>
                  )}
                  {cat.id !== "revenue" && weeklyBreakdown.length > 0 && (
                    <div style={{ marginBottom: 16, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LIGHT, padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, background: "#f9fafb" }}>How We Got Here — Weekly Breakdown</div>
                      {weeklyBreakdown.map((w, i) => (
                        <div key={w.week} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < weeklyBreakdown.length - 1 ? `1px solid ${BORDER}` : "none", background: "#fff" }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 13, color: DARK, fontWeight: 600 }}>Week {w.week}</span>
                            <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{w.dates} — {w.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, flexShrink: 0, marginLeft: 12 }}>{cat.unitLabel(w.stats[cat.statField])}</span>
                        </div>
                      ))}
                      {weeklyBreakdown.length > 1 && (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "8px 14px", background: "#f9fafb", borderTop: `1px solid ${BORDER}` }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Total: {cat.unitLabel(val)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {cat.id !== "revenue" && weeklyBreakdown.length === 0 && activeWeeks.length > 1 && (
                    <div style={{ marginBottom: 16, fontSize: 12, color: LIGHT, fontStyle: "italic" }}>No weeks in this view contributed to this number.</div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {items.map((item, i) => (<div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, marginTop: 7, flexShrink: 0 }} /><div style={{ fontSize: 12, color: DARK, lineHeight: 1.5 }}>{item}</div></div>))}
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
