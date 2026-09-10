import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { HelpCircle, CheckCircle2, MessageSquare, Send, Clock } from 'lucide-react';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuery, setActiveQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [statusToSet, setStatusToSet] = useState('RESOLVED');
  const [saving, setSaving] = useState(false);

  const loadQueries = async () => {
    try {
      const res = await api.get('/admin/queries');
      if (res.data.success) {
        setQueries(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleOpenReplyModal = (q) => {
    setActiveQuery(q);
    setResponseText(q.response || '');
    setStatusToSet(q.status === 'OPEN' ? 'RESOLVED' : q.status);
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!activeQuery) return;
    setSaving(true);

    try {
      const res = await api.put(`/admin/queries/${activeQuery.id}`, {
        response: responseText,
        status: statusToSet
      });
      if (res.data.success) {
        setActiveQuery(null);
        loadQueries();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update query.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Helpdesk & Query Resolution</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 20: Resolve escalations, respond to inquiries, and assign tickets.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : queries.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No queries logged in the system.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Trainee / Raised By</th>
                  <th className="p-4">Subject & Message</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {queries.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{q.trainee_name || 'Trainee'}</p>
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-slate-900">{q.subject}</p>
                      <p className="text-slate-500 text-[11px] truncate">{q.message}</p>
                      {q.response && (
                        <p className="text-emerald-700 text-[11px] mt-1 font-semibold truncate">
                          ✓ Replied: {q.response}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">
                      {q.assigned_to_name || 'Administrator'}
                    </td>
                    <td className="p-4">
                      <Badge label={q.status} variant={q.status} size="xs" />
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenReplyModal(q)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        {q.response ? 'Edit Response' : 'Reply & Resolve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {activeQuery && (
        <Modal
          isOpen={!!activeQuery}
          onClose={() => setActiveQuery(null)}
          title={`Respond to Query - ${activeQuery.subject}`}
        >
          <form onSubmit={handleSaveResponse} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">Trainee Question:</p>
              <p>"{activeQuery.message}"</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Response</label>
              <textarea
                rows={4}
                required
                placeholder="Type resolution message..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Update Status:</span>
                <select
                  value={statusToSet}
                  onChange={(e) => setStatusToSet(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-bold"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                {saving ? 'Saving...' : 'Save & Dispatch'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
