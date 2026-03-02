import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "Self-Service Zoom Setup", desc: "Figure out Zoom Webinar settings yourself. Panelist roles, Q&A config, registration — all trial and error." },
  { label: "No Onboarding Support", desc: "Zoom documentation is massive. Teams spend hours learning features they'll use once." },
  { label: "Untested Events", desc: "First real test is the live event itself. No structured rehearsal, no tech check, fingers crossed." },
  { label: "Live Troubleshooting", desc: "Audio doesn't work? Presenter can't share? You're the IT help desk during your own event." },
  { label: "Scaling Struggles", desc: "Multi-session, multi-track events are exponentially harder to manage alone on Zoom." },
  { label: "Post-Event Chaos", desc: "Recordings, reports, follow-ups all manual. No process, no templates, no support." },
];

const oeFeatures = [
  { label: "Full Onboarding", desc: "OE's team configures your Zoom Webinar or Zoom Events environment. Settings, roles, permissions — done for you." },
  { label: "Training & Enablement", desc: "Hands-on training for your team and presenters. Everyone knows the platform before day one." },
  { label: "Structured Rehearsals", desc: "Full dress rehearsals with your speakers. Test every slide, every transition, every backup plan." },
  { label: "Live Production Team", desc: "OE operators manage the event in real time. Audio, video, transitions, troubleshooting — all handled." },
  { label: "Multi-Track Execution", desc: "Complex multi-session events with breakout rooms, parallel tracks, and seamless attendee routing." },
  { label: "Post-Event Delivery", desc: "Recordings processed, reports generated, and follow-up materials delivered — all part of the service." },
];

export default function ZoomServices() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🤝</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Zoom Events Services
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            Partnership
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          Preferred managed services partner for Zoom Webinars and Zoom Events.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without Managed Services</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>Running Zoom events on your own</p>
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
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Zoom Services</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE manages your Zoom events</p>
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
