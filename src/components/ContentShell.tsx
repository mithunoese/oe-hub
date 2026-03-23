'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

function Nav() {
  const pathname = usePathname();
  const linkStyle = (href: string) => ({
    fontSize: 13,
    color: pathname === href ? '#111827' : '#6b7280',
    fontWeight: pathname === href ? 600 : 400,
  });
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid #f0f0f0",
      padding: "0 32px",
      display: "flex", gap: 32, alignItems: "center",
      height: "var(--nav-h)",
    }}>
      <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
        OE Hub
      </Link>
      <div style={{ display: "flex", gap: 20 }}>
        <Link href="/projects" style={linkStyle('/projects')}>Projects</Link>
        <Link href="/reports" style={linkStyle('/reports')}>Reports</Link>
        <Link href="/agents" style={linkStyle('/agents')}>Agents</Link>
      </div>
    </nav>
  );
}

export default function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
