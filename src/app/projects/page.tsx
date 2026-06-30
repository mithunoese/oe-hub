import Link from "next/link";

type Project = {
  slug?: string;
  href?: string;
  external?: boolean;
  title: string;
  description: string;
  badge: string;
  status?: "active" | "coming-soon" | "live";
};

type Category = {
  label: string;
  projects: Project[];
};

const categories: Category[] = [
  {
    label: "BD",
    projects: [
      {
        slug: "bd-pipeline",
        title: "BD Pipeline",
        description:
          "AI-scored contact pipeline for Corp Comms outreach — ASCO 2026 and Zoom partnerships. Brief contacts, generate follow-ups, and track pipeline state.",
        badge: "Active",
        status: "active",
      },
    ],
  },
  {
    label: "Platform",
    projects: [
      {
        slug: "oe-value-calculator",
        title: "OE Value Calculator",
        description:
          "Interactive ROI calculator — compare DIY event costs vs OpenExchange platform with 3-year projections and per-product pricing.",
        badge: "Platform",
        status: "live",
      },
    ],
  },
  {
    label: "Revenue Team",
    projects: [
      {
        slug: "sales-org",
        title: "Sales Org Teach-In",
        description:
          "Interactive org chart for the revenue team — names, roles, bios, and context for every person across all 8 teams. Editable inline.",
        badge: "For Emilia & Andrew",
        status: "live",
      },
    ],
  },
  {
    label: "SE & Strategy",
    projects: [
      {
        slug: "se-ideas",
        title: "Retail IR Product Concept",
        description:
          "Two-tier product proposal for retail investor engagement — content & distribution engine plus retail intelligence layer. Includes competitive matrix, revenue model ($6–11M ARR TAM), and phased roadmap.",
        badge: "For Emilia & Mark",
        status: "live",
      },
    ],
  },
  {
    label: "Live Demos",
    projects: [
      {
        href: "https://oe-zcc-support-demo.vercel.app/hero-splash.html",
        external: true,
        title: "ZCC Support Demo",
        description:
          "Live Zoom Contact Center support demo — real-time expert access for events, webinars, and technical support.",
        badge: "Live",
        status: "live",
      },
      {
        href: "https://oe-migration-site.vercel.app/",
        external: true,
        title: "Migration Landing Site",
        description:
          "Customer-facing site for OE's enterprise video migration service — Kaltura, Panopto, and Brightcove to Zoom.",
        badge: "Live",
        status: "live",
      },
    ],
  },
  {
    label: "Fun",
    projects: [
      {
        href: "/tetris",
        title: "Tetris",
        description:
          "Classic Tetris in black and white. Arrow keys to move, space to drop, P to pause.",
        badge: "Game",
        status: "live",
      },
    ],
  },
  {
    label: "Engineering",
    projects: [
      {
        slug: "video-migration",
        title: "Video Migration Tool",
        description:
          "Kaltura to Zoom migration pipeline — bulk video transfer with progress tracking and automated delivery.",
        badge: "Engineering",
        status: "live",
      },
      {
        href: "https://oe-video-editor.vercel.app",
        external: true,
        title: "OE Video Editor",
        description:
          "AI-powered earnings call video editor — upload Zoom recordings and transcripts, agent auto-edits the first pass, QC panel shows transcript diff with confidence score. Outputs MP4 and Premiere XML.",
        badge: "For Casey",
        status: "live",
      },
      {
        slug: "operator-dashboard",
        title: "Operator Command Center",
        description:
          "Real-time operator scheduling, device health, and staffing across all regions — replacing the Outlook calendar Tetris.",
        badge: "For Carlos",
        status: "live",
      },
    ],
  },
];

const statusDot: Record<string, string> = {
  active: "#16a34a",
  live: "#007a7d",
  "coming-soon": "#9ca3af",
};

function ProjectCard({ project }: { project: Project }) {
  const href = project.external
    ? project.href!
    : project.href ?? `/projects/${project.slug}`;

  const cardContent = (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        opacity: project.status === "coming-soon" ? 0.65 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusDot[project.status ?? "live"],
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
            {project.title}
          </span>
          {project.external && (
            <span style={{ fontSize: 11, color: "var(--light)" }}>↗</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, paddingLeft: 13 }}>
          {project.description}
        </p>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--teal)",
          background: "var(--teal-light)",
          padding: "3px 9px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {project.badge}
      </span>
    </div>
  );

  if (project.external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} style={{ display: "block" }}>
      {cardContent}
    </Link>
  );
}

export default function Projects() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 8 }}>
          Projects
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 6 }}>
          Active Projects
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          Tools, pipelines, and builds across the team.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {categories.map((cat) => (
          <div key={cat.label}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--light)",
                marginBottom: 10,
                paddingBottom: 8,
                borderBottom: "1px solid var(--border)",
              }}
            >
              {cat.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cat.projects.map((p) => (
                <ProjectCard key={p.slug ?? p.href} project={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
