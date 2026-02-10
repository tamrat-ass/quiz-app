const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ ERROR: DATABASE_URL environment variable not set');
    console.error('Please add DATABASE_URL to .env.local');
    console.error('\nExample:');
    console.error('DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('🚀 Starting database setup...\n');

    console.log('📦 Step 1: Creating database schema...');
    
    // Read and execute schema script
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '01-init-schema.sql'),
      'utf-8'
    );
    
    await pool.query(schemaSQL);
    console.log('✅ Schema created successfully\n');

    console.log('📦 Step 2: Seeding initial data (roles, permissions, question types)...');
    
    // Read and execute seed script
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '02-seed-data.sql'),
      'utf-8'
    );
    
    await pool.query(seedSQL);
    console.log('✅ Initial data seeded successfully\n');

    console.log('📦 Step 3: Creating test admin user...');
    
    // Create test admin user
    const bcryptjs = require('bcryptjs');
    const passwordHash = await bcryptjs.hash('password123', 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, first_name, last_name, role_id, is_active`,
      [
        'admin@example.com',
        passwordHash,
        'Admin',
        'User',
        'a0000000-0000-0000-0000-000000000001', // admin role
        true
      ]
    );
    
    console.log('✅ Test admin user created\n');
    console.log('   📧 Email: admin@example.com');
    console.log('   🔑 Password: password123');
    console.log('   👤 User ID:', result.rows[0].id);

    console.log('\n✨ Database setup complete!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('You can now login with:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.detail) {
      console.error('Details:', error.detail);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
