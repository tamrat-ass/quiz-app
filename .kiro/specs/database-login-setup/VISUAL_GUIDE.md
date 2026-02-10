# Visual Guide - Create Database

## 🎯 The Process in Pictures

### Step 1: Get Connection String from Neon

```
┌─────────────────────────────────────────────────────────┐
│  https://console.neon.tech                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your Projects:                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ attendance-system-shud                          │   │
│  │ ┌───────────────────────────────────────────┐   │   │
│  │ │ Connection string:                        │   │   │
│  │ │ postgresql://neon_user:pass@ep-cool-db... │   │   │
│  │ │ [Copy Button] 📋                          │   │   │
│  │ └───────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Update .env.local

```
┌─────────────────────────────────────────────────────────┐
│  .env.local                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DATABASE_URL=postgresql://neon_user:pass@ep-cool-db...│
│                                                         │
│  [Save] Ctrl+S                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Open Terminal

```
Windows:                Mac:                  Linux:
┌──────────────┐       ┌──────────────┐      ┌──────────────┐
│ Win + R      │       │ Cmd + Space  │      │ Ctrl+Alt+T   │
│ Type: cmd    │       │ Type: term   │      │              │
│ Press Enter  │       │ Press Enter  │      │ Terminal     │
└──────────────┘       └──────────────┘      │ opens        │
                                             └──────────────┘
```

### Step 4: Navigate to Project

```
Terminal:
$ cd C:\Users\YourName\Documents\quiz-app
$ 
```

### Step 5: Run Setup Script

```
Terminal:
$ npm run setup-db
$ 

🚀 Starting database setup...

📦 Step 1: Creating database schema...
✅ Schema created successfully

📦 Step 2: Seeding initial data...
✅ Initial data seeded successfully

📦 Step 3: Creating test admin user...
✅ Test admin user created

   📧 Email: admin@example.com
   🔑 Password: password123
   👤 User ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

✨ Database setup complete!
```

### Step 6: Test Locally

```
Terminal:
$ npm run dev
$ 

Browser:
http://localhost:3000
┌─────────────────────────────────────────────────────────┐
│  Quiz Application                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Email:    [admin@example.com                    ]      │
│  Password: [password123                          ]      │
│                                                         │
│  [Login Button]                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘

✅ Login successful → Dashboard loads
```

---

## 📊 What Gets Created

### Database Structure

```
┌─────────────────────────────────────────────────────────┐
│                   NEON DATABASE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ USERS TABLE                                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ id: a1b2c3d4-e5f6-7890-abcd-ef1234567890        │  │
│  │ email: admin@example.com                        │  │
│  │ password_hash: $2a$10$...                       │  │
│  │ role_id: a0000000-0000-0000-0000-000000000001   │  │
│  │ is_active: true                                 │  │
│  │ created_at: 2026-02-10 12:00:00                 │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ROLES TABLE                                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ id: a0000000-0000-0000-0000-000000000001        │  │
│  │ name: admin                                     │  │
│  │ description: Administrator with full access    │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PERMISSIONS TABLE                                │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ id: p0000000-0000-0000-0000-000000000001        │  │
│  │ name: upload_questions                         │  │
│  │ id: p0000000-0000-0000-0000-000000000002        │  │
│  │ name: create_questions                         │  │
│  │ ... (10 total)                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  + 15 more tables for questions, games, etc.           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Created

```
┌─────────────────────────────────────────────────────────┐
│                   INITIAL DATA                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ROLES (3):                                             │
│  ├─ admin      → Full system access                    │
│  ├─ teacher    → Create and manage games              │
│  └─ player     → Play games                           │
│                                                         │
│  PERMISSIONS (10):                                      │
│  ├─ upload_questions                                   │
│  ├─ create_questions                                   │
│  ├─ start_rounds                                       │
│  ├─ manage_users                                       │
│  ├─ manage_questions                                   │
│  ├─ view_logs                                          │
│  ├─ manage_themes                                      │
│  ├─ manage_roles                                       │
│  ├─ join_games                                         │
│  └─ answer_questions                                   │
│                                                         │
│  QUESTION TYPES (2):                                    │
│  ├─ choose    → Multiple choice                        │
│  └─ sign      → True/False                             │
│                                                         │
│  TEST USER (1):                                         │
│  └─ admin@example.com / password123                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
User enters credentials:
┌──────────────────────────────────────────────────────────┐
│ Email: admin@example.com                                 │
│ Password: password123                                    │
└──────────────────────────────────────────────────────────┘
                          ↓
                    [Login Button]
                          ↓
        POST /api/auth/login
        {
          "email": "admin@example.com",
          "password": "password123"
        }
                          ↓
        ┌─────────────────────────────────────────┐
        │ 1. Validate email format                │
        │    ✅ Valid                             │
        └─────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────────┐
        │ 2. Query database for user              │
        │    SELECT * FROM users                  │
        │    WHERE email = 'admin@example.com'    │
        │    ✅ User found                        │
        └─────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────────┐
        │ 3. Verify password                      │
        │    bcryptjs.compare(                    │
        │      'password123',                     │
        │      '$2a$10$...'                       │
        │    )                                    │
        │    ✅ Password correct                  │
        └─────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────────┐
        │ 4. Log successful login                 │
        │    INSERT INTO activity_logs            │
        │    action: 'LOGIN_SUCCESS'              │
        │    ✅ Logged                            │
        └─────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────────┐
        │ 5. Return user data                     │
        │    {                                    │
        │      "user": {                          │
        │        "id": "a1b2c3d4...",            │
        │        "email": "admin@example.com",   │
        │        "role_name": "admin",           │
        │        ...                             │
        │      },                                │
        │      "message": "Login successful"     │
        │    }                                    │
        │    ✅ Success                           │
        └─────────────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────────┐
        │ Dashboard loads                          │
        │ User is logged in                        │
        └──────────────────────────────────────────┘
