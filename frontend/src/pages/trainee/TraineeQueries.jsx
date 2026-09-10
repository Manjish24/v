import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { HelpCircle, Send, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function TraineeQueries() {
  const [queries, setQueries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueriesData() {
      try {
        const [qRes, cRes] = await Promise.all([
          api.get('/trainee/queries'),
          api.get('/trainee/courses')
        ]);
        if (qRes.data.success) setQueries(qRes.data.data);
        if (cRes.data.success) {
          const allCourses = [...cRes.data.data.ongoing, ...cRes.data.data.completed];
          setCourses(allCourses);
        }
      } catch (err) {
        console.error('Error fetching queries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQueriesData();
  }, []);

  const handleRaiseQuery = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      const res = await api.post('/trainee/queries', {
        course_id: selectedCourseId || null,
        subject,
        message
      });

      if (res.data.success) {
        setFeedbackMsg({ type: 'success', text: 'Query submitted successfully.' });
        setQueries([res.data.data, ...queries]);
        setSubject('');
        setMessage('');
        setSelectedCourseId('');
      } else {
        setFeedbackMsg({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit query.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Helpdesk & Queries</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 20: Raise direct academic questions to course trainers or administrative queries to platform staff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Raise Query Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 h-fit">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Raise a New Query
          </h2>

          {feedbackMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleRaiseQuery} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Related Course (Optional)
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
              >
                <option value="">General Platform Query (Assigned to Admin)</option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.title} (Trainer: {c.trainer_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Doubts on Linear Regression Loss formula"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Message / Details
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your academic or administrative question clearly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit Query'}
            </button>
          </form>
        </div>

        {/* Right: Existing Queries List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            My Raised Queries ({queries.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : queries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No queries raised yet</p>
              <p className="text-xs text-slate-400">Feel free to raise questions regarding course materials or certifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge label={q.status} variant={q.status} size="xs" />
                        <span className="text-[11px] text-slate-400">
                          {new Date(q.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{q.subject}</h3>
                      <p className="text-[11px] text-slate-400">
                        {q.course_title ? `Course: ${q.course_title} • Assigned to: ${q.assigned_to_name}` : 'Platform Support'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{q.message}"
                  </p>

                  {/* Response if resolved */}
                  {q.response ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Response from {q.assigned_to_name}:
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{q.response}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Awaiting instructor response
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
