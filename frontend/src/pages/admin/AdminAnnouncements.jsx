import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { Megaphone, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Platform Update');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const res = await api.get('/admin/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/admin/announcements', {
        title,
        content,
        category,
        published
      });
      if (res.data.success) {
        setCreateOpen(false);
        setTitle('');
        setContent('');
        loadAnnouncements();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await api.delete(`/admin/announcements/${id}`);
      if (res.data.success) {
        setAnnouncements(announcements.filter(a => a.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Announcements & Notices</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Section 32: Broadcast administrative updates, new cohort launches, and guidelines to the public portal and dashboards.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Publish Announcement
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400">No announcements published.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                      {a.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Published by {a.author_name || 'Admin'}</span>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Broadcast New Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. National Capacity Hackathon 2026 Cohorts Announced"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="Platform Update">Platform Update</option>
              <option value="Academic Announcement">Academic Announcement</option>
              <option value="Guidelines & Policy">Guidelines & Policy</option>
              <option value="General Notice">General Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Content</label>
            <textarea
              rows={4}
              required
              placeholder="Write the full announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {saving ? 'Publishing...' : 'Publish to Platform'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
