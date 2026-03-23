import Link from "next/link";

export default function SEPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <Link
        href="/projects"
        style={{ fontSize: 12, color: "#9ca3af", display: "inline-block", marginBottom: 28 }}
      >
        ← Projects
      </Link>

      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "0.18em",
          color: "#c0c0c0",
          marginBottom: 12,
        }}
      >
        SE
      </p>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        Golden Demo Scripts
      </h1>
      <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
        Coming soon — demo content from Max.
      </p>
    </main>
  );
}
