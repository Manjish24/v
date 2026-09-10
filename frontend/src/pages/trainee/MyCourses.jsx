import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { CertificateModal } from "../../components/CertificateModal";
import { BookOpen, Award, CheckCircle, Clock, PlayCircle, Star } from "lucide-react";

export const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getMyCourses();
        setCourses(response.courses || []);
      } catch (err) {
        console.error("Failed to load my courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const openCertificate = (course) => {
    const profileCertificate = user?.certificates?.find(
      (certificate) => certificate.certificateId === course.enrollment.certificateId
    );
    setSelectedCert({
      certificateId: course.enrollment.certificateId,
      recipientName: user?.name || "Trainee",
      courseTitle: course.title,
      score: course.enrollment.certificateScore ?? profileCertificate?.score,
      issueDate: course.enrollment.certificateIssuedAt ?? profileCertificate?.issueDate
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Enrolled Courses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your curriculum progress, view course lessons, and download earned certificates.
          </p>
        </div>
        <Link
          to="/courses"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm self-start"
        >
          + Enroll in More Courses
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your courses...</div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No courses enrolled yet</h3>
          <p className="text-xs text-slate-500 mt-1">Explore our meteorological and earth science modules.</p>
          <Link
            to="/courses"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = course.enrollment?.progressPercentage || 0;
            const isCompleted = progress === 100 || course.enrollment?.status === "completed";
            const hasCertificate = Boolean(course.enrollment?.certificateId);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-white/95 px-2.5 py-1 rounded-full shadow">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Course Completion</span>
                        <span className="font-bold text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between gap-2 mt-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex-1 py-2 px-3 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
                  >
                    Open Course
                  </Link>

                  {hasCertificate ? (
                    <button
                      onClick={() => openCertificate(course)}
                      className="flex items-center space-x-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  ) : isCompleted && course.assessmentId ? (
                    <Link
                      to={`/trainee/assessment/${course.assessmentId}`}
                      className="flex items-center space-x-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Take Assessment</span>
                    </Link>
                  ) : isCompleted ? (
                    <span className="text-[11px] font-semibold text-slate-500 px-2">Assessment unavailable</span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 px-2">Complete modules first</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
      />
    </div>
  );
};
