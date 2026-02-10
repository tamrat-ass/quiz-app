import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT id, title, description, status, created_at
      FROM games
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      {
        games: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Games list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, settings } = await request.json();
    const userId = request.headers.get('x-user-id') || '1';

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO games (created_by, title, description, settings, status)
      VALUES (${userId}, ${title}, ${description}, ${JSON.stringify(settings || {})}, 'draft')
      RETURNING *
    `;

    return NextResponse.json(
      {
        game: result.rows[0],
        message: 'Game created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Create game error:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
