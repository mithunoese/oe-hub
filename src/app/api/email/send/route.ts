import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { REP_NAMES, buildEmailHtml } from '@/lib/email-template';
import { requireAuth } from '@/lib/api-auth';

const FROM_EMAIL = process.env.FROM_EMAIL || 'outreach@openexc.com';
const FROM_NAME = process.env.FROM_NAME || 'OpenExchange';

async function getOrCreateList(base: string, headers: Record<string, string>): Promise<string> {
  const res = await fetch(`${base}/lists?count=10`, { headers });
  const { lists } = await res.json();

  if (lists?.length) {
    const match = lists.find((l: { name: string; id: string }) =>
      l.name.toLowerCase().includes('corp comms')
    );
    return (match || lists[0]).id;
  }

  // No audiences — create Corp Comms Outreach
  const createRes = await fetch(`${base}/lists`, {
    method: 'POST', headers,
    body: JSON.stringify({
      name: 'Corp Comms Outreach',
      contact: {
        company: 'OpenExchange',
        address1: '1 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
      },
      permission_reminder: 'You are receiving this email because you were contacted by the OpenExchange BD team.',
      email_type_option: false,
      campaign_defaults: {
        from_name: FROM_NAME,
        from_email: FROM_EMAIL,
        subject: 'OpenExchange BD Outreach',
        language: 'en',
      },
    }),
  });
  const created = await createRes.json();
  if (!created.id) throw new Error('Failed to create audience: ' + JSON.stringify(created));
  return created.id;
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const { contactEmail, firstName, firm, sigFrom, oePostEnabled } = await req.json();

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey) return NextResponse.json({ error: 'MAILCHIMP_API_KEY not configured' }, { status: 500 });
  if (!contactEmail?.includes('@')) return NextResponse.json({ error: 'Invalid contact email' }, { status: 400 });

  const server = apiKey.split('-').pop()?.trim();
  const base = `https://${server}.api.mailchimp.com/3.0`;
  const auth = 'Basic ' + Buffer.from(`anystring:${apiKey}`).toString('base64');
  const headers = { Authorization: auth, 'Content-Type': 'application/json' };

  let listId: string;
  try {
    listId = await getOrCreateList(base, headers);
  } catch (e) {
    console.error('[email/send]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  // Upsert contact into the audience
  const emailHash = createHash('md5').update(contactEmail.toLowerCase()).digest('hex');
  await fetch(`${base}/lists/${listId}/members/${emailHash}`, {
    method: 'PUT', headers,
    body: JSON.stringify({
      email_address: contactEmail,
      status_if_new: 'subscribed',
      merge_fields: { FNAME: firstName || '', LNAME: '', COMPANY: firm || '' },
    }),
  });

  const rep = REP_NAMES[sigFrom] || 'Cara Dingenthal';
  const html = buildEmailHtml({
    firstName: firstName || 'there',
    firm: firm || 'your company',
    rep: sigFrom,
    oePost: oePostEnabled ?? true,
  });

  // Create campaign targeting just this contact
  const campRes = await fetch(`${base}/campaigns`, {
    method: 'POST', headers,
    body: JSON.stringify({
      type: 'regular',
      settings: {
        subject_line: `A quick note from ${rep} at OpenExchange`,
        from_name: FROM_NAME,
        reply_to: FROM_EMAIL,
      },
      recipients: {
        list_id: listId,
        segment_opts: {
          match: 'all',
          conditions: [{
            condition_type: 'EmailAddress',
            field: 'EMAIL',
            op: 'is',
            value: contactEmail,
          }],
        },
      },
    }),
  });
  const camp = await campRes.json();
  if (!camp.id) return NextResponse.json({ error: 'Failed to create campaign', detail: camp }, { status: 500 });

  await fetch(`${base}/campaigns/${camp.id}/content`, {
    method: 'PUT', headers,
    body: JSON.stringify({ html }),
  });

  const sendRes = await fetch(`${base}/campaigns/${camp.id}/actions/send`, {
    method: 'POST', headers: { Authorization: auth },
  });

  if (sendRes.status !== 204) {
    const err = await sendRes.json().catch(() => ({}));
    return NextResponse.json({ error: 'Send failed', detail: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
