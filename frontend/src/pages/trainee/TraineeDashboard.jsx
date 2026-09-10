import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { StatCard } from "../../components/StatCard";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle,
  FileText
} from "lucide-react";

export const TraineeDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [courseRes, myCourseRes, annRes, libRes] = await Promise.all([
          api.getCourses(),
          api.getMyCourses(),
          api.getAnnouncements(),
          api.getLibrary()
        ]);
        setCourses(courseRes.courses || []);
        setEnrolledCourses(myCourseRes.courses || []);
        setAnnouncements(annRes.announcements || []);
        setLibrary(libRes.resources || []);
      } catch (err) {
        console.error("Error loading trainee dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const completedCount = enrolledCourses.filter((c) => c.enrollment?.status === "completed").length;
  const inProgressCount = enrolledCourses.filter((c) => c.enrollment?.status === "in-progress").length;
  const certificatesCount = user?.certificates ? user.certificates.length : completedCount;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Operational Meteorological Training Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Trainee"}!
          </h1>
          <p className="text-sm text-sky-100 mt-2 leading-relaxed">
            {user?.designation || "Scientific Staff"} · {user?.organization || "India Meteorological Department (IMD)"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/trainee/my-courses"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold shadow hover:bg-sky-50 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Learning</span>
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500/20 text-white border border-white/20 text-xs font-semibold hover:bg-sky-500/30 transition"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          subtitle="Assigned & Active"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Modules pending"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Curriculum cleared"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Certifications"
          value={certificatesCount}
          subtitle="MoES / IMD Verified"
          icon={Award}
          color="sky"
        />
      </div>

      {/* Main Content Grid: Continue Learning + Ministry Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Active Courses</h2>
              <p className="text-xs text-slate-500">Pick up where you left off</p>
            </div>
            <Link to="/trainee/my-courses" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No enrolled courses yet</p>
              <p className="text-xs text-slate-500 mt-1">Browse the IMD training catalog to begin your certification journey.</p>
              <Link
                to="/courses"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((course) => {
                const progress = course.enrollment?.progressPercentage || 0;
                return (
                  <div
                    key={course.id}
                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {course.category}
                        </span>
                        <span className="text-xs text-slate-400">· Trainer: {course.trainerName}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600">
                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                      </h3>
                      {/* Progress Bar */}
                      <div className="w-full max-w-md pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-sky-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                      >
                        {progress === 100 ? "Review Course" : "Resume Course"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Library Download widget */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Trainer Resource Library</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {library.slice(0, 2).map((res) => (
                <div key={res.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {res.fileType} · {res.fileSize}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">{res.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">By {res.uploaderName}</p>
                  </div>
                  <button
                    onClick={() => alert(`Downloading ${res.title} (${res.fileSize})...`)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0 ml-2"
                    title="Download Material"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ministry Bulletins & Notice Board */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
              <AlertCircle className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900">Ministry Announcements</h3>
            </div>
            <div className="space-y-4">
              {announcements.map((anc) => (
                <div key={anc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                  <span className="text-[10px] font-bold text-sky-700 uppercase">{anc.category}</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-3">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Assessment Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <Award className="w-8 h-8 text-amber-100 mb-2" />
            <h4 className="font-extrabold text-sm">Subject-Wise Assessment Ready</h4>
            <p className="text-xs text-amber-100 mt-1">
              Test your knowledge in Doppler Radar Echoes and get your IMD certification.
            </p>
            <Link
              to="/trainee/assessment/asm-001"
              className="mt-3 inline-block px-3.5 py-1.5 bg-white text-amber-900 text-xs font-bold rounded-lg shadow-sm hover:bg-amber-50 transition"
            >
              Start Quiz Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
