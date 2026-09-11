import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { StatCard } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import {
  BookOpen,
  Users,
  CheckSquare,
  FileText,
  PlusCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Trash2,
  Youtube
} from "lucide-react";

export const TrainerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Library Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [resourceData, setResourceData] = useState({
    title: "",
    category: "Manuals & Guidelines",
    fileType: "PDF",
    fileSize: "4.5 MB",
    description: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const [courseRes, asmRes, libRes] = await Promise.all([
          api.getTrainerCourses(),
          api.getTrainerAssessments(),
          api.getLibrary()
        ]);
        setCourses(courseRes.courses || []);
        setAssessments(asmRes.assessments || []);
        setLibrary(libRes.resources || []);
      } catch (err) {
        console.error("Failed to load trainer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, []);

  const handleUploadResource = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await api.uploadLibraryResource(resourceData);
      setLibrary([response.resource, ...library]);
      setUploadModalOpen(false);
      setResourceData({
        title: "",
        category: "Manuals & Guidelines",
        fileType: "PDF",
        fileSize: "4.5 MB",
        description: ""
      });
      alert("Resource published to Trainer Library!");
    } catch (err) {
      alert(err.message || "Failed to upload resource.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Remove this resource from the library?")) return;
    try {
      await api.deleteLibraryResource(id);
      setLibrary(library.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete resource.");
    }
  };

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty & Trainer Console</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "Trainer"}!
          </h1>
          <p className="text-sm text-amber-100 mt-2">
            {user?.designation || "Senior Specialist"} · {user?.department || "MoES Capacity Building"}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/trainer/create-course"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Author New Course</span>
            </Link>
            <Link
              to="/trainer/create-assessment"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Build MCQ Assessment</span>
            </Link>
            <Link
              to="/trainer/verify-video"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold transition"
            >
              <Youtube className="w-4 h-4" />
              <span>Verify YouTube Video</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Courses Authored"
          value={courses.length}
          subtitle="Curricula published"
          icon={BookOpen}
          color="amber"
        />
        <StatCard
          title="Trainees Enrolled"
          value={totalEnrollments}
          subtitle="Across all courses"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Assessments Active"
          value={assessments.length}
          subtitle="Subject exams"
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="Library Resources"
          value={library.length}
          subtitle="Slides, PDFs, Datasets"
          icon={FileText}
          color="sky"
        />
      </div>

      {/* Courses & Library Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Managed Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Active Courses</h2>
              <p className="text-xs text-slate-500">Monitor syllabus and enrolled candidates</p>
            </div>
            <Link to="/trainer/manage-courses" className="text-xs font-bold text-amber-700 hover:underline flex items-center">
              Manage All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {course.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-slate-500">
                    {course.modules?.length || 0} Modules · {course.enrolledCount || 0} Trainees Enrolled · Rating: {course.rating} ⭐
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Preview
                  </Link>
                  <Link
                    to="/trainer/trainee-progress"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    View Scores
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer Resource Library Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Trainer Library</span>
            </h2>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {library.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between"
              >
                <div className="truncate pr-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.fileType} · {item.fileSize} · {item.downloads || 0} downloads
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteResource(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition"
                  title="Delete Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Resource Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload to Trainer Resource Library">
        <form onSubmit={handleUploadResource} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={resourceData.title}
              onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
              placeholder="e.g. Doppler Radar Echo Identification Manual"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={resourceData.category}
                onChange={(e) => setResourceData({ ...resourceData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Manuals & Guidelines">Manuals & Guidelines</option>
                <option value="Training Slides">Training Slides</option>
                <option value="Code & Datasets">Code & Datasets</option>
                <option value="Technical Standards">Technical Standards</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">File Type</label>
              <select
                value={resourceData.fileType}
                onChange={(e) => setResourceData({ ...resourceData, fileType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="PDF">PDF Document</option>
                <option value="PPTX">PowerPoint Presentation</option>
                <option value="ZIP">Code / Dataset (ZIP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={resourceData.description}
              onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
              placeholder="Summary of contents and instructional intent..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition"
            >
              {uploading ? "Publishing..." : "Publish Resource"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
