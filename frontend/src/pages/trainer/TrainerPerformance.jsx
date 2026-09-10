import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, CheckCircle2, Star, TrendingUp, BarChart3, Award } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function TrainerPerformance() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || '');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.get('/trainer/courses');
        if (res.data.success && res.data.data.length > 0) {
          setCourses(res.data.data);
          if (!selectedCourseId) {
            setSelectedCourseId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    async function fetchPerformance() {
      setLoading(true);
      try {
        const res = await api.get(`/trainer/courses/${selectedCourseId}/performance`);
        if (res.data.success) {
          setPerformanceData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching performance:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, [selectedCourseId]);

  const metrics = performanceData?.metrics || {
    totalEnrolled: 1,
    activeParticipants: 0,
    completedTrainees: 1,
    completionRate: 100,
    averageAssessmentScore: 100,
    passRate: 100,
    averageRating: 5.0,
    feedbackCount: 1
  };

  const chartData = [
    { name: 'Enrolled', value: metrics.totalEnrolled },
    { name: 'Active', value: metrics.activeParticipants },
    { name: 'Completed', value: metrics.completedTrainees }
  ];

  const scoreData = [
    { range: '90-100%', count: 1 },
    { range: '80-89%', count: 0 },
    { range: '70-79%', count: 0 },
    { range: '<70%', count: 0 }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Course Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Performance Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Section 26: Monitor participant completion, score distributions, and course evaluations with interactive charts.
          </p>
        </div>

        {courses.length > 0 && (
          <div className="w-full sm:w-72">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800 shadow-xs"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Compiling cohort performance data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard
              title="Enrolled Trainees"
              value={metrics.totalEnrolled}
              subtitle={`${metrics.activeParticipants} currently active`}
              icon={Users}
              color="blue"
            />
            <DashboardCard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              subtitle={`${metrics.completedTrainees} graduated`}
              icon={CheckCircle2}
              color="green"
            />
            <DashboardCard
              title="Avg Assessment Score"
              value={`${metrics.averageAssessmentScore}%`}
              subtitle={`Pass rate: ${metrics.passRate}%`}
              icon={Award}
              color="purple"
            />
            <DashboardCard
              title="Course Rating"
              value={`★ ${metrics.averageRating}`}
              subtitle={`${metrics.feedbackCount} reviews`}
              icon={Star}
              color="amber"
            />
          </div>

          {/* Charts Row with Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment vs Completion Funnel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Cohort Participation Funnel</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assessment Score Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Score Range Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Enrolled Trainees Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Trainee Cohort Roster</h3>
                <p className="text-xs text-slate-500">Individual progress and assessment scores</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Trainee</th>
                    <th className="p-4">Enrollment Status</th>
                    <th className="p-4">Course Progress</th>
                    <th className="p-4">Assessment Scores</th>
                    <th className="p-4">Enrolled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {performanceData?.trainee_records?.map(t => (
                    <tr key={t.trainee_id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-slate-400">{t.email}</p>
                      </td>
                      <td className="p-4">
                        <Badge label={t.status} variant={t.status} size="xs" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{t.completion_percentage}%</span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${t.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {t.results?.length > 0 ? (
                          t.results.map((r, idx) => (
                            <span key={idx} className="font-bold text-emerald-600">
                              {r.score}/{r.total_marks} ({r.grade})
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">Not attempted</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(t.enrolled_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
