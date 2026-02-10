import bcryptjs from 'bcryptjs';
import { Pool } from '@neondatabase/serverless';

// Initialize pool with connection string from environment
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function createUser(email: string, password: string, fullName: string, roleId: number) {
  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role_id) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role_id, created_at',
      [email, passwordHash, fullName, roleId]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1 AND u.is_active = true`,
      [email]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching user:', error);
    throw error;
  }
}

export async function getUserById(userId: number) {
  try {
    const result = await pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [userId]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching user by ID:', error);
    throw error;
  }
}

export async function getUserPermissions(userId: number) {
  try {
    const user = await getUserById(userId);
    if (!user) return [];

    const result = await pool.query(
      `SELECT DISTINCT p.name
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN roles r ON rp.role_id = r.id
       WHERE r.id = $1`,
      [user.role_id]
    );
    
    return result.rows.map((row) => row.name);
  } catch (error) {
    console.error('[v0] Error fetching user permissions:', error);
    return [];
  }
}

export async function logActivity(
  userId: number | null,
  action: string,
  entityType: string | null,
  entityId: number | null,
  details: any = null,
  ipAddress: string | null = null,
  userAgent: string | null = null
) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('[v0] Error logging activity:', error);
  }
}
