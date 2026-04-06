export const REP_NAMES: Record<string, string> = {
  cara: 'Cara Dingenthal',
  kristen: 'Kristen Conklin',
  peter: 'Peter Georgiou',
  mithun: 'Mithun Manjunatha',
};

export function buildEmailHtml(params: {
  firstName: string;
  firm: string;
  rep: string;
  oePost: boolean;
}): string {
  const { firstName, firm, rep, oePost } = params;
  const repName = REP_NAMES[rep] || 'Cara Dingenthal';
  const month = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>OpenExchange</title></head>
<body style="font-family:system-ui,sans-serif;margin:0;padding:0;background:#f8f8f7;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#1a1a1a;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
    <span style="color:#fff;font-weight:700;font-size:14px;letter-spacing:.05em;">OPEN EXCHANGE</span>
    <span style="color:#666;font-size:11px;font-family:monospace;">BD Outreach \u00b7 ${month}</span>
  </div>
  <div style="padding:24px 28px;">
    <p style="margin:0 0 16px;color:#111827;font-weight:500;font-size:14px;">Hi ${firstName},</p>
    <p style="margin:0 0 14px;color:#374151;">I came across your work at ${firm} and was impressed by how your team is approaching corporate communications at scale. We\u2019re seeing a major shift in the market toward broadcast-quality virtual events \u2014 and OpenExchange is built specifically for that transition.</p>
    <p style="margin:0 0 20px;color:#374151;">OE delivers a fully managed, broadcast-grade platform for town halls, webcasts, and hybrid events \u2014 with 99.99% uptime, AI-powered analytics, and a dedicated operator team. Our clients include Fortune 500 comms teams running 100+ events annually.</p>
    ${oePost ? `<div style="background:#f0fafa;border-left:3px solid #007a7d;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:20px;font-size:13px;color:#007a7d;">I thought this might be relevant: <a href="https://www.linkedin.com/company/openexchange-inc-/posts/" style="color:#007a7d;">See what OpenExchange is doing \u2192</a></div>` : ''}
    <div style="margin-bottom:24px;">
      <a href="mailto:${repName.toLowerCase().replace(/ /g, '.')}@openexc.com?subject=OpenExchange%20-%2015%20min%20chat" style="display:inline-block;background:#007a7d;color:#fff;padding:11px 22px;border-radius:8px;font-size:13.5px;font-weight:600;text-decoration:none;">Let\u2019s connect \u2192</a>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding-top:16px;">
      <div style="font-weight:600;font-size:13.5px;color:#111827;">${repName}</div>
      <div style="font-size:12px;color:#6b7280;">Business Development \u00b7 OpenExchange</div>
      <div style="font-family:monospace;font-size:11.5px;color:#9ca3af;margin-top:2px;">openexchange.com</div>
    </div>
  </div>
  <div style="background:#f6f5f2;padding:12px 28px;font-size:11px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;">
    \u00a9 ${year} OpenExchange \u00b7 All rights reserved
  </div>
</div>
</body></html>`;
}
