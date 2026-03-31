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
    count: 42,
    agentTitle: 'Context Agent — Corp Comms',
    chips: ['Corp Comms Agencies', 'Town halls · Webcasts', 'Fortune 500 clients', '500+ employees'],
    stats: [
      { label: 'Total firms', val: '42' },
      { label: 'Score ≥ 65', val: '42', hi: true },
      { label: 'LinkedIn verified', val: '42' },
      { label: 'Emails drafted', val: '0' },
      { label: 'Sent via Mailchimp', val: '0' },
    ],
    eyebrow: 'Sales Cycle Outreach',
    title: 'Corp Comms Prospector',
    sub: 'AI-identified contacts at corporate comms agencies — scored against ICP, LinkedIn-verified.',
    tableFooter: '',
    rows: [
      { firm: 'Gatehouse', group: 'Priority', contact: 'Chris Lee', title: 'VP, Communications (Gallagher Employee Experience)', score: 81, status: 'none', li: true, liUsername: 'chris-lee-9072541', by: 'Cara', lastAct: '' },
      { firm: 'ScarlettAbbott', group: 'Priority', contact: 'Gonzalo Shoobridge', title: 'Director of Consultancy, Employee Experience & Internal Comms', score: 80, status: 'none', li: true, liUsername: 'gonzaloshoobridge', by: 'Cara', lastAct: '' },
      { firm: 'Brilliant Ink', group: 'Priority', contact: 'Ann Melinger', title: 'CEO & Owner', score: 79, status: 'none', li: true, liUsername: 'annmelinger', by: 'Cara', lastAct: '' },
      { firm: 'Davis & Company', group: 'Priority', contact: 'Alyssa Zeff', title: 'VP & Head of Engagement Agency (bswift)', score: 78, status: 'none', li: true, liUsername: 'alyssa-weiskopf-zeff-44097a', by: 'Cara', lastAct: '' },
      { firm: 'DRPG', group: 'Priority', contact: 'Andy Wilkinson', title: 'Group Sales Director', score: 84, status: 'none', li: true, liUsername: 'adpwilkinson', by: 'Cara', lastAct: '' },
      { firm: 'Jack Morton Worldwide', group: 'Priority', contact: 'Michelle Gallagher', title: 'SVP, Director of Client Services', score: 83, status: 'none', li: true, liUsername: '1michellegallagher', by: 'Cara', lastAct: '' },
      { firm: 'InVision Communications', group: 'Priority', contact: 'Kate Crotty', title: 'VP, Client Services / Executive Producer', score: 82, status: 'none', li: true, liUsername: 'kate-crotty-48690953', by: 'Cara', lastAct: '' },
      { firm: 'Sparks', group: 'Priority', contact: 'Adam Charles', title: 'Chief Growth Officer', score: 81, status: 'none', li: true, liUsername: 'charlesadam', by: 'Cara', lastAct: '' },
      { firm: 'Emperor', group: 'Priority', contact: 'Zoe Tisdall', title: 'Client Development Director', score: 80, status: 'none', li: true, liUsername: 'zo%C3%AB-tisdall-3636529', by: 'Cara', lastAct: '' },
      { firm: 'JPL', group: 'Priority', contact: 'Kelly Seipe', title: 'Chief Growth Officer', score: 79, status: 'none', li: true, liUsername: 'kelly-seipe-723820b', by: 'Cara', lastAct: '' },
      { firm: 'ROI Communication', group: 'Internal Comms', contact: 'Barbara Fagan', title: 'CEO & Founder', score: 77, status: 'none', li: true, liUsername: 'barbaramfagan', by: 'Cara', lastAct: '' },
      { firm: 'Blue Beyond Consulting', group: 'Internal Comms', contact: 'Cheryl Fields Tyler', title: 'Founder & CEO (now under BDO USA)', score: 76, status: 'none', li: true, liUsername: 'cherylfieldstyler', by: 'Cara', lastAct: '' },
      { firm: 'Sequel Group', group: 'Internal Comms', contact: 'Suzanne Peck', title: 'Managing Director', score: 75, status: 'none', li: true, liUsername: 'suzannepeck1', by: 'Cara', lastAct: '' },
      { firm: 'Brandpie', group: 'Internal Comms', contact: 'Will Bosanko', title: 'CEO, EMEIA', score: 74, status: 'none', li: true, liUsername: 'will-bosanko', by: 'Cara', lastAct: '' },
      { firm: 'MSL Employee Practice', group: 'Internal Comms', contact: 'Nicole Messier', title: 'Managing Director, Corporate at MSL/Publicis', score: 73, status: 'none', li: true, liUsername: 'nicolemessier', by: 'Cara', lastAct: '' },
      { firm: 'Freeman', group: 'Event + Broadcast', contact: 'Janet Dell', title: 'CEO', score: 84, status: 'none', li: true, liUsername: 'janetdell', by: 'Cara', lastAct: '' },
      { firm: 'George P. Johnson (GPJ)', group: 'Event + Broadcast', contact: 'Fiona Bruder', title: 'Global CEO', score: 83, status: 'none', li: true, liUsername: 'fiona-bruder-57b8751', by: 'Cara', lastAct: '' },
      { firm: 'Imagination', group: 'Event + Broadcast', contact: 'James Meyers', title: 'President, CEO & Founder', score: 82, status: 'none', li: true, liUsername: 'jamesemeyers', by: 'Cara', lastAct: '' },
      { firm: 'TBA Global', group: 'Event + Broadcast', contact: 'Heather Morgan', title: 'General Manager', score: 81, status: 'none', li: true, liUsername: 'heather-morgan-5265448', by: 'Cara', lastAct: '' },
      { firm: 'Peppercomm', group: 'Boutique', contact: 'Jacqueline Kolek', title: 'MD and Co-President (Ruder Finn Group)', score: 71, status: 'none', li: true, liUsername: 'jacquelinekolek', by: 'Cara', lastAct: '' },
      { firm: 'Prosek Partners', group: 'Boutique', contact: 'Asher Levine', title: 'Managing Director', score: 70, status: 'none', li: true, liUsername: 'asher-j-levine', by: 'Cara', lastAct: '' },
      { firm: 'Mission North', group: 'Boutique', contact: 'Meghan Gardner', title: 'EVP, Enterprise and Consumer Tech', score: 76, status: 'none', li: true, liUsername: 'meghansgardner', by: 'Cara', lastAct: '' },
      { firm: 'Seven Letter', group: 'Boutique', contact: 'Maura Hogan', title: 'Senior Director (now AVP at Emerson College)', score: 75, status: 'none', li: true, liUsername: 'maurarhogan', by: 'Cara', lastAct: '' },
      { firm: 'Padilla', group: 'Boutique', contact: 'Brooke Worden', title: 'SVP, Corporate Strategic Advisory', score: 74, status: 'none', li: true, liUsername: 'brookeworden', by: 'Cara', lastAct: '' },
      { firm: 'Lansons', group: 'Boutique', contact: 'Laura Hastings', title: 'CEO', score: 73, status: 'none', li: true, liUsername: '1laurahastings', by: 'Cara', lastAct: '' },
      { firm: 'Decker Communications', group: 'Boutique', contact: 'Sherri Wilkins', title: 'President', score: 72, status: 'none', li: true, liUsername: 'sherriwilkins', by: 'Cara', lastAct: '' },
      { firm: 'Bully Pulpit International', group: 'Boutique', contact: 'Andrew Bleeker', title: 'CEO', score: 71, status: 'none', li: true, liUsername: 'andrew-bleeker-b7a9a72a', by: 'Cara', lastAct: '' },
      { firm: 'Edelman', group: 'Enterprise', contact: 'Cydney Roach', title: 'Global Chair, Workplace Advisory', score: 88, status: 'none', li: true, liUsername: 'cydneyroach', by: 'Cara', lastAct: '' },
      { firm: 'Weber Shandwick', group: 'Enterprise', contact: 'Kate Bullinger', title: 'CEO, United Minds', score: 87, status: 'none', li: true, liUsername: 'kate-bullinger', by: 'Cara', lastAct: '' },
      { firm: 'APCO Worldwide', group: 'Enterprise', contact: 'Mara Hedgecoth', title: 'Chief Communications & Marketing Officer', score: 86, status: 'none', li: true, liUsername: 'mara-hedgecoth-abb651a', by: 'Cara', lastAct: '' },
      { firm: 'BCW (Burson Cohn & Wolfe)', group: 'Enterprise', contact: 'Eric Watnik', title: 'Executive VP at Burson', score: 85, status: 'none', li: true, liUsername: 'watnik', by: 'Cara', lastAct: '' },
      { firm: 'FleishmanHillard', group: 'Enterprise', contact: 'Rachel Catanach', title: 'Global MD, Corporate Affairs & GM New York', score: 91, status: 'none', li: true, liUsername: 'rachel-catanach-1380834', by: 'Cara', lastAct: '' },
      { firm: 'Brunswick Group', group: 'Enterprise', contact: 'Cara Mooses', title: 'Director, Sustainable Business', score: 90, status: 'none', li: true, liUsername: 'caramooses', by: 'Cara', lastAct: '' },
      { firm: 'FGS Global', group: 'Enterprise', contact: 'Michael Ahrens', title: 'Managing Director', score: 89, status: 'none', li: true, liUsername: 'michael-ahrens-82126755', by: 'Cara', lastAct: '' },
      { firm: 'Teneo', group: 'Enterprise', contact: 'Geoff Morrell', title: 'President, Global Strategy & Communications', score: 88, status: 'none', li: true, liUsername: 'geoffmorrell', by: 'Cara', lastAct: '' },
      { firm: 'Kekst CNC', group: 'Enterprise', contact: 'Richard Campbell', title: 'Co-CEO', score: 87, status: 'none', li: true, liUsername: 'richard-campbell-87b863', by: 'Cara', lastAct: '' },
      { firm: 'Ruder Finn', group: 'Enterprise', contact: 'Kate Hardin', title: 'Executive Vice President', score: 86, status: 'none', li: true, liUsername: 'kate-hardin-7836961b', by: 'Cara', lastAct: '' },
      { firm: 'The Grossman Group', group: 'New', contact: 'David Grossman', title: 'Founder & CEO', score: 80, status: 'none', li: true, liUsername: 'davidgrossmanaprabc', by: 'Cara', lastAct: '' },
      { firm: 'Gagen MacDonald', group: 'New', contact: 'Maril Gagen MacDonald', title: 'Founder & CEO', score: 79, status: 'none', li: true, liUsername: 'marilmacdonald', by: 'Cara', lastAct: '' },
      { firm: 'Ketchum', group: 'New', contact: 'Lauren Butler', title: 'MD, Employee Communications and Engagement', score: 78, status: 'none', li: true, liUsername: 'lauren-butler-ab20542', by: 'Cara', lastAct: '' },
      { firm: 'H+K Strategies', group: 'New', contact: 'Dan Coles', title: 'Sr. Assoc. Director, Change & Employee Experience', score: 77, status: 'none', li: true, liUsername: 'dancoles1', by: 'Cara', lastAct: '' },
      { firm: 'Porter Novelli', group: 'New', contact: 'Heidi P.T. Upton', title: 'VP, Employee Communications', score: 76, status: 'none', li: true, liUsername: 'heidiupton', by: 'Cara', lastAct: '' },
    ],
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
