import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import CourseCatalogPage from './pages/public/CourseCatalogPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import VerifyCertificatePage from './pages/public/VerifyCertificatePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Trainee Pages
import TraineeDashboard from './pages/trainee/TraineeDashboard';
import TraineeProfile from './pages/trainee/TraineeProfile';
import MyCourses from './pages/trainee/MyCourses';
import CourseLearningPage from './pages/trainee/CourseLearningPage';
import TraineeAssessments from './pages/trainee/TraineeAssessments';
import TakeAssessment from './pages/trainee/TakeAssessment';
import TraineeResults from './pages/trainee/TraineeResults';
import TraineeCertificates from './pages/trainee/TraineeCertificates';
import TraineeQueries from './pages/trainee/TraineeQueries';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerProfile from './pages/trainer/TrainerProfile';
import TrainerCourses from './pages/trainer/TrainerCourses';
import CreateCourse from './pages/trainer/CreateCourse';
import CreateAssessment from './pages/trainer/CreateAssessment';
import TrainerPerformance from './pages/trainer/TrainerPerformance';
import TrainerLibrary from './pages/trainer/TrainerLibrary';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CapacityCompetency from './pages/admin/CapacityCompetency';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTrainees from './pages/admin/AdminTrainees';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminQueries from './pages/admin/AdminQueries';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CourseCatalogPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/verify/:token" element={<VerifyCertificatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Trainee Portal Routes */}
      <Route
        path="/trainee"
        element={
          <ProtectedRoute allowedRoles={['TRAINEE', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/trainee/dashboard" replace />} />
        <Route path="dashboard" element={<TraineeDashboard />} />
        <Route path="profile" element={<TraineeProfile />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="courses/available" element={<CourseCatalogPage />} />
        <Route path="courses/:id" element={<CourseLearningPage />} />
        <Route path="assessments" element={<TraineeAssessments />} />
        <Route path="assessments/:id" element={<TakeAssessment />} />
        <Route path="results" element={<TraineeResults />} />
        <Route path="certificates" element={<TraineeCertificates />} />
        <Route path="queries" element={<TraineeQueries />} />
      </Route>

      {/* Trainer Portal Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/trainer/dashboard" replace />} />
        <Route path="dashboard" element={<TrainerDashboard />} />
        <Route path="profile" element={<TrainerProfile />} />
        <Route path="courses" element={<TrainerCourses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="assessments/create" element={<CreateAssessment />} />
        <Route path="performance" element={<TrainerPerformance />} />
        <Route path="library" element={<TrainerLibrary />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="competency" element={<CapacityCompetency />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="trainees" element={<AdminTrainees />} />
        <Route path="trainers" element={<AdminTrainers />} />
        <Route path="queries" element={<AdminQueries />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
