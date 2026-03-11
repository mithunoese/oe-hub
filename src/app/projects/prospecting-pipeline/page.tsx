import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };
const sans = { fontFamily: "system-ui, sans-serif" };

const tools = [
  {
    href: "/agents/prospecting",
    step: "01",
    title: "Prospecting Agent",
    description:
      "Run the AI to find 12 lookalike companies — with company size, event types, HQ, and who to contact at each. Generates a dated report.",
    badge: "Agent",
    badgeColor: "#7c3aed",
    badgeBg: "#f5f3ff",
    cta: "Run Agent →",
  },
  {
    href: "/reports/prospecting",
    step: "02",
    title: "Prospecting Reports",
    description:
      "Browse AI-generated company lookalikes for the Zoom Events pipeline. Each report includes a suggested contact, outreach angle, and one-click email drafting.",
    badge: "Reports",
    badgeColor: "#008285",
    badgeBg: "#f0fafa",
    cta: "View Reports →",
  },
  {
    href: "/agents/outreach",
    step: "03",
    title: "Outreach Queue",
    description:
      "Drafted cold emails from the Prospecting Agent — open directly in Outlook, copy subject or body, track send status.",
    badge: "Queue",
    badgeColor: "#0072c6",
    badgeBg: "#eff6ff",
    cta: "Open Queue →",
  },
];

export default function ProspectingPipeline() {
  return (
    <>
      <Link
        href="/projects"
        style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24, display: "inline-block" }}
      >
        ← Back to Projects
      </Link>

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
        Prospecting Pipeline
      </h1>
      <span
        style={{
          ...sans,
          fontSize: 10,
          fontWeight: 600,
          color: "#7c3aed",
          background: "#f5f3ff",
          padding: "4px 10px",
          borderRadius: 20,
        }}
      >
        For Kristen
      </span>

      <div
        style={{
          width: 40,
          height: 3,
          background: "#111827",
          borderRadius: 2,
          marginTop: 16,
          marginBottom: 20,
        }}
      />

      <p
        style={{
          ...serif,
          fontSize: 15,
          color: "#6b7280",
          lineHeight: 1.75,
          marginBottom: 36,
          maxWidth: 560,
        }}
      >
        Full AI-powered prospecting workflow — from finding lookalike companies to drafting
        personalized cold emails and sending them directly from Outlook.
      </p>

      {/* Step-by-step tool cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                padding: "24px 28px",
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                cursor: "pointer",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  ...sans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#d1d5db",
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                  paddingTop: 2,
                  minWidth: 24,
                }}
              >
                {tool.step}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <h2
                    style={{
                      ...serif,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111827",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {tool.title}
                  </h2>
                  <span
                    style={{
                      ...sans,
                      fontSize: 10,
                      fontWeight: 600,
                      color: tool.badgeColor,
                      background: tool.badgeBg,
                      padding: "3px 9px",
                      borderRadius: 20,
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>
                <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
                  {tool.description}
                </p>
              </div>

              {/* CTA */}
              <span
                style={{
                  ...sans,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9ca3af",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  paddingTop: 4,
                }}
              >
                {tool.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Connector arrows */}
      <style>{`
        a:hover > div { border-color: #e0f0f0 !important; }
      `}</style>
    </>
  );
}
