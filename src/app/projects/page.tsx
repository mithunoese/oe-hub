import Link from "next/link";

const serif = { fontFamily: "Georgia, serif" };

const projects = [
  {
    slug: "oe-value-calculator",
    title: "OE Value Calculator",
    description:
      "Interactive ROI calculator — compare DIY event costs vs OpenExchange platform with 3-year projections and per-product pricing.",
    badge: "Platform",
  },
  {
    slug: "sales-org",
    title: "Sales Org Teach-In",
    description:
      "Interactive org chart for the revenue team — names, roles, bios, and context for every person across all 8 teams. Editable inline.",
    badge: "For Amelia & Andrew",
  },
  {
    slug: "video-migration",
    title: "Video Migration Tool",
    description:
      "Kaltura to Zoom migration pipeline — bulk video transfer with progress tracking and automated delivery.",
    badge: "Engineering",
  },
  {
    slug: "operator-dashboard",
    title: "Operator Command Center",
    description:
      "Real-time operator scheduling, device health, and staffing across all regions — replacing the Outlook calendar Tetris.",
    badge: "For Carlos",
  },
];

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: "24px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div>
        <h2
          style={{
            ...serif,
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          {project.title}
        </h2>
        <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
          {project.description}
        </p>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#008285",
          background: "#f0fafa",
          padding: "4px 10px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {project.badge}
      </span>
    </Link>
  );
}

export default function Projects() {
  return (
    <>
      <h1
        style={{
          ...serif,
          fontSize: 36,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
        }}
      >
        Projects
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65, marginTop: 8 }}>
        Active work in progress.
      </p>
      <div
        style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16, marginBottom: 32 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
