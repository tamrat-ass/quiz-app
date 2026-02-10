import { NextRequest, NextResponse } from 'next/server';
import { createUser, logActivity, getUserByEmail } from '@/lib/auth';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    // Validate inputs
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Get player role ID
    const playerRoleResult = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      ['player']
    );

    if (playerRoleResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Player role not found' },
        { status: 500 }
      );
    }

    // Create user
    const newUser = await createUser(email, password, fullName, playerRoleResult.rows[0].id);

    // Log signup
    await logActivity(
      newUser.id,
      'SIGNUP',
      'user',
      newUser.id,
      { email },
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null
    );

    const { password_hash, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Signup API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
