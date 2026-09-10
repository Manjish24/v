import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tv,
  Award,
  Star,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        }

        // Check if current user is already enrolled
        if (isAuthenticated && user?.role === 'TRAINEE') {
          const enrollRes = await api.get('/trainee/courses');
          if (enrollRes.data.success) {
            const allMy = [...enrollRes.data.data.ongoing, ...enrollRes.data.data.completed];
            const found = allMy.some(c => c.course_id === id);
            setIsEnrolled(found);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourseDetails();
  }, [id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    if (user?.role !== 'TRAINEE') {
      setMessage('Only Trainee accounts can enroll in courses.');
      return;
    }

    setEnrolling(true);
    setMessage('');
    try {
      const res = await api.post(`/trainee/courses/${id}/enroll`);
      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/trainee/courses/${id}`);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-slate-600 font-medium">Course not found.</p>
          <Link to="/courses" className="text-blue-600 font-semibold text-sm">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge label={course.subject} variant="Beginner" />
              <Badge label={course.difficulty} variant={course.difficulty} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Duration: <strong className="text-slate-200">{course.duration}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                Instructor: <strong className="text-slate-200">{course.trainer?.name}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SIH PS 26075 Accredited
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {message && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {message}
              </div>
            )}

            {isEnrolled ? (
              <Link
                to={`/trainee/courses/${course.id}`}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in this Course (Free)'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              Includes full lecture access, study materials, assessments, and verified certificate.
            </p>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 w-full">
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Objectives */}
          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learning_objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum / Learning Materials Outline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Curriculum & Modules ({course.materials?.length || 0})
            </h2>

            <div className="divide-y divide-slate-100">
              {course.materials?.map((m, idx) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      {m.type === 'VIDEO' ? <Tv className="w-4 h-4 text-red-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                      <p className="text-xs text-slate-500">{m.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Module {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessments Info */}
          {course.assessments && course.assessments.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Required Assessments
              </h2>
              {course.assessments.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                    <p className="text-[11px] text-amber-800 font-medium mt-1">
                      Duration: {a.duration_minutes} mins • Marks: {a.total_marks}
                    </p>
                  </div>
                  <Badge label="MCQ Evaluation" variant="Beginner" size="xs" />
                </div>
              ))}
            </div>
          )}

          {/* Feedback & Reviews */}
          {course.feedback && course.feedback.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Verified Trainee Reviews
              </h2>
              <div className="space-y-3">
                {course.feedback.map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{f.trainee_name}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: f.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Instructor Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Course Instructor</h3>
            <div className="flex items-center gap-3">
              <img
                src={course.trainer?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={course.trainer?.name}
                className="w-14 h-14 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-base">{course.trainer?.name}</h4>
                <p className="text-xs text-slate-500">{course.trainer?.qualification}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{course.trainer?.bio}</p>
            {course.trainer?.work_experience && (
              <p className="text-[11px] text-blue-600 font-semibold bg-blue-50 p-2.5 rounded-lg">
                Experience: {course.trainer.work_experience}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