```

---

## 📁 File Structure

```
quiz-app/
├── .env.local                          ← Connection string
├── package.json                        ← Has "setup-db" script
├── scripts/
│   ├── 01-init-schema.sql             ← Creates tables
│   ├── 02-seed-data.sql               ← Creates roles, permissions
│   └── setup-db.js                    ← Runs everything
├── lib/
│   └── auth.ts                        ← Auth functions
├── app/
│   └── api/
│       └── auth/
│           └── login/
│               └── route.ts           ← Login endpoint
└── .kiro/
    └── specs/
        └── database-login-setup/      ← This documentation
            ├── README.md
            ├── QUICK_START.md
            ├── STEP_BY_STEP.md
            ├── SETUP_GUIDE.md
            ├── requirements.md
            ├── design.md
            ├── tasks.md
            └── VISUAL_GUIDE.md
```

---

## ⏱️ Timeline

```
Start
  │
  ├─ 1 min: Get connection string from Neon
  │
  ├─ 1 min: Update .env.local
  │
  ├─ 1 min: Open terminal and navigate to project
  │
  ├─ 2 min: Run npm run setup-db
  │         (creates schema, seeds data, creates test user)
  │
  ├─ 1 min: Run npm run dev
  │
  ├─ 1 min: Test login in browser
  │
  └─ Total: ~7 minutes
```

---

## ✅ Checklist

```
Database Setup Checklist:

□ Step 1: Get connection string from Neon
  └─ Go to https://console.neon.tech
  └─ Copy connection string

□ Step 2: Update .env.local
  └─ Add DATABASE_URL=postgresql://...

□ Step 3: Open terminal
  └─ Windows: Win+R, type cmd
  └─ Mac: Cmd+Space, type terminal
  └─ Linux: Ctrl+Alt+T

□ Step 4: Navigate to project
  └─ cd path/to/quiz-app

□ Step 5: Run setup script
  └─ npm run setup-db
  └─ Wait for completion

□ Step 6: Test locally
  └─ npm run dev
  └─ Go to http://localhost:3000
  └─ Login with admin@example.com / password123

□ Step 7: Push to GitHub
  └─ git add .
  └─ git commit -m "Add database setup"
  └─ git push

□ Step 8: Test on Vercel
  └─ Wait for deployment
  └─ Test login on deployed app

✨ Done!
```

---

## 🎓 Key Concepts

### Connection String
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```
- **user**: Database user (from Neon)
- **password**: Database password (from Neon)
- **host**: Database server address (from Neon)
- **port**: Database port (usually 5432)
- **database**: Database name (from Neon)
- **sslmode=require**: Use SSL encryption

### Password Hashing
```
Plain password:  "password123"
                      ↓
              bcryptjs.hash()
                      ↓
Hashed password: "$2a$10$abcdefghijklmnopqrstuvwxyz..."
```
- Never stored in plain text
- Can't be reversed
- Verified with bcryptjs.compare()

### UUID
```
Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
         └─────────────────────────────────┘
         Unique identifier (128-bit)
```
- Unique across all databases
- Better than sequential integers
- Used for all IDs in this project

---

## 🚨 Common Mistakes

```
❌ WRONG: Forgetting to update .env.local
   └─ Result: "DATABASE_URL not set" error

❌ WRONG: Copying connection string incorrectly
   └─ Result: "password authentication failed" error

❌ WRONG: Not running npm install first
   └─ Result: "Cannot find module" error

❌ WRONG: Running setup script twice without checking
   └─ Result: "duplicate key" error (but it's OK)

✅ RIGHT: Follow the steps in order
✅ RIGHT: Copy connection string carefully
✅ RIGHT: Run npm install before setup-db
✅ RIGHT: Check for errors and troubleshoot
```

---

## 🎉 Success Indicators

```
✅ npm run setup-db completes without errors
✅ You see "Database setup complete!" message
✅ Test user is created (admin@example.com)
✅ npm run dev starts successfully
✅ You can login with admin@example.com / password123
✅ Dashboard loads after login
✅ Activity logs show your login attempt
✅ Vercel deployment succeeds
✅ Login works on deployed app

If all ✅, you're done! 🎉
```

---

## 📞 Need Help?

| Question | Answer |
|----------|--------|
| How do I get the connection string? | Go to https://console.neon.tech and copy it |
| Where do I put the connection string? | In `.env.local` as `DATABASE_URL=...` |
| How do I run the setup script? | `npm run setup-db` in terminal |
| What if I get an error? | Check the troubleshooting section in STEP_BY_STEP.md |
| How do I test if it works? | `npm run dev` and login with admin@example.com / password123 |
| How do I deploy to Vercel? | `git push` and Vercel auto-deploys |

---

**You've got this! 💪**
