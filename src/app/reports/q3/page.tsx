"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type WeekEntry = {
  href: string;
  week: string;
  date: string;
  summary: string;
  count?: string;
  badge?: string | null;
  pdf?: string;
};

type MonthSection = { month: string; weeks: WeekEntry[] };

const months: MonthSection[] = [
  {
    month: "July 2026",
    weeks: [
      { href: "/reports/week-22", week: "Week 22", date: "Jul 13–17, 2026", summary: "Ash declined the associate SE offer, prompting a hiring-process redesign; Okta CircleHD and Apex Technical (Panopto) migrations advanced; Coupa proposal built live. Updated through Thursday.", badge: "Current", pdf: "/weekly_report_week22.pdf" },
      { href: "/reports/week-21", week: "Week 21", date: "Jul 6–10, 2026", summary: "Okta CircleHD migration kicked off with a $15K signed deal; pre-migration report template built live for Indeed; Ash accepted the associate SE offer.", pdf: "/weekly_report_week21.pdf" },
    ],
  },
];

export default function Q3Reports() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/reports" style={{ fontSize: 13, color: "var(--light)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>&larr; Back to Reports</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 8 }}>
              Q3 · July–September 2026
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 6 }}>
              Q3 Weekly Reports
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Week-by-week updates, pipeline activity, and progress tracking.
            </p>
          </div>
          <Link href="/se-kpi/q3" style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", border: "1px solid var(--teal-mid)", borderRadius: 8, padding: "8px 14px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4 }}>
            KPIs →
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {months.map((m) => (
          <div key={m.month}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--light)", marginBottom: 10, paddingBottom: 7, borderBottom: "1px solid var(--border)" }}>
              {m.month}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {m.weeks.map((r) => (
                <div key={r.week} onClick={() => router.push(r.href)} style={{ display: "block", cursor: "pointer" }}>
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, transition: "border-color 0.15s" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{r.week}</span>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>· {r.date}</span>
                        {r.badge && <span style={{ fontSize: 10, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", padding: "2px 8px", borderRadius: 20 }}>{r.badge}</span>}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{r.summary}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                      {r.count && <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.count}</span>}
                      {!r.pdf && !r.count && <span style={{ fontSize: 11, color: "var(--teal)" }}>In KPI dashboard →</span>}
                      {r.pdf && (
                        <a href={r.pdf} download onClick={(e) => e.stopPropagation()} style={{ fontSize: 11, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", border: "1px solid var(--teal-mid)", borderRadius: 6, padding: "4px 10px", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          ↓ PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
