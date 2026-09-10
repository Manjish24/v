import React from 'react';

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {trend && (
                <span className={trend > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {trend > 0 ? `+${trend}%` : `${trend}%`}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
