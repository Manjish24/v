import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import { BookOpen, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('TRAINEE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register({
      name,
      email,
      password,
      confirmPassword,
      role
    });

    setLoading(false);

    if (res.success) {
      if (res.user.role === 'TRAINEE') navigate('/trainee/dashboard');
      else if (res.user.role === 'TRAINER') navigate('/trainer/dashboard');
      else navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Create an Account</h2>
            <p className="text-xs text-slate-300">Join the national digital capacity-building portal</p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('TRAINEE')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      role === 'TRAINEE'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Trainee</span>
                    <span className="text-[10px] font-normal text-slate-500">Learn & Get Certified</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('TRAINER')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      role === 'TRAINER'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-700 ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Trainer</span>
                    <span className="text-[10px] font-normal text-slate-500">Create & Teach Courses</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
                <UserPlus className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
