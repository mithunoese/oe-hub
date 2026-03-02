import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

function HomeCard({
  href,
  title,
  description,
  featured,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      style={{
        border: `2px solid ${featured ? "#008285" : "#111827"}`,
        borderRadius: 14,
        padding: "40px 32px",
        minHeight: 180,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease",
      }}
    >
      {badge && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#008285",
            background: "#f0fafa",
            padding: "4px 12px",
            borderRadius: 20,
            alignSelf: "flex-start",
            marginBottom: 14,
          }}
        >
          {badge}
        </span>
      )}
      <h2 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
        {title}
      </h2>
      <p style={{ ...serif, fontSize: 14, color: "#9ca3af", marginTop: 12, lineHeight: 1.6, maxWidth: 340 }}>
        {description}
      </p>
      <span style={{ fontSize: 20, color: "#d1d5db", marginTop: 20 }}>→</span>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#c0c0c0",
          marginBottom: 16,
        }}
      >
        OPEN EXCHANGE
      </p>
      <h1
        style={{
          ...serif,
          fontSize: 44,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginBottom: 16,
        }}
      >
        OE — SE Hub.
      </h1>
      <p style={{ ...serif, fontSize: 16.5, color: "#9ca3af", lineHeight: 1.75, maxWidth: 500 }}>
        Projects, reports, agents, and resources for the team.
      </p>
      <div
        style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 20, marginBottom: 48 }}
      />

      <div style={{ display: "flex", gap: 20, marginBottom: 64, flexWrap: "wrap" }}>
        <HomeCard
          href="/projects"
          title="Projects"
          description="Sales org, migration tools, and active builds."
        />
        <HomeCard
          href="/reports"
          title="Reports"
          description="Weekly updates, progress tracking, and notes."
        />
      </div>
      <HomeCard
        href="/agents"
        title="Agents"
        description="AI-powered tools for prospecting, migration, reporting, and more."
        featured
        badge="1 Active"
      />
    </>
  );
}
