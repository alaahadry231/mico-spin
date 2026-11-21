import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// جلب كل النتائج
export async function GET() {
  try {
    const rows = await sql`SELECT * FROM results ORDER BY created_at ASC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/results error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

// إضافة نتيجة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol_id } = body;

    if (!symbol_id) {
      return NextResponse.json({ error: 'symbol_id is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO results (symbol_id, created_at)
      VALUES (${symbol_id}, NOW())
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('POST /api/results error:', error);
    return NextResponse.json({ error: 'Failed to add result' }, { status: 500 });
  }
}

// حذف آخر نتيجة
export async function DELETE() {
  try {
    await sql`
      DELETE FROM results
      WHERE id = (SELECT id FROM results ORDER BY created_at DESC LIMIT 1)
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/results error:', error);
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
  }
}

// مسح كل النتائج
export async function PUT() {
  try {
    await sql`DELETE FROM results`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/results error:', error);
    return NextResponse.json({ error: 'Failed to clear results' }, { status: 500 });
  }
}