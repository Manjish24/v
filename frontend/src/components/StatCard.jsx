import React from "react";

export const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", badge }) => {
  const colorMap = {
    blue: "from-blue-600 to-indigo-600 text-blue-600 bg-blue-50",
    sky: "from-sky-500 to-cyan-500 text-sky-600 bg-sky-50",
    amber: "from-amber-500 to-orange-500 text-amber-600 bg-amber-50",
    emerald: "from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50",
    rose: "from-rose-500 to-red-500 text-rose-600 bg-rose-50"
  };

  const current = colorMap[color] || colorMap.blue;
  const [gradient, textColor, bgColor] = current.split(" ");

  return (
    <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {badge && (
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
