import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/common/DashboardCard';
import Badge from '../../components/common/Badge';
import {
  BookOpen,
  Users,
  Star,
  BarChart3,
  PlusCircle,
  FileCheck2,
  Library,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainerDashboard() {
      try {
        const res = await api.get('/trainer/courses');
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error('Error loading trainer dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainerDashboard();
  }, []);

  const totalCourses = courses.length;
  const totalEnrolled = courses.reduce((acc, c) => acc + (c.total_enrolled || 0), 0);
  const totalCompleted = courses.reduce((acc, c) => acc + (c.total_completed || 0), 0);
  const avgRating = (
    courses.reduce((acc, c) => acc + (c.average_rating || 5), 0) / (totalCourses || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Instructor Management Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Trainer'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Design accredited curriculum, add YouTube lecture video materials, launch MCQ evaluations, and monitor student capacity growth.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/trainer/courses/create"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Course
          </Link>
          <Link
            to="/trainer/assessments/create"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            New Assessment
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Courses"
          value={totalCourses}
          subtitle="Curriculum published"
          icon={BookOpen}
          color="purple"
        />
        <DashboardCard
          title="Total Enrolled Trainees"
          value={totalEnrolled}
          subtitle="Active learners"
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="Average Course Rating"
          value={`${avgRating} / 5.0`}
          subtitle="Verified feedback"
          icon={Star}
          color="amber"
        />
        <DashboardCard
          title="Completion Rate"
          value={`${totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 80}%`}
          subtitle={`${totalCompleted} completed`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/trainer/courses/create"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
              Course Creator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add modules, embed YouTube videos, and trigger Gemini AI video summarization.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/assessments/create"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
              MCQ Questionnaire Builder
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Create evaluations with deadlines and server-calculated scores.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/performance"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
              Performance Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Monitor pass rates, score distributions, and trainee reviews.
            </p>
          </div>
        </Link>
      </div>

      {/* Taught Courses Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Authored Courses</h2>
            <p className="text-xs text-slate-500">Manage curriculum status, learning materials, and trainee scores.</p>
          </div>
          <Link
            to="/trainer/courses"
            className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
          >
            View All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No courses authored yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map(c => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge label={c.status} variant={c.status} size="xs" />
                    <span className="text-xs text-slate-400">{c.subject} • {c.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Enrolled: {c.total_enrolled}</span>
                    <span>Materials: {c.materials_count}</span>
                    <span>Assessments: {c.assessments_count}</span>
                    <span>Rating: ★ {c.average_rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/trainer/performance?courseId=${c.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Analytics
                  </Link>
                  <Link
                    to={`/courses/${c.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                  >
                    View Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
