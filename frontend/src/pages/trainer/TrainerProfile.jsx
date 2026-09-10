import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Award
} from 'lucide-react';

export default function TrainerProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [qualification, setQualification] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState([]);
  const [competencies, setCompetencies] = useState([]);

  // New Competency Form State
  const [newCompSubject, setNewCompSubject] = useState('');
  const [newCompExp, setNewCompExp] = useState(5);
  const [newCompLevel, setNewCompLevel] = useState('Expert');
  const [newCompCert, setNewCompCert] = useState('');

  // New Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Expert');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/trainer/profile');
        if (res.data.success) {
          const { user: u, profile: p } = res.data.data;
          setName(u.name || '');
          setBio(p.bio || u.bio || '');
          setQualification(p.qualification || '');
          setWorkExperience(p.work_experience || '');
          setSkills(p.skills || []);
          setCompetencies(p.competencies || []);
          setProfile(p);
        }
      } catch (err) {
        console.error('Error loading trainer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAddCompetency = () => {
    if (!newCompSubject.trim()) return;
    const newComp = {
      id: `tcomp_${Date.now()}`,
      subject: newCompSubject.trim(),
      experience_years: Number(newCompExp),
      proficiency_level: newCompLevel,
      certification: newCompCert.trim() || 'Verified Domain Expert',
      past_performance_score: 4.85
    };
    setCompetencies([...competencies, newComp]);
    setNewCompSubject('');
    setNewCompCert('');
  };

  const handleRemoveCompetency = (id) => {
    setCompetencies(competencies.filter(c => c.id !== id));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => (s.name || s) !== (skill.name || skill)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/trainer/profile', {
        name,
        bio,
        qualification,
        work_experience: workExperience,
        skills,
        competencies
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Trainer profile and competencies saved successfully!' });
        await refreshUser();
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save trainer profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-xs mt-3">Loading trainer credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
        <img
          src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Trainer')}`}
          alt={name}
          className="w-16 h-16 rounded-full border-2 border-purple-600 p-0.5 object-cover"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{name || 'Trainer Profile'}</h1>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <div className="mt-1">
            <Badge label="TRAINER" variant="TRAINER" size="xs" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Instructor Credentials & Background
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Qualifications
              </label>
              <input
                type="text"
                placeholder="e.g. Ph.D. IIT Bombay, M.Tech AI"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Work & Teaching Experience
            </label>
            <input
              type="text"
              placeholder="e.g. 8 years AI research and 5 years university lecturing"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>
        </div>

        {/* Competencies Section (Critical for Capacity Competency Matching - Section 22 & 35) */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                Teaching Competencies
              </h2>
              <p className="text-xs text-slate-500">
                Section 35: Feeds into the administrator's Capacity Competency matching engine for institutional trainer assignments.
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
              Core Differentiator
            </span>
          </div>

          {/* Add Competency Inputs */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Competency Subject (e.g. Advanced Machine Learning)"
                value={newCompSubject}
                onChange={(e) => setNewCompSubject(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-purple-200 bg-white"
              />
              <input
                type="text"
                placeholder="Certification (e.g. Google Professional ML Engineer)"
                value={newCompCert}
                onChange={(e) => setNewCompCert(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl border border-purple-200 bg-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Years Exp:</span>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={newCompExp}
                  onChange={(e) => setNewCompExp(e.target.value)}
                  className="w-16 px-2 py-1 text-xs rounded-lg border border-purple-200 bg-white"
                />
              </div>
              <select
                value={newCompLevel}
                onChange={(e) => setNewCompLevel(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white font-medium"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddCompetency}
                className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Competency
              </button>
            </div>
          </div>

          {/* List of competencies */}
          <div className="space-y-2">
            {competencies.map(c => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{c.subject}</span>
                    <Badge label={c.proficiency_level} variant={c.proficiency_level} size="xs" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.experience_years} Years Experience • Cert: {c.certification}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCompetency(c.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Skills & Tools
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Add skill (e.g. PyTorch, Docker, Kubernetes)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                {s.name || s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-purple-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Trainer Credentials'}
          </button>
        </div>
      </form>
    </div>
  );
}
