'use client';
import { useState } from 'react';
import type { PipelineRow } from '@/data/pipelines';

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (rows: PipelineRow[]) => void;
}

function parseImportText(text: string): PipelineRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (!lines.length) return [];
  const sep = lines[0].includes('\t') ? '\t' : ',';
  const firstLower = lines[0].toLowerCase();
  const hasHeader = firstLower.includes('firm') || firstLower.includes('company') || firstLower.includes('contact') || firstLower.includes('name');
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const parsed: PipelineRow[] = [];
  for (const line of dataLines) {
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    const firm = cols[0] || '';
    const contact = cols[1] || '';
    const title = cols[2] || '';
    const email = cols[3] && cols[3].includes('@') ? cols[3] : undefined;
    const by = cols[4] || '—';
    if (!firm) continue;
    parsed.push({ firm, group: 'Import', contact, title, score: 0, status: 'none', li: false, by, lastAct: '—', email });
  }
  return parsed;
}

export default function ImportModal({ open, onClose, onImport }: Props) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<PipelineRow[]>([]);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleTextChange = (value: string) => {
    setText(value);
    setError('');
    setPreview(parseImportText(value));
  };

  const handleConfirm = () => {
    if (!preview.length) return;
    onImport(preview);
    setText('');
    setPreview([]);
    setError('');
    onClose();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box" style={{ background: 'var(--surface)', borderRadius: 12, width: '100%', maxWidth: 560, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Import contacts</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Paste from Excel / Google Sheets / CSV</div>
          </div>
          <button onClick={onClose} className="close-btn" style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', fontSize: 16, cursor: 'pointer', color: 'var(--muted)' }}>×</button>
        </div>

        <div style={{ background: '#f9f8f6', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Column order:</strong> Firm · Contact Name · Title · Email · Owner<br />
          First row can be a header — it will be auto-detected and skipped.
        </div>

        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={"Firm\tContact\tTitle\tEmail\tOwner\nGatehouse\tJane Smith\tVP Comms\tjane@gatehouse.com\tCara"}
          style={{ width: '100%', minHeight: 160, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', resize: 'vertical', boxSizing: 'border-box' }}
        />

        {error && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</div>}

        {preview.length > 0 && (
          <div style={{ marginTop: 12, background: 'var(--teal-light)', border: '1px solid var(--teal-mid)', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, marginBottom: 6 }}>
              {preview.length} contact{preview.length !== 1 ? 's' : ''} ready to import
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--teal)', opacity: 0.8 }}>
              {preview.slice(0, 3).map(r => `${r.contact || '(no name)'} @ ${r.firm}`).join(' · ')}
              {preview.length > 3 ? ` · +${preview.length - 3} more` : ''}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!preview.length}
            style={{ padding: '8px 20px', background: preview.length ? 'var(--teal)' : '#ccc', color: '#fff', border: 'none', borderRadius: 7, cursor: preview.length ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600 }}
          >
            Import {preview.length > 0 ? `${preview.length} contacts` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
