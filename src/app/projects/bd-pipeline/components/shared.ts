import type { PipelineRow, Pipeline } from '@/data/pipelines';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactInfo {
  name: string;
  title: string;
  firm: string;
  score: number;
  status: string;
  li: boolean;
  liUsername?: string;
}

export interface AuditEntry {
  time: string;
  action: string;
  by: string;
  detail: string;
}

export interface ActivityEntry {
  method: string;
  outcome: string;
  date: string;
  by: string;
  notes: string;
}

export interface IcpSignals {
  firmographic: number;
  eventVolume: number;
  techStack: number;
  linkedin: number;
  buyingIntent: number;
}

export interface EmailHistoryItem {
  id: number;
  pipeline_name: string;
  sent_by: string;
  sent_at: string;
  send_type: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function scoreColor(score: number): string {
  if (score >= 75) return 'var(--green)';
  if (score >= 60) return 'var(--amber)';
  return 'var(--score-lo)';
}

export function scoreBg(score: number): string {
  if (score >= 75) return '#dcfce7';
  if (score >= 60) return '#fef3c7';
  return '#f3f4f6';
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    emailed: { label: 'Emailed', bg: 'var(--teal-light)', color: 'var(--teal)' },
    replied: { label: 'Replied', bg: '#dcfce7', color: 'var(--green)' },
    none: { label: '—', bg: 'transparent', color: 'var(--light)' },
  };
  return map[status] || map.none;
}

export function getInitials(name: string): string {
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name[0] || '?';
}

export function getNextStep(status: string, score: number) {
  if (status === 'replied') return { text: 'Schedule 20-min discovery call', bg: '#dcfce7', color: 'var(--green)' };
  if (status === 'emailed') return { text: 'Follow up — 3 days', bg: '#fef3c7', color: 'var(--amber)' };
  if (status === 'none' && score >= 75) return { text: 'Send initial outreach email', bg: 'var(--teal-light)', color: 'var(--teal)' };
  return { text: 'Verify LinkedIn before outreach', bg: '#fef3c7', color: 'var(--amber)' };
}

export const repNames: Record<string, string> = {
  cara: 'Cara Dingenthal',
  kristen: 'Kristen Conklin',
  peter: 'Peter Georgiou',
};

export const panelTabs = ['Contact', 'LinkedIn Posts', 'Draft Email', 'Activity Log', 'Text / SMS'];
