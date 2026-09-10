import React from 'react';

const BADGE_STYLES = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-sky-50 text-sky-700 border-sky-200',
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
  EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200',
  OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
  Beginner: 'bg-teal-50 text-teal-700 border-teal-200',
  Intermediate: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  Expert: 'bg-amber-50 text-amber-700 border-amber-200',
  TRAINEE: 'bg-blue-50 text-blue-700 border-blue-200',
  TRAINER: 'bg-purple-50 text-purple-700 border-purple-200',
  ADMIN: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function Badge({ label, variant, size = 'sm' }) {
  const key = variant || label;
  const style = BADGE_STYLES[key] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style} ${sizeClasses}`}>
      {label}
    </span>
  );
}
