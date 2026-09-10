import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { GraduationCap, Search, Award, BookOpen } from 'lucide-react';

export default function AdminTrainees() {
  const [trainees, setTrainees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainees() {
      try {
        const res = await api.get('/admin/trainees');
        if (res.data.success) {
          setTrainees(res.data.data);
        }
      } catch (err) {
        console.error('Error loading trainees:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainees();
  }, []);

  const filtered = trainees.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.qualification.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainee Database</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 29: Complete records of enrolled learners, qualifications, and certified competencies.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search trainees by name or qualification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">{filtered.length} Trainees</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Trainee</th>
                  <th className="p-4">Qualification</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Enrolled / Completed</th>
                  <th className="p-4">Certificates</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={t.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`}
                        alt={t.name}
                        className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-slate-400">{t.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{t.qualification}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.skills?.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                            {s.name || s} ({s.level || 'Intermediate'})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{t.enrolled_courses_count}</span> Enrolled • <span className="font-bold text-emerald-600">{t.completed_courses_count}</span> Completed
                    </td>
                    <td className="p-4 font-bold text-purple-700">
                      {t.certificates_count} Verified
                    </td>
                    <td className="p-4">
                      <Badge label={t.status} variant={t.status} size="xs" />
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
}
