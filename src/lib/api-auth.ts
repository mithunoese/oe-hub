import { NextRequest, NextResponse } from 'next/server';

export function requireAuth(req: NextRequest): NextResponse | null {
  // Allow requests from same origin (browser) via referer check
  const referer = req.headers.get('referer') || '';
  const host = req.headers.get('host') || '';
  if (referer && new URL(referer).host === host) return null;

  // Allow requests with valid API key
  const apiKey = req.headers.get('x-api-key');
  if (apiKey && apiKey === process.env.INTERNAL_API_KEY) return null;

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
