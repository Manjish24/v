import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { PlusCircle, BookOpen, Star, Users, ExternalLink, Edit } from "lucide-react";

export const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getTrainerCourses();
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
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Authored Courses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review syllabus structure, track enrollments, and update modules.
          </p>
        </div>
        <Link
          to="/trainer/create-course"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition self-start flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Course</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No courses authored yet</h3>
          <p className="text-xs text-slate-500 mt-1">Get started by creating your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-400">{course.level}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{course.enrolledCount || 0} Enrolled</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating || 5.0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-50">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Course</span>
                </Link>
                <Link
                  to="/trainer/trainee-progress"
                  className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Trainee Roster
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
