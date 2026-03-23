import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ rows: null, pipelines: null, error: 'DATABASE_URL not set' });
  try {
    const sql = neon(url);
    await sql`
      CREATE TABLE IF NOT EXISTS pipeline_state (
        id TEXT PRIMARY KEY,
        rows JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    // Add pipelines column if it doesn't exist (for existing tables)
    await sql`
      ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS pipelines JSONB
    `;
    const result = await sql`SELECT rows, pipelines FROM pipeline_state WHERE id = 'default'`;
    if (result.length === 0) return NextResponse.json({ rows: null, pipelines: null });
    return NextResponse.json({ rows: result[0].rows, pipelines: result[0].pipelines ?? null });
  } catch (err) {
    console.error('[pipeline-state GET]', err);
    return NextResponse.json({ rows: null, pipelines: null, error: String(err) });
  }
}

export async function POST(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ ok: false, error: 'DATABASE_URL not set' });
  try {
    const { rows, pipelines } = await req.json() as { rows: unknown; pipelines?: unknown };
    const rowsJson = JSON.stringify(rows);
    const pipelinesJson = JSON.stringify(pipelines ?? null);
    const sql = neon(url);
    await sql`
      CREATE TABLE IF NOT EXISTS pipeline_state (
        id TEXT PRIMARY KEY,
        rows JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS pipelines JSONB
    `;
    await sql`
      INSERT INTO pipeline_state (id, rows, pipelines, updated_at)
      VALUES ('default', ${rowsJson}::jsonb, ${pipelinesJson}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE
        SET rows = EXCLUDED.rows, pipelines = EXCLUDED.pipelines, updated_at = NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pipeline-state POST]', err);
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
