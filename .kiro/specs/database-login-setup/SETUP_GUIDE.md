# How to Create Database for Quiz App

## Step 1: Get Your Neon Database Connection String

1. Go to https://console.neon.tech
2. Login with your account
3. Select your project (e.g., `attendance-system-shud`)
4. Click on "Connection string" or "Databases"
5. Copy the connection string that looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
   ```
6. Update `.env.local` file with this connection string:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
   ```

## Step 2: Create Database Schema

### Option A: Using Neon SQL Editor (Easiest)

1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor" tab
4. Open file: `scripts/01-init-schema.sql`
5. Copy ALL the SQL code
6. Paste it into Neon SQL Editor
7. Click "Execute" button
8. Wait for completion (should see "Query executed successfully")

### Option B: Using psql Command Line

1. Install PostgreSQL tools (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql-client`

2. Open terminal/command prompt

3. Run this command (replace with your connection string):
   ```bash
   psql "postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require" < scripts/01-init-schema.sql
   ```

4. Wait for all tables to be created

### Option C: Using Node.js Script (Recommended for this project)

1. Create a new file: `scripts/setup-db.js`
2. Add this code:

```javascript
const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable not set');
    console.error('Please add DATABASE_URL to .env.local');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('📦 Creating database schema...');
    
    // Read and execute schema script
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '01-init-schema.sql'),
      'utf-8'
    );
    
    await pool.query(schemaSQL);
    console.log('✅ Schema created successfully');

    console.log('📦 Seeding initial data...');
    
    // Read and execute seed script
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '02-seed-data.sql'),
      'utf-8'
    );
    
    await pool.query(seedSQL);
    console.log('✅ Initial data seeded successfully');

    console.log('📦 Creating test admin user...');
    
    // Create test admin user
    const bcryptjs = require('bcryptjs');
    const passwordHash = await bcryptjs.hash('password123', 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
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
    
    console.log('✅ Test admin user created');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('   User ID:', result.rows[0].id);

    console.log('\n✨ Database setup complete!');
    console.log('\nYou can now login with:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
```

3. Add this script to `package.json`:
```json
{
  "scripts": {
    "setup-db": "node scripts/setup-db.js"
  }
}
```

4. Run the setup:
```bash
npm run setup-db
```

## Step 3: Verify Database Setup

### Check if tables were created:

Using Neon SQL Editor, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:
- activity_logs
- answers
- game_questions
- game_rounds
- game_sections
- games
- permissions
- players
- question_options
- question_types
- question_versions
- questions
- role_permissions
- roles
- rounds
- sections
- themes
- users

### Check if roles were created:

```sql
SELECT id, name, description FROM roles;
```

You should see:
- admin
- teacher
- player

### Check if test user was created:

```sql
SELECT id, email, first_name, last_name, role_id, is_active 
FROM users 
WHERE email = 'admin@example.com';
```

You should see one row with the admin user.

## Step 4: Test Login Locally

1. Make sure `.env.local` has the correct `DATABASE_URL`

2. Start development server:
```bash
npm run dev
```

3. Open browser and go to: http://localhost:3000

4. Try to login with:
   - Email: `admin@example.com`
   - Password: `password123`

5. If successful, you should see the dashboard

## Step 5: Deploy to Vercel

1. Make sure all changes are pushed to GitHub:
```bash
git add .
git commit -m "Add database setup script"
git push
```

2. Go to https://vercel.com/dashboard

3. Select your project `quizapplication`

4. Go to Settings → Environment Variables

5. Make sure `DATABASE_URL` is set to your Neon connection string

6. Redeploy:
   - Click "Deployments" tab
   - Click the three dots on latest deployment
   - Click "Redeploy"

7. Wait for deployment to complete

8. Test login on deployed app

## Troubleshooting

### Error: "Cannot find module '@neondatabase/serverless'"
- Run: `npm install`

### Error: "DATABASE_URL environment variable not set"
- Add `DATABASE_URL` to `.env.local`
- Make sure it's the correct connection string from Neon

### Error: "FATAL: password authentication failed"
- Check your connection string is correct
- Make sure you copied the full string including password

### Error: "relation 'users' does not exist"
- Schema wasn't created successfully
- Try running the schema script again
- Check for SQL syntax errors in the script

### Error: "duplicate key value violates unique constraint"
- The data already exists in the database
- This is safe - the scripts use `ON CONFLICT DO NOTHING`
- You can run them again without issues

### Login still doesn't work after setup
- Verify test user exists: `SELECT * FROM users WHERE email = 'admin@example.com';`
- Check password hash is correct: `SELECT password_hash FROM users WHERE email = 'admin@example.com';`
- Check activity logs for errors: `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;`

## Quick Reference

### Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Test User Credentials
- Email: `admin@example.com`
- Password: `password123`

### Database Files
- Schema: `scripts/01-init-schema.sql`
- Seed Data: `scripts/02-seed-data.sql`
- Setup Script: `scripts/setup-db.js` (to be created)

### Environment Variable
- File: `.env.local`
- Variable: `DATABASE_URL`
- Example: `postgresql://user:pass@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require`
