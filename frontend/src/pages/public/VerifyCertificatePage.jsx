import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { ShieldCheck, AlertCircle, Award, CheckCircle2, Calendar, User, BookOpen, Search } from 'lucide-react';

export default function VerifyCertificatePage() {
  const { token } = useParams();
  const [searchToken, setSearchToken] = useState(token || '');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyToken = async (targetToken) => {
    if (!targetToken) return;
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const res = await api.get(`/certificates/${targetToken.trim()}/verify`);
      if (res.data.success && res.data.verified) {
        setCertificate(res.data.data);
      } else {
        setError(res.data.message || 'Certificate record could not be verified.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found or verification token is invalid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchToken) verifyToken(searchToken);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Authoritative Public Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Verify Digital Certificate Authenticity
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Confirm authentic completion of government & institutional capacity-building programs on the Capacity Connect platform.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="pt-4 max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Enter Certificate Number (e.g. CC-2026-000108) or Token"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Verify
            </button>
          </form>
        </div>
      </div>

      {/* Result Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading && (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 text-sm mt-3">Validating cryptographic certificate record against database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-2xl p-8 border border-rose-200 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Certificate Verification Failed</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">{error}</p>
            <p className="text-xs text-slate-400">
              Please double check the token or certificate ID from the physical or digital document.
            </p>
          </div>
        )}

        {certificate && !loading && (
          <div className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top Verified Header */}
            <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                    Official Verification Result
                  </span>
                  <h2 className="text-xl font-extrabold">Certificate Authenticated</h2>
                </div>
              </div>
              <span className="px-3 py-1 bg-white text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                VALID
              </span>
            </div>

            {/* Certificate Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Certificate Number</p>
                  <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">{certificate.certificate_number}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Issued Date</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recipient Name</p>
                    <p className="text-base font-bold text-slate-900">{certificate.trainee_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Course Completed</p>
                    <p className="text-base font-bold text-slate-900">{certificate.course_title}</p>
                    {certificate.course_subject && (
                      <p className="text-xs text-slate-500">{certificate.course_subject}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Course Trainer</p>
                    <p className="text-sm font-bold text-slate-900">{certificate.trainer_name}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Issuing Authority: {certificate.issuing_authority}</p>
                <p className="font-mono text-[11px] text-slate-400 truncate">Token: {certificate.verification_token}</p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Recorded in Supabase PostgreSQL ledger with cryptographic hash matching.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
