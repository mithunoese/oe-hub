"use client";

import Link from "next/link";

const serif = { fontFamily: "var(--font-body)" };
const sans = { fontFamily: "var(--font-body)" };

const clients = [
  {
    name: "IFRS Foundation",
    source: "Kaltura",
    target: "Zoom Events Advanced",
    videos: "~500",
    status: "In Progress",
    statusColor: "#16a34a",
    details:
      "International accounting standards body migrating their full video library from Kaltura to Zoom Events Advanced CMS. Includes IFRS Standards webcasts, Board meetings, and educational content. Dry run completed with Veltris team onboarded for production execution. Multipart upload pipeline validated through Video Project 6.",
  },
  {
    name: "Laurentian University",
    source: "Panopto",
    target: "Zoom",
    videos: "TBD",
    status: "Scoped",
    statusColor: "#f59e0b",
    details:
      "Canadian university migrating from Panopto to Zoom. Scoped during Week 7 with Jira tickets created (ZCM-77 through ZCM-80). S3-to-S3 import flow designed for bulk transfer. Migration involves academic lecture recordings, course content, and institutional video archives.",
  },
  {
    name: "Anderson & Strudwick",
    source: "ON24",
    target: "Zoom",
    videos: "TBD",
    status: "Discovery",
    statusColor: "#9ca3af",
    details:
      "Financial services firm evaluating migration from ON24 to Zoom. Early-stage discovery to understand content volume, compliance requirements, and timeline. ON24 API integration being assessed for automated content extraction.",
  },
];

const pipeline = [
  { step: "1", label: "Discover", desc: "API-driven inventory of source platform videos with metadata extraction (titles, descriptions, captions, thumbnails, durations)." },
  { step: "2", label: "Download", desc: "Parallel download from source platform with progress tracking, retry logic, and checkpointing for large files." },
  { step: "3", label: "Stage", desc: "S3-compatible staging (MinIO for local, AWS S3 for production) with integrity verification before upload." },
  { step: "4", label: "Upload", desc: "Multipart upload to Zoom via Events Advanced API or Video Management API, depending on target configuration." },
  { step: "5", label: "Enrich", desc: "Caption transfer (VTT/SRT), thumbnail restoration, category mapping, and metadata sync to match source platform structure." },
  { step: "6", label: "Verify", desc: "Post-migration validation confirming video playback, caption accuracy, and metadata completeness on the Zoom side." },
];

const milestones = [
  { date: "Feb 2026", event: "Migration pricing one-pager endorsed by Zoom VP", done: true },
  { date: "Mar 2026", event: "IFRS dry run completed with Veltris team", done: true },
  { date: "Mar 2026", event: "Multipart upload pipeline validated (Video Project 6)", done: true },
  { date: "Mar 2026", event: "Laurentian University scoped, Jira tickets created", done: true },
  { date: "Apr 2026", event: "IFRS production migration begins", done: false },
  { date: "Apr 2026", event: "Laurentian pilot batch (50 videos)", done: false },
  { date: "Q2 2026", event: "Anderson & Strudwick discovery complete", done: false },
];

const teamMembers = [
  { name: "Mithun Manjunatha", role: "SE Lead", scope: "Pipeline engineering, API integration, migration execution" },
  { name: "Veltris Team", role: "Production Partner", scope: "IFRS content preparation, dry run coordination, production uploads" },
  { name: "Joe (ZCM)", role: "Zoom CMS Engineer", scope: "Multipart upload support, transcript API escalation, Events Advanced API" },
  { name: "Max Caine", role: "OE SE Manager", scope: "Client relationship, deal structure, pricing approval" },
];

