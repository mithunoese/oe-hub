'use client';
import type { AuditEntry } from './shared';

interface Props {
  open: boolean;
  onClose: () => void;
  entries: AuditEntry[];
}

export default function AuditLogPanel({ open, onClose, entries }: Props) {
  return (
    <div style={{
      position: 'fixed',
      top: 'var(--nav-h)',
      right: 0,
      bottom: 0,
      width: 380,
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      zIndex: 498,
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(0.32,0,0,1)',
      boxShadow: open ? '-8px 0 40px rgba(0,0,0,0.1)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0 20px',
        height: 52,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Audit Log</div>
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer',
            fontSize: 15, color: 'var(--muted)', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {entries.length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--light)', textAlign: 'center', padding: '40px 0' }}>
            No activity yet
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={i} style={{
            paddingBottom: 14, marginBottom: 14,
            borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{entry.action}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--light)' }}>{entry.by}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 3 }}>{entry.detail}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--light)' }}>{entry.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
