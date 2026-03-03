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
      <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 32 }}>
        <iframe
          src="https://video-migration-tau.vercel.app"
          style={{ width: "100%", height: "80vh", border: "none", display: "block" }}
          title="VideoMigrate Dashboard"
        />
      </div>
    </>
  );
}
