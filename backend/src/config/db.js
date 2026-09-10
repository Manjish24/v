import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// ============================================================================
// Robust In-Memory Relational Data Store (Pre-populated with Seed Data)
// Enables zero-configuration instantaneous local operation & testing
// ============================================================================

const defaultPasswordHash = bcrypt.hashSync('Password@123', 10);

export const memoryStore = {
  users: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Admin Officer',
      email: 'admin@capacityconnect.gov.in',
      password_hash: defaultPasswordHash,
      role: 'ADMIN',
      status: 'APPROVED',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Chief Administrator for Capacity Connect Portal.',
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Dr. Rajesh Sharma',
      email: 'rajesh.sharma@capacityconnect.gov.in',
      password_hash: defaultPasswordHash,
      role: 'TRAINER',
      status: 'APPROVED',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Senior AI Researcher & M.Tech in Artificial Intelligence. 8+ years experience.',
      created_at: new Date('2026-01-02').toISOString(),
      updated_at: new Date('2026-01-02').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      name: 'Prof. Anita Desai',
      email: 'anita.desai@capacityconnect.gov.in',
      password_hash: defaultPasswordHash,
      role: 'TRAINER',
      status: 'APPROVED',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      bio: 'Associate Professor in Web & Distributed Computing. Cloud certified architect.',
      created_at: new Date('2026-01-03').toISOString(),
      updated_at: new Date('2026-01-03').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      name: 'Aarav Patel',
      email: 'aarav.patel@trainee.in',
      password_hash: defaultPasswordHash,
      role: 'TRAINEE',
      status: 'APPROVED',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bio: 'Aspiring ML Engineer & Software Developer looking to upgrade skills.',
      created_at: new Date('2026-01-05').toISOString(),
      updated_at: new Date('2026-01-05').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      name: 'Priya Verma',
      email: 'priya.verma@trainee.in',
      password_hash: defaultPasswordHash,
      role: 'TRAINEE',
      status: 'PENDING',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'Data enthusiast & computer science graduate student.',
      created_at: new Date('2026-01-10').toISOString(),
      updated_at: new Date('2026-01-10').toISOString()
    }
  ],

  traineeProfiles: [
    {
      id: 'c1111111-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      qualification: 'B.Tech in Information Technology',
      work_experience: '1 year junior developer',
      interests: ['Artificial Intelligence', 'Data Science', 'Machine Learning'],
      bio: 'Dedicated learner building competencies for public sector tech transformation.',
      skills: [
        { name: 'Python', level: 'Advanced' },
        { name: 'SQL', level: 'Intermediate' },
        { name: 'Machine Learning', level: 'Beginner' }
      ],
      created_at: new Date('2026-01-05').toISOString()
    },
    {
      id: 'c1111111-0000-0000-0000-000000000002',
      user_id: 'c0000000-0000-0000-0000-000000000002',
      qualification: 'B.Sc. in Mathematics and Statistics',
      work_experience: 'Fresher',
      interests: ['Analytics', 'Machine Learning', 'Python'],
      bio: 'Focused on statistical modeling and business intelligence.',
      skills: [
        { name: 'Python', level: 'Intermediate' },
        { name: 'Statistics', level: 'Advanced' }
      ],
      created_at: new Date('2026-01-10').toISOString()
    }
  ],

  trainerProfiles: [
    {
      id: 'b1111111-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      qualification: 'Ph.D. in Computer Science (IIT Bombay), M.Tech AI',
      work_experience: '8 years in AI research and 5 years university lecturing',
      bio: 'Specializes in Deep Learning, PyTorch, and Computer Vision architectures.',
      skills: [
        { name: 'Machine Learning', level: 'Expert' },
        { name: 'Python', level: 'Expert' },
        { name: 'Deep Learning', level: 'Expert' },
        { name: 'Computer Vision', level: 'Expert' }
      ],
      competencies: [
        {
          id: 't0000000-0000-0000-0000-000000000001',
          subject: 'Machine Learning',
          experience_years: 8.0,
          proficiency_level: 'Expert',
          certification: 'Google Professional ML Engineer',
          past_performance_score: 4.90
        },
        {
          id: 't0000000-0000-0000-0000-000000000002',
          subject: 'Computer Vision & Deep Learning',
          experience_years: 6.5,
          proficiency_level: 'Expert',
          certification: 'DeepLearning.AI TensorFlow Specialization',
          past_performance_score: 4.85
        }
      ],
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      id: 'b1111111-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000002',
      qualification: 'M.S. in Software Systems, AWS Certified Solutions Architect',
      work_experience: '10 years software industry experience, 4 years trainer',
      bio: 'Passionate about modern full-stack development, cloud native apps, and microservices.',
      skills: [
        { name: 'React.js', level: 'Expert' },
        { name: 'Node.js', level: 'Expert' },
        { name: 'Cloud Architecture', level: 'Advanced' },
        { name: 'SQL', level: 'Expert' }
      ],
      competencies: [
        {
          id: 't0000000-0000-0000-0000-000000000003',
          subject: 'Full Stack Web Development',
          experience_years: 10.0,
          proficiency_level: 'Expert',
          certification: 'Meta Certified Full-Stack Developer',
          past_performance_score: 4.75
        },
        {
          id: 't0000000-0000-0000-0000-000000000004',
          subject: 'Cloud Computing & DevOps',
          experience_years: 7.0,
          proficiency_level: 'Advanced',
          certification: 'AWS Certified Solutions Architect - Professional',
          past_performance_score: 4.80
        }
      ],
      created_at: new Date('2026-01-03').toISOString()
    }
  ],

  courses: [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      trainer_id: 'b0000000-0000-0000-0000-000000000001',
      trainer_name: 'Dr. Rajesh Sharma',
      title: 'Applied Machine Learning with Python',
      description: 'Master regression, classification, model evaluation, and cross-validation techniques using real-world public sector case studies.',
      subject: 'Machine Learning',
      difficulty: 'Intermediate',
      duration: '6 Weeks (24 Hours)',
      learning_objectives: [
        'Understand linear and logistic regression',
        'Compute and minimize Mean Squared Error',
        'Implement cross-validation and avoid overfitting',
        'Deploy models with standard pipelines'
      ],
      prerequisites: ['Basic Python programming', 'Fundamental Linear Algebra'],
      status: 'PUBLISHED',
      thumbnail_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600',
      created_at: new Date('2026-01-10').toISOString(),
      updated_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      trainer_id: 'b0000000-0000-0000-0000-000000000002',
      trainer_name: 'Prof. Anita Desai',
      title: 'Modern Full-Stack Development with React & Node',
      description: 'Build production-grade web applications with modern React, Tailwind CSS, Express REST APIs, and PostgreSQL.',
      subject: 'Web Development',
      difficulty: 'Beginner',
      duration: '8 Weeks (32 Hours)',
      learning_objectives: [
        'Build responsive UI components in React',
        'Implement state management and hooks',
        'Design secure REST APIs in Express',
        'Connect to PostgreSQL with ORM and SQL'
      ],
      prerequisites: ['Basic HTML, CSS and JavaScript'],
      status: 'PUBLISHED',
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      created_at: new Date('2026-01-12').toISOString(),
      updated_at: new Date('2026-01-12').toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      trainer_id: 'b0000000-0000-0000-0000-000000000002',
      trainer_name: 'Prof. Anita Desai',
      title: 'Cloud Architecture & Microservices Fundamentals',
      description: 'Design resilient cloud solutions, containerized microservices, and serverless workflows for institutional capacity building.',
      subject: 'Cloud Computing',
      difficulty: 'Advanced',
      duration: '4 Weeks (16 Hours)',
      learning_objectives: [
        'Architect scalable multi-tier web applications',
        'Deploy containers using Docker',
        'Set up automated CI/CD pipelines',
        'Configure cloud security and monitoring'
      ],
      prerequisites: ['Basic Linux commands', 'Familiarity with web architecture'],
      status: 'PUBLISHED',
      thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
      created_at: new Date('2026-01-15').toISOString(),
      updated_at: new Date('2026-01-15').toISOString()
    }
  ],

  materials: [
    {
      id: 'm0000000-0000-0000-0000-000000000001',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      trainer_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Lecture 1: Introduction to Machine Learning and Supervised Systems',
      type: 'VIDEO',
      file_url: null,
      youtube_video_id: 'Gv9_4yMHFhI',
      youtube_url: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI',
      description: 'Comprehensive lecture video introducing supervised vs unsupervised learning and regression fundamentals.',
      sort_order: 1,
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'm0000000-0000-0000-0000-000000000002',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      trainer_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Module 1 Slide Deck: Regression & Loss Functions',
      type: 'PRESENTATION',
      file_url: 'https://example.com/materials/ml-module-1.pdf',
      youtube_video_id: null,
      youtube_url: null,
      description: 'Official slides covering mathematical derivations of Ordinary Least Squares and gradient descent.',
      sort_order: 2,
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'm0000000-0000-0000-0000-000000000003',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      trainer_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Core Reading: Bias-Variance Tradeoff in Model Training',
      type: 'TEXT/THEORY',
      file_url: null,
      youtube_video_id: null,
      youtube_url: null,
      description: 'The bias-variance dilemma is the conflict in trying to simultaneously minimize these two sources of error that prevent supervised learning algorithms from generalizing beyond their training set. High bias can cause an algorithm to miss the relevant relations between features and target outputs (underfitting). In contrast, high variance can cause an algorithm to model the random noise in the training data, rather than the intended outputs (overfitting).',
      sort_order: 3,
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'm0000000-0000-0000-0000-000000000004',
      course_id: 'd0000000-0000-0000-0000-000000000002',
      trainer_id: 'b0000000-0000-0000-0000-000000000002',
      title: 'Lecture 1: React Fundamentals and Component State',
      type: 'VIDEO',
      file_url: null,
      youtube_video_id: 'bMknfKXIFA8',
      youtube_url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      description: 'Hands-on walkthrough of modern React components, props, state, and unidirectional data flow.',
      sort_order: 1,
      created_at: new Date('2026-01-12').toISOString()
    }
  ],

  assessments: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      trainer_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Machine Learning Foundations Assessment',
      description: 'Mandatory MCQ evaluation on regression, cost functions, gradient descent, and evaluation metrics.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 30,
      total_marks: 30,
      passing_marks: 18,
      status: 'PUBLISHED',
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      course_id: 'd0000000-0000-0000-0000-000000000002',
      trainer_id: 'b0000000-0000-0000-0000-000000000002',
      title: 'React & State Management Quiz',
      description: 'Test on component lifecycle, hooks (useState, useEffect, useContext), and REST client calls.',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 20,
      total_marks: 20,
      passing_marks: 12,
      status: 'PUBLISHED',
      created_at: new Date('2026-01-12').toISOString()
    }
  ],

  questions: [
    {
      id: 'q0000000-0000-0000-0000-000000000001',
      assessment_id: 'e0000000-0000-0000-0000-000000000001',
      question: 'What loss function is most commonly minimized during Ordinary Least Squares (OLS) Linear Regression?',
      option_a: 'Binary Cross-Entropy',
      option_b: 'Mean Squared Error (MSE)',
      option_c: 'Hinge Loss',
      option_d: 'Kullback-Leibler Divergence',
      correct_option: 'B',
      marks: 10
    },
    {
      id: 'q0000000-0000-0000-0000-000000000002',
      assessment_id: 'e0000000-0000-0000-0000-000000000001',
      question: 'Which phenomenon occurs when a model performs exceptionally well on training data but fails to generalize to unseen data?',
      option_a: 'Underfitting',
      option_b: 'High Bias',
      option_c: 'Overfitting',
      option_d: 'Data leakage',
      correct_option: 'C',
      marks: 10
    },
    {
      id: 'q0000000-0000-0000-0000-000000000003',
      assessment_id: 'e0000000-0000-0000-0000-000000000001',
      question: 'In Gradient Descent, what determines the step size taken towards the minimum of the loss function?',
      option_a: 'Batch size',
      option_b: 'Learning rate (alpha)',
      option_c: 'Number of features',
      option_d: 'Activation threshold',
      correct_option: 'B',
      marks: 10
    }
  ],

  enrollments: [
    {
      id: 'en000000-0000-0000-0000-000000000001',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      status: 'COMPLETED',
      completion_percentage: 100.0,
      enrolled_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'en000000-0000-0000-0000-000000000002',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      course_id: 'd0000000-0000-0000-0000-000000000002',
      status: 'ACTIVE',
      completion_percentage: 45.0,
      enrolled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null
    }
  ],

  assessmentResults: [
    {
      id: 'r0000000-0000-0000-0000-000000000001',
      assessment_id: 'e0000000-0000-0000-0000-000000000001',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      score: 30,
      total_marks: 30,
      percentage: 100.0,
      grade: 'A+',
      answers: {
        'q0000000-0000-0000-0000-000000000001': 'B',
        'q0000000-0000-0000-0000-000000000002': 'C',
        'q0000000-0000-0000-0000-000000000003': 'B'
      },
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  certificates: [
    {
      id: 'cert0000-0000-0000-0000-000000000001',
      certificate_number: 'CC-2026-000108',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      trainee_name: 'Aarav Patel',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      course_title: 'Applied Machine Learning with Python',
      trainer_name: 'Dr. Rajesh Sharma',
      issued_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      verification_token: 'cc_token_v7f8a93e2b104dc98a4e',
      certificate_url: '/verify/cc_token_v7f8a93e2b104dc98a4e'
    }
  ],

  feedback: [
    {
      id: 'fb000000-0000-0000-0000-000000000001',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      trainee_name: 'Aarav Patel',
      rating: 5,
      comment: 'Exceptional lecture delivery! The mathematical explanations of gradient descent paired with Python code made complex topics effortless to understand.',
      academic_relevance: 5,
      suggestions: 'Would love an extra module covering neural network backpropagation.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  announcements: [
    {
      id: 'ann00000-0000-0000-0000-000000000001',
      title: 'Capacity Connect Launch - Smart India Hackathon PS 26075',
      content: 'Welcome to Capacity Connect! The portal is officially active for national digital capacity-building. Trainees and trainers can register, explore courses, and earn verifiable certificates.',
      category: 'Platform Update',
      created_by: 'a0000000-0000-0000-0000-000000000001',
      author_name: 'Admin Officer',
      published: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ann00000-0000-0000-0000-000000000002',
      title: 'New Advanced AI & Cloud Computing Cohorts Announced',
      content: 'Trainers have published new accredited courses in Applied Machine Learning and Modern Full-Stack Development. Enroll today to participate in live assessments.',
      category: 'Academic Announcement',
      created_by: 'a0000000-0000-0000-0000-000000000001',
      author_name: 'Admin Officer',
      published: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  achievements: [
    {
      id: 'ach00000-0000-0000-0000-000000000001',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      trainee_name: 'Aarav Patel',
      title: 'Top Assessment Performer (100%)',
      description: 'Scored a perfect 30/30 on the Applied Machine Learning Foundations Assessment.',
      badge_icon: 'trophy',
      status: 'APPROVED',
      published: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ach00000-0000-0000-0000-000000000002',
      trainee_id: 'c0000000-0000-0000-0000-000000000001',
      trainee_name: 'Aarav Patel',
      title: 'First Course Completion Milestone',
      description: 'Successfully finished all lectures, readings, and assessments for Applied Machine Learning.',
      badge_icon: 'award',
      status: 'APPROVED',
      published: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  queries: [
    {
      id: 'qry00000-0000-0000-0000-000000000001',
      raised_by: 'c0000000-0000-0000-0000-000000000001',
      trainee_name: 'Aarav Patel',
      assigned_to: 'b0000000-0000-0000-0000-000000000001',
      assigned_to_name: 'Dr. Rajesh Sharma',
      course_id: 'd0000000-0000-0000-0000-000000000001',
      course_title: 'Applied Machine Learning with Python',
      subject: 'Clarification regarding Gradient Descent Learning Rate',
      message: 'Dr. Rajesh, in lecture 1, what heuristic do you recommend if the cost oscillates instead of decreasing during batch gradient descent?',
      response: 'Oscillation indicates the learning rate (alpha) is too large. Try scaling alpha down by an order of magnitude (e.g., from 0.1 to 0.01) or implement an adaptive schedule such as Adam.',
      status: 'RESOLVED',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  notifications: [
    {
      id: 'not00000-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      title: 'Certificate Issued',
      message: 'Congratulations! Your certificate for Applied Machine Learning with Python is ready for download.',
      type: 'success',
      read: false,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};
