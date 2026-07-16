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
    month: "June 2026",
    weeks: [
      { href: "/reports/week-20", week: "Week 20", date: "Jun 29–Jul 3, 2026", summary: "Zoom Support Line launched to Zoom's full AE and CSM team with immediate adoption; Indeed CMS migration moved into a full Kaltura content audit; Contact Center licensing friction with Zoom persisted.", count: "21 meetings", badge: "Current", pdf: "/weekly_report_week20.pdf" },
      { href: "/reports/week-19", week: "Week 19", date: "Jun 22–26, 2026", summary: "Zoom CMS migration pricing came to a head as Mithun built a working pricing calculator in under 25 minutes; Support-line Contact Center cleared Salesforce blocker; Indeed CMS migration moved to signature.", count: "27 meetings", pdf: "/weekly_report_week19.pdf" },
      { href: "/reports/week-18", week: "Week 18", date: "Jun 15–19, 2026", summary: "IFRS migration closed after discovering and migrating 765 unmigrated livestream recordings within 48 hours; Indeed ZVM contract near signature; OE Support Line go-live confirmed for July 6.", count: "26 meetings", pdf: "/weekly_report_week18.pdf" },
      { href: "/reports/week-17", week: "Week 17", date: "Jun 8–12, 2026", summary: "IFRS delivered full migration report closing first end-to-end Kaltura-to-Zoom engagement; Indeed contract kicked off with SOW sent; Vault Jump bot architecture formalized.", count: "18 meetings" },
      { href: "/reports/week-16", week: "Week 16", date: "Jun 1–5, 2026", summary: "IFRS migration in final stage with caption bugs resolved; Indeed retention crisis resolved via Zoom product commitment; Vault Jump migration bot moving toward productization.", count: "19 meetings", pdf: "/weekly_report_week16.pdf" },
    ],
  },
  {
    month: "May 2026",
    weeks: [
      { href: "/reports/week-15", week: "Week 15", date: "May 25–29, 2026", summary: "IFRS reached final mile with 2,800 videos uploaded; ZVM migration bot cleared sprint review; CrowdStrike surfaced as displacement opportunity; Contact Center received Elite licenses.", count: "22 meetings" },
      { href: "/reports/week-14", week: "Week 14", date: "May 18–22, 2026", summary: "IFRS Kaltura migration executed live and completed early with 2,800 files extracted; ABA emerged as ON24 displacement lead; Support Line fast-tracked to 90-day launch.", count: "21 meetings" },
      { href: "/reports/week-13", week: "Week 13", date: "May 11–15, 2026", summary: "IFRS migration start locked for May 18; Indeed discovery materials confirmed; Arziant/Baker RFQ submitted; earnings automation product concept emerged.", count: "19 meetings", pdf: "/weekly_report_week13.pdf" },
      { href: "/reports/week-12", week: "Week 12", date: "May 4–8, 2026", summary: "IFRS migration validated and unblocked; CMS migration pitched to 30+ Zoom specialists; Amgen discovery opened; migration bot security architecture defined.", count: "15 meetings" },
    ],
  },
  {
    month: "April 2026",
    weeks: [
      { href: "/reports/week-11", week: "Week 11", date: "Apr 27–May 1, 2026", summary: "IFRS migration greenlit for live execution; Indeed proposal sent; S3-to-S3 Zoom architecture confirmed; CMS migration named at company all-hands.", count: "27 meetings", pdf: "/weekly_report_week11.pdf" },
      { href: "/reports/week-10", week: "Week 10", date: "Apr 20–24, 2026", summary: "Okta $38K implementation proposal presented; Indeed scoped at $22,100; IFRS technical blockers cleared; three internal AI initiatives advanced.", count: "23 meetings", pdf: "/weekly_report_week10.pdf" },
      { href: "/reports/week-9", week: "Week 9", date: "Apr 13–17, 2026", summary: "Okta discovery completed in single week; IFRS validation gates cleared; Open Montage enters working prototype; OE AI support agent goes live.", count: "23 meetings", pdf: "/weekly_report_week9.pdf" },
      { href: "/reports/week-8", week: "Week 8", date: "Apr 7–11, 2026", summary: "21 meetings across IFRS and Veltris dry runs exposing Zoom API gaps, managed agent concept pitched to Max and Alan, Cargill integration priced and closed, and AI tooling handed off across the team.", count: "21 meetings", pdf: "/weekly_report_week8.pdf" },
    ],
  },
];

export default function Q2Reports() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/reports" style={{ fontSize: 13, color: "var(--light)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>&larr; Back to Reports</Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 8 }}>
              Q2 · April–June 2026
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 6 }}>
              Q2 Weekly Reports
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Week-by-week updates, pipeline activity, and progress tracking.
            </p>
          </div>
          <Link href="/se-kpi" style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", background: "var(--teal-light)", border: "1px solid var(--teal-mid)", borderRadius: 8, padding: "8px 14px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginTop: 4 }}>
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
