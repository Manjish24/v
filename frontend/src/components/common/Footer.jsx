import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">CAPACITY CONNECT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital capacity-building and Learning Management Portal connecting trainees with master trainers and institutional certifications.
            </p>
            <p className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
              Smart India Hackathon • PS 26075
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/courses" className="hover:text-white transition-colors">Course Catalog</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/verify/cc_token_v7f8a93e2b104dc98a4e" className="hover:text-white transition-colors">Verify Certificate</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Trainee & Trainer Login</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Key Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-300">Capacity Competency Matching</span></li>
              <li><span className="text-slate-300">YouTube Embed Lecture Streaming</span></li>
              <li><span className="text-slate-300">Server-Scored MCQ Assessments</span></li>
              <li><span className="text-slate-300">Client-side PDF & QR Verification</span></li>
              <li><span className="text-slate-300">Google Gemini AI Summaries</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Security & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Authoritative Backend Verification
              </p>
              <p>All certifications, scoring, and role authorizations are verified on secure server infrastructure.</p>
              <p className="pt-2 text-[11px] text-slate-500">© 2026 Capacity Connect. Built for SIH Problem Statement 26075.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
