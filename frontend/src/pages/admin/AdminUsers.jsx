import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { Users, Search, Check, X, Ban, ShieldCheck, Filter } from 'lucide-react';

export default function AdminUsers() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'ALL') params.role = roleFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter, search]);

  const handleUpdateStatus = async (userId, newStatus) => {
    setActionMessage('');
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      if (res.data.success) {
        setActionMessage(`User status updated to ${newStatus}.`);
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setActionMessage(`User role updated to ${newRole}.`);
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Governance & Approvals</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 29 & 30: Review applicant credentials, manage roles, and authorize or suspend access.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
          {actionMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Role:
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="TRAINEE">Trainee</option>
            <option value="TRAINER">Trainer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
            Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No user records found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                        <p className="text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge label={u.role} variant={u.role} size="xs" />
                    </td>
                    <td className="p-4">
                      <Badge label={u.status} variant={u.status} size="xs" />
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {u.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                            title="Approve User"
                          >
                            Approve
                          </button>
                        )}
                        {u.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'SUSPENDED')}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold text-xs"
                            title="Suspend User"
                          >
                            Suspend
                          </button>
                        )}
                        {u.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs"
                            title="Reactivate User"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
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
