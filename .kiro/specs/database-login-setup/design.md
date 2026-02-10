# Database Login Setup - Design

## Architecture Overview

The login system consists of three main components:

1. **Database Layer** - PostgreSQL (Neon) with schema and seed data
2. **Authentication Layer** - bcryptjs for password hashing/verification
3. **API Layer** - Next.js route handlers for login endpoint

## Database Schema

### Core Tables

#### users
```
id: UUID (PK)
email: VARCHAR(255) UNIQUE NOT NULL
password_hash: VARCHAR(255) NOT NULL
first_name: VARCHAR(100)
last_name: VARCHAR(100)
role_id: UUID (FK -> roles.id)
is_active: BOOLEAN DEFAULT true
last_login: TIMESTAMP
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

#### roles
```
id: UUID (PK)
name: VARCHAR(50) UNIQUE NOT NULL
description: TEXT
created_at: TIMESTAMP DEFAULT NOW()
```

#### permissions
```
id: UUID (PK)
name: VARCHAR(100) UNIQUE NOT NULL
description: TEXT
created_at: TIMESTAMP DEFAULT NOW()
```

#### role_permissions
```
id: UUID (PK)
role_id: UUID (FK -> roles.id)
permission_id: UUID (FK -> permissions.id)
created_at: TIMESTAMP DEFAULT NOW()
UNIQUE(role_id, permission_id)
```

#### activity_logs
```
id: UUID (PK)
user_id: UUID (FK -> users.id, NULLABLE)
action: VARCHAR(100) NOT NULL
entity_type: VARCHAR(50)
entity_id: UUID
details: JSONB
ip_address: VARCHAR(45)
user_agent: TEXT
created_at: TIMESTAMP DEFAULT NOW()
```

### Initial Data

#### Roles
- **admin**: Administrator with full system access
- **teacher**: Game Master / Teacher - can create and manage games
- **player**: Student / Player - can participate in games

#### Permissions
- upload_questions
- create_questions
- start_rounds
- manage_users
- manage_questions
- view_logs
- manage_themes
- manage_roles
- join_games
- answer_questions

#### Test User
- **Email:** admin@example.com
- **Password:** password123 (hashed with bcryptjs)
- **Role:** admin
- **Status:** active

## Authentication Flow

### Login Process

1. **Input Validation**
   - Email format validation (regex check)
   - Password presence check
   - Return 400 if invalid

2. **User Lookup**
   - Query users table by email
   - Join with roles table to get role information
   - Return 401 if user not found
   - Log failed attempt with reason: LOGIN_FAILED_USER_NOT_FOUND

3. **Password Verification**
   - Use bcryptjs.compare() to verify password against hash
   - Return 401 if password incorrect
   - Log failed attempt with reason: LOGIN_FAILED_WRONG_PASSWORD

4. **Success Response**
   - Log successful login with reason: LOGIN_SUCCESS
   - Return user data (without password_hash)
   - Include user ID, email, name, role, permissions

### Activity Logging

All login attempts are logged with:
- user_id (NULL for failed attempts where user not found)
- action (LOGIN_SUCCESS, LOGIN_FAILED_USER_NOT_FOUND, LOGIN_FAILED_WRONG_PASSWORD)
- entity_type: 'user'
- entity_id: user ID (if found)
- details: { email }
- ip_address: from x-forwarded-for header
- user_agent: from user-agent header

## Code Changes Required

### 1. Update lib/auth.ts
- Change ID type from number to UUID (string)
- Update all queries to use UUID parameters
- Ensure activity_logs allows NULL user_id for failed logins

### 2. Create Database Setup Script
- SQL script to create schema
- SQL script to seed initial data
- SQL script to create test admin user

### 3. Verify API Routes
- app/api/auth/login/route.ts - already correct, just needs working database
- app/api/auth/signup/route.ts - needs review for UUID compatibility

## Correctness Properties

### Property 1: Valid Login Returns User Data
**Validates: Requirement 4.1**

For any user with email E and password P in the database:
- If password hash matches P, login returns user object with email E
- Returned object does NOT contain password_hash field
- Returned object contains role_name field

### Property 2: Invalid Email Returns Error
**Validates: Requirement 4.2**

For any email E not in the database:
- Login returns 401 status
- Response contains error message mentioning email not found
- Activity log contains LOGIN_FAILED_USER_NOT_FOUND entry

### Property 3: Invalid Password Returns Error
**Validates: Requirement 4.3**

For any user with email E and incorrect password P:
- Login returns 401 status
- Response contains error message mentioning incorrect password
- Activity log contains LOGIN_FAILED_WRONG_PASSWORD entry

### Property 4: Successful Login is Logged
**Validates: Requirement 4.4**

For any successful login:
- Activity log entry is created with action = LOGIN_SUCCESS
- Log entry contains user_id, email, ip_address, user_agent
- Log entry created_at is recent (within 1 second)

### Property 5: Failed Login is Logged
**Validates: Requirement 4.4**

For any failed login attempt:
- Activity log entry is created
- Log entry contains action (LOGIN_FAILED_*)
- Log entry contains email in details
- Log entry created_at is recent (within 1 second)

## Implementation Steps

1. Create database schema in Neon
2. Seed initial roles, permissions, question types
3. Create test admin user with hashed password
4. Update lib/auth.ts to use UUID instead of integer IDs
5. Test login endpoint with valid and invalid credentials
6. Verify activity logs are created correctly

## Testing Strategy

### Unit Tests
- Test password hashing and verification
- Test user lookup by email
- Test permission retrieval

### Integration Tests
- Test complete login flow with valid credentials
- Test login with invalid email
- Test login with invalid password
- Test activity logging for all scenarios

### Property-Based Tests
- Generate random valid users and verify login works
- Generate random invalid credentials and verify proper errors
- Verify all login attempts are logged

## Deployment Considerations

1. Database schema must be created before application deployment
2. Test user must be created before testing login
3. Environment variable DATABASE_URL must be set in Vercel
4. Connection pooling is handled by @neondatabase/serverless
