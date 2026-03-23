import { NextRequest, NextResponse } from 'next/server';

const FROM_EMAIL = 'mithun.manjunatha@openexc.com';
const FROM_NAME = 'Mithun Manjunatha';

interface Contact {
  firm: string;
  contact: string;
  title: string;
  score: number;
  status: string;
  by: string;
  email?: string;
}

async function getOrCreateAudience(
  base: string,
  headers: Record<string, string>,
  pipelineName: string
): Promise<string> {
  const res = await fetch(`${base}/lists?count=20`, { headers });
  const { lists } = await res.json();

  const audienceName = `${pipelineName} Outreach`;
  if (lists?.length) {
    const match = lists.find(
      (l: { name: string; id: string }) =>
        l.name === audienceName ||
        l.name.toLowerCase().includes(pipelineName.toLowerCase().split(' ')[0])
    );
    if (match) return match.id;
  }

  // Create audience for this pipeline
  const createRes = await fetch(`${base}/lists`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: audienceName,
      contact: {
        company: 'OpenExchange',
        address1: '1 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
      },
      permission_reminder:
        'You are receiving this as part of OpenExchange BD outreach.',
      email_type_option: false,
      campaign_defaults: {
        from_name: FROM_NAME,
        from_email: FROM_EMAIL,
        subject: 'OpenExchange',
        language: 'en',
      },
    }),
  });
  const created = await createRes.json();
  if (!created.id)
    throw new Error('Failed to create audience: ' + JSON.stringify(created));
  return created.id;
}

export async function POST(req: NextRequest) {
  const { contacts, pipelineName } = await req.json() as {
    contacts: Contact[];
    pipelineName: string;
  };

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey)
    return NextResponse.json({ error: 'MAILCHIMP_API_KEY not configured' }, { status: 500 });

  const emailContacts = contacts.filter((c) => c.email);
  if (!emailContacts.length)
    return NextResponse.json({ error: 'No contacts with email addresses' }, { status: 400 });

  const server = apiKey.split('-').pop()?.trim();
  const base = `https://${server}.api.mailchimp.com/3.0`;
  const auth = 'Basic ' + Buffer.from(`anystring:${apiKey}`).toString('base64');
  const headers = { Authorization: auth, 'Content-Type': 'application/json' };

  let listId: string;
  try {
    listId = await getOrCreateAudience(base, headers, pipelineName);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  // Build score bucket tag
  const scoreBucket = (score: number) =>
    score >= 75 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low';

  const members = emailContacts.map((c) => ({
    email_address: c.email!,
    status_if_new: 'subscribed',
    merge_fields: {
      FNAME: c.contact?.split(' ')[0] || '',
      LNAME: c.contact?.split(' ').slice(1).join(' ') || '',
      COMPANY: c.firm || '',
      MMERGE6: c.title || '',
    },
    tags: [pipelineName, scoreBucket(c.score), c.by].filter(
      (t) => t && t !== '—'
    ),
  }));

  // Mailchimp batch subscribe
  const batchRes = await fetch(`${base}/lists/${listId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ members, update_existing: true }),
  });
  const result = await batchRes.json();

  if (result.error_count > 0) {
    console.error('Mailchimp batch errors:', result.errors);
  }

  return NextResponse.json({
    ok: true,
    synced: (result.total_created || 0) + (result.total_updated || 0),
    created: result.total_created || 0,
    updated: result.total_updated || 0,
    errors: result.error_count || 0,
    listId,
    audienceName: `${pipelineName} Outreach`,
  });
}
