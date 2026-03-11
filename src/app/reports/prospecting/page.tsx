import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const reports = [
  {
    href: "/reports/prospecting/2026-03-10",
    label: "Week of Mar 10, 2026",
    summary: "12 lookalike companies across fintech SaaS, AI startups, and AmLaw 200 firms — with target contacts and outreach angles.",
    count: "12 companies",
    seeds: "Intuit · Siena AI · Gibson Dunn",
  },
];

export default function ProspectingReports() {
  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Link
          href="/reports"
          style={{ fontSize: 12, color: "#9ca3af", fontFamily: "system-ui, sans-serif", textDecoration: "none" }}
        >
          &larr; Reports
        </Link>
      </div>

      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginTop: 16 }}>
        Prospecting Reports
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65, marginTop: 8 }}>
        Weekly AI-generated company lookalikes for the Zoom Events sales pipeline.
      </p>
      <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2, marginTop: 16, marginBottom: 32 }} />

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
              }}
            >
              <div>
                <h2 style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
                  {r.label}
                </h2>
                <p style={{ fontSize: 11, color: "#008285", marginBottom: 6, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
                  Seeds: {r.seeds}
                </p>
                <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
                  {r.summary}
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2, fontFamily: "system-ui, sans-serif" }}>
                {r.count}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 40, padding: "16px 20px", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8 }}>
        <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "system-ui, sans-serif", lineHeight: 1.6, margin: 0 }}>
          Generated weekly by the{" "}
          <Link href="/agents/prospecting" style={{ color: "#008285" }}>
            Prospecting Agent
          </Link>{" "}
          — Llama 3.3 70B via Groq, free tier. New reports publish every Friday.
        </p>
      </div>
    </>
  );
}
