import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT id, question_text, section_id, round_id, question_number, created_at
       FROM questions
       ORDER BY created_at DESC`
    );

    return NextResponse.json(
      {
        questions: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Questions list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { questionText, sectionId, roundId, questionTypeId, questionNumber, options, correctAnswer } = await request.json();

    if (!questionText || !sectionId || !roundId || !questionTypeId || questionNumber === undefined) {
      return NextResponse.json(
        { error: 'Question text, section, round, type, and number are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO questions (section_id, round_id, question_type_id, question_number, question_text, options, correct_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [sectionId, roundId, questionTypeId, questionNumber, questionText, JSON.stringify(options), correctAnswer]
    );

    return NextResponse.json(
      {
        question: result.rows[0],
        message: 'Question created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Create question error:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
