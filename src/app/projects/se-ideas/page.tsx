"use client";

import Link from "next/link";

const serif = { fontFamily: "var(--font-body)" };
const sans = { fontFamily: "var(--font-body)" };

const tier1Bullets = [
  { label: "Extend the Life of Every Event", desc: "One earnings call becomes dozens of shareable clips that reach retail investors on social media, Reddit, Discord, and your IR website — long after the live broadcast ends." },
  { label: "Full Editorial Control", desc: "AI generates clips and suggests highlights; your IR team reviews and approves before anything is distributed. No content goes live without sign-off — Reg FD-conscious from the ground up." },
  { label: "Searchable Event Archive", desc: "Instantly search across all past events by keyword, speaker, or topic. Pull the exact moment your CEO addressed guidance, capital allocation, or forward-looking strategy — and share it in seconds." },
  { label: "Reduce Production Burden", desc: "AI handles transcription, tagging, and clip creation. Your team shifts from producing content to curating it — freeing up bandwidth for strategic IR priorities." },
  { label: "Measure What Matters", desc: "Track clip views, shares, and engagement by channel. Correlate content distribution with IR website traffic, event registration trends, and shifts in shareholder composition over time." },
];

const tier2Bullets = [
  { label: "Fill the Retail Feedback Void", desc: "Institutional investors have analyst days and roadshows. Retail has nothing. Give your retail shareholders a structured voice — and give your IR team the data to act on it." },
  { label: "Event-Linked Sentiment Capture", desc: "Before each earnings call, poll investors on what topics matter most. After the event, measure confidence and satisfaction. Track sentiment trends quarter over quarter." },
  { label: "Scalable Engagement, Not 1-on-1 Meetings", desc: "Moderated group Q&A sessions, topic voting, and structured surveys let thousands of retail investors participate without creating compliance risk or overwhelming your team." },
  { label: "Board-Ready Retail Insights", desc: "Present quantified retail sentiment alongside institutional feedback in board materials. \"Retail confidence in capital allocation strategy increased 12 points post-Investor Day\" is a data point no peer can match." },
  { label: "Benchmarked Against Peers", desc: "Anonymized, aggregated data across all OpenExchange clients creates sector-level benchmarks. See how your retail sentiment compares to industry peers — a proprietary dataset available nowhere else." },
];

const revenueRows = [
  { pkg: "Tier 1: Content & Distribution", price: "$15K – $25K", adoption: "15% (~165 clients)", arr: "$2.5M – $4.1M" },
  { pkg: "Tier 2: Retail Intelligence", price: "$20K – $35K", adoption: "10% (~110 clients)", arr: "$2.2M – $3.9M" },
  { pkg: "Combined (Tier 1 + 2)", price: "$30K – $50K", adoption: "5% (~55 clients)", arr: "$1.7M – $2.8M" },
];

const phases = [
  {
    label: "Phase 1 — Q2 2026",
    title: "Build & Pilot",
    color: "#008285",
    items: [
      "Adapt AI content engine for OE client environments",
      "Integrate approval workflow (IR sign-off before distribution)",
      "Pilot with 3–5 clients from existing account base",
      "Validate pricing with pilot participants",
    ],
  },
  {
    label: "Phase 2 — Q3 2026",
    title: "Scale Tier 1 + Build Tier 2 MVP",
    color: "#3b82f6",
    items: [
      "Roll Tier 1 to next 50 clients via targeted outreach",
      "Build polling & survey engine (Tier 2 MVP)",
      "Design peer benchmarking data model",
      "Hire / assign product owner for retail engagement",
    ],
  },
  {
    label: "Phase 3 — Q4 2026",
    title: "Full Launch",
    color: "#f59e0b",
    items: [
      "Launch Tier 2 to initial cohort",
      "Release combined Retail Engagement Dashboard",
      "Sales team enablement & GTM push",
      "Target 150+ clients by year-end",
    ],
  },
];

const competitors = [
  { name: "Q4 Inc.", offer: "IR website hosting, earnings webcasting, shareholder analytics", win: "No AI content repurposing; no retail engagement layer" },
  { name: "Irwin", offer: "CRM for IR teams, institutional tracking, engagement scoring", win: "Institutional-only; no retail sentiment or content distribution" },
  { name: "Nasdaq IR Intel", offer: "Surveillance, ownership analytics, advisory services", win: "Ownership data only; no retail engagement or content tools" },
  { name: "Notified", offer: "Press release distribution, webcasting, IR websites", win: "Commodity webcasting; no AI engine or retail intelligence" },
];

const surveyQs = [
  { n: "Q1", q: "After an earnings call or major investor event, what type of content do you feel drives the most engagement with retail investors?" },
  { n: "Q2", q: "What's the biggest challenge your IR team faces keeping retail investors informed and engaged between earnings calls?" },
  { n: "Q3", q: "If you could automate one part of your retail investor communications, what would it be?" },
];