export default function ZVMMigration() {
  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 72px" }}>
      <style>{`
        @media (max-width: 680px) {
          .pipeline-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <Link href="/projects" style={{ ...sans, fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>
          \u2190 Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div style={{
        background: "#008285", borderRadius: 8, padding: "20px 28px",
        marginBottom: 32, display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>ZOOM</div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)" }}>PARTNERSHIP</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)" }}>MIGRATION PRACTICE</div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ ...serif, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Video Migration Practice
          </div>
          <div style={{ ...sans, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4, letterSpacing: "0.04em" }}>
            Kaltura \u00b7 Panopto \u00b7 ON24 \u2192 Zoom \u00b7 April 2026
          </div>
        </div>
      </div>

      {/* Overview */}
      <p style={{ ...serif, fontSize: 16.5, color: "#6b7280", lineHeight: 1.75, marginBottom: 36, fontStyle: "italic" }}>
        End-to-end video content migration from legacy platforms to Zoom \u2014 engineered for enterprise scale, compliance, and zero content loss.
      </p>

      <section style={{ marginBottom: 40 }}>
        <SectionLabel>The Practice</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px", background: "#fafafa" }}>
          <p style={{ ...serif, fontSize: 16, color: "#374151", lineHeight: 1.85, margin: 0 }}>
            OpenExchange\u2019s video migration practice helps enterprise clients move their full video libraries from legacy CMS platforms (Kaltura, Panopto, ON24, Brightcove) to Zoom\u2019s video ecosystem. Each migration is scoped per-client with dedicated staging infrastructure, automated pipeline tooling, and metadata preservation including captions, thumbnails, and category structures. The practice supports both Zoom Events Advanced (for IR/webcasting clients) and Zoom Video Management (for corporate/education clients).
          </p>
        </div>
      </section>

      {/* Active Clients */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Active Client Engagements</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          {clients.map((c) => (
            <div key={c.name} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              <div style={{
                padding: "14px 22px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const,
                background: "#fafafa", borderBottom: "1px solid #e5e7eb",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ ...sans, fontSize: 15, fontWeight: 700, color: "#111827" }}>{c.name}</span>
                  <span style={{
                    ...sans, fontSize: 10, fontWeight: 600, color: c.statusColor,
                    background: `${c.statusColor}15`, padding: "3px 10px", borderRadius: 20,
                  }}>
                    {c.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ ...sans, fontSize: 12, color: "#6b7280" }}>{c.source} \u2192 {c.target}</span>
                  <span style={{ ...sans, fontSize: 12, color: "#6b7280" }}>{c.videos} videos</span>
                </div>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>{c.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Migration Pipeline</SectionLabel>
        <div className="pipeline-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {pipeline.map((p) => (
            <div key={p.step} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "#008285",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  ...sans, fontSize: 11, fontWeight: 700, color: "#fff",
                }}>
                  {p.step}
                </div>
                <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#111827" }}>{p.label}</span>
              </div>
              <p style={{ ...serif, fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <a
            href="https://video-migration-tau.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", background: "#008285", color: "#fff",
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}
          >
            Open Migration Dashboard \u2197
          </a>
        </div>
      </section>

      {/* Milestones */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Milestones</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                  border: m.done ? "none" : "2px solid #d1d5db",
                  background: m.done ? "#008285" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                }}>
                  {m.done ? "\u2713" : ""}
                </div>
                <div>
                  <span style={{ ...sans, fontSize: 11, color: "#9ca3af", marginRight: 8 }}>{m.date}</span>
                  <span style={{ ...serif, fontSize: 15, color: m.done ? "#374151" : "#111827", lineHeight: 1.6 }}>{m.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Team</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {teamMembers.map((t) => (
            <div key={t.name} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ ...sans, fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{t.name}</div>
              <div style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#008285", marginBottom: 8 }}>{t.role}</div>
              <p style={{ ...serif, fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{t.scope}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...sans, fontSize: 10.5, color: "#c0c0c0", letterSpacing: "0.04em" }}>
          Open Exchange \u00b7 Zoom Partnership \u00b7 Confidential \u00b7 April 2026
        </span>
        <span style={{ ...sans, fontSize: 10.5, color: "#c0c0c0" }}>
          Internal Use Only
        </span>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 16, background: "#008285", borderRadius: 2, flexShrink: 0 }} />
      <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#374151", margin: 0 }}>
        {children}
      </p>
    </div>
  );
}
