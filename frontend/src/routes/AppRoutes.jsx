import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { DashboardLayout } from "../layouts/DashboardLayout";

// Auth Pages
import { Login } from "../pages/auth/Login";
import { Signup } from "../pages/auth/Signup";

// Trainee Pages
import { TraineeDashboard } from "../pages/trainee/TraineeDashboard";
import { MyCourses } from "../pages/trainee/MyCourses";
import { CourseDetails } from "../pages/trainee/CourseDetails";
import { CourseCatalog } from "../pages/trainee/CourseCatalog";
import { Assessment } from "../pages/trainee/Assessment";
import { Profile } from "../pages/trainee/Profile";

// Trainer Pages
import { TrainerDashboard } from "../pages/trainer/TrainerDashboard";
import { CreateCourse } from "../pages/trainer/CreateCourse";
import { ManageCourses as TrainerManageCourses } from "../pages/trainer/ManageCourses";
import { CreateAssessment } from "../pages/trainer/CreateAssessment";
import { TraineeProgress } from "../pages/trainer/TraineeProgress";
import { VideoVerifier } from "../pages/trainer/VideoVerifier";

// Admin Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { ManageUsers } from "../pages/admin/ManageUsers";
import { ManageCourses as AdminManageCourses } from "../pages/admin/ManageCourses";
import { Reports } from "../pages/admin/Reports";

// Role-based redirect helper for root /
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-400">Loading Portal...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "trainer") return <Navigate to="/trainer/dashboard" replace />;
  return <Navigate to="/trainee/dashboard" replace />;
};

// Route protection component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Verifying security token...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main Dashboard Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />

        {/* Trainee Routes */}
        <Route path="trainee/dashboard" element={<TraineeDashboard />} />
        <Route path="trainee/my-courses" element={<MyCourses />} />
        <Route path="courses" element={<CourseCatalog />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="trainee/assessment/:id" element={<Assessment />} />
        <Route path="trainee/profile" element={<Profile />} />

        {/* Trainer Routes */}
        <Route
          path="trainer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainer/create-course"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainer/manage-courses"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <TrainerManageCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainer/create-assessment"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <CreateAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainer/trainee-progress"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <TraineeProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="trainer/verify-video"
          element={
            <ProtectedRoute allowedRoles={["trainer", "admin"]}>
              <VideoVerifier />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/manage-courses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManageCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
