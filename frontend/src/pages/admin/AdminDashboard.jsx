import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardCard from '../../components/common/DashboardCard';
import Badge from '../../components/common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  HelpCircle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const res = await api.get('/admin/statistics');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminStats();
  }, []);

  const totals = stats?.totals || {
    trainees: 2,
    trainers: 2,
    courses: 3,
    certifications: 1,
    average_score: 84,
    completion_rate: 78
  };

  const trends = stats?.enrollment_trends || [
    { month: 'Jan', enrollments: 24, completions: 18 },
    { month: 'Feb', enrollments: 38, completions: 26 },
    { month: 'Mar', enrollments: 45, completions: 34 },
    { month: 'Apr', enrollments: 52, completions: 40 },
    { month: 'May', enrollments: 68, completions: 51 },
    { month: 'Jun', enrollments: 84, completions: 64 },
    { month: 'Jul', enrollments: 95, completions: 72 }
  ];

  const pendingUsersCount = stats?.pending_users_count || 1;
  const openQueriesCount = stats?.recent_queries_count || 0;

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Executive Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Capacity Connect Governance Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            National capacity metrics, user authorization approvals, audit logging, and AI Capacity Competency assignments.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/competency"
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            Capacity Competency Matcher
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Pending Approvals Alert Bar if any */}
      {pendingUsersCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                {pendingUsersCount} User Registration(s) Pending Admin Approval
              </p>
              <p className="text-[11px] text-amber-700">
                Review trainee & trainer credentials before activating full portal access.
              </p>
            </div>
          </div>
          <Link
            to="/admin/users?status=PENDING"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex-shrink-0 transition-colors"
          >
            Review Applications
          </Link>
        </div>
      )}

      {/* Platform Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Trainees"
          value={totals.trainees}
          subtitle="Enrolled learners"
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="Accredited Trainers"
          value={totals.trainers}
          subtitle="Faculty & experts"
          icon={Award}
          color="purple"
        />
        <DashboardCard
          title="Published Courses"
          value={totals.courses}
          subtitle="Active curriculum"
          icon={BookOpen}
          color="amber"
        />
        <DashboardCard
          title="Issued Certifications"
          value={totals.certifications}
          subtitle="Cryptographically verified"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Analytics Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Enrollment & Completion Trends</h3>
            <span className="text-xs text-slate-400">Monthly Progression</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Total Enrollments
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Certified Completions
            </span>
          </div>
        </div>

        {/* Competency Subject Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Curriculum by Domain</h3>
            <span className="text-xs text-slate-400">Institutional Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.subject_breakdown || [
                  { subject: 'Machine Learning', count: 1 },
                  { subject: 'Web Dev', count: 1 },
                  { subject: 'Cloud Computing', count: 1 },
                  { subject: 'Data Science', count: 1 }
                ]}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Governance Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/competency"
          className="bg-gradient-to-tr from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="font-extrabold text-lg">Capacity Competency</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-criteria weighted matching engine to identify optimal trainers for institutional subject requirements.
          </p>
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1 pt-1">
            Launch Competency Engine <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">User Governance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Approve, suspend, or promote user accounts across Trainee, Trainer, and Admin roles.
          </p>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-1">
            Manage User Records <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/admin/queries"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Query Resolution</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Respond to trainee inquiries, resolve escalations, and dispatch platform notices.
          </p>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
            Open Helpdesk ({openQueriesCount}) <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
