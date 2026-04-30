"use client";

import Link from "next/link";

const weeks = [
  {
    href: "/reports/week-10",
    week: "Week 10",
    date: "Apr 20–24, 2026",
    summary: "Okta $38K implementation proposal presented to committee, Indeed scoped at $22,100 via automated pricing tool, IFRS all technical blockers cleared and client review scheduled, and three internal AI initiatives advanced in parallel.",
    count: "23 meetings",
    badge: "New",
    pdf: "/weekly_report_week10.pdf",
    month: "April 2026",
  },
  {
    href: "/reports/week-9",
    week: "Week 9",
    date: "Apr 13–18, 2026",
    summary: "Okta discovery call lands in a single week, IFRS pre-migration validation gates on April 18th Zoom release, Open Montage crosses into working prototype, and OE’s internal AI support agent goes live.",
    count: "23 meetings",
    badge: null,
    pdf: "/weekly_report_week9.pdf",
    month: "April 2026",
  },
  {
    href: "/reports/week-8",
    week: "Week 8",
    date: "Apr 7–11, 2026",
    summary: "21 meetings across IFRS and Veltris dry runs, Zoom managed agent concept pitched, Cargill API integration priced, Okta/Circle HD discovery underway, and AI video production POC scoped.",
    count: "21 meetings",
    badge: null,
    pdf: "/weekly_report_week8.pdf",
    month: "April 2026",
  },
  {
    href: "/reports/week-7",
    week: "Week 7",
    date: "Mar 30–Apr 4, 2026",
    summary: "19 meetings across Q1 close ($10M+), IFRS dry run confirmed with Veltris onboarded, MemberClicks integration resolved and documented, Laurentian University Panopto migration scoped, and two client deliverables shipped.",
    count: "19 meetings",
    badge: null,
    pdf: "/weekly_report_week7.pdf",
    month: "April 2026",
  },
  {
    href: "/reports/week-6",
    week: "Week 6",
    date: "Mar 23–27, 2026",
    summary: "10 meetings across IFRS client dry-run planning, migration pricing endorsed by Zoom VP, first Zoom integrations training with Ren, and NYC cocktail networking event.",
    count: "10 meetings",
    badge: null,
    pdf: "/weekly_report_week6.pdf",
    month: "March 2026",
  },
  {
    href: "/reports/week-5",
    week: "Week 5",
    date: "Mar 16–20, 2026",
    summary: "20 meetings across Q1 close sprint, Zoom API gaps resolved, integrations go-to-market confirmed, and prospecting tools shipped.",
    count: "20 meetings",
    badge: null,
    pdf: "/weekly_report_week5.pdf",
    month: "March 2026",
  },
  {
    href: "/reports/week-4",
    week: "Week 4",
    date: "Mar 9–13, 2026",
    summary: "17 meetings across migration pricing launch, Zoom platform enablement, EMEA intro, Workato partnership discovery, and the Zoom API gap.",
    count: "17 meetings",
    badge: null,
    pdf: "/weekly_report_week4.pdf",
    month: "March 2026",
  },
  {
    href: "/reports/week-3",
    week: "Week 3",
    date: "Mar 2–6, 2026",
    summary: "22 meetings across migration engineering, CMS pricing, first client demos, and SE cadence.",
    count: "22 meetings",
    badge: null,
    pdf: "/weekly_report_week3.pdf",
    month: "March 2026",
  },
  {
    href: "/reports/week-2",
    week: "Week 2",
    date: "Feb 23–27, 2026",
    summary: "27 meetings across sales, delivery, product, engineering, and the Zoom partnership.",
    count: "27 meetings",
    badge: null,
    pdf: "/weekly_report_week2.pdf",
    month: "February 2026",
  },
];

export default function Reports() {
  const months = [...new Set(weeks.map((w) => w.month))];
  const byMonth = months.reduce((acc, m) => {
    acc[m] = weeks.filter((w) => w.month === m);
    return acc;
  }, {} as Record<string, typeof weeks>);

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
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, marginTop: 4 }}>
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
                textAlign: "center",
              }}
            >
              ↑ Upload PDF
            </Link>
            <Link
              href="/se-kpi"
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
                textAlign: "center",
              }}
            >
              Q2 KPI →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {months.map((month) => (
          <div key={month}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  background: "var(--teal-light)",
                  border: "1px solid var(--teal-mid)",
                  borderRadius: 20,
                  padding: "4px 12px",
                }}
              >
                {month}
              </div>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {byMonth[month].map((r) => (
                <div key={r.href} style={{ position: "relative" }}>
                  <Link href={r.href} style={{ display: "block" }}>
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: "20px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{r.week}</span>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>· {r.date}</span>
                          {r.badge && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "var(--teal)",
                                background: "var(--teal-light)",
                                padding: "2px 8px",
                                borderRadius: 20,
                              }}
                            >
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
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            padding: "16px 24px",
            background: "var(--teal-light)",
            borderRadius: 10,
            border: "1px solid var(--teal-mid)",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--teal)", fontWeight: 500 }}>
            Track Q2 KPI progress week by week →{" "}
            <Link
              href="/se-kpi"
              style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              SE KPI Dashboard
            </Link>
          </div>
        </div>
        <div
          style={{
            padding: "16px 24px",
            background: "var(--teal-light)",
            borderRadius: 10,
            border: "1px solid var(--teal-mid)",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--teal)", fontWeight: 500 }}>
            View the live BD Pipeline dashboard →{" "}
            <Link
              href="/projects/bd-pipeline"
              style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Corp Comms · ASCO 2026 · Zoom
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
