import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { BookOpen, Users, Star, Eye, ExternalLink } from "lucide-react";

export const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getCourses();
        setCourses(response.courses || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">National Course Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directorate-level oversight for all training courses published across India Meteorological Department.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading courses catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Course Details</th>
                  <th className="py-3.5 px-6">Specialist Faculty</th>
                  <th className="py-3.5 px-6">Domain / Category</th>
                  <th className="py-3.5 px-6">Enrollments</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 max-w-sm">
                      <p className="font-bold text-slate-900 truncate">{course.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {course.duration} · {course.level} · {course.modules?.length || 0} Modules
                      </p>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {course.trainerName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {course.enrolledCount || 0} Trainees
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating || 5.0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center space-x-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
