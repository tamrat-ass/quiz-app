# Database Login Setup - Implementation Tasks

## Task List

### 1. Create Database Schema in Neon
- [ ] Connect to Neon database using connection string
- [ ] Execute SQL script from `scripts/01-init-schema.sql`
- [ ] Verify all tables are created
- [ ] Verify all indexes are created
- [ ] Verify foreign key constraints are in place

**Details:**
- Use Neon SQL Editor or psql CLI
- Connection string: `DATABASE_URL` from .env.local
- Script location: `scripts/01-init-schema.sql`

### 2. Seed Initial Data (Roles, Permissions, Question Types)
- [ ] Execute SQL script from `scripts/02-seed-data.sql`
- [ ] Verify 3 roles are created (admin, teacher, player)
- [ ] Verify 10 permissions are created
- [ ] Verify 2 question types are created
- [ ] Verify role-permission mappings are established

**Details:**
- Script location: `scripts/02-seed-data.sql`
- Uses ON CONFLICT DO NOTHING to handle re-runs safely

### 3. Create Test Admin User
- [ ] Generate bcryptjs hash for password "password123"
- [ ] Insert admin user with email "admin@example.com"
- [ ] Assign admin role to the user
- [ ] Mark user as active
- [ ] Verify user can be queried by email

**Details:**
- Email: admin@example.com
- Password: password123 (must be hashed)
- Role ID: a0000000-0000-0000-0000-000000000001 (admin)
- is_active: true

### 4. Update lib/auth.ts for UUID Support
- [ ] Change all ID types from number to string (UUID)
- [ ] Update createUser function to handle UUID role_id
- [ ] Update getUserByEmail function to return UUID fields
- [ ] Update getUserById function to accept UUID
- [ ] Update getUserPermissions function for UUID
- [ ] Update logActivity function for UUID user_id
- [ ] Ensure activity_logs allows NULL user_id for failed logins

**Details:**
- All IDs in database are UUIDs (strings), not integers
- Update type annotations throughout the file
- Verify all queries use correct parameter types

### 5. Test Login Endpoint - Valid Credentials
- [ ] Start development server: `npm run dev`
- [ ] Send POST request to `/api/auth/login` with:
  - email: admin@example.com
  - password: password123
- [ ] Verify response status is 200
- [ ] Verify response contains user object with email, role_name
- [ ] Verify response does NOT contain password_hash
- [ ] Verify activity log entry is created with LOGIN_SUCCESS

**Details:**
- Use curl, Postman, or fetch in browser console
- Check activity_logs table for entry
- Response should include: id, email, first_name, last_name, role_id, role_name, is_active, created_at

### 6. Test Login Endpoint - Invalid Email
- [ ] Send POST request to `/api/auth/login` with:
  - email: nonexistent@example.com
  - password: password123
- [ ] Verify response status is 401
- [ ] Verify response contains error message about email not found
- [ ] Verify activity log entry is created with LOGIN_FAILED_USER_NOT_FOUND
- [ ] Verify activity log user_id is NULL

**Details:**
- Error message should mention "Email not found"
- Check activity_logs table for entry with user_id = NULL

### 7. Test Login Endpoint - Invalid Password
- [ ] Send POST request to `/api/auth/login` with:
  - email: admin@example.com
  - password: wrongpassword
- [ ] Verify response status is 401
- [ ] Verify response contains error message about incorrect password
- [ ] Verify activity log entry is created with LOGIN_FAILED_WRONG_PASSWORD
- [ ] Verify activity log user_id is set to admin user ID

**Details:**
- Error message should mention "Incorrect password"
- Check activity_logs table for entry with correct user_id

### 8. Write Property-Based Tests for Login
- [ ] Create test file: `app/api/auth/login/__tests__/login.test.ts`
- [ ] Write property test: Valid login returns user data
- [ ] Write property test: Invalid email returns 401 error
- [ ] Write property test: Invalid password returns 401 error
- [ ] Write property test: Successful login is logged
- [ ] Write property test: Failed login is logged
- [ ] Run tests and verify all pass

**Details:**
- Use testing framework specified in design (to be determined)
- Generate random valid users for testing
- Generate random invalid credentials
- Verify database state after each test

### 9. Verify Deployment to Vercel
- [ ] Push all changes to GitHub
- [ ] Verify Vercel deployment succeeds
- [ ] Verify DATABASE_URL environment variable is set in Vercel
- [ ] Test login on deployed application
- [ ] Verify activity logs are created in production database

**Details:**
- Repository: tamrat-ass/quiz-app
- Vercel project: quizapplication
- Check Vercel deployment logs for any errors

### 10. Document Setup Process
- [ ] Create README section for database setup
- [ ] Document how to run SQL scripts
- [ ] Document test user credentials
- [ ] Document how to create additional users
- [ ] Document troubleshooting steps

**Details:**
- Add to project README or create SETUP.md
- Include connection string format
- Include example curl commands for testing

## Completion Criteria

All tasks must be completed in order:
1. Database schema created ✓
2. Initial data seeded ✓
3. Test admin user created ✓
4. lib/auth.ts updated for UUID ✓
5. Login tested with valid credentials ✓
6. Login tested with invalid email ✓
7. Login tested with invalid password ✓
8. Property-based tests written and passing ✓
9. Deployment verified ✓
10. Setup documented ✓

## Success Metrics

- User can login with admin@example.com / password123
- All login attempts are logged in activity_logs
- No TypeScript errors in auth code
- All property-based tests pass
- Application works on Vercel with Neon database
