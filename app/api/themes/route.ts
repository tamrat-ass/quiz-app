import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: NextRequest) {
  try {
    const gameId = request.nextUrl.searchParams.get('gameId') || null;

    let query = 'SELECT * FROM themes WHERE is_default = true ORDER BY created_at DESC LIMIT 10';
    const params = [];

    if (gameId) {
      query = 'SELECT * FROM themes WHERE game_id = $1 OR is_default = true ORDER BY created_at DESC';
      params.push(gameId);
    }

    const result = await pool.query(query, params);

    return NextResponse.json(
      {
        themes: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get themes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, primary_color, background_color, text_color, button_color, is_dark_mode, is_default, gameId, createdBy } = await request.json();

    // Validate required fields
    if (!name || !primary_color || !background_color || !text_color || !button_color || !createdBy) {
      return NextResponse.json(
        { error: 'All color fields and created_by are required' },
        { status: 400 }
      );
    }

    // Create new theme
    const result = await pool.query(
      `INSERT INTO themes (name, primary_color, background_color, text_color, button_color, is_dark_mode, is_default, created_by, game_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, primary_color, background_color, text_color, button_color, is_dark_mode || false, is_default || false, createdBy, gameId || null]
    );

    return NextResponse.json(
      {
        theme: result.rows[0],
        message: 'Theme created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Save theme error:', error);
    return NextResponse.json(
      { error: 'Failed to save theme' },
      { status: 500 }
    );
  }
}
