# Capacity Connect (SIH Problem Statement 26075)

> **Role-Based Digital Capacity-Building and Learning Management Portal**
> Connecting Trainees, Trainers, and Institutional Administrators.

---

## 🚀 Key Features & Architectural Highlights

- **3 Distinct Role Portals (RBAC)**:
  - **Trainee**: Comprehensive skill profiles (skills with levels), course enrollment, interactive video lectures via YouTube embeds, server-scored MCQ evaluations, authentic browser-generated PDF certificates with verifiable QR codes, feedback submission, and query helpdesk.
  - **Trainer**: Course authoring with YouTube video embedding, Google Gemini AI automated video summarization & objective extraction, MCQ questionnaire creation with deadlines, trainee performance analytics (Recharts), and resource library.
  - **Administrator**: Governance console, user approval workflow (Pending, Approved, Suspended), trainee & trainer databases, analytics, query resolutions, announcements, and the flagship **Capacity Competency Matching Engine**.
- **Flagship Innovation — Capacity Competency**:
  - Solves *"Who is the most suitable trainer to teach this subject?"*
  - Multi-criteria weighted scoring: Skills (35%), Experience (25%), Qualifications (15%), Certifications (15%), Past Teaching Performance (10%).
  - Semantic Google Gemini AI reasoning grounded in verified database credentials.
- **YouTube Embed Delivery**:
  - Trainers enter YouTube URLs; system validates and extracts video IDs, streaming lectures via responsive iframes without costly hosting overhead.
- **Browser-Side PDF Certification & Public QR Verification**:
  - Backend verifies 100% course completion and passing assessment scores before issuing a unique certificate number and high-entropy verification token (`cc_token_...`).
  - Trainees generate high-resolution certificate PDFs directly in their browser using `html2canvas` & `jspdf`.
  - Public verification route (`/verify/:token`) validates cryptographic records against the database.
- **Google Gemini AI Integration (`@google/genai`)**:
  - Trainee course recommendations based on profile skills and interests.
  - YouTube video transcript / lecture summarization and learning objective extraction.
  - Semantic Capacity Competency trainer matching explanations.
  - Academic query assistant grounded in course context.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, React Router v6, Recharts, Lucide Icons, jsPDF, html2canvas, qrcode.react |
| **Backend** | Node.js, Express.js, REST APIs, CORS, JWT authentication, RBAC middleware |
| **Database** | Supabase PostgreSQL schema with 19 relational tables, indexes, constraints, seeds, and in-memory zero-config fallback |
| **AI** | Google Gemini API via `@google/genai` SDK |
| **Hosting** | Render (Backend API), Vercel (Frontend Client) |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
```bash
# In backend/
cd backend
npm install

# In frontend/
cd ../frontend
npm install
```

### 2. Run Automated Test Suite
Verify backend authentication, RBAC security, YouTube URL parsing, server-side scoring, certificate verification, and Capacity Competency matching:
```bash
cd backend
npm test
```

### 3. Start Backend API Server
```bash
cd backend
npm start
# Running at http://localhost:5000 (Health Check: http://localhost:5000/api/health)
```

### 4. Start Frontend Client
```bash
cd frontend
npm run dev
# Running at http://localhost:5173
```

---

## 🔑 Demo Accounts (Pre-seeded for Evaluation)

| Role | Email | Password | Primary Functions |
| :--- | :--- | :--- | :--- |
| **Trainee** | `aarav.patel@trainee.in` | `Password@123` | Learn, Attempt Tests, Download Certificate with QR |
| **Trainer** | `rajesh.sharma@capacityconnect.gov.in` | `Password@123` | Create Course with YouTube + Gemini AI, Build MCQs, View Analytics |
| **Admin** | `admin@capacityconnect.gov.in` | `Password@123` | Capacity Competency Matcher, Approve Users, Publish Notices |

> **Note**: The login screen also features **1-Click Quick Demo Login buttons** for immediate evaluator testing without typing.

---

## 🗄️ Database Schema & Migrations

The complete PostgreSQL database schema and initial seed data are located in:
- `supabase/schema.sql`: 19 normalized relational tables, constraints, foreign keys, and indexes.
- `supabase/seed.sql`: Realistic pre-seeded users, courses, materials, MCQs, and certificates.

---

## 🔒 Security Principles

1. **Deterministic Backend Operations**: All role permissions, assessment scoring, and certificate eligibility decisions are performed exclusively by server-side code.
2. **Untrusted Client Role**: Roles are derived securely from authenticated server sessions; client-provided roles are never trusted.
3. **Hidden Assessment Answers**: Correct MCQ options are stripped from trainee API responses until after final submission.
4. **Deadline Enforcement**: Submissions past assessment deadlines are rejected server-side.