import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/common/DashboardCard';
import CourseCard from '../../components/common/CourseCard';
import Badge from '../../components/common/Badge';
import {
  BookOpen,
  FileCheck2,
  Award,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

export default function TraineeDashboard() {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState({ ongoing: [], completed: [] });
  const [assessments, setAssessments] = useState({ pending: [], completed: [] });
  const [certificates, setCertificates] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [coursesRes, assessRes, certsRes, recRes] = await Promise.all([
          api.get('/trainee/courses').catch(() => ({ data: { data: { ongoing: [], completed: [] } } })),
          api.get('/trainee/assessments/pending').catch(() => ({ data: { data: { pending: [], completed: [] } } })),
          api.get('/trainee/certificates').catch(() => ({ data: { data: [] } })),
          api.post('/ai/course-recommendation').catch(() => ({ data: { data: [] } }))
        ]);

        if (coursesRes.data.success) setCoursesData(coursesRes.data.data);
        if (assessRes.data.success) setAssessments(assessRes.data.data);
        if (certsRes.data.success) setCertificates(certsRes.data.data);
        if (recRes.data.success) setRecommendations(recRes.data.data);
      } catch (err) {
        console.error('Error loading trainee dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const totalOngoing = coursesData.ongoing?.length || 0;
  const totalCompleted = coursesData.completed?.length || 0;
  const pendingAssessments = assessments.pending?.length || 0;
  const earnedCerts = certificates?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Trainee Competency Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Trainee'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Track your ongoing courses, complete subject evaluations before deadlines, and unlock verifiable digital certificates.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/trainee/my-courses"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Resume Courses
          </Link>
          <Link
            to="/trainee/profile"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Update Skills
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Ongoing Courses"
          value={totalOngoing}
          subtitle="Actively enrolled"
          icon={BookOpen}
          color="blue"
        />
        <DashboardCard
          title="Completed Courses"
          value={totalCompleted}
          subtitle="Curriculum mastered"
          icon={CheckCircle}
          color="green"
        />
        <DashboardCard
          title="Pending Assessments"
          value={pendingAssessments}
          subtitle="Awaiting submission"
          icon={FileCheck2}
          color="amber"
        />
        <DashboardCard
          title="Certificates Earned"
          value={earnedCerts}
          subtitle="Verifiable credentials"
          icon={Award}
          color="purple"
        />
      </div>

      {/* AI Recommendations Banner (Section 11 & 38) */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/10 via-indigo-900/5 to-transparent p-6 rounded-2xl border border-purple-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  AI Course Recommendations for You
                </h3>
                <p className="text-xs text-slate-500">
                  Powered by Google Gemini semantic skill analysis based on your profile & goals.
                </p>
              </div>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-purple-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {rec.course?.subject || 'Technical'}
                    </span>
                    <Badge label={rec.priority + ' Priority'} variant="Intermediate" size="xs" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.course?.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 italic">"{rec.match_reason}"</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Duration: {rec.course?.duration}</span>
                  <Link
                    to={`/courses/${rec.course?.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ongoing Courses Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Active Courses ({totalOngoing})
          </h2>
          <Link to="/trainee/my-courses" className="text-xs font-semibold text-blue-600 hover:underline">
            View All Courses
          </Link>
        </div>

        {coursesData.ongoing?.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No active ongoing courses.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore our accredited catalog to enroll in upcoming modules and build your capacity.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Explore Available Courses
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coursesData.ongoing.map((c) => (
              <CourseCard
                key={c.course_id}
                course={c}
                isEnrolled={true}
                progress={c.completion_percentage}
                showContinue={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Assessments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              Assessments Due
            </h3>
            <Link to="/trainee/assessments" className="text-xs font-semibold text-blue-600 hover:underline">
              All Assessments
            </Link>
          </div>

          {assessments.pending?.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-slate-700">You're all caught up!</p>
              <p className="text-xs text-slate-400">No pending assessments at this moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.pending.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-500">{a.course_title}</p>
                    <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline: {new Date(a.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/trainee/assessments/${a.id}`}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    Attempt Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements & Certifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Earned Certifications ({earnedCerts})
            </h3>
            <Link to="/trainee/certificates" className="text-xs font-semibold text-blue-600 hover:underline">
              View Certificates
            </Link>
          </div>

          {certificates.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No certificates yet.</p>
              <p className="text-xs text-slate-400">Complete 100% of a course and pass its assessment to unlock your verifiable certificate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cert.course_title}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{cert.certificate_number}</p>
                    <p className="text-[11px] text-purple-800 mt-1">
                      Issued: {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to="/trainee/certificates"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    View / Download
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
