import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  User,
  PlusCircle,
  FolderKanban,
  Users,
  FileBarChart,
  Award,
  Layers,
  Sparkles,
  LogOut
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const traineeLinks = [
    { name: "Dashboard", path: "/trainee/dashboard", icon: LayoutDashboard },
    { name: "My Courses", path: "/trainee/my-courses", icon: BookOpen },
    { name: "Course Catalog", path: "/courses", icon: Layers },
    { name: "Assessments", path: "/trainee/assessment/asm-001", icon: CheckSquare },
    { name: "My Profile & CV", path: "/trainee/profile", icon: User }
  ];

  const trainerLinks = [
    { name: "Trainer Dashboard", path: "/trainer/dashboard", icon: LayoutDashboard },
    { name: "Create Course", path: "/trainer/create-course", icon: PlusCircle },
    { name: "Manage Courses", path: "/trainer/manage-courses", icon: FolderKanban },
    { name: "Create Assessment", path: "/trainer/create-assessment", icon: CheckSquare },
    { name: "Trainee Progress", path: "/trainer/trainee-progress", icon: Users }
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/manage-users", icon: Users },
    { name: "Manage Courses", path: "/admin/manage-courses", icon: FolderKanban },
    { name: "Competency & Reports", path: "/admin/reports", icon: FileBarChart }
  ];

  let currentLinks = traineeLinks;
  if (user?.role === "trainer") currentLinks = trainerLinks;
  if (user?.role === "admin") currentLinks = adminLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Ministry Badge / Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Portal Workspace</p>
              <p className="text-sm font-bold text-white capitalize">{user?.role || "Guest"} Console</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Main Menu
          </p>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/25 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.department || "MoES / IMD"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
