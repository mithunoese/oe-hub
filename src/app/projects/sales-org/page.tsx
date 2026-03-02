import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

export default function SalesOrg() {
  return (
    <>
      <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24, display: "inline-block" }}>
        ← Back to Projects
      </Link>
      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 8 }}>
        The Revenue Team
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
        27 people across 8 teams. Interactive org chart for the revenue team.
      </p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16, marginBottom: 32 }} />
      <p style={{ ...serif, fontSize: 16, color: "#374151", lineHeight: 1.85 }}>
        Names, roles, bios, and context for every person across all 8 teams. Editable inline.
      </p>
    </>
  );
}
