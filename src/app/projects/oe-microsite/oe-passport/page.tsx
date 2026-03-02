import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const diyPains = [
  { label: "12 Zoom Links in an Email", desc: "Attendees get a wall of URLs, have to figure out which session is which, and hope they click the right one" },
  { label: "No Personalization", desc: "Everyone gets the same generic email — no tailored agenda, no relevant recommendations" },
  { label: "PDF Agendas", desc: "Static documents that are outdated by the time they're sent. No live updates, no interactivity" },
  { label: "Material Distribution", desc: "Attachments in follow-up emails. Half the audience misses them, the other half can't find them later" },
  { label: "On-Demand Access", desc: "Recordings dumped on SharePoint or YouTube with no organization, no tracking, no context" },
  { label: "Mobile Experience", desc: "Nothing. Zoom links on a phone browser. No app, no optimized view, no offline access" },
];

const oeFeatures = [
  { label: "Branded Microsite", desc: "Custom-branded event portal with your logo, colors, and messaging. Looks like your company built it." },
  { label: "Personalized Agendas", desc: "Each attendee sees sessions relevant to them based on role, interest, or track — automatically curated." },
  { label: "One-Click Session Access", desc: "Smart links that always route to the right room. No wrong links, no confusion, no dropoffs." },
  { label: "Downloadable Materials", desc: "Slides, PDFs, and resources attached directly to each session. Available before, during, and after." },
  { label: "Video Library", desc: "On-demand replays organized by session with viewer tracking. Know who watched what and for how long." },
  { label: "Responsive Design", desc: "Full mobile experience — attendees can browse, join, and watch from any device, anywhere." },
];

export default function OEPassport() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects/oe-microsite" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Product Overview
        </Link>
      </div>

      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🎫</span>
          <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            OE Passport
          </h1>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20 }}>
            Participant Hub
          </span>
        </div>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          The front-end for attendees. A branded microsite that replaces &quot;here&apos;s 12 Zoom links in an email.&quot;
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 24px" }}>
        <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: 4 }}>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 20px", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Without OE Passport</span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>The attendee experience today</p>
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
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>With OE Passport</span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>How OE Passport transforms it</p>
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
