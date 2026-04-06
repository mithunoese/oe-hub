import { NextRequest, NextResponse } from 'next/server';
import { querySalesforce } from '@/lib/salesforce';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AccountRecord {
  Name: string;
  Owner?: { Name: string; IsActive: boolean };
}

interface VerifyResult {
  company: string;
  sfName: string | null;
  owner: string | null;
  ownerActive: boolean | null;
  found: boolean;
}

interface VerifyResponse {
  results: VerifyResult[];
  notFound: string[];
  queriedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape single quotes for SOQL string literals. */
function escapeSoql(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Common corporate suffixes to strip for fuzzy matching. */
const CORPORATE_SUFFIXES = [
  /,?\s+Inc\.?$/i,
  /,?\s+Corp\.?$/i,
  /,?\s+Corporation$/i,
  /,?\s+Company$/i,
  /,?\s+Co\.?$/i,
  /,?\s+LLC$/i,
  /,?\s+L\.L\.C\.?$/i,
  /,?\s+Ltd\.?$/i,
  /,?\s+Limited$/i,
  /,?\s+LP$/i,
  /,?\s+L\.P\.?$/i,
  /,?\s+PLC$/i,
  /,?\s+GmbH$/i,
  /,?\s+AG$/i,
  /,?\s+S\.A\.?$/i,
  /,?\s+N\.V\.?$/i,
];

function stripSuffix(name: string): string {
  let result = name.trim();
  for (const re of CORPORATE_SUFFIXES) {
    result = result.replace(re, '');
  }
  return result.trim();
}

/**
 * Build a deduplicated set of name variants for fuzzy matching.
 * Always includes the original name; adds stripped version if different.
 */
function buildNameVariants(companies: string[]): string[] {
  const seen = new Set<string>();
  const variants: string[] = [];

  for (const raw of companies) {
    const name = raw.trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      variants.push(name);
    }
    const stripped = stripSuffix(name);
    const strippedLower = stripped.toLowerCase();
    if (stripped && strippedLower !== lower && !seen.has(strippedLower)) {
      seen.add(strippedLower);
      variants.push(stripped);
    }
  }

  return variants;
}

/**
 * Match SF Account records back to the original company names.
 * Uses case-insensitive comparison; tries stripped variants too.
 */
function matchResults(
  companies: string[],
  records: AccountRecord[],
): VerifyResponse {
  // Build lookup: lowercase SF name → record
  const sfLookup = new Map<string, AccountRecord>();
  for (const rec of records) {
    if (rec.Name) {
      sfLookup.set(rec.Name.toLowerCase(), rec);
    }
  }

  const results: VerifyResult[] = [];
  const notFound: string[] = [];

  for (const raw of companies) {
    const company = raw.trim();
    if (!company) continue;

    // Try exact (case-insensitive)
    let match = sfLookup.get(company.toLowerCase()) ?? null;

    // Try stripped variant
    if (!match) {
      const stripped = stripSuffix(company);
      if (stripped.toLowerCase() !== company.toLowerCase()) {
        match = sfLookup.get(stripped.toLowerCase()) ?? null;
      }
    }

    if (match) {
      results.push({
        company,
        sfName: match.Name,
        owner: match.Owner?.Name ?? null,
        ownerActive: match.Owner?.IsActive ?? null,
        found: true,
      });
    } else {
      results.push({
        company,
        sfName: null,
        owner: null,
        ownerActive: null,
        found: false,
      });
      notFound.push(company);
    }
  }

  return {
    results,
    notFound,
    queriedAt: new Date().toISOString(),
  };
}

/**
 * Core verify logic shared by GET and POST.
 */
async function verifyCompanies(companies: string[]): Promise<VerifyResponse> {
  const cleaned = companies
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (cleaned.length === 0) {
    return { results: [], notFound: [], queriedAt: new Date().toISOString() };
  }

  // Build name variants for fuzzy matching
  const variants = buildNameVariants(cleaned);

  // Build IN clause with escaped names
  const inClause = variants.map((n) => `'${escapeSoql(n)}'`).join(',');

  const soql =
    `SELECT Name, Owner.Name, Owner.IsActive FROM Account WHERE Name IN (${inClause})`;

  const records = await querySalesforce<AccountRecord>(soql);

  return matchResults(cleaned, records);
}

// ---------------------------------------------------------------------------
// GET  /api/sf-verify?companies=Company1,Company2
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companiesParam = searchParams.get('companies');

  if (!companiesParam) {
    return NextResponse.json(
      {
        error:
          'Missing ?companies param. Provide comma-separated company names (URL-encoded).',
      },
      { status: 400 },
    );
  }

  const companies = companiesParam.split(',').map((c) => c.trim());

  try {
    const data = await verifyCompanies(companies);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[sf-verify GET]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/sf-verify
// Body: { "companies": [...] }  or  { "soql": "SELECT ..." }
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Raw SOQL mode (advanced)
    if (typeof body.soql === 'string' && body.soql.trim().length > 0) {
      const records = await querySalesforce(body.soql.trim());
      return NextResponse.json({
        records,
        total: records.length,
        queriedAt: new Date().toISOString(),
      });
    }

    // Company verification mode
    if (!Array.isArray(body.companies) || body.companies.length === 0) {
      return NextResponse.json(
        {
          error:
            'Request body must include "companies" (string[]) or "soql" (string).',
        },
        { status: 400 },
      );
    }

    const companies: string[] = body.companies.map(String);
    const data = await verifyCompanies(companies);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[sf-verify POST]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
