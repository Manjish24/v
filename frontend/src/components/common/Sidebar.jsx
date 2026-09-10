import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Search,
  FileCheck2,
  Award,
  HelpCircle,
  PlusCircle,
  BarChart3,
  Library,
  Users,
  BrainCircuit,
  Megaphone,
  GraduationCap
} from 'lucide-react';
import Badge from './Badge';

export default function Sidebar({ onCloseMobile }) {
  const { user } = useAuth();
  if (!user) return null;

  const traineeLinks = [
    { name: 'Overview', to: '/trainee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', to: '/trainee/profile', icon: User },
    { name: 'My Courses', to: '/trainee/my-courses', icon: BookOpen },
    { name: 'Available Courses', to: '/trainee/courses/available', icon: Search },
    { name: 'Assessments', to: '/trainee/assessments', icon: FileCheck2 },
    { name: 'My Results', to: '/trainee/results', icon: BarChart3 },
    { name: 'Certificates', to: '/trainee/certificates', icon: Award },
    { name: 'Queries & Help', to: '/trainee/queries', icon: HelpCircle }
  ];

  const trainerLinks = [
    { name: 'Overview', to: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'Trainer Profile', to: '/trainer/profile', icon: User },
    { name: 'My Courses', to: '/trainer/courses', icon: BookOpen },
    { name: 'Create Course', to: '/trainer/courses/create', icon: PlusCircle },
    { name: 'Performance Analytics', to: '/trainer/performance', icon: BarChart3 },
    { name: 'Trainer Library', to: '/trainer/library', icon: Library }
  ];

  const adminLinks = [
    { name: 'Overview & Stats', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Capacity Competency', to: '/admin/competency', icon: BrainCircuit, highlight: true },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Trainees Database', to: '/admin/trainees', icon: GraduationCap },
    { name: 'Trainers Database', to: '/admin/trainers', icon: Award },
    { name: 'Query Resolution', to: '/admin/queries', icon: HelpCircle },
    { name: 'Announcements', to: '/admin/announcements', icon: Megaphone }
  ];

  let links = traineeLinks;
  if (user.role === 'TRAINER') links = trainerLinks;
  if (user.role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* User Summary Pill */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <img
          src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
          <div className="mt-0.5">
            <Badge label={user.role} variant={user.role} size="xs" />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {user.role} Navigation
        </p>

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30'
                      : 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : item.highlight
                    ? 'text-purple-700 bg-purple-50/70 hover:bg-purple-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
              {item.highlight && (
                <span className="ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-extrabold tracking-wider">
                  AI Match
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 font-medium">Capacity Connect v1.0</p>
        <p className="text-[10px] text-slate-400">SIH PS 26075</p>
      </div>
    </aside>
  );
}
