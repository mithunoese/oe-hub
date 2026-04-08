"use client";

import Link from "next/link";

const weeks = [
  {
    href: "/reports/week-7",
    week: "Week 7",
    date: "Mar 30–Apr 4, 2026",
    summary: "19 meetings across Q1 close ($10M+), IFRS dry run confirmed with Veltris onboarded, MemberClicks integration resolved and documented, Laurentian University Panopto migration scoped, and two client deliverables shipped.",
    count: "19 meetings",
    badge: "New",
    pdf: "/weekly_report_week7.pdf",
  },
  {
    href: "/reports/week-6",
    week: "Week 6",
    date: "Mar 23–27, 2026",
    summary: "10 meetings across IFRS client dry-run planning, migration pricing endorsed by Zoom VP, first Zoom integrations training with Ren, and NYC cocktail networking event.",
    count: "10 meetings",
    badge: "null",
    pdf: "/weekly_report_week6.pdf",
  },
  {
    href: "/reports/week-5",
    week: "Week 5",
    date: "Mar 16–20, 2026",
    summary: "20 meetings across Q1 close sprint, Zoom API gaps resolved, integrations go-to-market confirmed, and prospecting tools shipped.",
    count: "20 meetings",
    badge: null,
    pdf: "/weekly_report_week5.pdf",
  },
  {
    href: "/reports/week-4",
    week: "Week 4",
    date: "Mar 9–13, 2026",
    summary: "17 meetings across migration pricing launch, Zoom platform enablement, EMEA intro, Workato partnership discovery, and the Zoom API gap.",
    count: "17 meetings",
    badge: null,
    pdf: "/weekly_report_week4.pdf",
  },
  {
    href: "/reports/week-3",
    week: "Week 3",
    date: "Mar 2–6, 2026",
    summary: "22 meetings across migration engineering, CMS pricing, first client demos, and SE cadence.",
    count: "22 meetings",
    badge: null,
    pdf: "/weekly_report_week3.pdf",
  },
  {
    href: "/reports/week-2",
    week: "Week 2",
    date: "Feb 23–27, 2026",
    summary: "27 meetings across sales, delivery, product, engineering, and the Zoom partnership.",
    count: "27 meetings",
    badge: null,
    pdf: "/weekly_report_week2.pdf",
  },
];

export default function Reports() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
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
          <Link
            href="/admin"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--teal)",
              background: "var(--teal-light)",
              border: "1px solid var(--teal-mid)",
              borderRadius: 8,
              padding: "8px 14px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            ↑ Upload PDF
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {weeks.map((r) => (
          <div key={r.href} style={{ position: "relative" }}>
            <Link href={r.href} style={{ display: "block" }}>
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{r.week}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>· {r.date}</span>
                    {r.badge && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", padding: "2px 8px", borderRadius: 20 }}>
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{r.summary}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.count}</span>
                  {r.pdf && (
                    <a
                      href={r.pdf}
                      download
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--teal)",
                        background: "var(--teal-light)",
                        border: "1px solid var(--teal-mid)",
                        borderRadius: 6,
                        padding: "4px 10px",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ↓ PDF
                    </a>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: "16px 24px", background: "var(--teal-light)", borderRadius: 10, border: "1px solid var(--teal-mid)" }}>
        <div style={{ fontSize: 13, color: "var(--teal)", fontWeight: 500 }}>
          View the live BD Pipeline dashboard →{" "}
          <Link href="/projects/bd-pipeline" style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Corp Comms · ASCO 2026 · Zoom
          </Link>
        </div>
      </div>
    </main>
  );
}
