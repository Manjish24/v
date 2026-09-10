import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, LogOut, LayoutDashboard, Menu, X, ShieldCheck } from 'lucide-react';
import Badge from './Badge';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'TRAINEE') return '/trainee/dashboard';
    if (user.role === 'TRAINER') return '/trainer/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  const getProfilePath = () => {
    if (!user) return '/login';
    if (user.role === 'TRAINEE') return '/trainee/profile';
    if (user.role === 'TRAINER') return '/trainer/profile';
    return '/admin/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                  CAPACITY CONNECT
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase -mt-1">
                  SIH PS 26075
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/courses" className="hover:text-blue-600 transition-colors">
              Course Catalog
            </Link>
            <Link to="/#about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/verify/cc_token_v7f8a93e2b104dc98a4e" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verify Certificate
            </Link>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Badge label={user.role} variant={user.role} />

                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to={getProfilePath()}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  title="My Profile"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <span className="text-xs font-semibold max-w-[120px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user && <Badge label={user.role} variant={user.role} size="xs" />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Course Catalog
          </Link>
          <Link
            to="/verify/cc_token_v7f8a93e2b104dc98a4e"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Verify Certificate
          </Link>

          {isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                Dashboard
              </Link>
              <Link
                to={getProfilePath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-slate-700 font-medium border border-slate-200 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-blue-600 text-white font-medium rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
