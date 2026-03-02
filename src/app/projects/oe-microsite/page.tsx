"use client";

import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

/* ─── Data ─── */

const manualSteps = [
  { phase: "Planning", items: ["Spreadsheets & email chains for run-of-show", "Separate RSVP tools, manual check-in", "No structured rehearsals"] },
  { phase: "Production", items: ["Generic Zoom/Teams, amateur look", "One screen share, awkward transitions", "All-live (risky) or MP4 (clunky)"] },
  { phase: "Experience", items: ["Zoom link in an email", "Wrong rooms, dropoffs", "DIY captioning"] },
  { phase: "Security", items: ["Standard passcodes", "Speakers mixed with attendees"] },
  { phase: "Post-Event", items: ["Zoom CSV, manual reconciliation", "YouTube upload, no tracking"] },
  { phase: "Integrations", items: ["CSV → Excel → Salesforce", "Manual multi-platform uploads"] },
];

const oeSteps = [
  { num: 1, slug: "oe-central", name: "OE Central", tag: "Command Center", desc: "360° organizer dashboard — tracking, scheduling, collaboration" },
  { num: 2, slug: "oe-passport", name: "OE Passport", tag: "Participant Hub", desc: "Branded attendee microsite — agendas, one-click access, materials" },
  { num: 3, slug: "oe-stream", name: "OE Stream", tag: "Webcasting", desc: "HD 1080p live + on-demand — translation, transcription, captioning" },
  { num: 4, slug: "oe-podium", name: "OE Podium", tag: "Presenter Panel", desc: "Backstage portal — slide control, private chat, Q&A" },
  { num: 5, slug: "oe-integrations", name: "OE Integrations", tag: "API Layer", desc: "Salesforce, marketing automation, analytics — data flows automatically" },
  { num: 6, slug: "zoom-services", name: "Zoom Services", tag: "Partnership", desc: "Managed Zoom Webinars + Events — rehearsals, live execution" },
];

const pillars = [
  { name: "Investor Relations", sub: "Earnings calls · Investor Days · LP updates", color: "#008285" },
  { name: "Corporate Engagement", sub: "Town halls · Kickoffs · Product launches", color: "#0f766e" },
  { name: "Institutional Banks", sub: "Corporate access · Capital markets", color: "#115e59" },
  { name: "Investment Managers", sub: "Virtual meetings · Expanded reach", color: "#134e4a" },
];

/* ─── Page ─── */

export default function OEMicrosite() {
  return (
    <div style={{ maxWidth: "none", margin: "0 -24px" }}>
      {/* Back link */}
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af" }}>
          ← Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div style={{ padding: "0 24px", marginBottom: 40 }}>
        <h1
          style={{
            ...serif,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Manual Process vs. OpenExchange
        </h1>
        <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65 }}>
          Left: everything you juggle today. Right: the end-to-end platform that replaces it all.
          <br />
          Foundation: the four verticals this serves.
        </p>
        <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16 }} />
      </div>

      {/* ─── SIDE BY SIDE ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          padding: "0 24px",
          marginBottom: 48,
        }}
      >
        {/* LEFT: Manual */}
        <div
          style={{
            background: "#fef2f2",
            border: "2px solid #fecaca",
            borderRadius: 16,
            padding: 4,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#fee2e2",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#dc2626" }}>✕</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>
                Manual / DIY
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>
              Fragmented tools, scattered processes
            </p>
          </div>

          {/* Phase cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {manualSteps.map((phase) => (
              <div
                key={phase.phase}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#ef4444",
                    marginBottom: 6,
                  }}
                >
                  {phase.phase}
                </p>
                {phase.items.map((item) => (
                  <p
                    key={item}
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      lineHeight: 1.5,
                      paddingLeft: 12,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "#fca5a5" }}>—</span>
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: OE End-to-End */}
        <div
          style={{
            background: "#ecfdf5",
            border: "2px solid #a7f3d0",
            borderRadius: 16,
            padding: 4,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#d1fae5",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#059669" }}>✓</span>
              <span style={{ ...serif, fontSize: 15, fontWeight: 700, color: "#065f46" }}>
                OE End-to-End
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>
              6 products, one platform, every stage covered
            </p>
          </div>

          {/* Product pipeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 4px 4px" }}>
            {oeSteps.map((step, i) => (
              <Link
                key={step.name}
                href={`/projects/oe-microsite/${step.slug}`}
                style={{
                  display: "block",
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 16px",
                  transition: "all 0.15s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #008285"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,130,133,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Step number */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#008285",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>{step.name}</span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "#008285",
                          background: "#f0fafa",
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {step.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#a7f3d0", marginLeft: "auto" }}>→</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4, marginTop: 2 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                {/* Connector arrow */}
                {i < oeSteps.length - 1 && (
                  <div style={{ textAlign: "center", color: "#a7f3d0", fontSize: 14, marginTop: 4 }}>
                    ↓
                  </div>
                )}
              </Link>
            ))}

            {/* Result */}
            <div
              style={{
                background: "#008285",
                borderRadius: 10,
                padding: "14px 16px",
                color: "#fff",
              }}
            >
              <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>
                Result: Peace of Mind
              </span>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 1.4 }}>
                Platform handles the tech. Team handles the execution. You focus on your message.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOUNDATION: 4 VERTICAL PILLARS ─── */}
      <div style={{ padding: "0 24px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Foundation — Who This Serves
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {pillars.map((p) => (
            <div
              key={p.name}
              style={{
                background: p.color,
                borderRadius: "0 0 12px 12px",
                padding: "20px 16px",
                color: "#fff",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Top "pillar cap" */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: 4,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "0 0 4px 4px",
                }}
              />
              <h3 style={{ ...serif, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                {p.sub}
              </p>
            </div>
          ))}
        </div>
        {/* Visual base line */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #008285, #134e4a)",
            borderRadius: 2,
            marginTop: 0,
          }}
        />
      </div>
    </div>
  );
}
