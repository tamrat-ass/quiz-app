# Database Login Setup - Requirements

## Overview
The quiz application needs a properly configured database with schema and test data to enable user login functionality. Currently, the database connection is configured but the schema hasn't been created and no test users exist.

## User Stories

### 1. Database Schema Creation
**As a** developer  
**I want** the database schema to be created in Neon  
**So that** the application can store and retrieve user data

**Acceptance Criteria:**
- [ ] All tables are created in the Neon database (users, roles, permissions, etc.)
- [ ] All foreign key relationships are properly established
- [ ] All indexes are created for performance
- [ ] The schema matches the SQL script in `scripts/01-init-schema.sql`

### 2. Initial Data Seeding
**As a** developer  
**I want** the database to be populated with initial roles, permissions, and question types  
**So that** the application has the necessary reference data

**Acceptance Criteria:**
- [ ] Three roles are created: admin, teacher, player
- [ ] All permissions are created and assigned to appropriate roles
- [ ] Question types (choose, sign) are created
- [ ] Role-permission mappings are established

### 3. Test Admin User Creation
**As a** developer  
**I want** a test admin user to be created in the database  
**So that** I can test the login functionality

**Acceptance Criteria:**
- [ ] Admin user is created with email: `admin@example.com`
- [ ] Password is securely hashed using bcryptjs
- [ ] User is assigned the admin role
- [ ] User is marked as active (`is_active = true`)
- [ ] User can successfully login with credentials: admin@example.com / password123

### 4. Login Functionality Verification
**As a** user  
**I want** to login to the application with valid credentials  
**So that** I can access the dashboard

**Acceptance Criteria:**
- [ ] Login endpoint accepts email and password
- [ ] Valid credentials return user data (without password hash)
- [ ] Invalid email returns appropriate error message
- [ ] Invalid password returns appropriate error message
- [ ] Successful login is logged in activity_logs table
- [ ] Failed login attempts are logged in activity_logs table

## Technical Details

### Database Connection
- **Provider:** Neon (PostgreSQL)
- **Connection String:** Stored in `DATABASE_URL` environment variable
- **Driver:** @neondatabase/serverless

### Authentication
- **Password Hashing:** bcryptjs with salt rounds = 10
- **Session Management:** To be implemented (currently just returns user data)

### Schema Notes
- Uses UUID primary keys (not integers as currently in auth.ts)
- Foreign key constraints are enforced
- Timestamps are automatically managed with DEFAULT NOW()
- Email field is unique and indexed

## Dependencies
- @neondatabase/serverless (already installed)
- bcryptjs (already installed)
- sql-template-tag (already installed)

## Known Issues to Address
1. Auth code uses integer IDs but schema uses UUIDs - need to update auth.ts
2. No test user exists in database
3. Database schema hasn't been created in Neon yet
4. Activity logging references non-existent user_id (should allow NULL for failed logins)
