import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const reports = [
  {
    href: "/reports/week-3",
    week: "Week 3",
    date: "Mar 2–6, 2026",
    summary: "22 meetings across migration engineering, CMS pricing, first client demos, and SE cadence.",
    count: "22 meetings",
  },
  {
    href: "/reports/week-2",
    week: "Week 2",
    date: "Feb 23–27, 2026",
    summary: "27 meetings across sales, delivery, product, engineering, and the Zoom partnership.",
    count: "27 meetings",
  },
];

export default function Reports() {
  return (
    <>
      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
        Weekly Reports
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65, marginTop: 8 }}>
        Week-by-week updates and progress tracking.
      </p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16, marginBottom: 32 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reports.map((r) => (
          <Link key={r.href} href={r.href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "24px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
            >
              <div>
                <h2 style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
                  {r.week}
                </h2>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{r.date}</p>
                <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
                  {r.summary}
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
                {r.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
