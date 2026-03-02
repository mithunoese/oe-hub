import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OE — SE Hub",
  description: "Projects, reports, agents, and resources for the team.",
};

function Nav() {
  const linkStyle = { fontSize: 13, color: "#6b7280" };
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "14px 24px",
        display: "flex",
        gap: 32,
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}
      >
        OE — SE Hub
      </Link>
      <div style={{ display: "flex", gap: 24 }}>
        <Link href="/reports" style={linkStyle}>Reports</Link>
        <Link href="/projects" style={linkStyle}>Projects</Link>
        <Link href="/agents" style={linkStyle}>Agents</Link>
      </div>
    </nav>
  );
}

function Footer({ right }: { right?: string }) {
  return (
    <footer
      style={{
        borderTop: "1px solid #f0f0f0",
        paddingTop: 20,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10.5,
        color: "#c0c0c0",
        marginTop: 64,
      }}
    >
      <span>Open Exchange · Confidential</span>
      <span>{right || "by Mithun Manjunatha"}</span>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "56px 24px 96px" }}>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
