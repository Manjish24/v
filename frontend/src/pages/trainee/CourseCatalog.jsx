import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { BookOpen, Search, Star, Users, ArrowRight, Filter } from "lucide-react";

export const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getCourses();
        setCourses(response.courses || []);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ["All", "Radar Meteorology", "Atmospheric Modeling", "Disaster Risk Reduction", "Agricultural Meteorology"];

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.trainerName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "All" || c.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">National Meteorological Course Catalog</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore capacity building programs in radar operations, NWP modeling, and cyclone warning protocols.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or trainers..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                category === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading training courses...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 p-8">
          No courses found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {course.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{course.level}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  <p className="text-xs text-slate-600 font-medium">Trainer: <strong>{course.trainerName}</strong></p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <span>{course.duration}</span>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/courses/${course.id}`}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 shadow-sm"
                >
                  <span>Explore Course & Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
