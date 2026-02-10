import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import sql from 'sql-template-tag';
import { logActivity } from '@/lib/auth';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;
    const authUser = request.headers.get('x-user-id');

    // Check if user exists
    const userQuery = sql`SELECT id FROM users WHERE id = ${userId}`;
    const userExists = await pool.query(userQuery.text, userQuery.values);

    if (userExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    const deleteQuery = sql`DELETE FROM users WHERE id = ${userId}`;
    await pool.query(deleteQuery.text, deleteQuery.values);

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
