// ─── Types ────────────────────────────────────────────────────────────────────

export interface PipelineRow {
  firm: string;
  group: string;
  contact: string;
  title: string;
  score: number;
  status: 'none' | 'emailed' | 'replied';
  li: boolean;
  liUsername?: string;
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
    count: 12,
    agentTitle: 'Context Agent — ASCO 2026',
    chips: ['Oncology / Pharma', 'Medical conference', 'US biotech', 'Phase III trials'],
    stats: [
      { label: 'Total firms', val: '12' },
      { label: 'Score ≥ 70', val: '12', hi: true },
      { label: 'LinkedIn verified', val: '12' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent', val: '0' },
    ],
    eyebrow: 'Conference Outreach',
    title: 'ASCO 2026 Pharma Tracker',
    sub: 'Key pharma and biotech companies attending ASCO 2026 — scored by comms need and OE fit.',
    tableFooter: '',
    rows: [
      { firm: 'BeOne Medicines', group: 'Oncology', contact: 'Eleanor K. Duff, PhD', title: 'SVP, Head of Corporate Communications', score: 82, status: 'none', li: true, liUsername: 'eleanorduff', by: 'Mithun', lastAct: '' },
      { firm: 'Iovance Biotherapeutics', group: 'Oncology', contact: 'Sara Pellegrino', title: 'SVP, IR and Corporate Communications', score: 88, status: 'none', li: true, liUsername: 'sara-pellegrino-irc-06283816', by: 'Mithun', lastAct: '' },
      { firm: 'BioCryst Pharmaceuticals', group: 'Rare Disease', contact: 'Lauren Iacono', title: 'VP, Corporate Communications', score: 75, status: 'none', li: true, liUsername: 'laureniacono', by: 'Mithun', lastAct: '' },
      { firm: 'BioMarin Pharmaceutical', group: 'Rare Disease', contact: 'Erin Rau', title: 'VP Corporate Communications', score: 76, status: 'none', li: true, liUsername: 'erin-rau-088a5255', by: 'Mithun', lastAct: '' },
      { firm: 'Merck', group: 'Big Pharma', contact: 'Courtney Ronaldo', title: 'Assoc. VP, Global Communications', score: 90, status: 'none', li: true, liUsername: 'courtney-ronaldo', by: 'Mithun', lastAct: '' },
      { firm: 'Ionis Pharmaceuticals', group: 'RNA Therapeutics', contact: 'Hayley Soffer', title: 'VP, Corporate Communications', score: 79, status: 'none', li: true, liUsername: 'hayley-soffer-114ba44', by: 'Mithun', lastAct: '' },
      { firm: 'Phathom Pharmaceuticals', group: 'GI', contact: 'Nick Benedetto', title: 'VP, Corporate Communications', score: 71, status: 'none', li: true, liUsername: 'nickbenedetto', by: 'Mithun', lastAct: '' },
      { firm: 'BioNTech', group: 'Oncology / mRNA', contact: 'Dr. Nathalie Knappe', title: 'Director Investor Relations', score: 85, status: 'none', li: true, liUsername: 'nathalieknappe', by: 'Mithun', lastAct: '' },
      { firm: 'Incyte', group: 'Oncology / Inflammation', contact: 'Michael Horowicz', title: 'Director, Investor Relations', score: 80, status: 'none', li: true, liUsername: 'michaelhorowicz', by: 'Mithun', lastAct: '' },
      { firm: 'Madrigal Pharmaceuticals', group: 'NASH / Liver', contact: 'Benazir Ali', title: 'Director of Investor Relations', score: 77, status: 'none', li: true, liUsername: 'benaziralimd', by: 'Mithun', lastAct: '' },
      { firm: 'Cogent Biosciences', group: 'Oncology', contact: 'Christi Waarich', title: 'Sr. Director, Investor Relations', score: 74, status: 'none', li: true, liUsername: 'christiwaarich', by: 'Mithun', lastAct: '' },
      { firm: 'Aktis Oncology', group: 'Oncology', contact: 'Andrew Lerner', title: 'Director, Corporate Affairs and IR', score: 70, status: 'none', li: true, liUsername: 'lernerandrew', by: 'Mithun', lastAct: '' },
    ],
  },
  {
    id: 2,
    name: 'Zoom Pipeline',
    count: 12,
    agentTitle: 'Context Agent — Zoom Pipeline',
    chips: ['SaaS / Tech', 'Zoom customers', 'Hybrid events', '200–2000 employees'],
    stats: [
      { label: 'Total contacts', val: '12' },
      { label: 'Score ≥ 75', val: '10', hi: true },
      { label: 'LinkedIn verified', val: '12' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent', val: '0' },
    ],
    eyebrow: 'Partner Channel',
    title: 'Zoom Pipeline',
    sub: 'High-fit contacts from Zoom customer base — transitioning to broadcast-grade events.',
    tableFooter: '',
    rows: [
      { firm: 'Salesforce', group: 'Enterprise SaaS', contact: 'Melanie Woods', title: 'Director, Internal Communications', score: 92, status: 'none', li: true, liUsername: 'melwoods', by: 'Mithun', lastAct: '' },
      { firm: 'Workday', group: 'Enterprise SaaS', contact: 'Grant Wright', title: 'Head of Global Employee Communications', score: 88, status: 'none', li: true, liUsername: 'grantpwright', by: 'Mithun', lastAct: '' },
      { firm: 'ServiceNow', group: 'Enterprise SaaS', contact: 'Mayuko Ogata', title: 'Sr. Director, Head of Corporate Comms Japan', score: 78, status: 'none', li: true, liUsername: 'mayukoogata', by: 'Mithun', lastAct: '' },
      { firm: 'Atlassian', group: 'Dev Tools', contact: 'Linda Shanley', title: 'VP Events, Community & Evangelism', score: 85, status: 'none', li: true, liUsername: 'lindalshanley', by: 'Mithun', lastAct: '' },
      { firm: 'Databricks', group: 'Data / AI', contact: 'Amy Mackreth', title: 'VP, Global Event Marketing', score: 87, status: 'none', li: true, liUsername: 'amymackreth', by: 'Mithun', lastAct: '' },
      { firm: 'Databricks', group: 'Data / AI', contact: 'Beau Beckner', title: 'Head of Corporate Event Technology & Production', score: 90, status: 'none', li: true, liUsername: 'beau-beckner-ba174477', by: 'Mithun', lastAct: '' },
      { firm: 'Proofpoint', group: 'Cybersecurity', contact: 'Sandra Barba', title: 'Director, Global Corporate Events', score: 80, status: 'none', li: true, liUsername: 'sandra-barba-42356b8b', by: 'Mithun', lastAct: '' },
      { firm: 'Appspace', group: 'Workplace Tech', contact: 'Shelly Del Rosario', title: 'Director of Events', score: 76, status: 'none', li: true, liUsername: 'shellydelrosario', by: 'Mithun', lastAct: '' },
      { firm: 'Docker', group: 'Dev Tools', contact: 'Keirah Davis', title: 'Sr. Director, Global Strategic Events', score: 82, status: 'none', li: true, liUsername: 'keirahjd', by: 'Mithun', lastAct: '' },
      { firm: 'Arizent', group: 'B2B Media', contact: 'Anisha Arouza', title: 'Sr. Director, Event Management & Technology', score: 79, status: 'none', li: true, liUsername: 'anishaarouza', by: 'Mithun', lastAct: '' },
      { firm: 'Atlassian', group: 'Dev Tools', contact: 'Charlotte Pedersen', title: 'Head of Global Events', score: 86, status: 'none', li: true, liUsername: 'charlotte-pedersen-cmp-39303a2', by: 'Mithun', lastAct: '' },
      { firm: 'Virtuous', group: 'Nonprofit Tech', contact: 'Monica McQueen', title: 'Corporate Events Director', score: 72, status: 'none', li: true, liUsername: 'monmcqueen', by: 'Mithun', lastAct: '' },
    ],
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
