'use client';
import type { PipelineRow } from '@/data/pipelines';
import { isOeCustomer } from '@/data/oe-customers';
import { scoreColor, scoreBg, statusBadge } from './shared';

interface Props {
  sortedRows: PipelineRow[];
  allRows: PipelineRow[];
  selectedRowIdx: number;
  rescoringIdx: Set<number>;
  ownerFilter: string | null;
  minScore: number;
  sortCol: string | null;
  sortDir: 'asc' | 'desc';
  onOpenContact: (row: PipelineRow, idx: number) => void;
  onCycleStatus: (e: React.MouseEvent, globalIdx: number) => void;
  onSetOwnerFilter: (owner: string | null) => void;
  onSort: (col: string) => void;
  onOpenImport: () => void;
  onExportCsv: () => void;
}

function SortHeader({ col, label, sortCol, sortDir, onSort }: { col: string; label: string; sortCol: string | null; sortDir: string; onSort: (col: string) => void }) {
  return (
    <button
      onClick={() => onSort(col)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: sortCol === col ? 'var(--teal)' : 'var(--light)',
        display: 'flex', alignItems: 'center', gap: 3, padding: 0,
      }}
    >
      {label}
      <span style={{ fontSize: 9 }}>{sortCol === col ? (sortDir === 'asc' ? '\u2191' : '\u2193') : '\u2195'}</span>
    </button>
  );
}

export default function ContactsTable({
  sortedRows, allRows, selectedRowIdx, rescoringIdx, ownerFilter, minScore,
  sortCol, sortDir, onOpenContact, onCycleStatus, onSetOwnerFilter, onSort, onOpenImport, onExportCsv,
}: Props) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 80px 100px 70px 80px 80px',
        padding: '10px 16px',
        background: '#f9f8f6',
        borderBottom: '1px solid var(--border)',
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--light)',
      }}>
        <SortHeader col="firm" label="Firm" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <span>Contact</span>
        <span>Title</span>
        <SortHeader col="score" label="Score" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <SortHeader col="status" label="Status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <span>LinkedIn</span>
        <span>Owner</span>
        <SortHeader col="lastAct" label="Last activity" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
      </div>

      {/* Empty state */}
      {sortedRows.length === 0 && (
        <div style={{ padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No contacts yet</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Import from a spreadsheet or paste in contacts to get started.
          </div>
          <button
            onClick={onOpenImport}
            style={{ fontSize: 13, padding: '8px 20px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >
            + Import contacts
          </button>
        </div>
      )}

      {/* Rows */}
      {sortedRows.map((row, idx) => {
        const badge = statusBadge(row.status);
        const globalIdx = allRows.indexOf(row);
        const isRescoring = rescoringIdx.has(globalIdx);
        return (
          <div
            key={idx}
            className="bd-row"
            onClick={() => !row.dim && onOpenContact(row, idx)}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 80px 100px 70px 80px 80px',
              padding: '13px 16px',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
              opacity: row.dim ? 0.45 : 1,
              transition: 'background 0.1s',
              background: isRescoring ? 'rgba(0,122,125,0.05)' : selectedRowIdx === idx ? '#f9f8f6' : 'transparent',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                {row.firm}
                {isOeCustomer(row.firm) && (
                  <span style={{
                    fontSize: 8.5, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                    background: '#fef2f2', color: '#dc2626', letterSpacing: '0.04em',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>CUSTOMER</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 1 }}>{row.group}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: row.dim ? 400 : 500 }}>{row.contact}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.title}</div>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                color: scoreColor(row.score),
                background: isRescoring ? 'rgba(0,122,125,0.15)' : scoreBg(row.score),
                padding: '3px 8px', borderRadius: 6, transition: 'background 0.3s',
              }}>
                {isRescoring ? (
                  <svg className="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                ) : row.score}
              </span>
            </div>
            <div className="status-cell" onClick={(e) => !row.dim && onCycleStatus(e, globalIdx)} title="Click to update status">
              {row.status !== 'none' ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: badge.bg, color: badge.color }}>{badge.label}</span>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--light)' }}>—</span>
              )}
            </div>
            <div>
              {row.li ? (
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8', letterSpacing: '0.04em' }}>in</span>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--light)' }}>—</span>
              )}
            </div>
            <div>
              <span
                className="owner-cell"
                onClick={(e) => { e.stopPropagation(); onSetOwnerFilter(ownerFilter === row.by ? null : row.by); }}
                title="Filter by owner"
                style={{
                  fontSize: 12,
                  color: ownerFilter === row.by ? 'var(--teal)' : (row.by === '—' ? 'var(--light)' : 'var(--muted)'),
                  fontWeight: ownerFilter === row.by ? 600 : (row.by !== '—' ? 500 : 400),
                  cursor: row.by !== '—' ? 'pointer' : 'default',
                }}
              >{row.by}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: row.lastAct === '—' ? 'var(--light)' : 'var(--muted)' }}>{row.lastAct}</div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ padding: '10px 16px', fontSize: 11.5, color: 'var(--light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Showing {sortedRows.length} of {allRows.length} · score ≥ {minScore}</span>
        <span onClick={onExportCsv} style={{ color: 'var(--teal)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Export CSV →</span>
      </div>
    </div>
  );
}
