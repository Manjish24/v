-- ============================================================================
-- CAPACITY CONNECT - PostgreSQL Database Schema
-- Smart India Hackathon - Problem Statement 26075
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('TRAINEE', 'TRAINER', 'ADMIN')),
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRAINEE PROFILES
CREATE TABLE IF NOT EXISTS trainee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qualification VARCHAR(255),
    work_experience TEXT,
    interests TEXT[],
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRAINER PROFILES
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qualification VARCHAR(255),
    work_experience TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SKILLS
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100)
);

-- 5. TRAINEE SKILLS
CREATE TABLE IF NOT EXISTS trainee_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    UNIQUE(trainee_id, skill_id)
);

-- 6. TRAINER SKILLS
CREATE TABLE IF NOT EXISTS trainer_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    UNIQUE(trainer_id, skill_id)
);

-- 7. TRAINER COMPETENCIES (Core differentiator for Capacity Competency matching)
CREATE TABLE IF NOT EXISTS trainer_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    experience_years NUMERIC(4,1) DEFAULT 0,
    proficiency_level VARCHAR(50) DEFAULT 'Intermediate' CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    certification TEXT,
    past_performance_score NUMERIC(3,2) DEFAULT 4.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. COURSES
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration VARCHAR(100),
    learning_objectives TEXT[],
    prerequisites TEXT[],
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED')),
    completion_percentage NUMERIC(5,2) DEFAULT 0.0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(trainee_id, course_id)
);

-- 10. MATERIALS
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('VIDEO', 'PDF', 'PRESENTATION', 'DOCUMENT', 'LINK', 'TEXT/THEORY')),
    file_url TEXT,
    youtube_video_id VARCHAR(100),
    youtube_url TEXT,
    description TEXT,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 30,
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 50,
    status VARCHAR(50) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    marks INT DEFAULT 10
);

-- 13. ASSESSMENT RESULTS
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_marks INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    answers JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, trainee_id)
);

-- 14. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    academic_relevance INT CHECK (academic_relevance >= 1 AND academic_relevance <= 5),
    suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, trainee_id)
);

-- 15. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    certificate_url TEXT,
    verification_token VARCHAR(255) UNIQUE NOT NULL,
    UNIQUE(trainee_id, course_id)
);

-- 16. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    badge_icon VARCHAR(100) DEFAULT 'award',
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. QUERIES
CREATE TABLE IF NOT EXISTS queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raised_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_trainee ON enrollments(trainee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token ON certificates(verification_token);
CREATE INDEX IF NOT EXISTS idx_trainer_comp_subject ON trainer_competencies(subject);
