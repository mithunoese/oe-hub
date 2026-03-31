'use client';
import type { PipelineRow, Pipeline } from '@/data/pipelines';

interface Props {
  pipelineRows: Record<number, PipelineRow[]>;
  pipelines: Pipeline[];
}

export default function AnalyticsSection({ pipelineRows, pipelines }: Props) {
  const allRows = Object.values(pipelineRows).flat().filter((r) => !r.dim);
  const totalContacts = allRows.length;
  const totalEmailed = allRows.filter((r) => r.status === 'emailed' || r.status === 'replied').length;
  const totalReplied = allRows.filter((r) => r.status === 'replied').length;
  const replyRate = totalEmailed > 0 ? Math.round((totalReplied / totalEmailed) * 100) : 0;
  const aes = ['Cara', 'Kristen', 'Peter', 'Jacob', 'Sean', 'Kaley', 'Michelle', 'Garret', 'CJ'];
  const activeAes = aes.filter(ae => allRows.some(r => r.by === ae));
  const maxEmails = Math.max(...activeAes.map(ae => allRows.filter(r => r.by === ae && (r.status === 'emailed' || r.status === 'replied')).length), 1);

  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 16 }}>
        Pipeline Analytics
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total contacts', val: totalContacts, sub: 'across all pipelines' },
          { label: 'Emailed', val: totalEmailed, sub: `${Math.round((totalEmailed / Math.max(totalContacts, 1)) * 100)}% of total` },
          { label: 'Replied', val: totalReplied, sub: 'responses received' },
          { label: 'Reply rate', val: `${replyRate}%`, sub: 'of emails sent' },
        ].map(({ label, val, sub }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--light)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline + AE breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', marginBottom: 12 }}>By pipeline</div>
          {pipelines.map((p, i) => {
            const rows = (pipelineRows[i] || []).filter(r => !r.dim);
            const emailed = rows.filter(r => r.status === 'emailed' || r.status === 'replied').length;
            const replied = rows.filter(r => r.status === 'replied').length;
            const pct = rows.length > 0 ? Math.round((emailed / rows.length) * 100) : 0;
            return (
              <div key={p.name} style={{ marginBottom: i < pipelines.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{p.name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{emailed} emailed · {replied} replied</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--teal)', borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', marginBottom: 12 }}>By AE</div>
          {activeAes.map((ae, i) => {
            const sent = allRows.filter(r => r.by === ae && (r.status === 'emailed' || r.status === 'replied')).length;
            const replied = allRows.filter(r => r.by === ae && r.status === 'replied').length;
            return (
              <div key={ae} style={{ marginBottom: i < activeAes.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{ae}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{sent} sent · {replied} replied</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((sent / maxEmails) * 100)}%`, background: 'var(--teal)', borderRadius: 2, opacity: 0.75 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
