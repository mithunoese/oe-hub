import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "CSV Export → Excel → Import", desc: "After every event: download CSV from Zoom, clean it in Excel, then manually import to Salesforce. Every. Single. Time." },
  { label: "No Real-Time Data", desc: "Engagement data only available after the event ends. No live insights during the event itself." },
  { label: "Registration Disconnect", desc: "Registration tool doesn't talk to the event platform. Manual reconciliation between systems." },
  { label: "Marketing Blind Spot", desc: "Marketing automation has no idea who attended, what they watched, or how engaged they were." },
  { label: "Content Scattered", desc: "Recordings uploaded manually to multiple platforms. No centralized management, no tracking." },
  { label: "Analytics Silos", desc: "Zoom has some data, registration tool has other data, Salesforce has different data. No single view." },
];

const oeFeatures = [
  { label: "Direct CRM Integration", desc: "OE connects directly to Salesforce, HubSpot, and other CRMs. Attendee data flows automatically — no CSV gymnastics." },
  { label: "Real-Time API Access", desc: "Live engagement data available via API during the event. Build dashboards, trigger automations, act in the moment." },
  { label: "Registration Sync", desc: "Registration tools, RSVP systems, and event platform all connected. One registration, everywhere it needs to go." },
  { label: "Marketing Automation", desc: "Engagement signals flow to Marketo, Eloqua, or HubSpot. Automatic follow-ups based on who attended and what they did." },
  { label: "Embeddable Content", desc: "Embed recorded sessions on any website via API. Centralized management with viewer tracking across all destinations." },
  { label: "Unified Analytics", desc: "One dashboard with all engagement metrics — attendance, watch time, polls, Q&A, downloads — across all channels." },
];

export default function OEIntegrations() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            OE Integrations
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            API Layer
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          The connective tissue — CRMs, marketing tools, and analytics, all wired together.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without OE Integrations</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>The data management nightmare</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {diyPains.map((item) => (
              <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ecfdf5", border: "2px solid #a7f3d0", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#d1fae5", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#059669" }}>✓</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Integrations</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE connects everything</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {oeFeatures.map((item) => (
              <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
