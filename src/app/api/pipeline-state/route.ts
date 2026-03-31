import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ rows: null, pipelines: null, version: 0 });
  try {
    const sql = neon(url);
    await sql`
      CREATE TABLE IF NOT EXISTS pipeline_state (
        id TEXT PRIMARY KEY,
        rows JSONB NOT NULL,
        pipelines JSONB,
        version INT DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS pipelines JSONB`;
    await sql`ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS version INT DEFAULT 0`;
    const result = await sql`SELECT rows, pipelines, version FROM pipeline_state WHERE id = 'default'`;
    if (result.length === 0) return NextResponse.json({ rows: null, pipelines: null, version: 0 });
    return NextResponse.json({
      rows: result[0].rows,
      pipelines: result[0].pipelines ?? null,
      version: result[0].version ?? 0,
    });
  } catch (err) {
    console.error('[pipeline-state GET]', err);
    return NextResponse.json({ rows: null, pipelines: null, version: 0, error: String(err) });
  }
}

async function upsert(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ ok: false, error: 'DATABASE_URL not set' });
  try {
    const { rows, pipelines, version } = await req.json() as { rows: unknown; pipelines?: unknown; version?: number };
    const rowsJson = JSON.stringify(rows);
    const pipelinesJson = JSON.stringify(pipelines ?? null);
    const ver = version ?? 0;
    const sql = neon(url);
    await sql`
      CREATE TABLE IF NOT EXISTS pipeline_state (
        id TEXT PRIMARY KEY,
        rows JSONB NOT NULL,
        pipelines JSONB,
        version INT DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS pipelines JSONB`;
    await sql`ALTER TABLE pipeline_state ADD COLUMN IF NOT EXISTS version INT DEFAULT 0`;
    await sql`
      INSERT INTO pipeline_state (id, rows, pipelines, version, updated_at)
      VALUES ('default', ${rowsJson}::jsonb, ${pipelinesJson}::jsonb, ${ver}, NOW())
      ON CONFLICT (id) DO UPDATE
        SET rows = EXCLUDED.rows, pipelines = EXCLUDED.pipelines, version = EXCLUDED.version, updated_at = NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pipeline-state upsert]', err);
    return NextResponse.json({ ok: false, error: String(err) });
  }
}

export const POST = upsert;
export const PUT = upsert;
