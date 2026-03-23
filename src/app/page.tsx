import Link from "next/link";

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
        background: "var(--surface)",
        border: `1.5px solid ${featured ? "var(--teal)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "28px 28px",
        minHeight: 160,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {badge && (
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--teal)",
          background: "var(--teal-light)",
          padding: "3px 10px",
          borderRadius: 20,
          alignSelf: "flex-start",
          marginBottom: 14,
        }}>
          {badge}
        </span>
      )}
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.2, marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 340 }}>
        {description}
      </p>
      <span style={{ fontSize: 18, color: "var(--light)", marginTop: "auto", paddingTop: 16 }}>→</span>
    </Link>
  );
}

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 12 }}>
          Open Exchange
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
          OE Hub
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, maxWidth: 480 }}>
          Projects, reports, agents, and resources for the team.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
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
        badge="2 Active"
      />
    </main>
  );
}
