import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { FileCheck2, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TraineeAssessments() {
  const [assessments, setAssessments] = useState({ pending: [], completed: [], expired: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await api.get('/trainee/assessments/pending');
        if (res.data.success) {
          setAssessments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  const pending = assessments.pending || [];
  const completed = assessments.completed || [];
  const expired = assessments.expired || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assessments & Evaluations</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 15 & 16: Subject-wise MCQ evaluations. Scores and deadlines are calculated and enforced server-side.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Loading evaluations...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Assessments */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Assessments ({pending.length})
            </h2>

            {pending.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No assessments pending</p>
                <p className="text-xs text-slate-400">All available assessments have been completed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {a.course_title}
                        </span>
                        <Badge label="PENDING" variant="PENDING" size="xs" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{a.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 font-medium">
                        <p>Total Marks: {a.total_marks}</p>
                        <p className="text-amber-700 font-bold">
                          Deadline: {new Date(a.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/trainee/assessments/${a.id}`}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                      >
                        Start Test
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Assessments */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Completed Evaluations ({completed.length})
            </h2>

            {completed.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No completed assessments yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {a.course_title}
                        </span>
                        <Badge label={`Grade: ${a.result?.grade || 'A'}`} variant="COMPLETED" size="xs" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Submitted on {new Date(a.result?.submitted_at || Date.now()).toLocaleDateString()}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-700">
                        Score: <span className="text-emerald-600">{a.result?.score} / {a.result?.total_marks}</span> ({a.result?.percentage}%)
                      </div>
                      <Link
                        to={`/trainee/assessments/${a.id}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Review Test <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expired Assessments */}
          {expired.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Expired Assessments ({expired.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expired.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl p-5 border border-slate-200 opacity-60 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Deadline Passed
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{a.title}</h3>
                      <p className="text-xs text-slate-500">{a.course_title}</p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Closed on {new Date(a.deadline).toLocaleDateString()}. Submissions are locked.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
