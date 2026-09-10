import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  Sparkles,
  Search,
  Award,
  Bell,
  Send,
  Trash2,
  FileBarChart,
  CheckCircle,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const Reports = () => {
  const [activeTab, setActiveTab] = useState("competency");

  // Competency Mapping State
  const [subjectQuery, setSubjectQuery] = useState("Radar");
  const [trainers, setTrainers] = useState([]);
  const [loadingMapping, setLoadingMapping] = useState(false);

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "Workshop",
    priority: "high"
  });
  const [postingAnn, setPostingAnn] = useState(false);

  // Reports State
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);

  // Fetch Mapping
  const runCompetencyMapping = async (query = subjectQuery) => {
    setLoadingMapping(true);
    try {
      const response = await api.getCompetencyMapping(query);
      setTrainers(response.trainers || []);
    } catch (err) {
      console.error("Mapping error:", err);
    } finally {
      setLoadingMapping(false);
    }
  };

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await api.getAnnouncements();
      setAnnouncements(response.announcements || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  };

  // Fetch Reports
  const fetchReport = async () => {
    try {
      const response = await api.getReports();
      setReportData(response);
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    runCompetencyMapping("Radar");
    fetchAnnouncements();
    fetchReport();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setPostingAnn(true);
    try {
      const response = await api.createAnnouncement(newAnnouncement);
      setAnnouncements([response.announcement, ...announcements]);
      setNewAnnouncement({ title: "", content: "", category: "Workshop", priority: "high" });
      alert("Announcement broadcasted successfully!");
    } catch (err) {
      alert(err.message || "Failed to post announcement.");
    } finally {
      setPostingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete announcement.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Competency Mapping & Directorate Reports</h1>
        <p className="text-xs text-slate-500 mt-1">
          Smart India Hackathon 2026 Engine: Match certified faculty with subject curricula, publish notices, and inspect capacity metrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab("competency")}
          className={`pb-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "competency"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Competency Mapping Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`pb-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "announcements"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Portal Announcements Manager</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "analytics"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileBarChart className="w-4 h-4" />
          <span>Cadre Training Analytics</span>
        </button>
      </div>

      {/* TAB 1: COMPETENCY MAPPING ENGINE */}
      {activeTab === "competency" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="max-w-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MoES Faculty Alignment Tool
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Identify Suitable Trainers for Subjects</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter a meteorological topic or skill keyword to calculate trainer compatibility scores based on verified research experience, qualifications, and past course reviews.
              </p>
            </div>

            {/* Search Input and Presets */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="e.g. Doppler Weather Radar, Cyclone Warning, WRF Modeling, Ocean Buoy..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => runCompetencyMapping(subjectQuery)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Calculate Matches
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Quick Subject Search:</span>
              {["Doppler Radar", "Cyclone Warning", "NWP Modeling", "Ocean Observing", "Agromet"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSubjectQuery(chip);
                    runCompetencyMapping(chip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-semibold transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Matched Trainers List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Matched Faculty for "{subjectQuery || "All"}" ({trainers.length} Found)
            </h3>

            {loadingMapping ? (
              <div className="p-12 text-center text-slate-400">Evaluating competencies...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainers.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{tr.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{tr.designation}</p>
                        <p className="text-[11px] font-semibold text-blue-700">{tr.organization}</p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                          {tr.matchScore}% Match
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Faculty Rating: {tr.avgRating} ⭐</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate"><strong>Degrees:</strong> {tr.qualifications}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate"><strong>Experience:</strong> {tr.experience}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Declared Competencies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tr.skills.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Courses Led: {tr.coursesTaughtCount}</span>
                      <button
                        onClick={() => alert(`Assigned course curriculum in '${subjectQuery}' to ${tr.name}. An email invitation has been sent.`)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        Assign Subject Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS MANAGER */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Broadcast New Notice</span>
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. Cyclone Forecasters Refresher Batch Announced"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Course Update">Course Update</option>
                  <option value="Policy">Policy</option>
                  <option value="Achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Detailed notification visible across the portal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={postingAnn}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
              >
                {postingAnn ? "Broadcasting..." : "Broadcast Notice"}
              </button>
            </form>
          </div>

          {/* Active Notices List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Ministry Bulletins ({announcements.length})</h3>
            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {anc.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Published by {anc.authorName}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{anc.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(anc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                    title="Remove Bulletin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & REPORTS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">National Capacity Building Summary</h2>

            {reportData?.executiveSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700">Total Enrolled Officers</p>
                  <p className="text-2xl font-extrabold text-blue-950 mt-1">
                    {reportData.executiveSummary.totalEnrolledTrainees}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700">Certified Forecasters</p>
                  <p className="text-2xl font-extrabold text-emerald-950 mt-1">
                    {reportData.executiveSummary.certifiedCandidates}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700">Overall Exam Pass Rate</p>
                  <p className="text-2xl font-extrabold text-amber-950 mt-1">
                    {reportData.executiveSummary.overallPassingRate}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Discipline Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Enrollment by Meteorological Discipline</h3>
            <div className="space-y-3">
              {(reportData?.categoryBreakdown || []).map((cat, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{cat.category}</span>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-slate-500">{cat.courses} Courses</span>
                    <span className="font-bold text-blue-700">{cat.enrollments} Trainees Enrolled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
