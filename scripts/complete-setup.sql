-- ============================================================================
-- COMPLETE DATABASE SETUP FOR QUIZ APP
-- ============================================================================
-- This script creates all tables, indexes, roles, permissions, and test data
-- Paste this entire script into Neon SQL Editor and execute it once
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- ============================================================================
-- CREATE ALL TABLES
-- ============================================================================

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Role-Permission junction table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role_id UUID NOT NULL REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rounds table
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  round_number INT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(round_number)
);

-- Question Types table
CREATE TABLE question_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id),
  round_id UUID NOT NULL REFERENCES rounds(id),
  question_type_id UUID NOT NULL REFERENCES question_types(id),
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  time_limit INT NOT NULL DEFAULT 30,
  marks INT NOT NULL DEFAULT 1,
  created_by UUID NOT NULL REFERENCES users(id),
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section_id, round_id, question_number)
);

-- Question Options table (for MCQ)
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_key VARCHAR(10) NOT NULL,
  option_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(question_id, option_key)
);

-- Question Versions table
CREATE TABLE question_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id),
  version_number INT NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  time_limit INT NOT NULL,
  marks INT NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(question_id, version_number)
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Game Sections table
CREATE TABLE game_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, section_id)
);

-- Game Rounds table
CREATE TABLE game_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round_id UUID NOT NULL REFERENCES rounds(id),
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, round_id)
);

-- Game Questions table
CREATE TABLE game_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_round_id UUID NOT NULL REFERENCES game_rounds(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_round_id, question_id)
);

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  total_score INT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_question_id UUID NOT NULL REFERENCES game_questions(id) ON DELETE CASCADE,
  answer_text VARCHAR(255) NOT NULL,
  is_correct BOOLEAN,
  points_earned INT DEFAULT 0,
  submission_time INT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  text_color VARCHAR(7) DEFAULT '#000000',
  button_color VARCHAR(7) DEFAULT '#3b82f6',
  is_dark_mode BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  game_id UUID REFERENCES games(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_questions_section_id ON questions(section_id);
CREATE INDEX idx_questions_round_id ON questions(round_id);
CREATE INDEX idx_questions_is_deleted ON questions(is_deleted);
CREATE INDEX idx_game_rounds_game_id ON game_rounds(game_id);
CREATE INDEX idx_answers_player_id ON answers(player_id);
CREATE INDEX idx_answers_game_question_id ON answers(game_question_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);

-- ============================================================================
-- INSERT INITIAL DATA
-- ============================================================================

-- Insert roles
INSERT INTO roles (id, name, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Administrator with full system access'),
  ('a0000000-0000-0000-0000-000000000002', 'teacher', 'Game Master / Teacher - can create and manage games'),
  ('a0000000-0000-0000-0000-000000000003', 'player', 'Student / Player - can participate in games')
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (id, name, description) VALUES
  ('p0000000-0000-0000-0000-000000000001', 'upload_questions', 'Upload questions via Excel'),
  ('p0000000-0000-0000-0000-000000000002', 'create_questions', 'Create questions manually'),
  ('p0000000-0000-0000-0000-000000000003', 'start_rounds', 'Start game rounds'),
  ('p0000000-0000-0000-0000-000000000004', 'manage_users', 'Manage system users'),
  ('p0000000-0000-0000-0000-000000000005', 'manage_questions', 'Add, update, delete, recover questions'),
  ('p0000000-0000-0000-0000-000000000006', 'view_logs', 'View activity logs and reports'),
  ('p0000000-0000-0000-0000-000000000007', 'manage_themes', 'Customize UI colors and themes'),
  ('p0000000-0000-0000-0000-000000000008', 'manage_roles', 'Manage roles and permissions'),
  ('p0000000-0000-0000-0000-000000000009', 'join_games', 'Join and play games'),
  ('p0000000-0000-0000-0000-000000000010', 'answer_questions', 'Submit answers to questions')
ON CONFLICT (name) DO NOTHING;

-- Insert question types
INSERT INTO question_types (id, name, description) VALUES
  ('q0000000-0000-0000-0000-000000000001', 'choose', 'Multiple choice - select one or more options'),
  ('q0000000-0000-0000-0000-000000000002', 'sign', 'Sign / True-False / Symbol-based questions')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign teacher permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000002', id FROM permissions
WHERE name IN ('upload_questions', 'create_questions', 'start_rounds', 'manage_questions', 'manage_themes')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign player permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000003', id FROM permissions
WHERE name IN ('join_games', 'answer_questions')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================================
-- CREATE TEST ADMIN USER
-- ============================================================================
-- Password: password123 (hashed with bcryptjs, salt rounds = 10)
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm

INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active)
VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
  'Admin',
  'User',
  'a0000000-0000-0000-0000-000000000001',
  true
)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
  is_active = true;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify everything was created)
-- ============================================================================

-- Check all tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check roles
SELECT id, name, description FROM roles;

-- Check permissions
SELECT id, name FROM permissions;

-- Check test user
SELECT id, email, first_name, last_name, role_id, is_active FROM users WHERE email = 'admin@example.com';

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- You can now login with:
-- Email: admin@example.com
-- Password: password123
-- ============================================================================
