'use client';
import { useState } from 'react';
import type { PipelineRow, Pipeline } from '@/data/pipelines';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreatePipeline: (pipeline: Pipeline, rows: PipelineRow[]) => void;
  nextId: number;
}

export default function AddPipelineModal({ open, onClose, onCreatePipeline, nextId }: Props) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setEventTypes([]);
    setRoles([]);
    setName('');
    setIndustry('');
    setSize('');
    setError('');
  };

  const handleGenerate = async () => {
    if (!name) return;
    setGenerating(true);
    setError('');
    try {
      const seeds = ['Intuit', 'Siena AI', 'Gibson Dunn'];
      const criteria = [industry, size,
        eventTypes.length > 0 ? `Event types: ${eventTypes.join(', ')}` : '',
        roles.length > 0 ? `Target roles: ${roles.join(', ')}` : '',
      ].filter(Boolean).join('. ');

      const res = await fetch('/api/prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seeds, criteria, pipelineName: name }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate prospects');
      const data = await res.json();

      const newRows: PipelineRow[] = (data.rows || []).map((r: PipelineRow) => ({
        firm: r.firm || '—', group: r.group || industry || 'Prospect',
        contact: r.contact || '—', title: r.title || '—',
        score: typeof r.score === 'number' ? r.score : 0,
        status: 'none' as const, li: r.li ?? false, by: '—', lastAct: 'AI generated',
      }));

      const newPipeline: Pipeline = {
        id: nextId, name, count: newRows.length,
        agentTitle: `Context Agent — ${name}`,
        chips: [industry, size].filter(Boolean),
        stats: [
          { label: 'Total firms', val: String(newRows.length) },
          { label: 'Score >= 65', val: '0', hi: true },
          { label: 'LinkedIn verified', val: '0' },
          { label: 'Emails drafted', val: '0' },
          { label: 'Sent', val: '0' },
        ],
        eyebrow: 'AI-Generated Pipeline', title: name,
        sub: `AI-identified prospects for ${name}. Run Update to score with ICP.`,
        tableFooter: '', rows: newRows,
      };

      onCreatePipeline(newPipeline, newRows);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  const toggleChip = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter(t => t !== val) : [...list, val]);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div className="modal-box" style={{ background: 'var(--surface)', borderRadius: 14, padding: '28px 32px', width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>New Pipeline</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Agent will generate contacts matching your ICP</div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--light)', padding: 0, lineHeight: 1 }}>x</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Pipeline name</label>
            <input type="text" placeholder="e.g. Healthcare Enterprise Q3" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select...</option>
                <option>Corporate Communications</option>
                <option>Healthcare / Pharma</option>
                <option>Technology / SaaS</option>
                <option>Financial Services</option>
                <option>Professional Services</option>
                <option>Media &amp; Entertainment</option>
                <option>Energy &amp; Utilities</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Company size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select...</option>
                <option>50-200</option>
                <option>200-500</option>
                <option>500-2000</option>
                <option>2000+</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 7 }}>Event types</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Investor Days', 'Earnings Calls', 'Town Halls', 'Webcasts', 'Hybrid Events'].map((type) => {
                const active = eventTypes.includes(type);
                return (
                  <button key={type} type="button" onClick={() => toggleChip(eventTypes, setEventTypes, type)}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: '4px 11px', borderRadius: 20,
                      border: '1px solid ' + (active ? 'var(--teal-mid)' : 'var(--border)'),
                      background: active ? 'var(--teal-light)' : 'var(--surface)',
                      color: active ? 'var(--teal)' : 'var(--muted)', cursor: 'pointer',
                    }}
                  >{type}</button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 7 }}>Target roles</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['VP Communications', 'Head of Events', 'Director IR', 'CMO', 'VP Marketing'].map((role) => {
                const active = roles.includes(role);
                return (
                  <button key={role} type="button" onClick={() => toggleChip(roles, setRoles, role)}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: '4px 11px', borderRadius: 20,
                      border: '1px solid ' + (active ? 'var(--teal-mid)' : 'var(--border)'),
                      background: active ? 'var(--teal-light)' : 'var(--surface)',
                      color: active ? 'var(--teal)' : 'var(--muted)', cursor: 'pointer',
                    }}
                  >{role}</button>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: 7 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={handleClose} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>Cancel</button>
          <button
            onClick={handleGenerate}
            disabled={!name || generating}
            className="btn-teal"
            style={{
              padding: '9px 22px',
              background: !name ? '#ccc' : generating ? 'var(--teal-mid)' : 'var(--teal)',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: !name || generating ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {generating && (
              <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
            )}
            {generating ? 'Generating...' : 'Generate pipeline'}
          </button>
        </div>
      </div>
    </div>
  );
}
