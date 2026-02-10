import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT 
        al.id, 
        al.user_id, 
        al.action, 
        al.entity_type, 
        al.entity_id, 
        al.details, 
        al.ip_address, 
        al.user_agent, 
        al.created_at,
        u.email as user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 1000
    `;

    return NextResponse.json(
      {
        activities: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Activity logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
