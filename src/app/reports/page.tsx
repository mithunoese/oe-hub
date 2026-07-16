"use client";

import Link from "next/link";

export default function Reports() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 8 }}>
          Reports
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 6 }}>
              Weekly Reports
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Week-by-week updates, pipeline activity, and progress tracking.
            </p>
          </div>
          <Link href="/admin" style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", border: "1px solid var(--teal-mid)", borderRadius: 8, padding: "8px 14px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4 }}>
            ↑ Upload PDF
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Link href="/reports/q1" style={{ display: "block" }}>
          <div style={{ padding: "22px 24px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Q1 · February–March 2026</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Weeks 2–7 · narrative weekly reports</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--bg)", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>View →</span>
          </div>
        </Link>

        <Link href="/reports/q2" style={{ display: "block" }}>
          <div style={{ padding: "22px 24px", background: "var(--surface)", border: "1.5px solid var(--teal)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Q2 · April–June 2026</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Weeks 8–20 · narrative weekly reports + SE KPIs</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>View →</span>
          </div>
        </Link>

        <Link href="/reports/q3" style={{ display: "block" }}>
          <div style={{ padding: "22px 24px", background: "var(--surface)", border: "1.5px solid var(--teal)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Q3 · July–September 2026</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Weeks 21–22 · narrative weekly reports + SE KPIs</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>View →</span>
          </div>
        </Link>

        <div style={{ padding: "22px 24px", background: "var(--surface)", border: "1.5px dashed var(--border)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Q4 · October–December 2026</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Nothing tracked yet</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--bg)", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>Coming soon</span>
        </div>
      </div>
    </main>
  );
}
