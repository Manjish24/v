import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { StatCard } from "../../components/StatCard";
import {
  Users,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileBarChart,
  ArrowRight,
  Sparkles,
  UserCheck,
  Clock
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.getAdminStats();
      setStats(response.stats);
      setRecentUsers(response.recentUsers || []);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.updateUserStatus(userId, { status: "approved" });
      fetchStats();
      alert("User approved successfully!");
    } catch (err) {
      alert(err.message || "Failed to approve user.");
    }
  };

  const pendingUsers = recentUsers.filter((u) => u.status === "pending");

  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry Directorate Administration</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CAPACITY CONNECT Directorate
          </h1>
          <p className="text-sm text-blue-200 mt-2">
            Centralized Command for MoES / IMD Personnel Capacity Building, Role Approvals & Competency Oversight
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/manage-users"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition"
            >
              <Users className="w-4 h-4" />
              <span>Manage User Directory</span>
            </Link>
            <Link
              to="/admin/reports"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition"
            >
              <FileBarChart className="w-4 h-4" />
              <span>Competency Mapping & Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Personnel"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.totalTrainees || 0} Trainees · ${stats?.totalTrainers || 0} Trainers`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          subtitle="Awaiting Verification"
          icon={Clock}
          color="amber"
          badge={stats?.pendingApprovals > 0 ? "Action Required" : null}
        />
        <StatCard
          title="Courses Active"
          value={stats?.totalCourses || 0}
          subtitle={`${stats?.totalEnrollments || 0} Enrolled Candidates`}
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Certifications Issued"
          value={stats?.totalCertificatesIssued || 0}
          subtitle={`Pass Rate: ${stats?.completionRate || 0}%`}
          icon={Award}
          color="sky"
        />
      </div>

      {/* Main Admin Columns: Pending Approvals & Quick Rosters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending User Approvals</h2>
              <p className="text-xs text-slate-500">Verify new trainers and officers joining the portal</p>
            </div>
            <Link to="/admin/manage-users" className="text-xs font-bold text-blue-600 hover:underline">
              View All Users
            </Link>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">All User Approvals Up to Date</p>
              <p className="text-xs text-slate-500 mt-1">No pending trainer or trainee registration requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {user.email} · {user.organization} ({user.department})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Qualifications: {user.qualifications || "Not specified"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Access</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Competency Callout */}
          <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">SIH Problem #26075 Core Feature</span>
              <h3 className="text-base font-extrabold mt-1">Trainer Competency Mapping Engine</h3>
              <p className="text-xs text-sky-200 mt-1 max-w-md">
                Match verified trainer specializations against upcoming operational meteorological courses.
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 bg-white text-blue-900 hover:bg-sky-50 font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              Run Mapping Tool
            </Link>
          </div>
        </div>

        {/* Right Activity Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Recent Portal Registrations
            </h3>
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      user.status === "approved"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
