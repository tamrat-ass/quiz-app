# Database Setup for Quiz App

This directory contains all the documentation and guides for setting up the database for the quiz application.

## 📚 Documentation Files

### 1. **QUICK_START.md** ⚡ START HERE
The fastest way to get your database running in 5 minutes.
- Get connection string from Neon
- Update `.env.local`
- Run `npm run setup-db`
- Done!

### 2. **STEP_BY_STEP.md** 📖 DETAILED GUIDE
Complete step-by-step instructions with explanations.
- Detailed instructions for each step
- Screenshots descriptions
- Troubleshooting for common errors
- Quick reference guide

### 3. **SETUP_GUIDE.md** 🛠️ COMPREHENSIVE GUIDE
In-depth guide with multiple options and detailed explanations.
- 3 different ways to create the database
- Verification steps
- Troubleshooting guide
- Quick reference

### 4. **requirements.md** 📋 REQUIREMENTS
What needs to be done (user stories and acceptance criteria).
- Database schema creation
- Initial data seeding
- Test user creation
- Login functionality verification

### 5. **design.md** 🏗️ DESIGN DOCUMENT
How the system will work (architecture and design).
- Database schema details
- Authentication flow
- Activity logging
- Correctness properties

### 6. **tasks.md** ✅ IMPLEMENTATION TASKS
10 actionable tasks to complete the setup.
- Create schema
- Seed data
- Create test user
- Update code
- Test login
- Deploy to Vercel

## 🚀 Quick Start (TL;DR)

```bash
# 1. Get connection string from https://console.neon.tech
# 2. Update .env.local with DATABASE_URL
# 3. Run setup script
npm run setup-db

# 4. Test locally
npm run dev

# 5. Login with:
# Email: admin@example.com
# Password: password123
```

## 📁 Project Files

### SQL Scripts
- `scripts/01-init-schema.sql` - Creates all database tables
- `scripts/02-seed-data.sql` - Creates roles, permissions, question types

### Setup Script
- `scripts/setup-db.js` - Node.js script that runs everything

### Configuration
- `.env.local` - Stores DATABASE_URL connection string
- `package.json` - Added `setup-db` script

### Code Files
- `lib/auth.ts` - Authentication functions (needs UUID update)
- `app/api/auth/login/route.ts` - Login endpoint

## 🎯 What Gets Created

### Database Tables (18 total)
- **Core:** users, roles, permissions, role_permissions
- **Questions:** questions, question_types, question_options, question_versions
- **Games:** games, game_sections, game_rounds, game_questions, players, answers
- **Organization:** sections, rounds, themes
- **Logging:** activity_logs

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
- Password: `password123`
- Role: admin
- Status: active

## 🔗 Connection String

Get from: https://console.neon.tech

Format:
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

Example:
```
postgresql://neon_user:abc123@ep-cool-db.us-east-1.neon.tech:5432/quiz_db?sslmode=require
```

## ✅ Verification

After running `npm run setup-db`, verify with:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check roles exist
SELECT id, name FROM roles;

-- Check test user exists
SELECT id, email, role_id FROM users WHERE email = 'admin@example.com';

-- Check permissions exist
SELECT id, name FROM permissions;
```

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Go to http://localhost:3000
# Login with admin@example.com / password123
```

### API Testing
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Vercel Testing
1. Push to GitHub: `git push`
2. Wait for Vercel deployment
3. Go to your Vercel app URL
4. Login with admin@example.com / password123

## 🐛 Troubleshooting

### "DATABASE_URL environment variable not set"
- Add DATABASE_URL to `.env.local`

### "password authentication failed"
- Check connection string is correct
- Copy it again from Neon

### "Cannot find module '@neondatabase/serverless'"
- Run `npm install`

### "duplicate key value violates unique constraint"
- This is OK, data already exists
- Run the script again if needed

### Login doesn't work
- Verify user exists: `SELECT * FROM users WHERE email = 'admin@example.com';`
- Check password hash: `SELECT password_hash FROM users WHERE email = 'admin@example.com';`
- Check activity logs: `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;`

## 📞 Need Help?

1. **Quick questions?** → Read QUICK_START.md
2. **Step-by-step help?** → Read STEP_BY_STEP.md
3. **Detailed guide?** → Read SETUP_GUIDE.md
4. **Technical details?** → Read design.md
5. **Implementation tasks?** → Read tasks.md

## 🎓 Learning Resources

### PostgreSQL
- https://www.postgresql.org/docs/
- https://www.postgresql.org/docs/current/sql-syntax.html

### Neon
- https://neon.tech/docs/
- https://console.neon.tech

### bcryptjs
- https://github.com/dcodeIO/bcrypt.js
- Password hashing best practices

### Next.js
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- API routes documentation

## 📝 Notes

- All IDs in the database are UUIDs (not integers)
- Passwords are hashed with bcryptjs (salt rounds = 10)
- Connection uses SSL (sslmode=require)
- All timestamps are in UTC
- Foreign key constraints are enforced
- Indexes are created for performance

## 🔐 Security

- Passwords are never stored in plain text
- Connection uses SSL encryption
- Environment variables are used for secrets
- Activity logging tracks all login attempts
- Role-based access control is implemented

## 📊 Database Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    QUIZ APPLICATION                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐      ┌──────────────┐               │
│  │    users     │◄─────┤    roles     │               │
│  ├──────────────┤      ├──────────────┤               │
│  │ id (UUID)    │      │ id (UUID)    │               │
│  │ email        │      │ name         │               │
│  │ password_hash│      │ description  │               │
│  │ role_id ─────┼──────► id           │               │
│  │ is_active    │      └──────────────┘               │
│  │ created_at   │             ▲                       │
│  └──────────────┘             │                       │
│         ▲                      │                       │
│         │                      │                       │
│         │          ┌───────────────────────┐          │
│         │          │  role_permissions     │          │
│         │          ├───────────────────────┤          │
│         │          │ role_id ──────────────┼──┐       │
│         │          │ permission_id ────────┼──┼─┐     │
│         │          └───────────────────────┘  │ │     │
│         │                                     │ │     │
│         │          ┌──────────────┐           │ │     │
│         │          │ permissions  │◄──────────┘ │     │
│         │          ├──────────────┤             │     │
│         │          │ id (UUID)    │◄────────────┘     │
│         │          │ name         │                   │
│         │          │ description  │                   │
│         │          └──────────────┘                   │
│         │                                             │
│         │          ┌──────────────┐                   │
│         └──────────┤activity_logs │                   │
│                    ├──────────────┤                   │
│                    │ user_id ─────┼──┐                │
│                    │ action       │  │                │
│                    │ entity_type  │  │                │
│                    │ details      │  │                │
│                    │ created_at   │  │                │
│                    └──────────────┘  │                │
│                                       │                │
│                    [Other tables]     │                │
│                    - questions        │                │
│                    - games            │                │
│                    - players          │                │
│                    - answers          │                │
│                    - themes           │                │
│                    - etc.             │                │
│                                       │                │
└───────────────────────────────────────┴────────────────┘
```

## 🎉 Success Criteria

You'll know everything is working when:

✅ `npm run setup-db` completes without errors
✅ Test user is created with email admin@example.com
✅ `npm run dev` starts the development server
✅ You can login with admin@example.com / password123
✅ Dashboard loads after successful login
✅ Activity logs show your login attempt
✅ Vercel deployment succeeds
✅ Login works on deployed app

---

**Last Updated:** February 2026
**Status:** Ready to use
**Version:** 1.0.0
