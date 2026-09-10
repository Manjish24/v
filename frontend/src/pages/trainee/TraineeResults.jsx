import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { BarChart3, Award, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default function TraineeResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await api.get('/trainee/results');
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching trainee results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assessment Results</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Historical record of server-evaluated marks, percentages, and grade classifications.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Loading performance history...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Assessment Results Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you attempt and submit course assessments, your results and grades will appear here.
          </p>
          <Link
            to="/trainee/assessments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Go to Assessments
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Assessment & Course</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Percentage</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{r.assessment_title}</p>
                      <p className="text-slate-400">{r.course_title}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {r.score} / {r.total_marks}
                    </td>
                    <td className="p-4 font-bold">
                      <span className={r.passed ? 'text-emerald-600' : 'text-rose-600'}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs">
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-4">
                      {r.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Needs Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(r.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
