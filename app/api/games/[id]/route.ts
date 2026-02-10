import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { sql } from '@vercel/postgres'; // Declare the sql variable

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);

    // Check if game exists
    const gameExists = await sql`SELECT id FROM games WHERE id = ${gameId}`;

    if (gameExists.rows.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Delete game
    await sql`DELETE FROM games WHERE id = ${gameId}`;

    return NextResponse.json(
      { message: 'Game deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete game error:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);

    const gameResult = await sql`
      SELECT g.*, u.full_name as created_by_name
      FROM games g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.id = ${gameId}
    `;

    if (gameResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    const game = gameResult.rows[0];

    // Get questions for this game
    const questionsResult = await sql`
      SELECT q.id, q.title, q.difficulty, gq.order_index
      FROM game_questions gq
      JOIN questions q ON gq.question_id = q.id
      WHERE gq.game_id = ${gameId}
      ORDER BY gq.order_index
    `;

    return NextResponse.json(
      {
        game,
        questions: questionsResult.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get game error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
