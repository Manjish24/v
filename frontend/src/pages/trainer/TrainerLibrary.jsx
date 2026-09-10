import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { BookOpen, Search, Tv, FileText, Download, ExternalLink } from 'lucide-react';

export default function TrainerLibrary() {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const res = await api.get('/trainer/library');
        if (res.data.success) {
          setMaterials(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching trainer library:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLibrary();
  }, []);

  const filtered = materials.filter(m => {
    const matchesType = selectedType === 'ALL' || m.type === selectedType;
    const matchesSearch = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.course_title && m.course_title.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainer Resource Library</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 25: Central repository of all uploaded lecture videos, slide presentations, and academic theory notes.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search resources, lecture titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['ALL', 'VIDEO', 'PRESENTATION', 'TEXT/THEORY'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedType === t
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-2 border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No resources found</p>
          <p className="text-xs text-slate-400">Try modifying your search or filter options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge label={m.type} variant="Beginner" size="xs" />
                  <span className="text-[10px] text-slate-400">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{m.title}</h3>
                <p className="text-xs text-purple-700 font-semibold">{m.course_title}</p>
                {m.description && (
                  <p className="text-xs text-slate-500 line-clamp-3 italic">"{m.description}"</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {m.youtube_url ? (
                  <a
                    href={m.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Tv className="w-3.5 h-3.5" /> Watch on YouTube
                  </a>
                ) : m.file_url ? (
                  <a
                    href={m.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download File
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Internal Reading Text</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
