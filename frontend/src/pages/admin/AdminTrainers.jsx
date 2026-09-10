import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { Award, Search, BookOpen, BrainCircuit } from 'lucide-react';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const res = await api.get('/admin/trainers');
        if (res.data.success) {
          setTrainers(res.data.data);
        }
      } catch (err) {
        console.error('Error loading trainers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, []);

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.qualification.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainer Competency Database</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 29: Complete records of certified instructors, verified competencies, and active curriculum.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search trainers by name, domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">{filtered.length} Instructors</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Trainer</th>
                  <th className="p-4">Qualifications & Experience</th>
                  <th className="p-4">Verified Competencies</th>
                  <th className="p-4">Courses Authored</th>
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
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{t.qualification}</p>
                      <p className="text-slate-400">{t.work_experience}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.competencies?.map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-100">
                            {c.subject} ({c.proficiency_level})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-600">
                      {t.courses_count} Published
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
