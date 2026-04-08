"use client";

import Link from "next/link";

const serif = { fontFamily: "var(--font-body)" };
const sans = { fontFamily: "var(--font-body)" };

const connectors = [
  {
    platform: "HubSpot",
    type: "MAP",
    status: "Supported",
    statusColor: "#16a34a",
    desc: "Native Zoom Events integration via HubSpot Marketplace. Event registration sync, attendee tracking, lead scoring based on webcast engagement. Supports both Zoom Events and Webinars Plus.",
  },
  {
    platform: "Marketo",
    type: "MAP",
    status: "Supported",
    statusColor: "#16a34a",
    desc: "Zoom-to-Marketo connector syncing registration, attendance, and engagement data. Smart list triggers for post-event nurture campaigns. Custom field mapping for enterprise segmentation.",
  },
  {
    platform: "Eloqua",
    type: "MAP",
    status: "Custom Middleware",
    statusColor: "#f59e0b",
    desc: "No native Zoom connector. Requires custom middleware (Workato or Zapier) to bridge Zoom Events webhooks to Eloqua REST API. Registration and attendance sync achievable with webhook-to-contact mapping.",
  },
  {
    platform: "Pardot (Account Engagement)",
    type: "MAP",
    status: "Custom Middleware",
    statusColor: "#f59e0b",
    desc: "Salesforce-native but no direct Zoom Events connector. Integration path through Salesforce CRM as intermediary or via Zapier/Workato automation. Prospect activity sync requires custom field configuration.",
  },
  {
    platform: "Salesforce",
    type: "CRM",
    status: "Supported",
    statusColor: "#16a34a",
    desc: "Zoom Events Salesforce package available in AppExchange. Campaign member sync, custom report types for event ROI, and lead assignment rules based on webcast engagement scores.",
  },
  {
    platform: "MemberClicks",
    type: "AMS",
    status: "Resolved",
    statusColor: "#3b82f6",
    desc: "Association management system integration for NIRI-type clients. SSO passthrough and member registration sync debugged and documented during Week 7. Custom webhook relay handles member verification.",
  },
];

const workstreams = [
  {
    title: "Workato Referral Model",
    color: "#008285",
    items: [
      "OE refers enterprise clients who need complex integrations to Workato",
      "Workato provides pre-built Zoom Events recipes and dedicated SE support",
      "Revenue share model under discussion with Workato partnership team",
      "Target: clients with Eloqua, Pardot, or custom CRM stacks",
    ],
  },
  {
    title: "Zapier Automation Layer",
    color: "#3b82f6",
    items: [
      "Self-serve integration path for mid-market clients",
      "Pre-built Zap templates for Zoom Events \u2192 MAP sync",
      "MemberClicks integration fully resolved via Zapier relay",
      "Documentation published for SE team enablement",
    ],
  },
  {
    title: "Native Connector Landscape",
    color: "#f59e0b",
    items: [
      "Ren (Zoom Integrations PM) mapping full connector inventory",
      "HubSpot and Marketo connectors production-ready",
      "Salesforce AppExchange package available",
      "Gap analysis for Eloqua and Pardot in progress",
    ],
  },
];

const stakeholders = [
  { name: "Ren", role: "Zoom Integrations PM", context: "Owns the Zoom-side connector landscape. Primary contact for native integration roadmap, API capabilities, and partner connector development." },
  { name: "Mithun Manjunatha", role: "OE SE Lead", context: "Integration architecture, middleware design, client-facing technical requirements gathering, and Zapier/Workato implementation." },
  { name: "Max Caine", role: "OE SE Manager", context: "Client relationship management, deal positioning, and integration scoping during sales cycles." },
];

const timeline = [
  { date: "Mar 2026", event: "First Zoom integrations training session with Ren", done: true },
  { date: "Mar 2026", event: "MemberClicks integration debugged and documented", done: true },
  { date: "Mar 2026", event: "Workato referral model discussion initiated", done: true },
  { date: "Apr 2026", event: "Connector matrix v1 published for SE team", done: false },
  { date: "Apr 2026", event: "Eloqua middleware proof-of-concept", done: false },
  { date: "Q2 2026", event: "Pardot integration path validated", done: false },
  { date: "Q2 2026", event: "Workato revenue share terms finalized", done: false },
];

export default function ZoomIntegrations() {
  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 72px" }}>
      <style>{`
        @media (max-width: 680px) {
          .workstream-grid { grid-template-columns: 1fr !important; }
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
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)" }}>INTEGRATIONS</div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ ...serif, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Integration Effort
          </div>
          <div style={{ ...sans, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4, letterSpacing: "0.04em" }}>
            Zoom Events \u00b7 MAP \u00b7 CRM \u00b7 Middleware \u00b7 April 2026
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p style={{ ...serif, fontSize: 16.5, color: "#6b7280", lineHeight: 1.75, marginBottom: 36, fontStyle: "italic" }}>
        Connecting Zoom Events to the enterprise marketing and CRM stack \u2014 native where possible, middleware where needed.
      </p>

      {/* Overview */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>The Effort</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px", background: "#fafafa" }}>
          <p style={{ ...serif, fontSize: 16, color: "#374151", lineHeight: 1.85, margin: 0 }}>
            Enterprise clients running Zoom Events need their webcast data to flow into marketing automation platforms (HubSpot, Marketo, Eloqua, Pardot) and CRM systems (Salesforce). Some connectors exist natively; others require middleware solutions through Workato or Zapier. This effort maps the full connector landscape, builds the missing bridges, and creates a repeatable playbook for SE teams to position integration capabilities during sales cycles.
          </p>
        </div>
      </section>

      {/* Connector Matrix */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Connector Matrix</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {connectors.map((c) => (
            <div key={c.platform} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" as const }}>
                <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.platform}</span>
                <span style={{ ...sans, fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{c.type}</span>
                <span style={{
                  ...sans, fontSize: 10, fontWeight: 600, color: c.statusColor,
                  background: `${c.statusColor}15`, padding: "3px 10px", borderRadius: 20,
                }}>
                  {c.status}
                </span>
              </div>
              <p style={{ ...serif, fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workstreams */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Workstreams</SectionLabel>
        <div className="workstream-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {workstreams.map((w) => (
            <div key={w.title} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ background: w.color, padding: "12px 16px" }}>
                <div style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>{w.title}</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {w.items.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: w.color, flexShrink: 0, marginTop: 7 }} />
                    <p style={{ ...serif, fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Timeline</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                  border: t.done ? "none" : "2px solid #d1d5db",
                  background: t.done ? "#008285" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                }}>
                  {t.done ? "\u2713" : ""}
                </div>
                <div>
                  <span style={{ ...sans, fontSize: 11, color: "#9ca3af", marginRight: 8 }}>{t.date}</span>
                  <span style={{ ...serif, fontSize: 15, color: t.done ? "#374151" : "#111827", lineHeight: 1.6 }}>{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Key Stakeholders</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {stakeholders.map((s) => (
            <div key={s.name} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ ...sans, fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{s.name}</div>
              <div style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#008285", marginBottom: 8 }}>{s.role}</div>
              <p style={{ ...serif, fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{s.context}</p>
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
