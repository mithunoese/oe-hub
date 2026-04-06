import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

interface SFContact {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  accountName: string;
  industry?: string;
}

interface SFQueryRecord {
  FirstName: string | null;
  LastName: string | null;
  Email: string | null;
  Title: string | null;
  Account?: { Name: string | null; Industry?: string | null };
}

async function querySalesforce(soql: string): Promise<SFQueryRecord[]> {
  const accessToken = process.env.SF_ACCESS_TOKEN;
  const instanceUrl = process.env.SF_INSTANCE_URL || 'https://openexchange.my.salesforce.com';

  if (!accessToken) {
    throw new Error('SF_ACCESS_TOKEN not configured');
  }

  const url = `${instanceUrl}/services/data/v60.0/query?q=${encodeURIComponent(soql)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Salesforce API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const records: SFQueryRecord[] = data.records ?? [];

  // Handle pagination — SF returns nextRecordsUrl for large result sets
  let nextUrl: string | null = data.nextRecordsUrl ?? null;
  while (nextUrl) {
    const nextRes = await fetch(`${instanceUrl}${nextUrl}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!nextRes.ok) break;
    const nextData = await nextRes.json();
    records.push(...(nextData.records ?? []));
    nextUrl = nextData.nextRecordsUrl ?? null;
  }

  return records;
}

function mapRecords(records: SFQueryRecord[], includeIndustry: boolean): SFContact[] {
  return records.map((r) => {
    const contact: SFContact = {
      firstName: r.FirstName ?? '',
      lastName: r.LastName ?? '',
      email: r.Email ?? '',
      title: r.Title ?? '',
      accountName: r.Account?.Name ?? '',
    };
    if (includeIndustry) {
      contact.industry = r.Account?.Industry ?? '';
    }
    return contact;
  });
}

const ALLOWED_INDUSTRIES = [
  'Healthcare', 'Technology', 'Financial Services', 'Energy',
  'Manufacturing', 'Media', 'Retail', 'Education', 'Communications',
  'Pharmaceuticals', 'Biotechnology', 'Insurance', 'Real Estate',
  'Government', 'Nonprofit', 'Professional Services', 'Consulting',
];

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (!type || !['blocklist', 'prospects'].includes(type)) {
    return NextResponse.json(
      { error: 'Missing or invalid type param. Use ?type=blocklist or ?type=prospects&industry=Healthcare' },
      { status: 400 },
    );
  }

  try {
    if (type === 'blocklist') {
      const soql = `SELECT FirstName, LastName, Email, Title, Account.Name FROM Contact WHERE Id IN (SELECT Requester_Contact__c FROM Order WHERE Channel_Agency_Referral__c != '001d0000010b5x0AAA' AND Requester_Contact__c != null AND End_Date__c >= 2025-01-01)`;
      const records = await querySalesforce(soql);
      const contacts = mapRecords(records, false);
      return NextResponse.json({ contacts, total: contacts.length });
    }

    // prospects
    const industry = searchParams.get('industry');
    if (!industry) {
      return NextResponse.json({ error: 'Missing industry param for prospects query' }, { status: 400 });
    }

    if (!ALLOWED_INDUSTRIES.includes(industry)) {
      return NextResponse.json({ error: 'Invalid industry value' }, { status: 400 });
    }
    // Industry is from allowlist, safe to interpolate
    const soql = `SELECT FirstName, LastName, Email, Title, Account.Name, Account.Industry FROM Contact WHERE AccountId NOT IN (SELECT AccountId FROM Order WHERE End_Date__c >= 2024-01-01) AND Account.Industry = '${industry}' AND Email != null`;
    const records = await querySalesforce(soql);
    const contacts = mapRecords(records, true);
    return NextResponse.json({ contacts, total: contacts.length });
  } catch (err) {
    console.error('[sf-query GET]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