const nextSteps = [
  "Distribute survey to 5 IROs via sales team",
  "Pilot Tier 1 with 3–5 existing OE clients — Q2 2026",
  "Build polling & survey engine for Tier 2 MVP",
  "Design peer benchmarking data model",
  "Present revenue model + roadmap to Amelia + Mark",
];

export default function SEIdeas() {
  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 72px" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        @media (max-width: 680px) {
          .concept-grid { grid-template-columns: 1fr !important; }
          .phase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Back link + print button */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <Link href="/projects" style={{ ...sans, fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>
          ← Back to Projects
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            ...sans, fontSize: 12, fontWeight: 600, color: "#008285",
            background: "#f0fafa", border: "1px solid #c6e8e8",
            borderRadius: 6, padding: "7px 16px", cursor: "pointer",
          }}
        >
          Print / Export PDF ↗
        </button>
      </div>

      {/* OE Header bar */}
      <div style={{
        background: "#008285", borderRadius: 8, padding: "20px 28px",
        marginBottom: 32, display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>OPEN</div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)" }}>EXCHANGE</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)" }}>SE IDEAS</div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div style={{ ...serif, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Retail Investor Engagement
          </div>
          <div style={{ ...sans, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4, letterSpacing: "0.04em" }}>
            Two Solutions for Modern IR Teams · March 2026
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p style={{ ...serif, fontSize: 16.5, color: "#6b7280", lineHeight: 1.75, marginBottom: 36, fontStyle: "italic" }}>
        Give your retail shareholders a voice — and a reason to stay.
      </p>

      {/* THE PROBLEM */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>The Opportunity</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px", background: "#fafafa" }}>
          <p style={{ ...serif, fontSize: 16, color: "#374151", lineHeight: 1.85, margin: 0 }}>
            Retail investors represent a growing share of your shareholder base — but most IR teams have no structured
            way to reach them, hear from them, or measure their engagement. OpenExchange changes that with two solutions
            designed specifically for IR teams: one that turns your existing events into a retail content engine, and one
            that gives you the retail intelligence you&apos;ve never had.
          </p>
        </div>
      </section>

      {/* TIER 1 */}
      <section style={{ marginBottom: 40 }}>
        <div style={{
          background: "#008285", borderRadius: "8px 8px 0 0",
          padding: "14px 22px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...sans, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}>TIER 1</span>
            <span style={{ ...sans, fontSize: 16, fontWeight: 700, color: "#fff" }}>Content &amp; Distribution</span>
          </div>
          <span style={{ ...sans, fontSize: 12, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
            Turn every IR event into a retail engagement engine
          </span>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "24px 26px" }}>
          <p style={{ ...serif, fontSize: 15.5, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
            Your earnings calls, investor days, and non-deal roadshows already contain the messaging retail investors need.
            This solution transforms that content into short, branded, compliance-ready snippets — and gives your team a
            searchable library to find, clip, approve, and distribute the right moments to the right channels.
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, marginBottom: 20 }}>
            {tier1Bullets.map((b) => (
              <div key={b.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#008285", flexShrink: 0, marginTop: 8 }} />
                <p style={{ ...serif, fontSize: 15.5, color: "#374151", lineHeight: 1.75, margin: 0 }}>
                  <strong>{b.label}</strong> — {b.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ ...sans, fontSize: 12, color: "#374151", background: "#f0fafa", border: "1px solid #c6e8e8", borderRadius: 6, padding: "12px 16px" }}>
            <strong>Premium Add-On:</strong> A dedicated, secure content library per issuer with highlight reel builders,
            AI-assisted narrative editing, and board-ready reporting on retail content performance — positioning IR as a
            strategic driver of shareholder engagement.
          </div>
        </div>
      </section>

      {/* TIER 2 */}
      <section style={{ marginBottom: 40 }}>
        <div style={{
          background: "#1e3a5f", borderRadius: "8px 8px 0 0",
          padding: "14px 22px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...sans, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>TIER 2</span>
            <span style={{ ...sans, fontSize: 16, fontWeight: 700, color: "#fff" }}>Retail Intelligence</span>
          </div>
          <span style={{ ...sans, fontSize: 12, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
            Structured sentiment, feedback, and engagement data
          </span>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "24px 26px" }}>
          <p style={{ ...serif, fontSize: 15.5, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
            You can tell the board exactly what your top 50 institutional holders think. But what about the other 30–40%
            of your shareholder base? This solution gives IR teams structured, quantifiable retail investor data — through
            event-linked polls, post-event surveys, topic voting, and moderated group Q&amp;A — without the Reg FD
            exposure of 1-on-1 meetings.
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, marginBottom: 20 }}>
            {tier2Bullets.map((b) => (
              <div key={b.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e3a5f", flexShrink: 0, marginTop: 8 }} />
                <p style={{ ...serif, fontSize: 15.5, color: "#374151", lineHeight: 1.75, margin: 0 }}>
                  <strong>{b.label}</strong> — {b.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ ...sans, fontSize: 12, color: "#374151", background: "#f0fafa", border: "1px solid #c6e8e8", borderRadius: 6, padding: "12px 16px" }}>
            <strong>Premium Add-On:</strong> A real-time Retail Engagement Dashboard — combining content analytics from
            Tier 1 with sentiment data from Tier 2 — giving IR teams a single view of how their retail shareholder base
            is engaging, what they care about, and how sentiment is trending.
          </div>
        </div>
      </section>

      {/* REVENUE MODEL */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Revenue Model &amp; TAM Estimate</SectionLabel>
        <p style={{ ...sans, fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
          Illustrative pricing based on 1,100 existing OE clients. Assumes tiered annual subscription with optional
          premium add-ons. Actual pricing to be validated through sales team survey and pilot feedback.
        </p>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, ...sans, fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#111827" }}>
                <th style={{ padding: "12px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700, letterSpacing: "0.04em" }}>Package</th>
                <th style={{ padding: "12px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700 }}>Annual Price</th>
                <th style={{ padding: "12px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700 }}>Adoption (Yr 1)</th>
                <th style={{ padding: "12px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700 }}>Incremental ARR</th>
              </tr>
            </thead>
            <tbody>
              {revenueRows.map((r, i) => (
                <tr key={r.pkg} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 18px", color: "#111827", fontWeight: 500 }}>{r.pkg}</td>
                  <td style={{ padding: "12px 18px", color: "#374151" }}>{r.price}</td>
                  <td style={{ padding: "12px 18px", color: "#374151" }}>{r.adoption}</td>
                  <td style={{ padding: "12px 18px", color: "#008285", fontWeight: 600 }}>{r.arr}</td>
                </tr>
              ))}
              <tr style={{ background: "#f0fafa", borderTop: "2px solid #008285" }}>
                <td colSpan={3} style={{ padding: "12px 18px", color: "#111827", fontWeight: 700, ...sans }}>Total Year 1 Blended</td>
                <td style={{ padding: "12px 18px", color: "#008285", fontWeight: 700, fontSize: 15, ...sans }}>$6.4M – $10.8M</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...sans, fontSize: 11.5, color: "#9ca3af", marginTop: 10, lineHeight: 1.6 }}>
          Conservative estimates. Pricing assumes mid-market to large-cap clients. Per-event and usage-based models could
          supplement subscription revenue. Premium add-ons represent additional upsell.
        </p>
      </section>

      {/* PHASED ROADMAP */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Phased Roadmap</SectionLabel>
        <div className="phase-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {phases.map((phase) => (
            <div key={phase.label} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ background: phase.color, padding: "12px 16px" }}>
                <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginBottom: 3 }}>
                  {phase.label}
                </div>
                <div style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>{phase.title}</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {phase.items.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.color, flexShrink: 0, marginTop: 7 }} />
                    <p style={{ ...serif, fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITIVE LANDSCAPE */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Competitive Landscape &amp; OE Moat</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, ...sans, fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#f59e0b" }}>
                <th style={{ padding: "11px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700, width: "18%" }}>Competitor</th>
                <th style={{ padding: "11px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700, width: "42%" }}>What They Offer</th>
                <th style={{ padding: "11px 18px", textAlign: "left" as const, color: "#fff", fontWeight: 700 }}>Where OE Wins</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={c.name} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 18px", color: "#111827", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "12px 18px", color: "#6b7280" }}>{c.offer}</td>
                  <td style={{ padding: "12px 18px", color: "#374151" }}>{c.win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ border: "1px solid #fde68a", borderRadius: 8, padding: "16px 20px", background: "#fffbeb" }}>
          <p style={{ ...serif, fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            <strong>OE&apos;s Defensible Moat:</strong> OpenExchange is the only platform combining live event hosting,
            an existing client content library, AI-powered content repurposing, and retail investor engagement in a single
            ecosystem. Competitors would need to build or acquire multiple capabilities to match this offering — and OE&apos;s
            established client relationships create a significant first-mover advantage.
          </p>
        </div>
      </section>

      {/* IRO PULSE SURVEY */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>IRO Pulse Survey</SectionLabel>
        <p style={{ ...sans, fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>
          3 questions to distribute via sales team — Typeform or email.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          {surveyQs.map((item) => (
            <div key={item.n} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "18px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#008285", background: "#f0fafa", borderRadius: 6, padding: "4px 10px", flexShrink: 0 }}>
                {item.n}
              </div>
              <p style={{ ...serif, fontSize: 15.5, color: "#111827", lineHeight: 1.75, margin: 0 }}>{item.q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEXT STEPS */}
      <section style={{ marginBottom: 48 }}>
        <SectionLabel>Next Steps</SectionLabel>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "22px 26px" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {nextSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 16, height: 16, border: "2px solid #d1d5db", borderRadius: 3, flexShrink: 0, marginTop: 3 }} />
                <p style={{ ...serif, fontSize: 15.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...sans, fontSize: 10.5, color: "#c0c0c0", letterSpacing: "0.04em" }}>
          Open Exchange · Strategic Solutions Engineering · Confidential · March 2026
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
