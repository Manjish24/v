import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CourseCard from '../../components/common/CourseCard';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedSubject !== 'All') params.subject = selectedSubject;
        if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

        const res = await api.get('/courses', { params });
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCourses();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedSubject, selectedDifficulty]);

  const subjects = ['All', 'Machine Learning', 'Web Development', 'Cloud Computing'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Catalog Header */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Platform Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Accredited Courses & Competencies
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Explore government and institutional capacity-building courses. Watch master video lectures, complete structured modules, and earn verifiable certificates.
          </p>
        </div>
      </div>

      {/* Main Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search courses, skills, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Subject and Difficulty dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Subject:
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
              Difficulty:
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 text-xs mt-3">Loading available courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or resetting the subject and difficulty filters.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedSubject('All'); setSelectedDifficulty('All'); }}
              className="px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
