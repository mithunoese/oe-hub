import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

export default function VideoMigration() {
  return (
    <>
      <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24, display: "inline-block" }}>
        ← Back to Projects
      </Link>
      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 8 }}>
        Video Migration Tool
      </h1>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
        Engineering
      </span>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16, marginBottom: 24 }} />
      <p style={{ ...serif, fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 24 }}>
        Automated pipeline for migrating video content from Kaltura to Zoom via AWS S3.
        Handles bulk transfers, progress tracking, error recovery, and delivery confirmation.
      </p>
      <a
        href="https://video-migration-tau.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          background: "#008285",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          marginTop: 8,
        }}
      >
        Open VideoMigrate Dashboard ↗
      </a>
    </>
  );
}
