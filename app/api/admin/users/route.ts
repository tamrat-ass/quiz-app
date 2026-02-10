import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import sql from 'sql-template-tag';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export async function GET(request: NextRequest) {
  try {
    const query = sql`
      SELECT u.id, u.email, u.full_name, r.name as role_name, u.is_active, u.created_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `;

    const result = await pool.query(query.text, query.values);

    return NextResponse.json(
      {
        users: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Users list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
