'use client';

import { useState } from 'react';
import { pipelines } from '@/data/pipelines';

export default function AgentsPage() {
  const [icpRunState, setIcpRunState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [icpProgress, setIcpProgress] = useState({ scored: 0, total: 0, highFit: 0 });

  const runIcpAgent = async () => {
    setIcpRunState('running');
    setIcpProgress({ scored: 0, total: 0, highFit: 0 });

    try {
      // Load pipeline state from DB
      const stateRes = await fetch('/api/pipeline-state');
      const { rows: pipelineRows } = await stateRes.json();

      // Flatten all contacts across all pipelines
      type PipelineRow = { firm: string; contact: string; title: string; li: boolean; score: number; [key: string]: unknown };
      const allContacts: Array<{ pipelineIdx: number; rowIdx: number; row: PipelineRow }> = [];

      for (let pi = 0; pi < pipelines.length; pi++) {
        const rows: PipelineRow[] = pipelineRows?.[pi] || pipelines[pi].rows;
        rows.forEach((row: PipelineRow, ri: number) => {
          if (!row.dim) allContacts.push({ pipelineIdx: pi, rowIdx: ri, row });
        });
      }

      setIcpProgress({ scored: 0, total: allContacts.length, highFit: 0 });

      // Score in batches of 5
      const updatedRows: Record<number, PipelineRow[]> = {};
      for (let pi = 0; pi < pipelines.length; pi++) {
        updatedRows[pi] = [...(pipelineRows?.[pi] || pipelines[pi].rows)];
      }

      let scored = 0;
      let highFit = 0;
      const BATCH = 5;

      for (let i = 0; i < allContacts.length; i += BATCH) {
        const batch = allContacts.slice(i, i + BATCH);
        await Promise.all(batch.map(async ({ pipelineIdx, rowIdx, row }) => {
          try {
            const res = await fetch('/api/ai/score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firm: row.firm,
                contact: row.contact,
                title: row.title,
                li: row.li,
                pipelineName: pipelines[pipelineIdx].name,
              }),
            });
            const data = await res.json();
            if (res.ok && data.score) {
              updatedRows[pipelineIdx][rowIdx] = { ...updatedRows[pipelineIdx][rowIdx], score: data.score };
              if (data.score >= 75) highFit++;
            }
          } catch { /* skip failed */ }
          scored++;
          setIcpProgress(p => ({ ...p, scored, highFit }));
        }));
      }

      // Save updated scores to DB
      await fetch('/api/pipeline-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: updatedRows }),
      });

      setIcpProgress({ scored, total: allContacts.length, highFit });
      setIcpRunState('done');
    } catch {
      setIcpRunState('error');
    }
  };

  const agents = [
    {
      name: 'ICP Scoring Agent',
      description: 'Scores all contacts in your pipelines against the OpenExchange ICP using Claude AI — firmographic fit, event volume, tech stack, LinkedIn, and buying intent.',
      accent: 'var(--teal)',
      accentBg: 'var(--teal-light)',
      status: 'active',
      statusLabel: 'Active',
      pulse: true,
      tags: ['Firmographic', 'Intent', 'LinkedIn'],
      action: (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          {icpRunState === 'idle' && (
            <button
              onClick={runIcpAgent}
              style={{ fontSize: 12.5, padding: '7px 16px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600 }}
            >
              ✦ Run Agent
            </button>
          )}
          {icpRunState === 'running' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
              <span style={{ fontSize: 12.5, color: 'var(--teal)', fontWeight: 500 }}>
                Scoring {icpProgress.scored} / {icpProgress.total} contacts…
              </span>
            </div>
          )}
          {icpRunState === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, color: 'var(--teal)', fontWeight: 600 }}>
                ✓ {icpProgress.scored} scored · {icpProgress.highFit} high-fit
              </span>
              <button
                onClick={runIcpAgent}
                style={{ fontSize: 11.5, padding: '4px 12px', background: 'transparent', color: 'var(--light)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}
              >
                Re-run
              </button>
            </div>
          )}
          {icpRunState === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, color: '#ef4444' }}>Run failed</span>
              <button onClick={runIcpAgent} style={{ fontSize: 11.5, padding: '3px 10px', background: 'transparent', color: 'var(--light)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>Retry</button>
            </div>
          )}
        </div>
      ),
      stats: icpRunState === 'done'
        ? [
            { label: 'Contacts scored', val: String(icpProgress.scored) },
            { label: 'High-fit (≥75)', val: String(icpProgress.highFit) },
            { label: 'Last run', val: 'Just now' },
          ]
        : [
            { label: 'Contacts scored', val: icpRunState === 'running' ? String(icpProgress.scored) : '—' },
            { label: 'High-fit (≥75)', val: icpRunState === 'running' ? String(icpProgress.highFit) : '—' },
            { label: 'Status', val: icpRunState === 'running' ? 'Running…' : 'Ready' },
          ],
    },
    {
      name: 'Email Draft Agent',
      description: 'Generates personalized outreach emails using contact context, ICP score, and recent LinkedIn activity. Open any contact → Draft Email to compose and send.',
      accent: '#5b21b6',
      accentBg: '#f5f3ff',
      status: 'active',
      statusLabel: 'Active',
      pulse: true,
      stats: [
        { label: 'Send endpoint', val: 'Live' },
        { label: 'Test endpoint', val: 'Live' },
        { label: 'Mailchimp', val: 'Connected' },
      ],
      tags: ['Personalization', 'Mailchimp', 'LinkedIn'],
      action: (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <a
            href="/projects/bd-pipeline"
            style={{ fontSize: 12.5, padding: '7px 16px', background: '#5b21b6', color: '#fff', borderRadius: 7, cursor: 'pointer', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
          >
            → Open Pipeline
          </a>
        </div>
      ),
    },
    {
      name: 'LinkedIn Tracker',
      description: 'Monitors target accounts for recent posts, role changes, and engagement signals to surface warm outreach moments.',
      accent: '#d97706',
      accentBg: '#fffbeb',
      status: 'paused',
      statusLabel: 'Paused',
      pulse: false,
      stats: [
        { label: 'Accounts tracked', val: '48' },
        { label: 'New signals', val: '0' },
        { label: 'Last run', val: '3d ago' },
      ],
      tags: ['Social listening', 'Role changes'],
      action: null,
    },
    {
      name: 'SMS Sequencer',
      description: 'Multi-step SMS sequences for warm prospects at key pipeline stages. Integrates with your CRM for trigger-based sends.',
      accent: '#9ca3af',
      accentBg: '#f9fafb',
      status: 'coming-soon',
      statusLabel: 'Coming soon',
      pulse: false,
      stats: [
        { label: 'Sequences', val: '—' },
        { label: 'Messages sent', val: '—' },
        { label: 'Status', val: 'Q3 2026' },
      ],
      tags: ['SMS', 'CRM', 'Sequences'],
      action: null,
    },
  ];

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--light)", marginBottom: 8 }}>
          Agents
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 6 }}>
          AI Agents
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          Automated intelligence across your BD pipeline.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 18 }}>
        {agents.map((agent) => (
          <div
            key={agent.name}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${agent.accent}`,
              borderRadius: 10,
              padding: "20px 22px",
              opacity: agent.status === 'coming-soon' ? 0.65 : 1,
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: 6 }}>{agent.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {agent.pulse && (
                    <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0, display: "inline-flex" }}>
                      <span style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: agent.accent,
                        opacity: 0.35,
                        animation: "agentPing 1.8s ease-out infinite",
                      }} />
                      <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: agent.accent, display: "block" }} />
                    </div>
                  )}
                  {!agent.pulse && agent.status !== 'coming-soon' && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e5e7eb", flexShrink: 0 }} />
                  )}
                  {agent.status === 'coming-soon' ? (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: "#f3f4f6",
                      color: "#9ca3af",
                    }}>Coming soon</span>
                  ) : (
                    <span style={{ fontSize: 11.5, color: agent.status === 'paused' ? "var(--light)" : agent.accent, fontWeight: 500 }}>{agent.statusLabel}</span>
                  )}
                </div>
              </div>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: agent.accentBg,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: agent.accent, opacity: 0.8 }} />
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>{agent.description}</p>

            {/* Stats */}
            <div style={{ display: "flex", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "12px 0", marginBottom: agent.action ? 0 : 16 }}>
              {agent.stats.map(({ label, val }, i) => (
                <div key={label} style={{
                  flex: 1,
                  paddingLeft: i > 0 ? 12 : 0,
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{val}</div>
                  <div style={{ fontSize: 10.5, color: "var(--light)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Action button */}
            {agent.action}

            {/* Tags */}
            {!agent.action && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                {agent.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "3px 9px",
                    borderRadius: 20,
                    background: agent.accentBg,
                    color: agent.accent,
                  }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes agentPing {
          0% { transform: scale(1); opacity: 0.35; }
          60% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .spin { animation: spinAnim 0.8s linear infinite; }
        @keyframes spinAnim { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
