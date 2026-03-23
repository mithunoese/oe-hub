import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// GET /api/report-pdf/[week] — serve the PDF for a given week
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ week: string }> }
) {
  const { week } = await params;

  // First try the public folder (statically committed PDFs)
  // This is handled by Next.js static serving, so we only need DB fallback here

  try {
    const url = process.env.DATABASE_URL;
    if (!url) return new NextResponse('No DB', { status: 500 });
    const sql = neon(url);

    const rows = await sql`SELECT filename, data FROM report_pdfs WHERE week = ${week}`;
    if (rows.length === 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    const { filename, data } = rows[0];
    const buffer = Buffer.from(data as string, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return new NextResponse(String(err), { status: 500 });
  }
}
