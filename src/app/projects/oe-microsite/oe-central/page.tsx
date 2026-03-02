import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "Run-of-Show", desc: "Spreadsheets emailed back and forth — no single source of truth, version control nightmares" },
  { label: "Attendee Tracking", desc: "Manual headcounts, no real-time visibility into who's where during a live event" },
  { label: "Presenter Coordination", desc: "Email chains, WhatsApp groups, hoping speakers show up on time with the right slides" },
  { label: "Scheduling", desc: "Google Sheets or Outlook calendars, no session-level granularity, conflicts missed" },
  { label: "Collaboration", desc: "Scattered across Slack, email, docs — no centralized hub for the event team" },
  { label: "Day-of Visibility", desc: "Flying blind. No dashboard. Relying on walkie-talkies and gut feel" },
];

const oeFeatures = [
  { label: "360° Dashboard", desc: "Real-time view of every attendee, presenter, and session — all in one screen. No tab-switching." },
  { label: "Live Attendee Tracking", desc: "See who's in which session, who dropped off, who hasn't joined — in real time, not after the event." },
  { label: "Presenter Management", desc: "Track speaker readiness, slide uploads, rehearsal completion, and live status from one panel." },
  { label: "Smart Scheduling", desc: "Drag-and-drop session builder with conflict detection, timezone handling, and auto-notifications." },
  { label: "Team Collaboration", desc: "Built-in chat, task assignment, and notes for the entire event team — no external tools needed." },
  { label: "Project Manager Assigned", desc: "Dedicated OE account manager runs the logistics. You set the strategy, they execute the details." },
];

export default function OECentral() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>⌘</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            OE Central
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            Logistics Command Center
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          The back-end dashboard where organizers see everything. Your 360° control room.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      {/* Side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        {/* LEFT: DIY */}
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without OE Central</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>What event planning looks like today</p>
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

        {/* RIGHT: OE */}
        <div style={{ background: "#ecfdf5", border: "2px solid #a7f3d0", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#d1fae5", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#059669" }}>✓</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Central</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE Central handles it</p>
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
