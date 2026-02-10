import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { read, utils } from 'xlsx';
import sql from 'sql-template-tag'; // Import sql-template-tag for sql variable

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Get user ID (default to 1 for demo)
    const userId = request.headers.get('x-user-id') || '1';
    let uploadedCount = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;

      if (!row.title || !row.correct_answer) {
        errors.push(`Row ${i + 2}: Title and correct answer are required`);
        continue;
      }

      try {
        // Parse options if they're comma-separated
        let options = [];
        if (row.options) {
          options = typeof row.options === 'string'
            ? row.options.split(',').map((o: string) => o.trim())
            : [row.options];
        }

        await sql`
          INSERT INTO questions (created_by, title, description, category, difficulty, options, correct_answer)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          userId,
          row.title,
          row.description || null,
          row.category || null,
          row.difficulty || 'medium',
          JSON.stringify(options),
          row.correct_answer,
        ];

        uploadedCount++;
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(
      {
        message: `Successfully uploaded ${uploadedCount} questions`,
        uploadedCount,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: uploadedCount > 0 ? 200 : 400 }
    );
  } catch (error) {
    console.error('[v0] Excel upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
