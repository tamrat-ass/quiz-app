import { Pool } from '@neondatabase/serverless';
import bcryptjs from 'bcryptjs';

async function seedDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('[v0] Starting database seeding...');

    // 1. Insert roles
    console.log('[v0] Inserting roles...');
    const rolesResult = await pool.query(`
      INSERT INTO roles (name, description) VALUES
        ('admin', 'Administrator with full access'),
        ('teacher', 'Teacher who can create and manage games'),
        ('player', 'Player who can participate in games')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name;
    `);
    console.log('[v0] Roles inserted:', rolesResult.rows);

    // 2. Insert permissions
    console.log('[v0] Inserting permissions...');
    const permissionsResult = await pool.query(`
      INSERT INTO permissions (name, description) VALUES
        ('manage_users', 'Can create, edit, delete users'),
        ('manage_questions', 'Can create, edit, delete questions'),
        ('manage_games', 'Can create, edit, delete games'),
        ('view_activity', 'Can view activity logs'),
        ('manage_themes', 'Can customize themes'),
        ('play_games', 'Can participate in games')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name;
    `);
    console.log('[v0] Permissions inserted:', permissionsResult.rows);

    // 3. Get role IDs
    const rolesQuery = await pool.query('SELECT id, name FROM roles');
    const roles = {};
    rolesQuery.rows.forEach((row) => {
      roles[row.name] = row.id;
    });
    console.log('[v0] Role IDs:', roles);

    // 4. Get permission IDs
    const permsQuery = await pool.query('SELECT id, name FROM permissions');
    const permissions = {};
    permsQuery.rows.forEach((row) => {
      permissions[row.name] = row.id;
    });
    console.log('[v0] Permission IDs:', permissions);

    // 5. Assign permissions to roles
    console.log('[v0] Assigning permissions to roles...');
    
    // Admin gets all permissions
    const adminPerms = [
      'manage_users',
      'manage_questions',
      'manage_games',
      'view_activity',
      'manage_themes',
      'play_games'
    ];
    for (const perm of adminPerms) {
      await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [roles.admin, permissions[perm]]
      );
    }
    
    // Teacher can manage questions, games, play games
    const teacherPerms = ['manage_questions', 'manage_games', 'play_games'];
    for (const perm of teacherPerms) {
      await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [roles.teacher, permissions[perm]]
      );
    }
    
    // Player can only play games
    await pool.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [roles.player, permissions['play_games']]
    );

    console.log('[v0] Permissions assigned to roles');

    // 6. Create demo admin user
    console.log('[v0] Creating demo admin user...');
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash('password123', salt);

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, full_name, role_id;`,
      ['admin@example.com', passwordHash, 'Admin User', roles.admin, true]
    );
    console.log('[v0] Demo user created:', userResult.rows[0]);

    // 7. Create demo teacher user
    console.log('[v0] Creating demo teacher user...');
    const teacherResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, full_name, role_id;`,
      ['teacher@example.com', passwordHash, 'Teacher User', roles.teacher, true]
    );
    console.log('[v0] Teacher user created:', teacherResult.rows[0]);

    // 8. Create demo player user
    console.log('[v0] Creating demo player user...');
    const playerResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, full_name, role_id;`,
      ['player@example.com', passwordHash, 'Player User', roles.player, true]
    );
    console.log('[v0] Player user created:', playerResult.rows[0]);

    console.log('[v0] Database seeded successfully!');
    console.log('[v0] Demo credentials:');
    console.log('[v0]   Admin: admin@example.com / password123');
    console.log('[v0]   Teacher: teacher@example.com / password123');
    console.log('[v0]   Player: player@example.com / password123');

    await pool.end();
  } catch (error) {
    console.error('[v0] Error seeding database:', error);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();
