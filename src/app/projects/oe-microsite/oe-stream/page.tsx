import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "Generic Zoom/Teams", desc: "No branding, no lower thirds, no graphics. Looks like every other internal call, not a produced event." },
  { label: "Amateur Audio/Video", desc: "Webcam quality, inconsistent audio, no production value. Presenters look unprepared." },
  { label: "No Live Translation", desc: "Global audience? Too bad. Manual interpreter setup is complex, expensive, and unreliable." },
  { label: "No Captioning", desc: "Accessibility is an afterthought. DIY auto-captions are inaccurate and embarrassing." },
  { label: "Awkward Transitions", desc: "One screen share at a time. Switching between speakers means dead air and confused viewers." },
  { label: "Pre-Record vs Live", desc: "Either go all-live (risky) or play an MP4 (clunky). No way to blend both seamlessly." },
];

const oeFeatures = [
  { label: "Broadcast-Quality Production", desc: "Custom layouts, lower thirds, branded graphics, and HD 1080p output. Looks like TV, not a Zoom call." },
  { label: "Professional Audio/Video", desc: "Multi-camera support, audio mixing, and production team managing transitions in real time." },
  { label: "Live Translation", desc: "Built-in simultaneous translation for global audiences. Multiple language channels, zero setup for you." },
  { label: "Auto Transcription & Captioning", desc: "Real-time closed captioning with high accuracy. Meets accessibility standards out of the box." },
  { label: "Multi-Source Feeds", desc: "Seamless switching between presenters, locations, and content sources. No dead air, no awkward pauses." },
  { label: "Pre-Record + Live Q&A", desc: "Mix pre-recorded segments with live Q&A seamlessly. De-risk your keynote while keeping it interactive." },
];

export default function OEStream() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>▶</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            OE Stream
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            Webcasting Engine
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          Live and on-demand video that looks like broadcast TV, not a conference call.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without OE Stream</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>The livestreaming experience today</p>
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
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Stream</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE Stream delivers it</p>
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
