import { NextRequest, NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let schemaMigrated = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureSchema(sql: NeonQueryFunction<any, any>) {
  if (schemaMigrated) return;
  await sql`
    CREATE TABLE IF NOT EXISTS email_sends (
      id SERIAL PRIMARY KEY,
      contact_email TEXT NOT NULL,
      contact_name TEXT,
      firm TEXT,
      pipeline_name TEXT,
      sent_by TEXT,
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      send_type TEXT DEFAULT 'campaign'
    )
  `;
  schemaMigrated = true;
}

export async function POST(req: NextRequest) {
  const { contactEmail, contactName, firm, pipelineName, sentBy, sendType } =
    await req.json();

  if (!contactEmail)
    return NextResponse.json({ error: 'contactEmail required' }, { status: 400 });

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await ensureSchema(sql);
    await sql`
      INSERT INTO email_sends (contact_email, contact_name, firm, pipeline_name, sent_by, send_type)
      VALUES (${contactEmail}, ${contactName || ''}, ${firm || ''}, ${pipelineName || ''}, ${sentBy || ''}, ${sendType || 'campaign'})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ sends: [] });

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await ensureSchema(sql);
    const sends = await sql`
      SELECT id, contact_name, firm, pipeline_name, sent_by, sent_at, send_type
      FROM email_sends
      WHERE contact_email = ${email}
      ORDER BY sent_at DESC
      LIMIT 20
    `;
    return NextResponse.json({ sends });
  } catch {
    return NextResponse.json({ sends: [] });
  }
}
