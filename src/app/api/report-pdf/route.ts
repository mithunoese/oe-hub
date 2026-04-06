import { NextRequest, NextResponse } from 'next/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return neon(url);
}

let reportPdfSchemaMigrated = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: NeonQueryFunction<any, any>) {
  if (reportPdfSchemaMigrated) return;
  await sql`
    CREATE TABLE IF NOT EXISTS report_pdfs (
      week       TEXT PRIMARY KEY,
      filename   TEXT NOT NULL,
      data       TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  reportPdfSchemaMigrated = true;
}

// GET /api/report-pdf — list all available PDFs
export async function GET() {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const rows = await sql`SELECT week, filename, uploaded_at FROM report_pdfs ORDER BY uploaded_at DESC`;
    return NextResponse.json({ pdfs: rows });
  } catch (err) {
    console.error('[report-pdf GET]', err);
    return NextResponse.json({ pdfs: [], error: 'Internal server error' });
  }
}

// POST /api/report-pdf — upload a PDF (multipart form: week, file)
export async function POST(req: NextRequest) {
  const pin = req.headers.get('x-admin-pin');
  if (!process.env.ADMIN_PIN || pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const week = form.get('week') as string;
    const file = form.get('file') as File;

    if (!week || !file) {
      return NextResponse.json({ error: 'Missing week or file' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const sql = getDb();
    await ensureTable(sql);
    await sql`
      INSERT INTO report_pdfs (week, filename, data)
      VALUES (${week}, ${file.name}, ${base64})
      ON CONFLICT (week) DO UPDATE SET filename = ${file.name}, data = ${base64}, uploaded_at = NOW()
    `;

    return NextResponse.json({ success: true, week, filename: file.name });
  } catch (err) {
    console.error('[report-pdf POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/report-pdf — remove a PDF
export async function DELETE(req: NextRequest) {
  const pin = req.headers.get('x-admin-pin');
  if (!process.env.ADMIN_PIN || pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { week } = await req.json();
  const sql = getDb();
  await ensureTable(sql);
  await sql`DELETE FROM report_pdfs WHERE week = ${week}`;
  return NextResponse.json({ success: true });
}
