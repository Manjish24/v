import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { PlusCircle, Trash2, ArrowLeft, BookOpen, Video, FileText } from "lucide-react";

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [verification, setVerification] = useState(null);

  const [courseData, setCourseData] = useState({
    title: "",
    category: "Radar Meteorology",
    duration: "6 Weeks",
    level: "Intermediate",
    description: "",
    topics: [""],
    thumbnail: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?auto=format&fit=crop&w=800&q=80",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Principles and Atmospheric Foundations",
        duration: "45 mins",
        videoUrl: "",
        timestamp: "",
        content: "Overview of basic concepts, atmospheric dynamics, and operational guidelines.",
        resources: [{ name: "Module_Handbook.pdf", type: "pdf", size: "2.4 MB" }]
      }
    ]
  });

  const handleAddModule = () => {
    const newIdx = courseData.modules.length + 1;
    setCourseData({
      ...courseData,
      modules: [
        ...courseData.modules,
        {
          id: `mod-${newIdx}`,
          title: `Module ${newIdx}: New Instructional Unit`,
          duration: "50 mins",
          videoUrl: "",
          timestamp: "",
          content: "Session summary and technical explanation.",
          resources: []
        }
      ]
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...courseData.modules];
    updated[index][field] = value;
    setCourseData({ ...courseData, modules: updated });
  };

  const handleRemoveModule = (index) => {
    if (courseData.modules.length === 1) return;
    setCourseData({
      ...courseData,
      modules: courseData.modules.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.title) {
      alert("Please provide a course title.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.createCourse({
        ...courseData,
        topics: courseData.topics.map((topic) => topic.trim()).filter(Boolean)
      });
      setVerification(result.verification);
      alert(`Course verified at ${result.verification.mappingPercentage}% and created successfully.`);
      navigate("/trainer/manage-courses");
    } catch (err) {
      setVerification(err.verification || null);
      const mapping = err.verification?.mappingPercentage;
      const reason = err.verification?.reason;
      alert([
        err.message || "Failed to create course.",
        mapping !== undefined ? `Mapping: ${mapping}%` : "",
        reason || ""
      ].filter(Boolean).join("\n"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate("/trainer/dashboard")}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create New Training Course</h1>
          <p className="text-xs text-slate-500">
            Author comprehensive meteorological curriculum for Ministry of Earth Sciences cadre.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Course Information</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              placeholder="e.g. Advanced Doppler Weather Radar (DWR) Echo Analysis"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topics for Academic Mapping</label>
            <input
              type="text"
              value={courseData.topics.join(", ")}
              onChange={(e) => setCourseData({ ...courseData, topics: e.target.value.split(",") })}
              placeholder="e.g. Doppler principles, reflectivity, velocity products"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discipline / Category</label>
              <select
                value={courseData.category}
                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Radar Meteorology">Radar Meteorology</option>
                <option value="Atmospheric Modeling">Atmospheric Modeling (NWP)</option>
                <option value="Disaster Risk Reduction">Disaster Risk Reduction (Cyclone)</option>
                <option value="Agricultural Meteorology">Agricultural Meteorology</option>
                <option value="Marine Meteorology">Marine & Ocean Observing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Skill Level</label>
              <select
                value={courseData.level}
                onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={courseData.duration}
                onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                placeholder="e.g. 4 Weeks"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description & Objectives</label>
            <textarea
              rows={3}
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              placeholder="Outline what trainees will master..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Modules Builder */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Curriculum Modules</h2>
              <p className="text-[11px] text-slate-500">Add recorded lectures, slide decks, and lesson syllabi</p>
            </div>
            <button
              type="button"
              onClick={handleAddModule}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-4">
            {courseData.modules.map((mod, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Module #{idx + 1}</span>
                  {courseData.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleModuleChange(idx, "title", e.target.value)}
                      placeholder="Module Title"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={mod.duration}
                      onChange={(e) => handleModuleChange(idx, "duration", e.target.value)}
                      placeholder="Duration (e.g. 45 mins)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={mod.videoUrl}
                    onChange={(e) => handleModuleChange(idx, "videoUrl", e.target.value)}
                    placeholder="YouTube video URL"
                    className="sm:col-span-2 w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={mod.timestamp}
                    onChange={(e) => handleModuleChange(idx, "timestamp", e.target.value)}
                    placeholder="Timestamp (e.g. 10:30)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={mod.content}
                    onChange={(e) => handleModuleChange(idx, "content", e.target.value)}
                    placeholder="Optional module notes for trainees..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/trainer/dashboard")}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
          >
            {submitting ? "Verifying Course..." : "Verify & Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
};
