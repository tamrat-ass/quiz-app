import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, logActivity } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Try to get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      // Log failed login attempt - email not found
      await logActivity(
        null,
        'LOGIN_FAILED_USER_NOT_FOUND',
        'user',
        null,
        { email },
        request.headers.get('x-forwarded-for') || null,
        request.headers.get('user-agent') || null
      );

      return NextResponse.json(
        { error: 'Email not found. Please check your email or create an account.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      // Log failed login attempt - wrong password
      await logActivity(
        null,
        'LOGIN_FAILED_WRONG_PASSWORD',
        'user',
        user.id,
        { email },
        request.headers.get('x-forwarded-for') || null,
        request.headers.get('user-agent') || null
      );

      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Log successful login
    await logActivity(
      user.id,
      'LOGIN_SUCCESS',
      'user',
      user.id,
      { email },
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null
    );

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Login successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Login API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
