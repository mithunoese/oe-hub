'use client';
import { useState, useEffect, useCallback } from 'react';
import { pipelines, CONTACT_LINKEDIN_POSTS, CONTACT_NEXT_BEST } from '@/data/pipelines';
import type { PipelineRow, Pipeline } from '@/data/pipelines';
import {
  AnalyticsSection,
  AuditLogPanel,
  ContactsTable,
  ImportModal,
  AddPipelineModal,
  scoreColor,
  scoreBg,
  statusBadge,
  getInitials,
  getNextStep,
  repNames,
  panelTabs,
} from './components';
import type { ContactInfo, AuditEntry, ActivityEntry, IcpSignals, EmailHistoryItem } from './components';

// ─── Sub-components (used in contact panel) ──────────────────────────────────

function OELogoMini() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 1, cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: '#fff' }}>OPEN</span>
        <span style={{ width: 16, height: 1.2, background: '#007a7d', display: 'inline-block', marginLeft: 4 }} />
      </div>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: '#fff' }}>EXCHANGE</span>
    </div>
  );
}

function IcpBarSignal({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color, fontWeight: 500 }}>{score}</span>
      </div>
      <div style={{ height: 4, background: '#f0eeeb', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

const defaultAuditLog: AuditEntry[] = [];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BDPipelinePage() {
  const [activePipeline, setActivePipeline] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactInfo | null>(null);
  const [currentRow, setCurrentRow] = useState<PipelineRow | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [minScore, setMinScore] = useState(65);
  const [search, setSearch] = useState('');
  const [segments, setSegments] = useState<{ label: string; minScore: number }[]>([{ label: 'All firms', minScore: 0 }]);
  const [activeSegment, setActiveSegment] = useState(0);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(defaultAuditLog);
  const [auditOpen, setAuditOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [icpScoring, setIcpScoring] = useState(false);
  const [icpSaveBar, setIcpSaveBar] = useState<{ count: number } | null>(null);
  const [icpSegName, setIcpSegName] = useState('');
  const [icpText, setIcpText] = useState('');
  const [sigFrom, setSigFrom] = useState('cara');
  const [oePostEnabled, setOePostEnabled] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [logMethod, setLogMethod] = useState('email');
  const [logOutcome, setLogOutcome] = useState('positive');
  const [logDate, setLogDate] = useState('');
  const [logBy, setLogBy] = useState('cara');
  const [logNotes, setLogNotes] = useState('');
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);

  // Dynamic pipelines (starts from static definitions, can grow)
  const [allPipelines, setAllPipelines] = useState<Pipeline[]>(() => [...pipelines]);

  // Mutable pipeline rows (enables status editing, score updates)
  const [pipelineRows, setPipelineRows] = useState<Record<number, PipelineRow[]>>(() => {
    return Object.fromEntries(pipelines.map((p, i) => [i, p.rows]));
  });

  // Sorting
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Owner filter
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);

  // Rescoring animation
  const [rescoringIdx, setRescoringIdx] = useState<Set<number>>(new Set());

  // AI brief
  const [briefLoading, setBriefLoading] = useState(false);
  const [contactBrief, setContactBrief] = useState<string | null>(null);

  // Smart follow-up
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupData, setFollowupData] = useState<{ subject: string; body: string } | null>(null);

  // Live LinkedIn posts
  const [liPosts, setLiPosts] = useState<Array<{ date: string; text: string; hook: string }> | null>(null);
  const [liPostsLoading, setLiPostsLoading] = useState(false);
  const [liPostsContact, setLiPostsContact] = useState<string | null>(null);
  const [liVerifying, setLiVerifying] = useState(false);

  // DB sync status
  const [dbSynced, setDbSynced] = useState(false);

  // Selected row index for keyboard nav
  const [selectedRowIdx, setSelectedRowIdx] = useState<number>(-1);

  // Mailchimp sync state
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');

  // Import contacts modal
  const [importOpen, setImportOpen] = useState(false);

  // Real ICP signals from AI scoring
  const [icpSignals, setIcpSignals] = useState<IcpSignals | null>(null);
  const [icpRationale, setIcpRationale] = useState<string | null>(null);
  const [icpLoading, setIcpLoading] = useState(false);

  // Email send history for current contact
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);

  const loadEmailHistory = useCallback(async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/email/log?email=${encodeURIComponent(email)}`);
      const { sends } = await res.json();
      setEmailHistory(sends || []);
    } catch { setEmailHistory([]); }
  }, []);

  const pipeline = allPipelines[activePipeline] || allPipelines[0];

  // Persist to DB on changes (no localStorage)
  useEffect(() => {
    if (!dbSynced) return;
    fetch('/api/pipeline-state', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ rows: pipelineRows, pipelines: allPipelines }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineRows]);

  // Load from Neon on mount (authoritative source)
  useEffect(() => {
    fetch('/api/pipeline-state')
      .then(r => r.json())
      .then(({ rows, pipelines: savedPipelines }) => {
        if (rows) {
          setPipelineRows(rows);
        }
        if (savedPipelines && Array.isArray(savedPipelines) && savedPipelines.length > 0) {
          setAllPipelines(savedPipelines);
        }
        setDbSynced(true);
      })
      .catch(() => setDbSynced(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save to Neon on state change
  useEffect(() => {
    if (!dbSynced) return;
    const t = setTimeout(() => {
      fetch('/api/pipeline-state', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rows: pipelineRows, pipelines: allPipelines }),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [pipelineRows, allPipelines, dbSynced]);

  const activeSegMinScore = segments[activeSegment]?.minScore ?? 0;
  const effectiveMinScore = Math.max(minScore, activeSegMinScore);

  const filteredRows = (pipelineRows[activePipeline] || pipeline.rows).filter((row) => {
    const searchOk = search === '' ||
      row.firm.toLowerCase().includes(search.toLowerCase()) ||
      row.contact.toLowerCase().includes(search.toLowerCase());
    if (!searchOk) return false;
    if (ownerFilter && row.by !== ownerFilter) return false;
    if (!row.dim) return row.score >= effectiveMinScore;
    return row.score >= effectiveMinScore - 30;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortCol) return 0;
    let av: string | number = 0, bv: string | number = 0;
    if (sortCol === 'firm') { av = a.firm.toLowerCase(); bv = b.firm.toLowerCase(); }
    if (sortCol === 'score') { av = a.score; bv = b.score; }
    if (sortCol === 'status') { av = a.status; bv = b.status; }
    if (sortCol === 'lastAct') { av = a.lastAct; bv = b.lastAct; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const openContact = useCallback((row: PipelineRow, idx?: number) => {
    setCurrentContact({
      name: row.contact,
      title: row.title,
      firm: row.firm,
      score: row.score,
      status: row.status,
      li: row.li,
      liUsername: row.liUsername,
    });
    setCurrentRow(row);
    setActiveTab(0);
    setPanelOpen(true);
    setContactBrief(null);
    setFollowupData(null);
    setIcpSignals(null);
    setIcpRationale(null);
    setEmailHistory([]);
    if (row.email) loadEmailHistory(row.email);
    if (idx !== undefined) setSelectedRowIdx(idx);
  }, [loadEmailHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPanelOpen(false); setAuditOpen(false); }
      if (!panelOpen) return;
      const rows = sortedRows;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(selectedRowIdx + 1, rows.length - 1);
        setSelectedRowIdx(next);
        if (!rows[next].dim) openContact(rows[next], next);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(selectedRowIdx - 1, 0);
        setSelectedRowIdx(prev);
        if (!rows[prev].dim) openContact(rows[prev], prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panelOpen, selectedRowIdx, sortedRows, openContact]);

  const cycleStatus = (e: React.MouseEvent, rowIdx: number) => {
    e.stopPropagation();
    const cycle: Record<string, PipelineRow['status']> = { none: 'emailed', emailed: 'replied', replied: 'none' };
    setPipelineRows(prev => {
      const rows = [...(prev[activePipeline] || pipeline.rows)];
      const currentStatus = rows[rowIdx].status;
      rows[rowIdx] = { ...rows[rowIdx], status: cycle[currentStatus] };
      return { ...prev, [activePipeline]: rows };
    });
  };

  const runIcpScoring = async () => {
    setIcpScoring(true);
    setIcpSaveBar(null);
    const liveRows = pipelineRows[activePipeline] || pipeline.rows;
    const validRows = liveRows
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) => !row.dim);

    const updatedRows = [...liveRows];
    const BATCH = 5;

    for (let i = 0; i < validRows.length; i += BATCH) {
      const batch = validRows.slice(i, i + BATCH);
      await Promise.all(batch.map(async ({ row, idx: globalIdx }) => {
        setRescoringIdx(prev => new Set([...prev, globalIdx]));
        try {
          const res = await fetch('/api/ai/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firm: row.firm,
              contact: row.contact,
              title: row.title,
              li: row.li,
              pipelineName: pipeline.name,
              context: icpText || undefined,
            }),
          });
          const data = await res.json();
          if (res.ok && data.score) {
            updatedRows[globalIdx] = { ...updatedRows[globalIdx], score: data.score };
            setPipelineRows(prev => {
              const rows = [...(prev[activePipeline] || pipeline.rows)];
              rows[globalIdx] = { ...rows[globalIdx], score: data.score };
              return { ...prev, [activePipeline]: rows };
            });
          }
        } catch { /* skip failed */ }
        setRescoringIdx(prev => { const s = new Set(prev); s.delete(globalIdx); return s; });
      }));
    }

    // Persist updated scores to DB
    await fetch('/api/pipeline-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: { ...pipelineRows, [activePipeline]: updatedRows }, pipelines: allPipelines }),
    });

    setIcpScoring(false);
    const thresholdMatch = pipeline.stats.find(s => s.hi)?.label.match(/\d+/);
    const minScoreVal = thresholdMatch ? parseInt(thresholdMatch[0]) : 65;
    const highCount = updatedRows.filter(r => !r.dim && r.score >= minScoreVal).length;
    setIcpSaveBar({ count: highCount });
    setAuditLog(prev => [{
      time: 'Just now', action: 'ICP Scoring run', by: 'Agent',
      detail: `${validRows.length} contacts rescored — ${pipeline.name}${icpText ? ' (with context)' : ''}`,
    }, ...prev]);
  };

  const saveSegment = () => {
    const name = icpSegName || `Scored · ${icpSaveBar?.count}`;
    setSegments((prev) => [...prev, { label: name, minScore: minScore }]);
    setAuditLog((prev) => [{
      time: 'Just now',
      action: 'Segment saved',
      by: 'You',
      detail: `${name} — ${icpSaveBar?.count} contacts`,
    }, ...prev]);
    setIcpSaveBar(null);
    setIcpSegName('');
  };

  const submitActivityLog = () => {
    if (!logDate) return;
    setActivityEntries((prev) => [{
      method: logMethod,
      outcome: logOutcome,
      date: logDate,
      by: logBy,
      notes: logNotes,
    }, ...prev]);
    setLogDate('');
    setLogNotes('');
  };

  const generateBrief = async () => {
    if (!currentContact) return;
    setBriefLoading(true);
    setContactBrief(null);
    try {
      const res = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: currentContact.name,
          title: currentContact.title,
          firm: currentContact.firm,
          score: currentContact.score,
          status: currentContact.status,
          li: currentContact.li,
        }),
      });
      const data = await res.json();
      setContactBrief(data.brief || 'Could not generate brief — try again.');
    } catch {
      setContactBrief('Unable to reach AI — check connection and try again.');
    } finally {
      setBriefLoading(false);
    }
  };

  const generateFollowup = async () => {
    if (!currentContact || !currentRow) return;
    setFollowupLoading(true);
    setFollowupData(null);
    try {
      const res = await fetch('/api/ai/followup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: currentContact.name,
          title: currentContact.title,
          firm: currentContact.firm,
          score: currentContact.score,
          lastActivity: currentRow.lastAct,
        }),
      });
      const data = await res.json();
      setFollowupData(data.subject ? data : null);
    } catch {
      setFollowupData(null);
    } finally {
      setFollowupLoading(false);
    }
  };

  const exportCsv = () => {
    const headers = ['Firm', 'Group', 'Contact', 'Title', 'Email', 'Score', 'Status', 'LinkedIn', 'Owner', 'Last Activity'];
    const rows = sortedRows.map(r => [r.firm, r.group, r.contact, r.title, r.email || '', r.score, r.status, r.li ? 'Yes' : 'No', r.by, r.lastAct]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${pipeline.name.replace(/\s+/g, '-')}-pipeline.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Live stats computed from mutable rows
  const liveRows = pipelineRows[activePipeline] || pipeline.rows;
  const scoreThreshold = pipeline.id === 0 ? 65 : pipeline.id === 1 ? 70 : 75;
  const liveStats = [
    { label: 'Total firms', val: String(liveRows.length), hi: false },
    { label: pipeline.stats[1].label, val: String(liveRows.filter(r => r.score >= scoreThreshold).length), hi: true },
    { label: 'LinkedIn verified', val: String(liveRows.filter(r => r.li).length), hi: false },
    { label: 'Emails drafted', val: String(liveRows.filter(r => r.status === 'emailed' || r.status === 'replied').length), hi: false },
    { label: pipeline.stats[4].label, val: String(liveRows.filter(r => r.status === 'replied').length), hi: false },
  ];

  // ─── Handler props for extracted components ────────────────────────────────

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const handleImport = (rows: PipelineRow[]) => {
    const existing = pipelineRows[activePipeline] || pipeline.rows;
    setPipelineRows(prev => ({ ...prev, [activePipeline]: [...existing, ...rows] }));
  };

  const handleCreatePipeline = (newPipeline: Pipeline, newRows: PipelineRow[]) => {
    const newIdx = allPipelines.length;
    setAllPipelines(prev => [...prev, newPipeline]);
    setPipelineRows(prev => ({ ...prev, [newIdx]: newRows }));
    setActivePipeline(newIdx);
    setSegments([{ label: 'All firms', minScore: 0 }]);
    setAuditLog(prev => [{
      time: 'Just now', action: 'Pipeline created', by: 'You',
      detail: `${newPipeline.name} — ${newRows.length} prospects generated by AI`,
    }, ...prev]);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .bd-row:hover { background: #f9f8f6 !important; cursor: pointer; }
        .seg-btn:hover { background: #f0eeeb !important; }
        .tab-btn:hover { color: var(--text) !important; }
        .panel-tab:hover { color: var(--text) !important; }
        .btn-teal:hover { background: #006466 !important; }
        .close-btn:hover { background: #f0eeeb !important; }
        .pipe-tab:hover { background: #f0eeeb !important; }
        .pipe-tab-wrap:hover .pipe-tab-delete { opacity: 1 !important; }
        .pipe-tab-delete:hover { color: var(--text) !important; background: #f0eeeb !important; }
        .modal-overlay { animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { animation: slideUp 0.2s cubic-bezier(0.32,0,0,1); }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { accent-color: var(--teal); }
        select, input[type=text], input[type=email], textarea {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--text);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 8px 11px;
          outline: none;
          transition: border-color 0.15s;
        }
        select:focus, input:focus, textarea:focus { border-color: var(--teal); }
        [contenteditable]:focus { outline: 2px solid rgba(0,122,125,0.25); outline-offset: 2px; border-radius: 3px; }
        .status-cell { cursor: pointer; transition: opacity 0.15s; }
        .status-cell:hover { opacity: 0.75; }
        .sort-header:hover { color: var(--text) !important; }
        .owner-cell:hover { color: var(--teal) !important; cursor: pointer; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scoreFlash { 0% { background: rgba(0,122,125,0.15); } 100% { background: transparent; } }
      `}</style>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <main style={{ marginTop: 'var(--nav-h)', minHeight: 'calc(100vh - var(--nav-h))', background: 'var(--bg)' }}>

        {/* Topbar */}
        <div style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          height: 52,
          position: 'sticky',
          top: 'var(--nav-h)',
          zIndex: 50,
        }}>
          <div style={{ fontSize: 11, color: 'var(--light)', marginRight: 16 }}>BD Pipeline</div>
          <div style={{ width: 1, height: 16, background: 'var(--border)', marginRight: 16 }} />

          {/* Pipeline tabs */}
          {allPipelines.map((p, i) => (
            <div
              key={p.id}
              className="pipe-tab-wrap"
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <button
                className="pipe-tab"
                onClick={() => { setActivePipeline(i); setSearch(''); setActiveSegment(0); setSortCol(null); setOwnerFilter(null); setSegments([{ label: 'All firms', minScore: 0 }]); }}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: i >= 3 ? '0 28px 0 14px' : '0 14px',
                  height: 52,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: activePipeline === i ? 'var(--teal)' : 'var(--muted)',
                  borderBottom: activePipeline === i ? '2px solid var(--teal)' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {p.name}
                <span style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  background: activePipeline === i ? 'var(--teal-light)' : '#f0eeeb',
                  color: activePipeline === i ? 'var(--teal)' : 'var(--light)',
                  padding: '1px 6px',
                  borderRadius: 10,
                }}>{(pipelineRows[i] || p.rows).length}</span>
              </button>
              {i >= 3 && (
                <button
                  className="pipe-tab-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAllPipelines(prev => prev.filter((_, idx) => idx !== i));
                    setPipelineRows(prev => {
                      const next: Record<number, PipelineRow[]> = {};
                      Object.entries(prev).forEach(([k, v]) => {
                        const ki = Number(k);
                        if (ki < i) next[ki] = v;
                        else if (ki > i) next[ki - 1] = v;
                      });
                      return next;
                    });
                    setActivePipeline(0);
                  }}
                  title="Delete pipeline"
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: 'var(--light)',
                    padding: 0,
                    lineHeight: 1,
                    opacity: 0,
                    transition: 'opacity 0.15s, color 0.15s',
                  }}
                >×</button>
              )}
            </div>
          ))}

          {/* Add pipeline */}
          <button
            onClick={() => setModalOpen(true)}
            style={{
              marginLeft: 8,
              fontSize: 13,
              color: 'var(--light)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0 10px',
              height: 52,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New
          </button>

          <div style={{ flex: 1 }} />

          {/* Audit log toggle */}
          <button
            onClick={() => setAuditOpen((v) => !v)}
            style={{
              fontSize: 12,
              color: auditOpen ? 'var(--teal)' : 'var(--muted)',
              background: auditOpen ? 'var(--teal-light)' : 'transparent',
              border: '1px solid ' + (auditOpen ? 'var(--teal-mid)' : 'var(--border)'),
              borderRadius: 7,
              cursor: 'pointer',
              padding: '5px 12px',
              marginRight: 12,
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
          >
            Audit log
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 80px', maxWidth: 1300, marginLeft: 'auto', marginRight: 'auto' }}>

          {/* Pipeline header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--light)', marginBottom: 6 }}>{pipeline.eyebrow}</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 4 }}>{pipeline.title}</h1>
            <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 560 }}>{pipeline.sub}</div>
          </div>

          {/* Agent context banner */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--teal)',
            borderRadius: 9,
            padding: '16px 20px',
            marginBottom: 20,
          }}>
            {/* Top row: title + pulse + meta + stats */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal)' }}>{pipeline.agentTitle}</div>
                  <div style={{ fontSize: 11, color: 'var(--light)' }}>· Re-scores contacts on fresh intel</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {pipeline.chips.map((chip) => (
                    <span key={chip} style={{
                      fontSize: 11.5, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                      background: 'var(--teal-light)', color: 'var(--teal)',
                      border: '1px solid var(--teal-mid)',
                    }}>{chip}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 22, flexShrink: 0 }}>
                {liveStats.map(({ label, val, hi }) => (
                  <div key={label} style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600,
                      color: hi ? 'var(--teal)' : 'var(--text)', letterSpacing: '-0.01em',
                    }}>{val}</div>
                    <div style={{ fontSize: 10, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Input row */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <textarea
                rows={2}
                placeholder="What did you just learn? e.g. 'Hershey's mentioned they're moving to quarterly hybrid global town halls, 2,000+ employees, need a tech partner…'"
                value={icpText}
                onChange={(e) => setIcpText(e.target.value)}
                style={{
                  flex: 1, fontFamily: 'var(--font-body)', fontSize: 13.5, padding: '9px 13px',
                  border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)',
                  color: 'var(--text)', resize: 'none', lineHeight: 1.5, outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--teal)'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)'; }}
              />
              <button
                onClick={runIcpScoring}
                disabled={icpScoring}
                style={{
                  background: icpScoring ? 'var(--teal-mid)' : 'var(--teal)', color: '#fff',
                  border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13,
                  fontWeight: 600, cursor: icpScoring ? 'default' : 'pointer',
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}
              >
                {icpScoring && (
                  <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                )}
                {icpScoring ? 'Scoring…' : 'Update →'}
              </button>
            </div>
            {/* Save bar */}
            {icpSaveBar && (
              <div style={{
                marginTop: 12, background: 'var(--teal-light)', border: '1px solid var(--teal-mid)',
                borderRadius: 8, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700, marginBottom: 8 }}>
                  ✓ Re-scored — {icpSaveBar.count} contacts match your updated ICP
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Name this segment…"
                    value={icpSegName}
                    onChange={(e) => setIcpSegName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveSegment()}
                    style={{
                      flex: 1, fontFamily: 'var(--font-body)', fontSize: 13, padding: '7px 10px',
                      border: '1.5px solid var(--teal-mid)', borderRadius: 6, background: '#fff',
                      color: 'var(--text)', outline: 'none',
                    }}
                    autoFocus
                  />
                  <button onClick={saveSegment} style={{
                    padding: '7px 14px', background: 'var(--teal)', color: '#fff', fontSize: 13,
                    fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>Save segment →</button>
                  <button onClick={() => setIcpSaveBar(null)} style={{
                    padding: '7px 10px', background: 'none', border: '1.5px solid var(--border)',
                    borderRadius: 6, cursor: 'pointer', color: 'var(--muted)', fontSize: 13,
                  }}>×</button>
                </div>
              </div>
            )}
          </div>

          {/* Segments + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {segments.map((seg, i) => {
              const segCount = i === 0
                ? (pipelineRows[activePipeline] || pipeline.rows).length
                : (pipelineRows[activePipeline] || pipeline.rows).filter(r => !r.dim && r.score >= seg.minScore).length;
              return (
                <button
                  key={`${seg.label}-${i}`}
                  className="seg-btn"
                  onClick={() => { setActiveSegment(i); if (seg.minScore > 0) setMinScore(seg.minScore); }}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    padding: '5px 13px',
                    borderRadius: 20,
                    border: '1px solid ' + (activeSegment === i ? 'var(--teal-mid)' : 'var(--border)'),
                    background: activeSegment === i ? 'var(--teal-light)' : 'var(--surface)',
                    color: activeSegment === i ? 'var(--teal)' : 'var(--muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{seg.label} · {segCount}</button>
              );
            })}

            {/* Owner filter chip */}
            {ownerFilter && (
              <button
                onClick={() => setOwnerFilter(null)}
                style={{
                  fontSize: 12,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: 'var(--teal-light)',
                  color: 'var(--teal)',
                  border: '1px solid var(--teal-mid)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                Owner: {ownerFilter} ×
              </button>
            )}

            <div style={{ flex: 1 }} />

            {/* Search */}
            <input
              type="text"
              placeholder="Search firms / contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220, fontSize: 12.5, padding: '6px 12px', borderRadius: 20 }}
            />

            {/* Score filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Score ≥ {minScore}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                style={{ width: 90 }}
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={exportCsv}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 7,
                background: 'var(--surface)',
                color: 'var(--teal)',
                border: '1px solid var(--teal-mid)',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              ⬇ Export CSV
            </button>

            {/* Import contacts */}
            <button
              onClick={() => setImportOpen(true)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 7,
                background: 'var(--teal)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              + Import contacts
            </button>

            {/* Sync to Mailchimp */}
            <button
              onClick={async () => {
                const contacts = sortedRows.filter(r => r.email);
                if (!contacts.length) { alert('No contacts with email addresses in current view.'); return; }
                setSyncState('syncing');
                try {
                  const res = await fetch('/api/email/sync-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contacts: contacts.map(r => ({
                        firm: r.firm, contact: r.contact, title: r.title,
                        score: r.score, status: r.status, by: r.by, email: r.email,
                      })),
                      pipelineName: pipeline.name,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) { alert('Sync failed: ' + (data.error || 'Unknown error')); setSyncState('error'); }
                  else { setSyncState('done'); setTimeout(() => setSyncState('idle'), 3000); }
                } catch { setSyncState('error'); setTimeout(() => setSyncState('idle'), 3000); }
              }}
              disabled={syncState === 'syncing'}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 7,
                background: syncState === 'done' ? 'var(--green)' : syncState === 'error' ? 'var(--red, #ef4444)' : '#007a7d',
                color: '#fff',
                border: 'none',
                cursor: syncState === 'syncing' ? 'wait' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                opacity: syncState === 'syncing' ? 0.7 : 1,
              }}
            >
              {syncState === 'syncing' ? '⟳ Syncing…' : syncState === 'done' ? '✓ Synced!' : syncState === 'error' ? '✗ Failed' : '⇡ Sync to Mailchimp'}
            </button>
          </div>

          {/* Table */}
          <ContactsTable
            sortedRows={sortedRows}
            allRows={pipelineRows[activePipeline] || pipeline.rows}
            selectedRowIdx={selectedRowIdx}
            rescoringIdx={rescoringIdx}
            ownerFilter={ownerFilter}
            minScore={minScore}
            sortCol={sortCol}
            sortDir={sortDir}
            onOpenContact={openContact}
            onCycleStatus={cycleStatus}
            onSetOwnerFilter={setOwnerFilter}
            onSort={handleSort}
            onOpenImport={() => setImportOpen(true)}
            onExportCsv={exportCsv}
          />

          {/* Analytics */}
          <AnalyticsSection
            pipelineRows={pipelineRows}
            pipelines={allPipelines}
          />
        </div>
      </main>

      {/* ── Panel overlay ─────────────────────────────────────────── */}
      <div
        onClick={() => setPanelOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 'var(--panel-w)',
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 200,
          opacity: panelOpen ? 1 : 0,
          pointerEvents: panelOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* ── Detail Panel ──────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--panel-w)',
        background: 'var(--surface)',
        zIndex: 201,
        transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.32,0,0,1)',
        boxShadow: panelOpen ? '8px 0 40px rgba(0,0,0,0.12)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {currentContact && (
          <>
            {/* Panel header */}
            <div style={{
              padding: '0 24px',
              height: 52,
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Avatar */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--teal) 0%, #4db6b8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    {getInitials(currentContact.name)}
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{currentContact.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{currentContact.title} · {currentContact.firm}</div>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setPanelOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: 'var(--muted)',
                  lineHeight: 1,
                  transition: 'background 0.15s',
                }}
              >×</button>
            </div>

            {/* Panel tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              padding: '0 24px',
              flexShrink: 0,
              overflowX: 'auto',
            }}>
              {panelTabs.map((tab, i) => (
                <button
                  key={tab}
                  className="panel-tab"
                  onClick={() => setActiveTab(i)}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    padding: '0 14px',
                    height: 44,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: activeTab === i ? 'var(--teal)' : 'var(--light)',
                    borderBottom: activeTab === i ? '2px solid var(--teal)' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >{tab}</button>
              ))}
            </div>

            {/* Panel body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

              {/* ── Tab 0: Contact ── */}
              {activeTab === 0 && (
                <div>
                  {/* Big avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--teal) 0%, #4db6b8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                        {getInitials(currentContact.name)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{currentContact.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{currentContact.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{currentContact.firm}</div>
                      {currentContact.li && (
                        <span style={{
                          display: 'inline-block',
                          marginTop: 6,
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          letterSpacing: '0.04em',
                        }}>LinkedIn verified</span>
                      )}
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 28,
                        fontWeight: 700,
                        color: scoreColor(currentContact.score),
                        letterSpacing: '-0.02em',
                      }}>{currentContact.score}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ICP Score</div>
                    </div>
                  </div>

                  {/* Next step chip */}
                  {(() => {
                    const ns = getNextStep(currentContact.status, currentContact.score);
                    return (
                      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)' }}>Suggested:</span>
                        <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: ns.bg, color: ns.color, fontWeight: 500 }}>
                          {ns.text}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Email display */}
                  {currentRow?.email && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: emailHistory.length > 0 ? 8 : 0 }}>
                        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>✉</span>
                        <a href={`mailto:${currentRow.email}`} style={{ fontSize: 12.5, color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>
                          {currentRow.email}
                        </a>
                      </div>
                      {emailHistory.length > 0 && (
                        <div style={{ background: '#f9f8f6', borderRadius: 8, padding: '10px 14px' }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', marginBottom: 8 }}>Send History</div>
                          {emailHistory.map((s) => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.pipeline_name || '—'} · {s.sent_by || '—'}</span>
                              <span style={{ fontSize: 11, color: 'var(--light)', fontFamily: 'var(--font-mono)' }}>
                                {new Date(s.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ICP Score Breakdown */}
                  <div style={{ background: '#f9f8f6', borderRadius: 9, padding: '16px 18px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)' }}>ICP Score Breakdown</div>
                      <button
                        onClick={async () => {
                          if (!currentRow || icpLoading) return;
                          setIcpLoading(true);
                          try {
                            const res = await fetch('/api/ai/score', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                firm: currentRow.firm,
                                contact: currentRow.contact,
                                title: currentRow.title,
                                li: currentRow.li,
                                pipelineName: pipeline.name,
                              }),
                            });
                            const data = await res.json();
                            if (res.ok && data.score) {
                              setIcpSignals(data.signals);
                              setIcpRationale(data.rationale);
                              // Update score in pipeline state
                              const rows = [...(pipelineRows[activePipeline] || pipeline.rows)];
                              const rowIdx = rows.findIndex(r => r.firm === currentRow.firm && r.contact === currentRow.contact);
                              if (rowIdx !== -1) {
                                rows[rowIdx] = { ...rows[rowIdx], score: data.score };
                                setPipelineRows(prev => ({ ...prev, [activePipeline]: rows }));
                              }
                            }
                          } finally {
                            setIcpLoading(false);
                          }
                        }}
                        disabled={icpLoading}
                        style={{
                          fontSize: 11,
                          padding: '3px 10px',
                          background: icpSignals ? 'transparent' : 'var(--teal)',
                          color: icpSignals ? 'var(--light)' : '#fff',
                          border: icpSignals ? '1px solid var(--border)' : 'none',
                          borderRadius: 6,
                          cursor: icpLoading ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          opacity: icpLoading ? 0.6 : 1,
                        }}
                      >
                        {icpLoading
                          ? <><svg className="spin" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Scoring…</>
                          : icpSignals ? '↻ Re-score' : '✦ Score with AI'}
                      </button>
                    </div>
                    {icpSignals ? (
                      <>
                        <IcpBarSignal label="Firmographic fit" score={icpSignals.firmographic} color={scoreColor(icpSignals.firmographic)} />
                        <IcpBarSignal label="Event volume signal" score={icpSignals.eventVolume} color={scoreColor(icpSignals.eventVolume)} />
                        <IcpBarSignal label="Tech stack alignment" score={icpSignals.techStack} color={scoreColor(icpSignals.techStack)} />
                        <IcpBarSignal label="LinkedIn engagement" score={icpSignals.linkedin} color={scoreColor(icpSignals.linkedin)} />
                        <IcpBarSignal label="Buying intent" score={icpSignals.buyingIntent} color={scoreColor(icpSignals.buyingIntent)} />
                        {icpRationale && (
                          <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                            <span style={{ fontWeight: 600, color: 'var(--teal)' }}>✦ </span>{icpRationale}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <IcpBarSignal label="Firmographic fit" score={Math.round(currentContact.score * 0.9)} color={scoreColor(currentContact.score)} />
                        <IcpBarSignal label="Event volume signal" score={Math.round(currentContact.score * 0.85)} color={scoreColor(currentContact.score)} />
                        <IcpBarSignal label="Tech stack alignment" score={Math.round(currentContact.score * 0.75)} color={scoreColor(currentContact.score)} />
                        <IcpBarSignal label="LinkedIn engagement" score={currentContact.li ? Math.round(currentContact.score * 0.8) : 20} color={currentContact.li ? scoreColor(currentContact.score) : 'var(--score-lo)'} />
                        <IcpBarSignal label="Buying intent" score={Math.round(currentContact.score * 0.65)} color={scoreColor(currentContact.score)} />
                        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--light)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                          Scores are estimates — click <strong>✦ Score with AI</strong> for real analysis
                        </div>
                      </>
                    )}
                  </div>

                  {/* AI Brief */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)' }}>AI Outreach Brief</div>
                      {!contactBrief && (
                        <button
                          onClick={generateBrief}
                          disabled={briefLoading}
                          style={{ fontSize: 12, padding: '4px 12px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          {briefLoading && <svg className="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>}
                          ✦ Brief me
                        </button>
                      )}
                      {contactBrief && (
                        <button onClick={() => setContactBrief(null)} style={{ fontSize: 11, color: 'var(--light)', background: 'none', border: 'none', cursor: 'pointer' }}>regenerate</button>
                      )}
                    </div>
                    {briefLoading && !contactBrief && (
                      <div style={{ background: '#f9f8f6', borderRadius: 9, padding: '14px 16px', fontSize: 12.5, color: 'var(--muted)', fontStyle: 'italic' }}>
                        Analyzing firmographic signals, recent LinkedIn activity, and ICP alignment…
                      </div>
                    )}
                    {contactBrief && (
                      <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-mid)', borderRadius: 9, padding: '14px 16px', fontSize: 13, color: 'var(--teal)', lineHeight: 1.65 }}>
                        <span style={{ fontWeight: 700 }}>✦ </span>{contactBrief}
                      </div>
                    )}
                  </div>

                  {/* Smart Follow-up — only shown when status is 'emailed' */}
                  {currentContact.status === 'emailed' && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)' }}>Smart Follow-Up</div>
                        {!followupData && (
                          <button
                            onClick={generateFollowup}
                            disabled={followupLoading}
                            style={{ fontSize: 12, padding: '4px 12px', background: '#5b21b6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            {followupLoading && <svg className="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>}
                            ✦ Generate
                          </button>
                        )}
                        {followupData && (
                          <button onClick={() => setFollowupData(null)} style={{ fontSize: 11, color: 'var(--light)', background: 'none', border: 'none', cursor: 'pointer' }}>regenerate</button>
                        )}
                      </div>
                      {followupLoading && !followupData && (
                        <div style={{ background: '#f9f8f6', borderRadius: 9, padding: '14px 16px', fontSize: 12.5, color: 'var(--muted)', fontStyle: 'italic' }}>
                          Writing a sharp follow-up for {currentContact.firm}…
                        </div>
                      )}
                      {followupData && (
                        <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 9, padding: '14px 16px' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#5b21b6', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</div>
                          <div style={{ fontSize: 13, color: '#1e1b2e', marginBottom: 12, fontWeight: 500 }}>{followupData.subject}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#5b21b6', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Body</div>
                          <div style={{ fontSize: 13, color: '#1e1b2e', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{followupData.body}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next best alternative */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)', marginBottom: 10 }}>Next-Best Alternative</div>
                    {(() => {
                      const nba = CONTACT_NEXT_BEST[currentContact.firm] || { name: 'Rachel Kim', title: 'Director of Events', initials: 'RK', score: 72, color: '#8b5cf6' };
                      return (
                        <div style={{
                          border: '1px solid var(--border)',
                          borderRadius: 9,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}>
                          <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${nba.color} 0%, ${nba.color}99 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{nba.initials}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{nba.name}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{nba.title} · {currentContact.firm}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 14,
                              fontWeight: 600,
                              color: scoreColor(nba.score),
                              background: scoreBg(nba.score),
                              padding: '2px 8px',
                              borderRadius: 5,
                            }}>{nba.score}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ── Tab 1: LinkedIn Posts ── */}
              {activeTab === 1 && (() => {
                // Auto-fetch when tab opens for a new contact
                if (currentContact.name !== liPostsContact && !liPostsLoading) {
                  setLiPostsContact(currentContact.name);
                  setLiPosts(null);
                  setLiPostsLoading(true);
                  fetch('/api/linkedin/person-posts', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                      contact: currentContact.name,
                      title: currentContact.title,
                      firm: currentContact.firm,
                      linkedinUsername: currentContact.liUsername || undefined,
                    }),
                  })
                    .then(r => r.json())
                    .then(d => { setLiPosts(d.posts || []); setLiPostsLoading(false); })
                    .catch(() => { setLiPosts([]); setLiPostsLoading(false); });
                }
                const posts = liPosts || [];
                const guessedUsername = currentContact.name.toLowerCase().trim().split(/\s+/).join('-');
                const profileUrl = currentContact.liUsername
                  ? `https://linkedin.com/in/${currentContact.liUsername}`
                  : `https://linkedin.com/in/${guessedUsername}`;
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Recent activity from {currentContact.name}&apos;s LinkedIn profile</div>
                      <button
                        onClick={() => {
                          setLiPostsContact(null);
                          setLiPosts(null);
                        }}
                        style={{ fontSize: 11, color: 'var(--light)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >refresh</button>
                    </div>
                    {/* LinkedIn profile link + source badge + verify button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11.5, color: '#1d4ed8', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                      >
                        {profileUrl.replace('https://', '')} ↗
                      </a>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 3,
                        background: currentContact.liUsername ? '#dcfce7' : '#fef3c7',
                        color: currentContact.liUsername ? '#166534' : '#92400e',
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                      }}>
                        {currentContact.liUsername ? 'Verified' : 'AI-generated'}
                      </span>
                      {!currentContact.liUsername && (
                        <button
                          disabled={liVerifying}
                          onClick={async () => {
                            setLiVerifying(true);
                            try {
                              const res = await fetch('/api/linkedin/verify', {
                                method: 'POST',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({
                                  contact: currentContact.name,
                                  title: currentContact.title,
                                  firm: currentContact.firm,
                                }),
                              });
                              const data = await res.json();
                              if (data.guessedUsernames?.[0]) {
                                const username = data.guessedUsernames[0];
                                // Update the current contact
                                setCurrentContact(prev => prev ? { ...prev, liUsername: username, li: true } : prev);
                                // Update the row in pipeline data
                                if (currentRow) {
                                  const updatedRows = (pipelineRows[activePipeline] || []).map(r =>
                                    r.contact === currentRow.contact && r.firm === currentRow.firm
                                      ? { ...r, liUsername: username, li: true }
                                      : r
                                  );
                                  setPipelineRows(prev => ({ ...prev, [activePipeline]: updatedRows }));
                                }
                                // Re-fetch posts with the new username
                                setLiPostsContact(null);
                                setLiPosts(null);
                              }
                            } catch {}
                            setLiVerifying(false);
                          }}
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: 5,
                            border: '1px solid #1d4ed8',
                            background: liVerifying ? '#eff6ff' : 'white',
                            color: '#1d4ed8',
                            cursor: liVerifying ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {liVerifying && (
                            <svg className="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                          )}
                          {liVerifying ? 'Verifying…' : '🔍 Verify LinkedIn'}
                        </button>
                      )}
                    </div>
                    {liPostsLoading && (
                      <div style={{ background: '#f9f8f6', borderRadius: 9, padding: '14px 16px', fontSize: 12.5, color: 'var(--muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                        Fetching LinkedIn activity for {currentContact.name}…
                      </div>
                    )}
                    {!liPostsLoading && posts.length === 0 && (
                      <div style={{ background: '#f9f8f6', borderRadius: 9, padding: '14px 16px', fontSize: 12.5, color: 'var(--muted)' }}>
                        No LinkedIn posts found for this contact. Add their LinkedIn URL to pull recent activity.
                      </div>
                    )}
                    {posts.map(({ date, text, hook }, i) => (
                      <div key={i} style={{
                        border: '1px solid var(--border)',
                        borderRadius: 9,
                        padding: '14px 16px',
                        marginBottom: 14,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1d4ed8' }} />
                            <span style={{ fontSize: 11, color: 'var(--light)', fontFamily: 'var(--font-mono)' }}>{date}</span>
                          </div>
                          <span style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            letterSpacing: '0.04em',
                          }}>LinkedIn</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>{text}</p>
                        <div style={{
                          background: 'var(--teal-light)',
                          borderRadius: 7,
                          padding: '9px 12px',
                          fontSize: 12,
                          color: 'var(--teal)',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}>
                          <span style={{ fontStyle: 'normal', fontWeight: 700 }}>AI suggested: </span>{hook}
                        </div>
                      </div>
                    ))}

                    {/* OE LinkedIn — real recent posts for outreach reference */}
                    {!liPostsLoading && posts.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>OE LinkedIn — share in outreach</div>
                          <a
                            href="https://linkedin.com/company/openexchange-inc-/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 10.5, color: '#1d4ed8', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                          >openexchange-inc- ↗</a>
                        </div>
                        {[
                          { date: '20h', text: 'Supporting Zoom clients in delivering high-visibility events with precision — marketing programs, sales kickoffs, product launches, and global town halls.' },
                          { date: '4d', text: 'Cocktail Event at the Cornell Club welcoming 100+ guests. Mark Loehr delivered opening remarks at the IR Impact Awards at Cipriani 25 Broadway.' },
                          { date: '6d', text: 'Virtual is no longer a backup. It is becoming a strategic channel for reaching new audiences in a changing global landscape.' },
                          { date: '1mo', text: 'Introducing OE Meet — secure meeting scheduling and execution for post-announcement moments. Handles surge meeting requests after acquisitions, FDA approvals, earnings.' },
                        ].map((p, i) => (
                          <div key={`oe-${i}`} style={{
                            border: '1px solid #e0e7ef',
                            borderRadius: 7,
                            padding: '10px 14px',
                            marginBottom: 8,
                            background: '#f8fafc',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 10, color: 'var(--light)', fontFamily: 'var(--font-mono)' }}>{p.date}</span>
                              <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: 3,
                                background: '#dcfce7',
                                color: '#166534',
                                letterSpacing: '0.03em',
                              }}>OE POST</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>{p.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── Tab 2: Draft Email ── */}
              {activeTab === 2 && (
                <div>
                  {/* From selector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500 }}>From:</span>
                      <select value={sigFrom} onChange={(e) => setSigFrom(e.target.value)} style={{ fontSize: 12.5 }}>
                        <option value="cara">Cara Dingenthal</option>
                        <option value="kristen">Kristen Conklin</option>
                        <option value="peter">Peter Georgiou</option>
                      </select>
                    </div>
                    {/* OE Post toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Include OE post</span>
                      <button
                        onClick={() => setOePostEnabled((v) => !v)}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 11,
                          background: oePostEnabled ? 'var(--teal)' : '#e5e7eb',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.2s',
                          flexShrink: 0,
                          padding: 0,
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: 3,
                          left: oePostEnabled ? 19 : 3,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#fff',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }} />
                      </button>
                    </div>
                  </div>

                  {/* OE Post URL row */}
                  {oePostEnabled && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 14,
                      padding: '9px 12px',
                      background: 'var(--teal-light)',
                      borderRadius: 8,
                      border: '1px solid var(--teal-mid)',
                    }}>
                      <span style={{ fontSize: 11.5, color: 'var(--teal)', fontWeight: 600, flexShrink: 0 }}>OE post:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--teal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        openexchange.com/blog/broadcast-grade-town-halls-2026
                      </span>
                    </div>
                  )}

                  {/* Email preview */}
                  <div style={{
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 16,
                    fontSize: 13.5,
                    lineHeight: 1.65,
                  }}>
                    {/* Dark header */}
                    <div style={{
                      background: '#1a1a1a',
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <OELogoMini />
                      <span style={{ fontSize: 11, color: '#666', fontFamily: 'var(--font-mono)' }}>BD Outreach · {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '24px 28px', background: '#fff' }}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{ marginBottom: 16, color: 'var(--text)', fontWeight: 500, fontSize: 14 }}
                      >
                        Hi {currentContact.name.split(' ')[0]},
                      </div>

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{ marginBottom: 14, color: 'var(--text)' }}
                      >
                        I came across your work at {currentContact.firm} and was impressed by how your team is approaching corporate communications at scale. We're seeing a major shift in the market toward broadcast-quality virtual events — and OpenExchange is built specifically for that transition.
                      </div>

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{ marginBottom: 20, color: 'var(--text)' }}
                      >
                        OE delivers a fully managed, broadcast-grade platform for town halls, webcasts, and hybrid events — with 99.99% uptime, AI-powered analytics, and a dedicated operator team. Our clients include Fortune 500 comms teams running 100+ events annually.
                      </div>

                      {oePostEnabled && (
                        <div style={{
                          background: 'var(--teal-light)',
                          borderLeft: '3px solid var(--teal)',
                          borderRadius: '0 6px 6px 0',
                          padding: '10px 14px',
                          marginBottom: 20,
                          fontSize: 12.5,
                          color: 'var(--teal)',
                        }}>
                          I thought this might be relevant: <a href="#" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>Broadcast-Grade Town Halls in 2026 →</a>
                        </div>
                      )}

                      {/* CTA */}
                      <div style={{ marginBottom: 24 }}>
                        <a href="#" style={{
                          display: 'inline-block',
                          background: 'var(--teal)',
                          color: '#fff',
                          padding: '11px 22px',
                          borderRadius: 8,
                          fontSize: 13.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}>Schedule 20 min →</a>
                      </div>

                      {/* Signature */}
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{repNames[sigFrom]}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Business Development · OpenExchange</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--light)', marginTop: 2 }}>openexchange.com</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      background: '#f6f5f2',
                      padding: '12px 28px',
                      fontSize: 11,
                      color: 'var(--light)',
                      textAlign: 'center',
                      borderTop: '1px solid var(--border)',
                    }}>
                      © {new Date().getFullYear()} OpenExchange · All rights reserved
                    </div>
                  </div>

                  {/* Mailchimp status bar */}
                  <div style={{
                    border: '1px solid var(--border)',
                    borderRadius: 9,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    background: '#fafaf9',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                      <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Mailchimp connected · <strong style={{ color: 'var(--text)' }}>Corp Comms Outreach</strong></span>
                    </div>
                    <button
                      onClick={async () => {
                        if (!currentRow?.email) { alert('No email address for this contact.'); return; }
                        setEmailSent(true);
                        try {
                          const res = await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              contactEmail: currentRow.email,
                              firstName: currentContact?.name.split(' ')[0],
                              firm: currentContact?.firm,
                              sigFrom,
                              oePostEnabled,
                            }),
                          });
                          if (!res.ok) { const e = await res.json(); alert('Send failed: ' + (e.error || 'Unknown error')); setEmailSent(false); return; }
                          // Log to DB
                          fetch('/api/email/log', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              contactEmail: currentRow.email,
                              contactName: currentContact?.name,
                              firm: currentContact?.firm,
                              pipelineName: pipeline.name,
                              sentBy: sigFrom,
                              sendType: 'campaign',
                            }),
                          }).then(() => { if (currentRow.email) loadEmailHistory(currentRow.email); }).catch(() => {});
                        } catch { setEmailSent(false); }
                        setTimeout(() => setEmailSent(false), 3000);
                      }}
                      style={{
                        background: emailSent ? 'var(--green)' : 'var(--teal)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 7,
                        padding: '6px 14px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >{emailSent ? '✓ Sent!' : 'Send via Mailchimp →'}</button>
                  </div>

                  {/* Test email */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="email"
                      placeholder="Send test to your email…"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        padding: '7px 11px',
                        border: '1px solid var(--border)',
                        borderRadius: 7,
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={async () => {
                        if (!testEmail || !testEmail.includes('@')) {
                          const input = document.querySelector('input[type="email"][placeholder="Send test to your email…"]') as HTMLInputElement;
                          if (input) { input.style.borderColor = 'var(--red)'; setTimeout(() => { input.style.borderColor = 'var(--border)'; }, 1500); }
                          return;
                        }
                        setTestSent(true);
                        try {
                          const res = await fetch('/api/email/test', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              to: testEmail,
                              firstName: currentContact?.name.split(' ')[0] || 'there',
                              firm: currentContact?.firm || 'your company',
                              sigFrom,
                              oePostEnabled,
                            }),
                          });
                          if (!res.ok) { const e = await res.json(); alert('Test failed: ' + (e.error || 'Unknown error')); setTestSent(false); return; }
                        } catch { setTestSent(false); return; }
                        setTimeout(() => setTestSent(false), 2500);
                      }}
                      style={{
                        background: testSent ? 'var(--green)' : 'var(--surface)',
                        color: testSent ? '#fff' : 'var(--teal)',
                        border: testSent ? 'none' : '1px solid var(--teal)',
                        borderRadius: 7,
                        padding: '7px 14px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >{testSent ? '✓ Sent to you' : 'Send test →'}</button>
                  </div>
                </div>
              )}

              {/* ── Tab 3: Activity Log ── */}
              {activeTab === 3 && (
                <div>
                  {/* Log form */}
                  <div style={{
                    background: '#f9f8f6',
                    borderRadius: 9,
                    padding: '16px 18px',
                    marginBottom: 20,
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)', marginBottom: 12 }}>Log Activity</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                      <select value={logMethod} onChange={(e) => setLogMethod(e.target.value)}>
                        <option value="email">Email</option>
                        <option value="call">Call</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="meeting">Meeting</option>
                      </select>
                      <select value={logOutcome} onChange={(e) => setLogOutcome(e.target.value)}>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                        <option value="sent">Sent</option>
                        <option value="no-reply">No reply</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Date (e.g. Mar 18)"
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
                      />
                      <select value={logBy} onChange={(e) => setLogBy(e.target.value)}>
                        <option value="cara">Cara Dingenthal</option>
                        <option value="kristen">Kristen Conklin</option>
                        <option value="peter">Peter Georgiou</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Notes…"
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      style={{
                        width: '100%',
                        resize: 'vertical',
                        minHeight: 64,
                        fontSize: 12.5,
                        borderRadius: 7,
                        padding: '8px 11px',
                        marginBottom: 10,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={submitActivityLog}
                      disabled={!logDate}
                      style={{
                        background: logDate ? 'var(--teal)' : '#e5e7eb',
                        color: logDate ? '#fff' : 'var(--light)',
                        border: 'none',
                        borderRadius: 7,
                        padding: '7px 16px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: logDate ? 'pointer' : 'default',
                        transition: 'background 0.15s',
                      }}
                    >Log activity</button>
                  </div>

                  {/* History */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--light)', marginBottom: 12 }}>History</div>
                    {activityEntries.map((entry, i) => {
                      const outcomeColors: Record<string, string> = {
                        positive: 'var(--green)', replied: 'var(--green)', sent: 'var(--teal)',
                        neutral: 'var(--amber)', negative: 'var(--red)', 'no-reply': 'var(--light)',
                      };
                      return (
                        <div key={i} style={{
                          display: 'flex',
                          gap: 12,
                          paddingBottom: 14,
                          marginBottom: 14,
                          borderBottom: i < activityEntries.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: outcomeColors[entry.outcome] || 'var(--light)',
                            flexShrink: 0,
                            marginTop: 4,
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{entry.method}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--light)' }}>{entry.date} · {entry.by}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{entry.notes}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Tab 4: Text / SMS ── */}
              {activeTab === 4 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    fontSize: 24,
                  }}>💬</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>SMS Sequencer</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.6 }}>
                    Multi-step SMS sequences for warm prospects. Coming in Q3 2026.
                  </div>
                  <div style={{
                    marginTop: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: '#f3f4f6',
                    color: '#9ca3af',
                  }}>Coming soon</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Audit Log Panel ─────────────────────────────────────── */}
      <AuditLogPanel
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        entries={auditLog}
      />

      {/* ── Import Contacts Modal ────────────────────────────────── */}
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      {/* ── Add Pipeline Modal ───────────────────────────────────── */}
      <AddPipelineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreatePipeline={handleCreatePipeline}
        nextId={allPipelines.length}
      />

    </>
  );
}
