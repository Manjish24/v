import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CourseCard from '../../components/common/CourseCard';
import Badge from '../../components/common/Badge';
import {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tv,
  FileCheck,
  QrCode,
  BrainCircuit,
  Megaphone,
  Trophy
} from 'lucide-react';

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    trainees: 2,
    trainers: 2,
    courses: 3,
    certifications: 1
  });

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [coursesRes, annRes, achRes] = await Promise.all([
          api.get('/courses'),
          api.get('/admin/announcements/public').catch(() => ({ data: { data: [] } })),
          api.get('/admin/achievements/public').catch(() => ({ data: { data: [] } }))
        ]);

        if (coursesRes.data.success) setCourses(coursesRes.data.data);
        if (annRes.data.success) setAnnouncements(annRes.data.data);
        if (achRes.data.success) setAchievements(achRes.data.data);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Smart India Hackathon • Problem Statement 26075
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Build Skills. Connect with Expertise.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Grow Your Capacity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Capacity Connect is the authoritative, role-based capacity-building portal connecting ambitious trainees, certified trainers, and institutional administrators with AI-driven competency matching, video learning, and verifiable credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              Explore Course Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              Register as Trainee / Trainer
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="relative -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">{stats.trainees}+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Registered Trainees</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{stats.trainers}+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Expert Trainers</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{stats.courses}+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Published Courses</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-600">{stats.certifications}+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Verified Certifications</p>
          </div>
        </div>
      </section>

      {/* How It Works Flow (Section 6) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Capacity Building Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Capacity Connect Works
          </h2>
          <p className="text-slate-500 text-sm">
            A seamless journey designed to elevate competencies from baseline to certified professional mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Create Profile', desc: 'Add qualifications, work experience, skills, and interests.', icon: Users },
            { step: '02', title: 'Discover Courses', desc: 'AI-assisted semantic recommendations grounded in your skill gaps.', icon: BookOpen },
            { step: '03', title: 'Learn & Engage', desc: 'Embedded YouTube lectures, presentations, and core theory reading.', icon: Tv },
            { step: '04', title: 'Assess & Score', desc: 'Strict server-side scored MCQ assessments with deadline validation.', icon: FileCheck },
            { step: '05', title: 'Get Certified', desc: 'Verifiable PDF credential with dynamic QR authentication.', icon: QrCode }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-blue-600/30">{item.step}</span>
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Flagship Differentiator: Capacity Competency */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-purple-300" />
              Flagship Innovation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Capacity Competency Matching
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              While standard LMS platforms only answer <em className="text-white">"What should a trainee learn?"</em>, Capacity Connect solves the institutional dilemma: <strong className="text-white">"Who is the most suitable trainer to teach it?"</strong>
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-criteria weighted scoring: Skills (35%), Experience (25%), Qualifications (15%), Certifications (15%), Past Performance (10%).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Google Gemini AI semantic understanding recognizes deep domain relevance without exact keyword restrictions.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Every fact grounded in real verified trainer records in the database.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-semibold transition-colors"
              >
                Experience Admin Competency Matcher
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Graphic mockup */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-mono text-purple-300 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                Capacity Competency Assistant
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/60 text-xs font-mono space-y-2">
              <p className="text-slate-400">// Admin Requirement:</p>
              <p className="text-purple-300">"Find a trainer for Advanced Machine Learning & Deep Vision"</p>
              <p className="text-slate-400 pt-2">// Ranked Candidate #1:</p>
              <div className="p-3 bg-slate-800/90 rounded-lg border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Dr. Rajesh Sharma</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-bold">Score: 95%</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">Ph.D. IIT Bombay • 8 yrs AI Research • Google ML Certified</p>
                <p className="text-slate-300 text-[11px] mt-2 italic font-sans">
                  "Dr. Rajesh is exceptionally qualified with verified expertise in PyTorch and supervised algorithms..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Accredited Curriculum
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Learning Courses
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore hands-on courses led by top trainers across emerging technologies.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View All Courses ({courses.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Announcements & Achievements Section */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Announcements */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                Official Announcements
              </h3>
              <span className="text-xs font-semibold text-slate-400">Institutional Updates</span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {ann.category || 'General'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm pt-1">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Trainee Achievements
              </h3>
              <span className="text-xs font-semibold text-slate-400">Verified Milestones</span>
            </div>

            <div className="space-y-3">
              {achievements.map((ach, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-sm">{ach.title}</span>
                  </div>
                  <p className="text-xs text-slate-600">{ach.description}</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Achieved by {ach.trainee_name || 'Trainee'} • Verified by Administrator
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
