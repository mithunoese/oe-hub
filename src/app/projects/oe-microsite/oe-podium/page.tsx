import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "Speakers Mixed with Attendees", desc: "Presenters join the same Zoom room as everyone else. No backstage, no preparation space, no privacy." },
  { label: "Hot-Mic Risk", desc: "One unmuted speaker can derail the entire event. No isolation between presenters and audience." },
  { label: "Slide Chaos", desc: "Screen share pass-around. One person shares at a time, handoffs are awkward, slides get lost." },
  { label: "No Private Communication", desc: "Speakers can't message each other during the event without the audience seeing it." },
  { label: "Q&A Free-for-All", desc: "Chat box floods with questions and comments mixed together. No moderation, no prioritization." },
  { label: "No Rehearsal Environment", desc: "Speakers test on the live call. If something breaks, everyone sees it." },
];

const oeFeatures = [
  { label: "Separate Backstage", desc: "Presenters have their own private portal. They see the event, but the audience doesn't see them until showtime." },
  { label: "Audio Isolation", desc: "Speakers are muted to the audience by default. OE team controls when each mic goes live. Zero hot-mic risk." },
  { label: "Slide Control", desc: "Presenters manage their own slides from the backstage panel. No screen share handoffs needed." },
  { label: "Private Chat", desc: "Speakers can message each other and the production team privately during the live event." },
  { label: "Moderated Q&A", desc: "Questions are queued, filtered, and prioritized by moderators before reaching the speakers." },
  { label: "Full Dress Rehearsals", desc: "24-hour test lines and structured rehearsals in the same environment as the live event." },
];

export default function OEPodium() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🎙</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            OE Podium
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            Presenter Panel
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          A separate backstage portal for speakers — keeping presenters separated from the audience.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without OE Podium</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>The presenter experience today</p>
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
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Podium</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE Podium handles speakers</p>
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
