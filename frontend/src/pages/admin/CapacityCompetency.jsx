import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  Award,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Star,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function CapacityCompetency() {
  const [query, setQuery] = useState('Advanced Machine Learning');
  const [weights, setWeights] = useState({
    skill: 35,
    experience: 25,
    qualification: 15,
    certification: 15,
    performance: 10
  });

  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState('');

  const runMatching = async (targetQuery = query) => {
    if (!targetQuery.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/competency/match', {
        subject: targetQuery,
        weights
      });

      if (res.data.success) {
        setMatchResult(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error executing Capacity Competency engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runMatching('Advanced Machine Learning');
  }, []);

  const handleWeightChange = (key, val) => {
    setWeights(prev => ({
      ...prev,
      [key]: Number(val)
    }));
  };

  const presetQueries = [
    'Advanced Machine Learning',
    'Full Stack Web Development',
    'Cloud Architecture & DevOps',
    'Computer Vision & Deep Learning'
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          Smart India Hackathon • Problem Statement 26075 Flagship Feature
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Capacity Competency Matching Engine
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Section 34-37: Answers <strong className="text-white">"Who is the most suitable trainer to teach this subject?"</strong> using multi-criteria weighted scoring and Google Gemini AI semantic reasoning grounded in verified database credentials.
          </p>
        </div>

        {/* Search requirement input */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Describe institutional competency need (e.g. 'Advanced Machine Learning and PyTorch')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-purple-400"
            />
          </div>
          <button
            onClick={() => runMatching(query)}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Matching...' : 'Match Suitable Trainer'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400">Quick queries:</span>
          {presetQueries.map(p => (
            <button
              key={p}
              onClick={() => {
                setQuery(p);
                runMatching(p);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Configurable Multi-Criteria Weights Slider (Section 36) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Configurable Multi-Criteria Weights</h3>
          </div>
          <span className="text-xs text-slate-400">
            Total Weight: {weights.skill + weights.experience + weights.qualification + weights.certification + weights.performance}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Skill Relevance</span>
              <span className="text-purple-600">{weights.skill}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.skill}
              onChange={(e) => handleWeightChange('skill', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Experience</span>
              <span className="text-purple-600">{weights.experience}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.experience}
              onChange={(e) => handleWeightChange('experience', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Qualification</span>
              <span className="text-purple-600">{weights.qualification}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.qualification}
              onChange={(e) => handleWeightChange('qualification', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Certification</span>
              <span className="text-purple-600">{weights.certification}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.certification}
              onChange={(e) => handleWeightChange('certification', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Past Performance</span>
              <span className="text-purple-600">{weights.performance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.performance}
              onChange={(e) => handleWeightChange('performance', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Match Results */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-xs mt-3">Evaluating candidate competencies and querying Gemini AI reasoning...</p>
        </div>
      ) : matchResult ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Matched Candidate Banner */}
          {matchResult.topMatch && (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-white rounded-2xl border-2 border-purple-500/50 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={matchResult.topMatch.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={matchResult.topMatch.name}
                    className="w-16 h-16 rounded-2xl border-2 border-purple-600 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded-full">
                        #1 Optimal Match Candidate
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {matchResult.topMatch.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {matchResult.topMatch.qualification} • {matchResult.topMatch.work_experience}
                    </p>
                  </div>
                </div>

                {/* Score badge */}
                <div className="text-center sm:text-right bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Composite Match Score</p>
                  <p className="text-3xl font-black text-purple-700">{matchResult.topMatch.score}%</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Highly Recommended</p>
                </div>
              </div>

              {/* Gemini AI Executive Explanation (Section 37) */}
              {matchResult.explanation && (
                <div className="p-4 rounded-xl bg-purple-900 text-white text-xs space-y-2 shadow-inner">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Google Gemini AI Semantic Reasoning
                  </div>
                  <p className="leading-relaxed text-slate-100 font-sans">
                    "{matchResult.explanation}"
                  </p>
                </div>
              )}

              {/* Score Breakdown Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Match</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {matchResult.topMatch.score_breakdown.skillScore}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {matchResult.topMatch.score_breakdown.experienceScore}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Qualification</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {matchResult.topMatch.score_breakdown.qualificationScore}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Certification</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {matchResult.topMatch.score_breakdown.certScore}%
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Past Performance</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {matchResult.topMatch.score_breakdown.performanceScore}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ranked Candidates Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
            <h3 className="text-base font-bold text-slate-900">
              All Ranked Instructor Candidates ({matchResult.rankedTrainers?.length || 0})
            </h3>

            <div className="divide-y divide-slate-100">
              {matchResult.rankedTrainers?.map((t, idx) => (
                <div key={t.trainer_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 font-extrabold text-xs text-slate-700 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={t.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-500">{t.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <span>Exp: {t.work_experience}</span>
                    <span>Past Rating: ★ {t.past_performance_score || '4.8'}</span>
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs">
                      {t.score}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
