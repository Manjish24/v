import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Bell,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Compass,
  Menu,
  X
} from "lucide-react";
import { getRoleBadgeColor } from "../utils/formatters";

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">CAPACITY CONNECT</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                  MoES / IMD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Digital Capacity Building & Learning Management Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* SIH Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SIH 2026 PS #26075</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">Ministry Announcements</span>
                  <span className="text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                  <div className="p-3 hover:bg-slate-50 text-xs transition">
                    <p className="font-semibold text-slate-800">Cyclone Early Warning SOP 2026</p>
                    <p className="text-slate-500 mt-1">National guidelines updated for North Indian Ocean cyclogenesis.</p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 text-xs transition">
                    <p className="font-semibold text-slate-800">New Doppler Radar Assessment</p>
                    <p className="text-slate-500 mt-1">Dual-pol hydrometeor quiz deadline is approaching.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-all border border-slate-200/60"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{user.organization || "MoES / IMD"}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to={user.role === "trainee" ? "/trainee/profile" : "/"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
