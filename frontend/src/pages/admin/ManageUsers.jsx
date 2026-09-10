import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Users, Search, Filter, Trash2, CheckCircle, Shield, UserCheck } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await api.getAdminUsers();
      setUsers(response.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserStatus(userId, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to update role.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Permanently remove this user from the directory?")) return;
    try {
      await api.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Users & Access Roles</h1>
        <p className="text-xs text-slate-500 mt-1">
          Approve registrations, assign roles (Trainee, Trainer, Admin), and maintain personnel directories.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, institute..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 sm:flex-none"
          >
            <option value="all">All Roles</option>
            <option value="trainee">Trainee</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 sm:flex-none"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading user records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Official Name</th>
                  <th className="py-3.5 px-6">Organization & Cadre</th>
                  <th className="py-3.5 px-6">Assigned Role</th>
                  <th className="py-3.5 px-6">Verification Status</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700 font-medium">{user.organization}</p>
                      <p className="text-[11px] text-slate-400">{user.designation || user.department}</p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 capitalize"
                      >
                        <option value="trainee">Trainee</option>
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          user.status === "approved"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : user.status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {user.status !== "approved" && (
                          <button
                            onClick={() => handleStatusChange(user.id, "approved")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {user.status === "approved" && (
                          <button
                            onClick={() => handleStatusChange(user.id, "rejected")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
};
