import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    // Get total games count
    const gamesResult = await pool.query('SELECT COUNT(*) as count FROM games');
    const totalGames = parseInt(gamesResult.rows[0]?.count || 0);

    // Get total questions count
    const questionsResult = await pool.query('SELECT COUNT(*) as count FROM questions');
    const totalQuestions = parseInt(questionsResult.rows[0]?.count || 0);

    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0]?.count || 0);

    // Get recent activity
    const activityResult = await pool.query(`
      SELECT id, action, created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);
    const recentActivity = activityResult.rows;

    return NextResponse.json(
      {
        totalGames,
        totalQuestions,
        totalUsers,
        recentActivity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
