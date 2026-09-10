import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import VideoEmbed from '../../components/common/VideoEmbed';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Tv,
  FileText,
  CheckCircle2,
  HelpCircle,
  Star,
  Award,
  ArrowRight,
  BookOpen,
  Send,
  AlertCircle
} from 'lucide-react';

export default function CourseLearningPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback Modal State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [relevance, setRelevance] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  // Query Modal State
  const [queryOpen, setQueryOpen] = useState(false);
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [querySuccess, setQuerySuccess] = useState('');
  const [queryError, setQueryError] = useState('');

  useEffect(() => {
    async function loadLearningView() {
      try {
        const [courseRes, myCoursesRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/trainee/courses')
        ]);

        if (courseRes.data.success) {
          const c = courseRes.data.data;
          setCourse(c);
          if (c.materials && c.materials.length > 0) {
            setSelectedMaterial(c.materials[0]);
          }
        }

        if (myCoursesRes.data.success) {
          const all = [...myCoursesRes.data.data.ongoing, ...myCoursesRes.data.data.completed];
          const found = all.find(item => item.course_id === id);
          if (found) setEnrollment(found);
        }
      } catch (err) {
        console.error('Error loading course learning view:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLearningView();
  }, [id]);

  const handleUpdateProgress = async (newPct) => {
    try {
      const res = await api.put(`/trainee/courses/${id}/progress`, {
        completion_percentage: newPct
      });
      if (res.data.success) {
        setEnrollment(prev => ({
          ...prev,
          completion_percentage: newPct,
          status: newPct >= 100 ? 'COMPLETED' : 'ACTIVE'
        }));
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    try {
      const res = await api.post(`/courses/${id}/feedback`, {
        rating,
        academic_relevance: relevance,
        comment
      });
      if (res.data.success) {
        setFeedbackSuccess('Feedback submitted successfully. Thank you!');
        setTimeout(() => setFeedbackOpen(false), 1500);
      } else {
        setFeedbackError(res.data.message);
      }
    } catch (err) {
      setFeedbackError(err.response?.data?.message || 'Feedback submission failed. You must complete the course first.');
    }
  };

  const handleRaiseQuery = async (e) => {
    e.preventDefault();
    setQueryError('');
    setQuerySuccess('');
    try {
      const res = await api.post('/trainee/queries', {
        course_id: id,
        subject: querySubject,
        message: queryMessage
      });
      if (res.data.success) {
        setQuerySuccess('Query submitted! Instructor Dr. Rajesh or Admin will respond shortly.');
        setQuerySubject('');
        setQueryMessage('');
        setTimeout(() => setQueryOpen(false), 1500);
      } else {
        setQueryError(res.data.message);
      }
    } catch (err) {
      setQueryError(err.response?.data?.message || 'Failed to submit query.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-xs mt-3">Loading interactive classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 font-bold">Course not found.</p>
        <Link to="/trainee/my-courses" className="text-blue-600 text-sm font-semibold">Back to My Courses</Link>
      </div>
    );
  }

  const currentPct = enrollment?.completion_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Top Learning Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge label={course.subject} variant="Beginner" size="xs" />
            <Badge label={course.difficulty} variant={course.difficulty} size="xs" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">{course.title}</h1>
          <p className="text-xs text-slate-500">Instructor: {course.trainer?.name}</p>
        </div>

        {/* Course Progress & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700">Progress: {Math.round(currentPct)}%</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${currentPct}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQueryOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Ask Instructor a Question"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Ask Question</span>
            </button>

            <button
              onClick={() => setFeedbackOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Course Feedback"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: Active Module Viewer */}
        <div className="lg:col-span-2 space-y-5">
          {selectedMaterial ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedMaterial.title}</h2>
                  <p className="text-xs text-slate-400 capitalize">{selectedMaterial.type} Module</p>
                </div>
                <Badge label={selectedMaterial.type} variant="Beginner" size="xs" />
              </div>

              {/* Video Embed Player */}
              {selectedMaterial.type === 'VIDEO' ? (
                <div className="space-y-4">
                  <VideoEmbed
                    videoId={selectedMaterial.youtube_video_id}
                    title={selectedMaterial.title}
                  />
                  {selectedMaterial.description && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                      <p className="font-bold text-slate-800 mb-1">Lecture Overview:</p>
                      {selectedMaterial.description}
                    </div>
                  )}
                </div>
              ) : selectedMaterial.type === 'TEXT/THEORY' ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Core Theory Reading</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedMaterial.description}
                  </p>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">{selectedMaterial.title}</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">{selectedMaterial.description}</p>
                  {selectedMaterial.file_url && (
                    <a
                      href={selectedMaterial.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Download Material PDF
                    </a>
                  )}
                </div>
              )}

              {/* Progress Update Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Completed this module?
                </span>
                <button
                  onClick={() => handleUpdateProgress(Math.min(100, currentPct + 25))}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Understood & Advance (+25%)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Select a module from the syllabus on the right to start learning.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Modules Syllabus & Assessments */}
        <div className="space-y-6">
          {/* Syllabus Modules List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Course Syllabus ({course.materials?.length || 0})
            </h3>

            <div className="space-y-2">
              {course.materials?.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    selectedMaterial?.id === m.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                  }`}
                >
                  <div className="mt-0.5">
                    {m.type === 'VIDEO' ? (
                      <Tv className={`w-4 h-4 ${selectedMaterial?.id === m.id ? 'text-blue-600' : 'text-red-600'}`} />
                    ) : (
                      <FileText className={`w-4 h-4 ${selectedMaterial?.id === m.id ? 'text-blue-600' : 'text-slate-500'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{m.title}</p>
                    <span className="text-[10px] text-slate-400 capitalize">Module {idx + 1} • {m.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Assessments Card */}
          {course.assessments && course.assessments.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Required Evaluations
              </h3>

              <div className="space-y-3">
                {course.assessments.map(a => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                    <p className="text-xs font-bold text-slate-900">{a.title}</p>
                    <p className="text-[11px] text-slate-500">{a.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1">
                      <span>Marks: {a.total_marks}</span>
                      <span>Passing: {Math.round(a.total_marks * 0.5)}</span>
                    </div>
                    <Link
                      to={`/trainee/assessments/${a.id}`}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold text-center block transition-colors shadow-xs"
                    >
                      Attempt Assessment
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} title="Submit Course Feedback">
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <p className="text-xs text-slate-500">
            Section 19: Feedback is verified against course completion records. Please evaluate the lecture delivery and academic rigor.
          </p>

          {feedbackSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {feedbackSuccess}
            </div>
          )}
          {feedbackError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {feedbackError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Overall Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-500 focus:outline-hidden"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Relevance (1 to 5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={relevance}
              onChange={(e) => setRelevance(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Low relevance</span>
              <span>Highly relevant ({relevance}/5)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback / Review</label>
            <textarea
              rows={3}
              required
              placeholder="What did you learn? How was the instructor delivery?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setFeedbackOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </Modal>

      {/* Query Modal */}
      <Modal isOpen={queryOpen} onClose={() => setQueryOpen(false)} title={`Ask Question - ${course.trainer?.name}`}>
        <form onSubmit={handleRaiseQuery} className="space-y-4">
          <p className="text-xs text-slate-500">
            Submit a query directly to {course.trainer?.name}. Responses will appear in your Queries portal.
          </p>

          {querySuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {querySuccess}
            </div>
          )}
          {queryError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {queryError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Question on Lecture 1 derivation"
              value={querySubject}
              onChange={(e) => setQuerySubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
            <textarea
              rows={4}
              required
              placeholder="Explain your doubt or query in detail..."
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQueryOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Send Query
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
