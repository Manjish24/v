import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  Star,
  Award,
  Download,
  Share2,
  Clock,
  User,
  MessageSquare
} from "lucide-react";

export const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.getCourseDetails(id);
        setCourse({ ...response.course, assessments: response.assessments || [] });
        setEnrollment(response.enrollment);
        setFeedbacks(response.feedbacks || []);
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await api.enrollCourse(id);
      setEnrollment(response.enrollment);
      alert("Successfully enrolled in course!");
    } catch (err) {
      alert(err.message || "Enrollment failed.");
    }
  };

  const handleCompleteModule = async (moduleId) => {
    try {
      const response = await api.updateCourseProgress(id, moduleId);
      setEnrollment(response.enrollment);
    } catch (err) {
      alert(err.message || "Failed to update module progress.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setSubmittingFeedback(true);
    try {
      const response = await api.submitCourseFeedback(id, { rating, comment });
      setFeedbacks([response.feedback, ...feedbacks]);
      setComment("");
      alert("Thank you for your feedback!");
    } catch (err) {
      alert(err.message || "Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading course curriculum...</div>;
  }

  if (!course) {
    return <div className="p-12 text-center text-rose-500">Course not found.</div>;
  }

  const activeModule = course.modules && course.modules[activeModuleIndex];
  const isEnrolled = !!enrollment;
  const completedModules = enrollment?.completedModules || [];
  const isCurrentModuleCompleted = activeModule && completedModules.includes(activeModule.id);
  const isCourseComplete = enrollment?.status === "completed" || enrollment?.progressPercentage === 100;
  const assessmentId = course.assessments?.[0]?.id;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link to="/courses" className="hover:text-blue-600">Courses</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{course.category}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{course.title}</h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
            <span>Instructor: <strong className="text-slate-700">{course.trainerName}</strong></span>
            <span>· Level: <strong className="text-slate-700">{course.level}</strong></span>
            <span>· Duration: <strong className="text-slate-700">{course.duration}</strong></span>
          </p>
        </div>

        <div>
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-md text-sm transition"
            >
              Enroll Now (Free MoES Cadre)
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                Enrolled ({enrollment.progressPercentage}% Completed)
              </span>
              {isCourseComplete && assessmentId && (
                <Link
                  to={`/trainee/assessment/${assessmentId}`}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
                >
                  Take Assessment
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Learning Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Video & Notes Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
            {/* Embedded Educational Video Player Mock */}
            <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
              <iframe
                src={activeModule?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title="Lesson Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase">Module {activeModuleIndex + 1}</span>
                <h3 className="text-lg font-bold text-slate-900">{activeModule?.title}</h3>
                <span className="text-xs text-slate-400">Duration: {activeModule?.duration}</span>
              </div>

              {isEnrolled && (
                <button
                  onClick={() => handleCompleteModule(activeModule.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isCurrentModuleCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isCurrentModuleCompleted ? "Module Completed" : "Mark as Done"}</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 mb-1">Session Abstract & Operational Notes</h4>
              <p>{activeModule?.content || "Detailed operational concepts covering meteorological analysis and case studies."}</p>
            </div>

            {/* Attached Study Materials */}
            {activeModule?.resources && activeModule.resources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Module Downloads & Slides</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModule.resources.map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{res.name}</span>
                      </div>
                      <button
                        onClick={() => alert(`Downloading ${res.name}...`)}
                        className="text-[11px] font-bold text-sky-700 hover:underline shrink-0 ml-2"
                      >
                        {res.size}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Review Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Trainee Feedback & Rating</span>
            </h3>

            {isEnrolled && (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate this Course</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Operational Review</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share how this training enhanced your forecasting / technical ability..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                >
                  {submittingFeedback ? "Submitting..." : "Post Review"}
                </button>
              </form>
            )}

            <div className="space-y-3 pt-2">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{fb.userName}</span>
                    <div className="flex items-center">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                      <span className="text-xs font-bold text-slate-700">{fb.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modules Syllabus Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Course Curriculum</span>
              <span className="text-xs font-normal text-slate-500">{course.modules?.length || 0} Modules</span>
            </h3>

            <div className="space-y-2">
              {course.modules?.map((mod, index) => {
                const isCurrent = index === activeModuleIndex;
                const isCompleted = completedModules.includes(mod.id);

                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(index)}
                    className={`w-full p-3.5 rounded-xl text-left transition flex items-start space-x-3 ${
                      isCurrent
                        ? "bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${isCurrent ? "text-blue-600" : "text-slate-400"}`} />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs font-bold truncate">{mod.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{mod.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Assessment Box */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Formal Certification</span>
                <h4 className="text-xs font-bold text-amber-950 mt-1">Subject-wise MCQ Examination</h4>
                <p className="text-[11px] text-amber-800 mt-1">Pass score threshold: 70%.</p>
                {isCourseComplete && assessmentId ? (
                  <Link
                    to={`/trainee/assessment/${assessmentId}`}
                    className="mt-3 inline-block w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-center text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    Start Assessment
                  </Link>
                ) : (
                  <p className="mt-3 text-[11px] font-semibold text-amber-900">Finish all modules to unlock the assessment.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
