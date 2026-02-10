import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { sql } from '@vercel/postgres';
import { logActivity } from '@/lib/auth';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const authUser = request.headers.get('x-user-id');

    // Check if user exists
    const userExists = await sql`SELECT id FROM users WHERE id = ${userId}`;

    if (userExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await sql`DELETE FROM users WHERE id = ${userId}`;

    // Log activity
    await logActivity(
      authUser ? parseInt(authUser) : null,
      'USER_DELETED',
      'user',
      parseInt(userId),
      null
    );

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
