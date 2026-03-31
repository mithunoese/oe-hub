import { NextRequest, NextResponse } from 'next/server';

const FROM_EMAIL = 'mithun.manjunatha@openexc.com';
const FROM_NAME = 'Mithun Manjunatha';

const REP_NAMES: Record<string, string> = {
  cara: 'Cara Dingenthal',
  kristen: 'Kristen Conklin',
  peter: 'Peter Georgiou',
};

function buildHtml(firstName: string, firm: string, repKey: string, oePost: boolean) {
  const rep = REP_NAMES[repKey] || 'Cara Dingenthal';
  const month = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>OpenExchange</title></head>
<body style="font-family:system-ui,sans-serif;margin:0;padding:0;background:#f8f8f7;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#1a1a1a;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
    <span style="color:#fff;font-weight:700;font-size:14px;letter-spacing:.05em;">OPEN EXCHANGE</span>
    <span style="color:#666;font-size:11px;font-family:monospace;">BD Outreach · ${month}</span>
  </div>
  <div style="padding:24px 28px;">
    <p style="margin:0 0 16px;color:#111827;font-weight:500;font-size:14px;">Hi ${firstName},</p>
    <p style="margin:0 0 14px;color:#374151;">I came across your work at ${firm} and was impressed by how your team is approaching corporate communications at scale. We're seeing a major shift in the market toward broadcast-quality virtual events — and OpenExchange is built specifically for that transition.</p>
    <p style="margin:0 0 20px;color:#374151;">OE delivers a fully managed, broadcast-grade platform for town halls, webcasts, and hybrid events — with 99.99% uptime, AI-powered analytics, and a dedicated operator team. Our clients include Fortune 500 comms teams running 100+ events annually.</p>
    ${oePost ? `<div style="background:#f0fafa;border-left:3px solid #007a7d;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:20px;font-size:13px;color:#007a7d;">I thought this might be relevant: <a href="https://openexchange.com/blog/broadcast-grade-town-halls-2026" style="color:#007a7d;">Broadcast-Grade Town Halls in 2026 →</a></div>` : ''}
    <div style="margin-bottom:24px;">
      <a href="mailto:${rep.toLowerCase().replace(' ', '.')}@openexc.com?subject=OpenExchange%20-%2015%20min%20chat" style="display:inline-block;background:#007a7d;color:#fff;padding:11px 22px;border-radius:8px;font-size:13.5px;font-weight:600;text-decoration:none;">Let's connect →</a>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding-top:16px;">
      <div style="font-weight:600;font-size:13.5px;color:#111827;">${rep}</div>
      <div style="font-size:12px;color:#6b7280;">Business Development · OpenExchange</div>
      <div style="font-family:monospace;font-size:11.5px;color:#9ca3af;margin-top:2px;">openexchange.com</div>
    </div>
  </div>
  <div style="background:#f6f5f2;padding:12px 28px;font-size:11px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;">
    © ${year} OpenExchange · All rights reserved
  </div>
</div>
</body></html>`;
}

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
  const { to, firstName, firm, sigFrom, oePostEnabled } = await req.json();

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey) return NextResponse.json({ error: 'MAILCHIMP_API_KEY not configured' }, { status: 500 });
  if (!to?.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

  const server = apiKey.split('-').pop()?.trim();
  const base = `https://${server}.api.mailchimp.com/3.0`;
  const auth = 'Basic ' + Buffer.from(`anystring:${apiKey}`).toString('base64');
  const headers = { Authorization: auth, 'Content-Type': 'application/json' };

  let listId: string;
  try {
    listId = await getOrCreateList(base, headers);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  const rep = REP_NAMES[sigFrom] || 'Cara Dingenthal';
  const html = buildHtml(firstName || 'there', firm || 'your company', sigFrom, oePostEnabled ?? true);

  // Create draft campaign
  const campRes = await fetch(`${base}/campaigns`, {
    method: 'POST', headers,
    body: JSON.stringify({
      type: 'regular',
      settings: {
        subject_line: `[TEST] A quick note from ${rep} at OpenExchange`,
        from_name: FROM_NAME,
        reply_to: FROM_EMAIL,
      },
      recipients: { list_id: listId },
    }),
  });
  const camp = await campRes.json();
  if (!camp.id) return NextResponse.json({ error: 'Failed to create campaign', detail: camp }, { status: 500 });

  try {
    await fetch(`${base}/campaigns/${camp.id}/content`, {
      method: 'PUT', headers,
      body: JSON.stringify({ html }),
    });

    const testRes = await fetch(`${base}/campaigns/${camp.id}/actions/test`, {
      method: 'POST', headers,
      body: JSON.stringify({ test_emails: [to], send_type: 'html' }),
    });

    if (testRes.status !== 204) {
      const err = await testRes.json().catch(() => ({}));
      return NextResponse.json({ error: 'Test send failed', detail: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } finally {
    await fetch(`${base}/campaigns/${camp.id}`, {
      method: 'DELETE', headers: { Authorization: auth },
    });
  }
}
