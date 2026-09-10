import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Users, Search, CheckCircle, Clock, Award, FileSpreadsheet, Filter } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const TraineeProgress = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.getTraineeProgress();
        setProgressList(response.progress || []);
      } catch (err) {
        console.error("Failed to load trainee progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const courses = Array.from(new Set(progressList.map((p) => p.courseTitle)));

  const filtered = progressList.filter((p) => {
    const matchesSearch =
      p.traineeName.toLowerCase().includes(search.toLowerCase()) ||
      p.traineeEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.organization.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = selectedCourse === "all" || p.courseTitle === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleExportCSV = () => {
    const headers = ["Trainee Name", "Email", "Organization", "Course", "Progress (%)", "Status", "Latest Score"];
    const rows = filtered.map((p) => {
      const latestSub = p.submissions && p.submissions[0];
      const scoreStr = latestSub ? `${latestSub.percentage}% (${latestSub.passed ? "Passed" : "Failed"})` : "Not Attempted";
      return [
        `"${p.traineeName}"`,
        `"${p.traineeEmail}"`,
        `"${p.organization}"`,
        `"${p.courseTitle}"`,
        p.progressPercentage,
        p.status,
        `"${scoreStr}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IMD_Trainee_Progress_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Trainee Progress & Performance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor learning completion rates, subject MCQ examination scores, and certifications.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center space-x-1.5 self-start"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainee name or institute..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 sm:flex-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainees Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading trainee roster...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No trainees found matching the criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Trainee Candidate</th>
                  <th className="py-3.5 px-6">Organization / Station</th>
                  <th className="py-3.5 px-6">Assigned Course</th>
                  <th className="py-3.5 px-6">Curriculum Progress</th>
                  <th className="py-3.5 px-6">Assessment Marks</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => {
                  const sub = item.submissions && item.submissions[0];
                  return (
                    <tr key={item.enrollmentId} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{item.traineeName}</p>
                        <p className="text-[11px] text-slate-400">{item.traineeEmail}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-700 font-medium">{item.organization}</p>
                        <p className="text-[11px] text-slate-400">{item.department}</p>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800 max-w-xs truncate">
                        {item.courseTitle}
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>{item.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${item.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {sub ? (
                          <div>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                                sub.passed
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-rose-50 text-rose-800 border-rose-200"
                              }`}
                            >
                              {sub.percentage}% ({sub.passed ? "Passed" : "Retake Required"})
                            </span>
                            <p className="text-[10px] text-slate-400 mt-1">{formatDate(sub.submittedAt)}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending Quiz</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            item.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
