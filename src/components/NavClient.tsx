'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavClient() {
  const pathname = usePathname();

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-h)',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    padding: '0 28px',
  };

  const linkBase: React.CSSProperties = {
    fontSize: 13.5,
    fontWeight: 500,
    color: 'var(--muted)',
    padding: '0 14px',
    height: 'var(--nav-h)',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
  };

  const linkActive: React.CSSProperties = {
    ...linkBase,
    color: 'var(--teal)',
    borderBottomColor: 'var(--teal)',
  };

  const isActive = (href: string) => {
    if (href === '/reports') return pathname.startsWith('/reports');
    if (href === '/projects') return pathname.startsWith('/projects');
    if (href === '/agents') return pathname.startsWith('/agents');
    return false;
  };

  return (
    <nav style={navStyle}>
      {/* OE Logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1,
        gap: 1,
        marginRight: 32,
        cursor: 'default',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#1a1a1a',
          }}>OPEN</span>
          <span style={{
            width: 22,
            height: 1.5,
            background: '#007a7d',
            display: 'inline-block',
            marginLeft: 5,
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.14em',
          color: '#1a1a1a',
        }}>EXCHANGE</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/reports" style={isActive('/reports') ? linkActive : linkBase}>
          Reports
        </Link>
        <Link href="/projects" style={isActive('/projects') ? linkActive : linkBase}>
          Projects
        </Link>
        <Link href="/agents" style={isActive('/agents') ? linkActive : linkBase}>
          Agents
        </Link>
      </div>
    </nav>
  );
}
