# Step-by-Step: Create Database for Quiz App

## Step 1: Get Connection String from Neon

### What to do:
1. Open https://console.neon.tech in your browser
2. Login with your account
3. You should see your projects listed
4. Click on your project (e.g., `attendance-system-shud`)
5. Look for "Connection string" or "Databases" section
6. You'll see a string that looks like:
   ```
   postgresql://neon_user:password123@ep-cool-db.us-east-1.neon.tech:5432/quiz_db?sslmode=require
   ```
7. Click the copy button (📋) to copy it

### What you're looking for:
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```

---

## Step 2: Update .env.local File

### What to do:
1. Open the file `.env.local` in your code editor
2. Find the line that says:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
   ```
3. Replace it with the connection string you copied from Neon
4. Save the file (Ctrl+S or Cmd+S)

### Example:
**Before:**
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
```

**After:**
```
DATABASE_URL=postgresql://neon_user:abc123xyz@ep-cool-db.us-east-1.neon.tech:5432/quiz_db?sslmode=require
```

---

## Step 3: Open Terminal/Command Prompt

### On Windows:
1. Press `Win + R`
2. Type `cmd` and press Enter
3. A black window opens (Command Prompt)

### On Mac:
1. Press `Cmd + Space`
2. Type `terminal` and press Enter
3. A terminal window opens

### On Linux:
1. Press `Ctrl + Alt + T`
2. A terminal window opens

---

## Step 4: Navigate to Project Folder

### What to do:
In the terminal, type:
```bash
cd path/to/your/quiz-app
```

Replace `path/to/your/quiz-app` with the actual path to your project.

### Example:
```bash
cd C:\Users\YourName\Documents\quiz-app
```

or

```bash
cd ~/Documents/quiz-app
```

### How to find the path:
1. Open your code editor (VS Code)
2. Look at the folder path shown in the file explorer
3. Copy that path

---

## Step 5: Run the Setup Script

### What to do:
In the terminal, type:
```bash
npm run setup-db
```

Then press Enter.

### What happens:
The script will:
1. Connect to your Neon database
2. Create all 18 tables
3. Add roles (admin, teacher, player)
4. Add permissions
5. Create a test admin user
6. Show you the login credentials

### Expected output:
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
   👤 User ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

✨ Database setup complete!

═══════════════════════════════════════════════════════
You can now login with:
  Email: admin@example.com
  Password: password123
═══════════════════════════════════════════════════════
```

### If you see an error:
- See the "Troubleshooting" section below

---

## Step 6: Test Login Locally

### What to do:
1. In the same terminal, type:
   ```bash
   npm run dev
   ```
2. Press Enter
3. Wait for the message: `ready - started server on 0.0.0.0:3000`
4. Open your browser and go to: http://localhost:3000
5. You should see the login page
6. Enter:
   - Email: `admin@example.com`
   - Password: `password123`
7. Click "Login"

### Expected result:
- You should see the dashboard
- If you see an error, check the troubleshooting section

---

## Step 7: Push to GitHub

### What to do:
1. In the terminal, type:
   ```bash
   git add .
   ```
2. Press Enter
3. Type:
   ```bash
   git commit -m "Add database setup script"
   ```
4. Press Enter
5. Type:
   ```bash
   git push
   ```
6. Press Enter

### What happens:
- Your changes are uploaded to GitHub
- Vercel automatically deploys the new version
- Wait 2-3 minutes for deployment to complete

---

## Step 8: Test on Vercel

### What to do:
1. Go to https://vercel.com/dashboard
2. Click on your project `quizapplication`
3. Wait for the deployment to complete (green checkmark)
4. Click the "Visit" button or the deployment URL
5. You should see your app
6. Try to login with:
   - Email: `admin@example.com`
   - Password: `password123`

### Expected result:
- Login works on the deployed app
- You can see the dashboard

---

## Troubleshooting

### ❌ Error: "DATABASE_URL environment variable not set"

**What it means:** The `.env.local` file doesn't have the connection string

**How to fix:**
1. Open `.env.local`
2. Make sure it has a line like:
   ```
   DATABASE_URL=postgresql://...
   ```
3. If it's empty or missing, add the connection string from Neon
4. Save the file
5. Run `npm run setup-db` again

---

### ❌ Error: "password authentication failed"

**What it means:** The connection string is wrong or the password is incorrect

**How to fix:**
1. Go to https://console.neon.tech
2. Copy the connection string again (make sure you copy the whole thing)
3. Update `.env.local` with the new connection string
4. Run `npm run setup-db` again

---

### ❌ Error: "Cannot find module '@neondatabase/serverless'"

**What it means:** Dependencies are not installed

**How to fix:**
1. In terminal, type:
   ```bash
   npm install
   ```
2. Press Enter
3. Wait for installation to complete
4. Run `npm run setup-db` again

---

### ❌ Error: "duplicate key value violates unique constraint"

**What it means:** The data already exists in the database (this is OK!)

**How to fix:**
- This is not an error, it's just a warning
- The script uses `ON CONFLICT DO NOTHING` to handle this
- You can run the script again without problems
- The database is already set up correctly

---

### ❌ Error: "relation 'users' does not exist"

**What it means:** The schema wasn't created successfully

**How to fix:**
1. Check your connection string is correct
2. Go to https://console.neon.tech and verify the database exists
3. Run `npm run setup-db` again
4. If it still fails, check the SQL script for errors

---

### ❌ Login doesn't work after setup

**What to check:**
1. Verify the user exists in the database:
   - Go to https://console.neon.tech
   - Click "SQL Editor"
   - Run this query:
     ```sql
     SELECT * FROM users WHERE email = 'admin@example.com';
     ```
   - You should see one row

2. Check the password hash:
   - Run this query:
     ```sql
     SELECT email, password_hash FROM users WHERE email = 'admin@example.com';
     ```
   - You should see a long hash string (not "password123")

3. Check activity logs for errors:
   - Run this query:
     ```sql
     SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;
     ```
   - Look for any error messages

4. If the user doesn't exist, run `npm run setup-db` again

---

## Quick Reference

### Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Test User Credentials
```
Email: admin@example.com
Password: password123
```

### Important Files
```
.env.local                    ← Connection string goes here
scripts/01-init-schema.sql    ← Creates tables
scripts/02-seed-data.sql      ← Creates roles, permissions
scripts/setup-db.js           ← Runs everything + creates test user
package.json                  ← Has "setup-db" script
```

### Commands
```bash
npm run setup-db              ← Create database and test user
npm run dev                   ← Start development server
npm run build                 ← Build for production
npm run start                 ← Start production server
```

---

## Summary

1. ✅ Get connection string from Neon
2. ✅ Update `.env.local` with connection string
3. ✅ Open terminal and navigate to project folder
4. ✅ Run `npm run setup-db`
5. ✅ Test login locally with `npm run dev`
6. ✅ Push to GitHub with `git push`
7. ✅ Test on Vercel

**Total time: ~5 minutes**

You're done! 🎉
