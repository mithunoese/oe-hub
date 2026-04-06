import { NextRequest, NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import type { PipelineRow } from '@/data/pipelines';

let blocklistSchemaMigrated = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureBlocklistSchema(sql: NeonQueryFunction<any, any>) {
  if (blocklistSchemaMigrated) return;
  await sql`
    CREATE TABLE IF NOT EXISTS sf_blocklist (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      title TEXT,
      account_name TEXT,
      domain TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(email)
    )
  `;
  blocklistSchemaMigrated = true;
}

interface SFContact {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  accountName: string;
  industry?: string;
}

interface DedupResult {
  clean: PipelineRow[];
  duplicates: SFContact[];
  blocked: SFContact[];
  stats: { total: number; clean: number; duped: number; blocked: number };
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function emailDomain(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase().trim() : '';
}

function fuzzyNameMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  // Check if one contains the other (handles "John Smith" vs "John")
  if (na.includes(nb) || nb.includes(na)) return true;
  return false;
}

function contactToPipelineRow(c: SFContact): PipelineRow {
  return {
    firm: c.accountName,
    group: c.industry ?? '',
    contact: `${c.firstName} ${c.lastName}`.trim(),
    title: c.title,
    score: 50,
    status: 'none',
    li: false,
    by: '—',
    lastAct: '—',
    email: c.email,
  };
}

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const { contacts, mode } = (await req.json()) as {
      contacts: SFContact[];
      mode: 'blocklist' | 'prospects';
    };

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json({ error: 'Missing contacts array' }, { status: 400 });
    }
    if (!mode || !['blocklist', 'prospects'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode. Use blocklist or prospects' }, { status: 400 });
    }

    const sql = neon(dbUrl);
    await ensureBlocklistSchema(sql);

    if (mode === 'blocklist') {
      // Insert contacts into blocklist table, skip duplicates
      let inserted = 0;
      for (const c of contacts) {
        if (!c.email) continue;
        const domain = emailDomain(c.email);
        try {
          await sql`
            INSERT INTO sf_blocklist (email, first_name, last_name, title, account_name, domain)
            VALUES (${c.email.toLowerCase()}, ${c.firstName}, ${c.lastName}, ${c.title}, ${c.accountName}, ${domain})
            ON CONFLICT (email) DO NOTHING
          `;
          inserted++;
        } catch {
          // Skip individual insert errors
        }
      }
      return NextResponse.json({
        ok: true,
        inserted,
        total: contacts.length,
      });
    }

    // prospects mode — dedup against blocklist + existing pipeline
    const blocklistRows = await sql`SELECT email, domain, first_name, last_name FROM sf_blocklist`;
    const blockedEmails = new Set(blocklistRows.map((r) => (r.email as string).toLowerCase()));
    const blockedDomains = new Set(blocklistRows.map((r) => r.domain as string).filter(Boolean));
    const blockedNames = blocklistRows.map((r) => `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim());

    // Load existing pipeline rows
    const pipelineResult = await sql`SELECT rows, pipelines FROM pipeline_state WHERE id = 'default'`;
    const existingRows: PipelineRow[] = [];
    if (pipelineResult.length > 0) {
      // Collect rows from all pipelines
      const pipelines = pipelineResult[0].pipelines;
      if (Array.isArray(pipelines)) {
        for (const p of pipelines) {
          if (p && Array.isArray(p.rows)) {
            existingRows.push(...p.rows);
          }
        }
      }
      // Also check top-level rows
      const topRows = pipelineResult[0].rows;
      if (Array.isArray(topRows)) {
        existingRows.push(...topRows);
      }
    }

    const result: DedupResult = {
      clean: [],
      duplicates: [],
      blocked: [],
      stats: { total: contacts.length, clean: 0, duped: 0, blocked: 0 },
    };

    for (const c of contacts) {
      const email = (c.email ?? '').toLowerCase();
      const domain = emailDomain(email);
      const fullName = `${c.firstName} ${c.lastName}`.trim();

      // Check blocklist — by exact email, domain + fuzzy name
      if (email && blockedEmails.has(email)) {
        result.blocked.push(c);
        result.stats.blocked++;
        continue;
      }
      if (domain && blockedDomains.has(domain)) {
        const nameBlocked = blockedNames.some((bn) => fuzzyNameMatch(bn, fullName));
        if (nameBlocked) {
          result.blocked.push(c);
          result.stats.blocked++;
          continue;
        }
      }

      // Check existing pipeline — by firm name + contact name
      const firmNorm = normalize(c.accountName);
      const isDupe = existingRows.some((row) => {
        const rowFirm = normalize(row.firm);
        const rowContact = normalize(row.contact);
        if (firmNorm && rowFirm && fuzzyNameMatch(firmNorm, rowFirm)) {
          if (fuzzyNameMatch(fullName, row.contact)) return true;
        }
        // Also check by email if available
        if (email && row.email && email === row.email.toLowerCase()) return true;
        return false;
      });

      if (isDupe) {
        result.duplicates.push(c);
        result.stats.duped++;
        continue;
      }

      result.clean.push(contactToPipelineRow(c));
      result.stats.clean++;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[sf-dedup POST]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
