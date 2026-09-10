# CAPACITY CONNECT
### A Digital Capacity Building and Learning Management Portal
**Smart India Hackathon 2026 — Problem Statement ID: 26075**  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** India Meteorological Department (IMD)  
**Theme:** Smart Education | **Category:** Software  

---

## 🌟 Executive Summary

**CAPACITY CONNECT** is a centralized, secure, role-based Digital Capacity Building and Learning Management Portal built to train, evaluate, and certify scientific, operational, and technical cadres across the Ministry of Earth Sciences (MoES), India Meteorological Department (IMD), NCMRWF, INCOIS, and IITM.

---

## 👥 Three Core User Roles

### 1. Trainee / Forecaster
- **Professional Cadre Profiles:** Qualifications, operational work experience, meteorological competencies, and verifiable certifications.
- **Curriculum & Resource Center:** Interactive lecture viewers with downloadable operational standard operating procedures (SOPs), radar handbooks, and slide decks.
- **Subject-Wise Timed MCQ Assessments:** Interactive examination runner with immediate automated scoring, answer explanations, and pass/fail thresholds.
- **MoES / IMD Verified Certificates:** Formal, verifiable digital certificates of competency.
- **Course Feedback:** Transparent rating and operational feedback submission.

### 2. Trainer / Specialist Faculty
- **Course Authoring Studio:** Structured multi-module course creator with syllabus, lecture videos, and technical attachments.
- **Assessment Builder:** Create subject-wise MCQs, specify passing percentages, deadlines, point values, and scientific explanations.
- **Trainee Performance Monitoring:** Live tracking of completion rates, examination marks, and exportable CSV reports.
- **Trainer Library:** Centralized repository to upload manuals, presentations, scripts, radar datasets, and standards.

### 3. Administrator / Directorate
- **Directorate Dashboard:** High-level metrics for enrolled officers, active courses, pass rates, and certificates issued.
- **User Verification & Role Management:** Approval workflows for newly registered faculty and trainees.
- **Competency Mapping Engine:** Advanced search and compatibility scoring matching trainers' declared skills and experience with specialized meteorological domains (Doppler Radar, NWP Modeling, Cyclone Forecasting, Agro-meteorology).
- **Ministry Broadcast Manager:** Real-time publication of national training workshops, policy updates, and bulletins.

---

## 🔑 Demo Logins (Instant Hackathon Access)

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Dr. M. Mohapatra (DG IMD) | `admin@imd.gov.in` | `Password@123` |
| **Trainer** | Dr. Sunitha Sharma (Radar Specialist) | `trainer@imd.gov.in` | `Password@123` |
| **Trainee** | Amit Sengupta (Scientific Asst) | `trainee@imd.gov.in` | `Password@123` |

*(The login screen also provides 1-click Quick Demo buttons for instant evaluation!)*

---

## 📁 Repository Structure

```
CAPACITY-CONNECT/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── CertificateModal.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── trainee/
│   │   │   │   ├── TraineeDashboard.jsx
│   │   │   │   ├── MyCourses.jsx
│   │   │   │   ├── CourseDetails.jsx
│   │   │   │   ├── CourseCatalog.jsx
│   │   │   │   ├── Assessment.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── trainer/
│   │   │   │   ├── TrainerDashboard.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   ├── ManageCourses.jsx
│   │   │   │   ├── CreateAssessment.jsx
│   │   │   │   └── TraineeProgress.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageCourses.jsx
│   │   │       └── Reports.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── assessmentController.js
│   │   │   ├── trainerController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Assessment.js
│   │   │   ├── AssessmentSubmission.js
│   │   │   ├── TrainerLibrary.js
│   │   │   ├── Announcement.js
│   │   │   └── Feedback.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── assessmentRoutes.js
│   │   │   ├── trainerRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── services/
│   │   │   └── dataService.js
│   │   ├── utils/
│   │   │   └── seedData.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
cd CAPACITY-CONNECT/backend
npm install
npm run dev
```
*Backend starts on `http://localhost:5000` with persistent file/memory database loaded with realistic MoES/IMD seed data.*

### 2. Start the Frontend Application
```bash
cd CAPACITY-CONNECT/frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with an active proxy to `http://localhost:5000`.*
