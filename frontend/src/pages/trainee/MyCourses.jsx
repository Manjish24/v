import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import Badge from '../../components/common/Badge';
import { BookOpen, CheckCircle2, Award, Clock, ArrowRight, MessageSquare } from 'lucide-react';

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [coursesData, setCoursesData] = useState({ ongoing: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.get('/trainee/courses');
        if (res.data.success) {
          setCoursesData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const ongoing = coursesData.ongoing || [];
  const completed = coursesData.completed || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your enrolled courses, monitor ongoing progress, and view completed certifications.
          </p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm"
        >
          Explore More Courses
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ongoing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Ongoing Courses ({ongoing.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed Courses ({completed.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Loading your courses...</p>
        </div>
      ) : activeTab === 'ongoing' ? (
        ongoing.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No ongoing courses</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any active courses in progress right now.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoing.map((c) => (
              <CourseCard
                key={c.course_id}
                course={c}
                isEnrolled={true}
                progress={c.completion_percentage}
                showContinue={true}
              />
            ))}
          </div>
        )
      ) : completed.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No completed courses yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you finish 100% of a course's curriculum and pass its assessments, it will appear here alongside your verified certificate.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((c) => (
            <div
              key={c.course_id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge label="COMPLETED" variant="COMPLETED" size="xs" />
                  <span className="text-xs text-slate-400">
                    Finished on {c.completed_at ? new Date(c.completed_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-500">Instructor: {c.trainer_name} • Subject: {c.subject}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                  <span className="text-emerald-700 font-bold">100% Mastered</span>
                  <span>•</span>
                  <span>Assessments Completed: {c.assessments_completed}/{c.assessments_total}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Link
                  to={`/trainee/courses/${c.course_id}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Review Materials
                </Link>

                {c.has_certificate ? (
                  <Link
                    to="/trainee/certificates"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-4 h-4" />
                    View Certificate
                  </Link>
                ) : (
                  <Link
                    to="/trainee/certificates"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
                  >
                    Claim Certificate
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
