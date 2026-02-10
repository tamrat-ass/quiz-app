# Quick Start - Create Database in 5 Minutes

## The Fastest Way

### 1️⃣ Get Connection String from Neon

```
Go to: https://console.neon.tech
→ Select your project
→ Click "Connection string"
→ Copy the string (looks like: postgresql://user:pass@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require)
```

### 2️⃣ Add to .env.local

Open `.env.local` and update:
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
```

### 3️⃣ Run Setup Script

```bash
npm run setup-db
```

That's it! ✨

---

## What Happens When You Run `npm run setup-db`

```
🚀 Starting database setup...

📦 Step 1: Creating database schema...
✅ Schema created successfully

📦 Step 2: Seeding initial data (roles, permissions, question types)...
✅ Initial data seeded successfully

📦 Step 3: Creating test admin user...
✅ Test admin user created

   📧 Email: admin@example.com
   🔑 Password: password123
   👤 User ID: [some-uuid]

✨ Database setup complete!

═══════════════════════════════════════════════════════
You can now login with:
  Email: admin@example.com
  Password: password123
═══════════════════════════════════════════════════════
```

---

## Test It Works

### Option A: Test Locally

```bash
npm run dev
```

Then go to http://localhost:3000 and login with:
- Email: `admin@example.com`
- Password: `password123`

### Option B: Test with curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

You should get back user data (not an error).

---

## If Something Goes Wrong

### ❌ "DATABASE_URL environment variable not set"

**Fix:** Make sure `.env.local` has the connection string:
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
```

### ❌ "password authentication failed"

**Fix:** Check your connection string is correct:
- Go to https://console.neon.tech
- Copy the connection string again
- Make sure you didn't miss any characters

### ❌ "Cannot find module '@neondatabase/serverless'"

**Fix:** Install dependencies:
```bash
npm install
```

### ❌ "duplicate key value violates unique constraint"

**Fix:** This is OK! It means the data already exists. You can run the script again - it won't cause problems.

### ❌ Login still doesn't work

**Fix:** Check the database has the user:

Using Neon SQL Editor, run:
```sql
SELECT * FROM users WHERE email = 'admin@example.com';
```

If you see a row, the user exists. If not, run `npm run setup-db` again.

---

## What Gets Created

### Tables (18 total)
- users, roles, permissions, role_permissions
- questions, question_types, question_options, question_versions
- sections, rounds, games, game_sections, game_rounds, game_questions
- players, answers, themes, activity_logs

### Roles (3 total)
- **admin** - Full system access
- **teacher** - Can create and manage games
- **player** - Can play games

### Permissions (10 total)
- upload_questions, create_questions, start_rounds
- manage_users, manage_questions, view_logs
- manage_themes, manage_roles, join_games, answer_questions

### Test User (1 total)
- Email: `admin@example.com`
- Password: `password123` (hashed with bcryptjs)
- Role: admin
- Status: active

---

## Next Steps

1. ✅ Run `npm run setup-db`
2. ✅ Test login locally with `npm run dev`
3. ✅ Push to GitHub: `git add . && git commit -m "Add database setup" && git push`
4. ✅ Vercel will auto-deploy
5. ✅ Test login on deployed app

---

## Files Involved

| File | Purpose |
|------|---------|
| `.env.local` | Stores DATABASE_URL connection string |
| `scripts/01-init-schema.sql` | Creates all database tables |
| `scripts/02-seed-data.sql` | Creates roles, permissions, question types |
| `scripts/setup-db.js` | Node.js script that runs everything + creates test user |
| `package.json` | Added `setup-db` script |

---

## Connection String Explained

```
postgresql://user:password@host:port/database?sslmode=require
         ↑    ↑    ↑        ↑    ↑    ↑         ↑
      protocol user pass   host port database  SSL
```

Example:
```
postgresql://neon_user:abc123@ep-cool-db.us-east-1.neon.tech:5432/quiz_db?sslmode=require
```

Get this from Neon dashboard → Connection string
