import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { BookOpen, PlusCircle, BarChart3, Edit, Trash2, Eye, Award } from 'lucide-react';

export default function TrainerCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.get('/trainer/courses');
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching trainer courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      const res = await api.delete(`/trainer/courses/${id}`);
      if (res.data.success) {
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Section 23 & 24: Author, edit, and publish capacity-building courses and learning content.
          </p>
        </div>
        <Link
          to="/trainer/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Course
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Loading your courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by creating your first course with embedded YouTube lectures, study notes, and MCQs.
          </p>
          <Link
            to="/trainer/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge label={course.status} variant={course.status} size="xs" />
                    <Badge label={course.difficulty} variant={course.difficulty} size="xs" />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Enrolled: <strong>{course.total_enrolled || 0}</strong></span>
                    <span>Completed: <strong>{course.total_completed || 0}</strong></span>
                    <span>Rating: <strong>★ {course.average_rating || 5.0}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/trainer/performance?courseId=${course.id}`}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Analytics
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/courses/${course.id}`}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg"
                    title="Public View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
