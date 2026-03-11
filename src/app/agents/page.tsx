import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

export default function Agents() {
  return (
    <>
      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
        AI Agents
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65, marginTop: 8 }}>
        AI-powered tools built for the SE workflow — reporting, migration, and more.
      </p>
      <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2, marginTop: 16, marginBottom: 32 }} />

      <Link href="/agents/report-agent" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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
              Report Agent
            </h2>
            <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
              Generates structured weekly reports from raw meeting notes using Claude. Extracts themes, organizes by day, and produces the final HTML page.
            </p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
            Active
          </span>
        </div>
      </Link>

      <div
        style={{
          border: "2px dashed #f0f0f0",
          borderRadius: 8,
          padding: "24px 28px",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: "#9ca3af" }}>
          More agents coming soon — Migration Agent, Demo Builder
        </p>
      </div>
    </>
  );
}
