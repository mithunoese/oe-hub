// ─── Types ────────────────────────────────────────────────────────────────────

export interface PipelineRow {
  firm: string;
  group: string;
  contact: string;
  title: string;
  score: number;
  status: 'none' | 'emailed' | 'replied';
  li: boolean;
  by: string;
  lastAct: string;
  dim?: boolean;
  email?: string;
}

export interface PipelineStat {
  label: string;
  val: string;
  hi?: boolean;
}

export interface Pipeline {
  id: number;
  name: string;
  count: number;
  agentTitle: string;
  chips: string[];
  stats: PipelineStat[];
  eyebrow: string;
  title: string;
  sub: string;
  tableFooter: string;
  rows: PipelineRow[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const pipelines: Pipeline[] = [
  {
    id: 0,
    name: 'Corp Comms',
    count: 0,
    agentTitle: 'Context Agent — Corp Comms',
    chips: ['Corp Comms Agencies', 'Town halls · Webcasts', 'Fortune 500 clients', '500+ employees'],
    stats: [
      { label: 'Total firms', val: '0' },
      { label: 'Score ≥ 65', val: '0', hi: true },
      { label: 'LinkedIn verified', val: '0' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent via Mailchimp', val: '0' },
    ],
    eyebrow: 'Sales Cycle Outreach',
    title: 'Corp Comms Prospector',
    sub: 'AI-identified contacts at corporate comms agencies — scored against ICP, LinkedIn-verified.',
    tableFooter: '',
    rows: [],
  },
  {
    id: 1,
    name: 'ASCO 2026',
    count: 0,
    agentTitle: 'Context Agent — ASCO 2026',
    chips: ['Oncology / Pharma', 'Medical conference', 'US biotech', 'Phase III trials'],
    stats: [
      { label: 'Total firms', val: '0' },
      { label: 'Score ≥ 70', val: '0', hi: true },
      { label: 'LinkedIn verified', val: '0' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent', val: '0' },
    ],
    eyebrow: 'Conference Outreach',
    title: 'ASCO 2026 Pharma Tracker',
    sub: 'Key pharma and biotech companies attending ASCO 2026 — scored by comms need and OE fit.',
    tableFooter: '',
    rows: [],
  },
  {
    id: 2,
    name: 'Zoom Pipeline',
    count: 0,
    agentTitle: 'Context Agent — Zoom Pipeline',
    chips: ['SaaS / Tech', 'Zoom customers', 'Hybrid events', '200–2000 employees'],
    stats: [
      { label: 'Total contacts', val: '0' },
      { label: 'Score ≥ 75', val: '0', hi: true },
      { label: 'LinkedIn verified', val: '0' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent', val: '0' },
    ],
    eyebrow: 'Partner Channel',
    title: 'Zoom Pipeline',
    sub: 'High-fit contacts from Zoom customer base — transitioning to broadcast-grade events.',
    tableFooter: '',
    rows: [],
  },
];

// ─── LinkedIn Posts ────────────────────────────────────────────────────────────

export const CONTACT_LINKEDIN_POSTS: Record<string, { date: string; text: string; hook: string }[]> = {
  default: [
    {
      date: '',
      text: 'No LinkedIn posts found for this contact. Add their LinkedIn URL to pull recent activity.',
      hook: '',
    },
  ],
};

// ─── Next-Best Alternatives ────────────────────────────────────────────────────

export const CONTACT_NEXT_BEST: Record<string, { name: string; title: string; initials: string; score: number; color: string }> = {};
