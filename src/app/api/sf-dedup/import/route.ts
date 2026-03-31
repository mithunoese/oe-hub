import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import type { PipelineRow } from '@/data/pipelines';

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const { rows, pipelineIndex } = (await req.json()) as {
      rows: PipelineRow[];
      pipelineIndex: number;
    };

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Missing or empty rows array' }, { status: 400 });
    }
    if (typeof pipelineIndex !== 'number' || pipelineIndex < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid pipelineIndex' }, { status: 400 });
    }

    const sql = neon(dbUrl);

    // Ensure table + columns exist
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

    // Load current state
    const result = await sql`SELECT rows, pipelines FROM pipeline_state WHERE id = 'default'`;

    let pipelines: Array<{ rows: PipelineRow[]; [key: string]: unknown }> = [];
    let topRows: PipelineRow[] = [];

    if (result.length > 0) {
      pipelines = Array.isArray(result[0].pipelines) ? result[0].pipelines : [];
      topRows = Array.isArray(result[0].rows) ? result[0].rows : [];
    }

    // Append rows to the specified pipeline
    if (pipelineIndex < pipelines.length) {
      const target = pipelines[pipelineIndex];
      if (!Array.isArray(target.rows)) {
        target.rows = [];
      }
      target.rows = [...target.rows, ...rows];
      // Update count if the pipeline object has one
      if ('count' in target) {
        target.count = target.rows.length;
      }
    } else {
      // Fallback: append to top-level rows
      topRows = [...topRows, ...rows];
    }

    const rowsJson = JSON.stringify(topRows);
    const pipelinesJson = JSON.stringify(pipelines);

    await sql`
      INSERT INTO pipeline_state (id, rows, pipelines, updated_at)
      VALUES ('default', ${rowsJson}::jsonb, ${pipelinesJson}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE
        SET rows = EXCLUDED.rows, pipelines = EXCLUDED.pipelines, updated_at = NOW()
    `;

    return NextResponse.json({ ok: true, imported: rows.length });
  } catch (err) {
    console.error('[sf-dedup/import POST]', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
