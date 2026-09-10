-- ============================================================================
-- CAPACITY CONNECT - Seed Data Script
-- Smart India Hackathon - Problem Statement 26075
-- ============================================================================

-- Fixed UUIDs for predictable relational integrity
-- Admin: a0000000-0000-0000-0000-000000000001
-- Trainer 1: b0000000-0000-0000-0000-000000000001 (Dr. Rajesh Sharma)
-- Trainer 2: b0000000-0000-0000-0000-000000000002 (Prof. Anita Desai)
-- Trainee 1: c0000000-0000-0000-0000-000000000001 (Aarav Patel)
-- Trainee 2: c0000000-0000-0000-0000-000000000002 (Priya Verma)

-- 1. USERS
INSERT INTO users (id, name, email, password_hash, role, status, avatar_url, bio)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Admin Officer', 'admin@capacityconnect.gov.in', '$2a$10$wE9Jvhg7zHwYq92vXq8.b.jKjGqGvF5s9bC8oF1d8T6V2pL4iG0u.', 'ADMIN', 'APPROVED', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Chief Administrator for Capacity Connect Portal.'),
  ('b0000000-0000-0000-0000-000000000001', 'Dr. Rajesh Sharma', 'rajesh.sharma@capacityconnect.gov.in', '$2a$10$wE9Jvhg7zHwYq92vXq8.b.jKjGqGvF5s9bC8oF1d8T6V2pL4iG0u.', 'TRAINER', 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Senior AI Researcher & M.Tech in Artificial Intelligence. 8+ years experience.'),
  ('b0000000-0000-0000-0000-000000000002', 'Prof. Anita Desai', 'anita.desai@capacityconnect.gov.in', '$2a$10$wE9Jvhg7zHwYq92vXq8.b.jKjGqGvF5s9bC8oF1d8T6V2pL4iG0u.', 'TRAINER', 'APPROVED', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Associate Professor in Web & Distributed Computing. Cloud certified architect.'),
  ('c0000000-0000-0000-0000-000000000001', 'Aarav Patel', 'aarav.patel@trainee.in', '$2a$10$wE9Jvhg7zHwYq92vXq8.b.jKjGqGvF5s9bC8oF1d8T6V2pL4iG0u.', 'TRAINEE', 'APPROVED', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Aspiring ML Engineer & Software Developer looking to upgrade skills.'),
  ('c0000000-0000-0000-0000-000000000002', 'Priya Verma', 'priya.verma@trainee.in', '$2a$10$wE9Jvhg7zHwYq92vXq8.b.jKjGqGvF5s9bC8oF1d8T6V2pL4iG0u.', 'TRAINEE', 'PENDING', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Data enthusiast & computer science graduate student.')
ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES
INSERT INTO trainer_profiles (id, user_id, qualification, work_experience, bio)
VALUES
  ('b1111111-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Ph.D. in Computer Science (IIT Bombay), M.Tech AI', '8 years in AI research and 5 years university lecturing', 'Specializes in Deep Learning, PyTorch, and Computer Vision architectures.'),
  ('b1111111-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'M.S. in Software Systems, AWS Certified Solutions Architect', '10 years software industry experience, 4 years trainer', 'Passionate about modern full-stack development, cloud native apps, and microservices.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO trainee_profiles (id, user_id, qualification, work_experience, interests, bio)
VALUES
  ('c1111111-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'B.Tech in Information Technology', '1 year junior developer', ARRAY['Artificial Intelligence', 'Data Science', 'Machine Learning'], 'Dedicated learner building competencies for public sector tech transformation.'),
  ('c1111111-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'B.Sc. in Mathematics and Statistics', 'Fresher', ARRAY['Analytics', 'Machine Learning', 'Python'], 'Focused on statistical modeling and business intelligence.')
ON CONFLICT (id) DO NOTHING;

-- 3. SKILLS
INSERT INTO skills (id, name, description, category)
VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Python', 'Core Python programming and data structures', 'Programming'),
  ('s0000000-0000-0000-0000-000000000002', 'Machine Learning', 'Supervised and unsupervised ML algorithms', 'AI/Data'),
  ('s0000000-0000-0000-0000-000000000003', 'Deep Learning', 'Neural networks, PyTorch, and Computer Vision', 'AI/Data'),
  ('s0000000-0000-0000-0000-000000000004', 'React.js', 'Frontend web development with React hooks and ecosystem', 'Web'),
  ('s0000000-0000-0000-0000-000000000005', 'Node.js', 'Backend REST APIs and server-side JavaScript', 'Backend'),
  ('s0000000-0000-0000-0000-000000000006', 'SQL', 'Relational database querying and optimization', 'Database'),
  ('s0000000-0000-0000-0000-000000000007', 'Cloud Architecture', 'AWS, Azure, containerization, and microservices', 'Cloud')
ON CONFLICT (id) DO NOTHING;

-- 4. TRAINER COMPETENCIES
INSERT INTO trainer_competencies (id, trainer_id, subject, experience_years, proficiency_level, certification, past_performance_score)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'b1111111-0000-0000-0000-000000000001', 'Machine Learning', 8.0, 'Expert', 'Google Professional ML Engineer', 4.90),
  ('t0000000-0000-0000-0000-000000000002', 'b1111111-0000-0000-0000-000000000001', 'Computer Vision & Deep Learning', 6.5, 'Expert', 'DeepLearning.AI TensorFlow Specialization', 4.85),
  ('t0000000-0000-0000-0000-000000000003', 'b1111111-0000-0000-0000-000000000002', 'Full Stack Web Development', 10.0, 'Expert', 'Meta Certified Full-Stack Developer', 4.75),
  ('t0000000-0000-0000-0000-000000000004', 'b1111111-0000-0000-0000-000000000002', 'Cloud Computing & DevOps', 7.0, 'Advanced', 'AWS Certified Solutions Architect - Professional', 4.80)
ON CONFLICT (id) DO NOTHING;

-- 5. TRAINEE SKILLS
INSERT INTO trainee_skills (id, trainee_id, skill_id, level)
VALUES
  ('ts000000-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 'Advanced'),
  ('ts000000-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000006', 'Intermediate'),
  ('ts000000-0000-0000-0000-000000000003', 'c1111111-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002', 'Beginner')
ON CONFLICT (id) DO NOTHING;

-- 6. COURSES
INSERT INTO courses (id, trainer_id, title, description, subject, difficulty, duration, learning_objectives, prerequisites, status, thumbnail_url)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Applied Machine Learning with Python',
    'Master regression, classification, model evaluation, and cross-validation techniques using real-world public sector case studies.',
    'Machine Learning',
    'Intermediate',
    '6 Weeks (24 Hours)',
    ARRAY['Understand linear and logistic regression', 'Compute and minimize Mean Squared Error', 'Implement cross-validation and avoid overfitting', 'Deploy models with standard pipelines'],
    ARRAY['Basic Python programming', 'Fundamental Linear Algebra'],
    'PUBLISHED',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'Modern Full-Stack Development with React & Node',
    'Build production-grade web applications with modern React, Tailwind CSS, Express REST APIs, and PostgreSQL.',
    'Web Development',
    'Beginner',
    '8 Weeks (32 Hours)',
    ARRAY['Build responsive UI components in React', 'Implement state management and hooks', 'Design secure REST APIs in Express', 'Connect to PostgreSQL with ORM and SQL'],
    ARRAY['Basic HTML, CSS and JavaScript'],
    'PUBLISHED',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'Cloud Architecture & Microservices Fundamentals',
    'Design resilient cloud solutions, containerized microservices, and serverless workflows for institutional capacity building.',
    'Cloud Computing',
    'Advanced',
    '4 Weeks (16 Hours)',
    ARRAY['Architect scalable multi-tier web applications', 'Deploy containers using Docker', 'Set up automated CI/CD pipelines', 'Configure cloud security and monitoring'],
    ARRAY['Basic Linux commands', 'Familiarity with web architecture'],
    'PUBLISHED',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600'
  )
ON CONFLICT (id) DO NOTHING;

-- 7. MATERIALS
INSERT INTO materials (id, course_id, trainer_id, title, type, file_url, youtube_video_id, youtube_url, description, sort_order)
VALUES
  (
    'm0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Lecture 1: Introduction to Machine Learning and Supervised Systems',
    'VIDEO',
    NULL,
    'Gv9_4yMHFhI',
    'https://www.youtube.com/watch?v=Gv9_4yMHFhI',
    'Comprehensive lecture video introducing supervised vs unsupervised learning and regression fundamentals.',
    1
  ),
  (
    'm0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Module 1 Slide Deck: Regression & Loss Functions',
    'PRESENTATION',
    'https://example.com/materials/ml-module-1.pdf',
    NULL,
    NULL,
    'Official slides covering mathematical derivations of Ordinary Least Squares and gradient descent.',
    2
  ),
  (
    'm0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Core Reading: Bias-Variance Tradeoff in Model Training',
    'TEXT/THEORY',
    NULL,
    NULL,
    NULL,
    'The bias-variance dilemma is the conflict in trying to simultaneously minimize these two sources of error that prevent supervised learning algorithms from generalizing beyond their training set.',
    3
  ),
  (
    'm0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'Lecture 1: React Fundamentals and Component State',
    'VIDEO',
    NULL,
    'bMknfKXIFA8',
    'https://www.youtube.com/watch?v=bMknfKXIFA8',
    'Hands-on walkthrough of modern React components, props, state, and unidirectional data flow.',
    1
  )
ON CONFLICT (id) DO NOTHING;

-- 8. ASSESSMENTS
INSERT INTO assessments (id, course_id, trainer_id, title, description, deadline, duration_minutes, total_marks, passing_marks, status)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Machine Learning Foundations Assessment',
    'Mandatory MCQ evaluation on regression, cost functions, gradient descent, and evaluation metrics.',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    30,
    30,
    18,
    'PUBLISHED'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'React & State Management Quiz',
    'Test on component lifecycle, hooks (useState, useEffect, useContext), and REST client calls.',
    CURRENT_TIMESTAMP + INTERVAL '15 days',
    20,
    20,
    12,
    'PUBLISHED'
  )
ON CONFLICT (id) DO NOTHING;

-- 9. QUESTIONS
INSERT INTO questions (id, assessment_id, question, option_a, option_b, option_c, option_d, correct_option, marks)
VALUES
  (
    'q0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'What loss function is most commonly minimized during Ordinary Least Squares (OLS) Linear Regression?',
    'Binary Cross-Entropy',
    'Mean Squared Error (MSE)',
    'Hinge Loss',
    'Kullback-Leibler Divergence',
    'B',
    10
  ),
  (
    'q0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'Which phenomenon occurs when a model performs exceptionally well on training data but fails to generalize to unseen data?',
    'Underfitting',
    'High Bias',
    'Overfitting',
    'Data leakage',
    'C',
    10
  ),
  (
    'q0000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'In Gradient Descent, what determines the step size taken towards the minimum of the loss function?',
    'Batch size',
    'Learning rate (alpha)',
    'Number of features',
    'Activation threshold',
    'B',
    10
  )
ON CONFLICT (id) DO NOTHING;

-- 10. ENROLLMENTS & RESULTS (Aarav completed ML course & passed test)
INSERT INTO enrollments (id, trainee_id, course_id, status, completion_percentage, enrolled_at, completed_at)
VALUES
  (
    'en000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'COMPLETED',
    100.0,
    CURRENT_TIMESTAMP - INTERVAL '14 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
  ),
  (
    'en000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000002',
    'ACTIVE',
    45.0,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO assessment_results (id, assessment_id, trainee_id, score, total_marks, percentage, grade, answers, submitted_at)
VALUES
  (
    'r0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    30,
    30,
    100.0,
    'A+',
    '{"q0000000-0000-0000-0000-000000000001": "B", "q0000000-0000-0000-0000-000000000002": "C", "q0000000-0000-0000-0000-000000000003": "B"}',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 11. CERTIFICATE (Aarav earned official certificate with QR token)
INSERT INTO certificates (id, certificate_number, trainee_id, course_id, issued_at, verification_token, certificate_url)
VALUES
  (
    'cert0000-0000-0000-0000-000000000001',
    'CC-2026-000108',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'cc_token_v7f8a93e2b104dc98a4e',
    '/verify/cc_token_v7f8a93e2b104dc98a4e'
  )
ON CONFLICT (id) DO NOTHING;

-- 12. FEEDBACK
INSERT INTO feedback (id, course_id, trainee_id, rating, comment, academic_relevance, suggestions)
VALUES
  (
    'fb000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    5,
    'Exceptional lecture delivery! The mathematical explanations of gradient descent paired with Python code made complex topics effortless to understand.',
    5,
    'Would love an extra module covering neural network backpropagation.'
  )
ON CONFLICT (id) DO NOTHING;

-- 13. ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, category, created_by, published)
VALUES
  (
    'ann00000-0000-0000-0000-000000000001',
    'Capacity Connect Launch - Smart India Hackathon PS 26075',
    'Welcome to Capacity Connect! The portal is officially active for national digital capacity-building. Trainees and trainers can register, explore courses, and earn verifiable certificates.',
    'Platform Update',
    'a0000000-0000-0000-0000-000000000001',
    TRUE
  ),
  (
    'ann00000-0000-0000-0000-000000000002',
    'New Advanced AI & Cloud Computing Cohorts Announced',
    'Trainers have published new accredited courses in Applied Machine Learning and Modern Full-Stack Development. Enroll today to participate in live assessments.',
    'Academic Announcement',
    'a0000000-0000-0000-0000-000000000001',
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- 14. ACHIEVEMENTS
INSERT INTO achievements (id, trainee_id, title, description, badge_icon, status, published)
VALUES
  (
    'ach00000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Top Assessment Performer (100%)',
    'Scored a perfect 30/30 on the Applied Machine Learning Foundations Assessment.',
    'trophy',
    'APPROVED',
    TRUE
  ),
  (
    'ach00000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'First Course Completion Milestone',
    'Successfully finished all lectures, readings, and assessments for Applied Machine Learning.',
    'award',
    'APPROVED',
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- 15. QUERIES
INSERT INTO queries (id, raised_by, assigned_to, course_id, subject, message, response, status, resolved_at)
VALUES
  (
    'qry00000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'Clarification regarding Gradient Descent Learning Rate',
    'Dr. Rajesh, in lecture 1, what heuristic do you recommend if the cost oscillates instead of decreasing during batch gradient descent?',
    'Oscillation indicates the learning rate (alpha) is too large. Try scaling alpha down by an order of magnitude (e.g., from 0.1 to 0.01) or implement an adaptive schedule such as Adam.',
    'RESOLVED',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;
