import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import { BookOpen, LogIn, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (res.user.role === 'TRAINEE') navigate('/trainee/dashboard');
        else if (res.user.role === 'TRAINER') navigate('/trainer/dashboard');
        else if (res.user.role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  // Quick 1-Click Demo Login Helper
  const fillAndLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    login(demoEmail, 'Password@123').then(res => {
      if (res.success) {
        if (res.user.role === 'TRAINEE') navigate('/trainee/dashboard');
        else if (res.user.role === 'TRAINER') navigate('/trainer/dashboard');
        else if (res.user.role === 'ADMIN') navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Welcome to Capacity Connect</h2>
            <p className="text-xs text-slate-300">Sign in to your role-based learning portal</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Password@123 (Demo)</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <LogIn className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Logins for Hackathon Evaluators */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                One-Click Quick Role Logins (Demo)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillAndLogin('aarav.patel@trainee.in')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold text-center transition-colors"
                >
                  Trainee
                </button>
                <button
                  type="button"
                  onClick={() => fillAndLogin('rajesh.sharma@capacityconnect.gov.in')}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold text-center transition-colors"
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => fillAndLogin('admin@capacityconnect.gov.in')}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold text-center transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
