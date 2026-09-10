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
  AlertCircle
} from 'lucide-react';

export default function TraineeProfile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [qualification, setQualification] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/trainee/profile');
        if (res.data.success) {
          const { user: userData, profile: profileData, profile_completion_percentage } = res.data.data;
          setName(userData.name || '');
          setBio(profileData.bio || userData.bio || '');
          setQualification(profileData.qualification || '');
          setWorkExperience(profileData.work_experience || '');
          setInterestsText((profileData.interests || []).join(', '));
          setSkills(profileData.skills || []);
          setCompletionPercentage(profile_completion_percentage || 0);
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Error fetching trainee profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = skills.some(s => (s.name || s).toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) {
      setMessage({ type: 'error', text: 'This skill is already in your profile.' });
      return;
    }

    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel('Intermediate');
    setMessage({ type: '', text: '' });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => (s.name || s) !== (skillToRemove.name || skillToRemove)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const interestsArray = interestsText
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const res = await api.put('/trainee/profile', {
        name,
        bio,
        qualification,
        work_experience: workExperience,
        interests: interestsArray,
        skills
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Your professional profile was successfully saved.' });
        await refreshUser();
        // Recalculate completion
        let count = 0;
        if (name) count++;
        if (qualification) count++;
        if (workExperience) count++;
        if (interestsArray.length > 0) count++;
        if (skills.length > 0) count++;
        if (bio) count++;
        setCompletionPercentage(Math.round((count / 6) * 100));
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-xs mt-3">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Completion Meter */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Trainee')}`}
              alt={name}
              className="w-16 h-16 rounded-full border-2 border-blue-600 p-0.5 object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">{name || 'Trainee Profile'}</h1>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="mt-1">
                <Badge label="TRAINEE" variant="TRAINEE" size="xs" />
              </div>
            </div>
          </div>

          {/* Profile Completion percentage */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Profile Strength</span>
              <span className="text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              {completionPercentage === 100 ? 'All sections complete' : 'Complete all fields for better AI recommendations'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Basic & Qualifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Academic & Professional Background
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech in Computer Science"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Work Experience
            </label>
            <input
              type="text"
              placeholder="e.g. 1 year Junior Developer or Fresher"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Bio
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of your learning objectives and background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Interests (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Artificial Intelligence, Data Science, Cloud Computing"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Skills & Skill Levels (Section 9 Requirement) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Skills & Skill Levels
            </h2>
            <span className="text-xs text-slate-400">Section 9 Compliance</span>
          </div>

          {/* Add skill row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Add skill (e.g. Python, SQL, React)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          {/* List of skills */}
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No skills added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {skills.map((skill, index) => {
                const sName = skill.name || skill;
                const sLevel = skill.level || 'Intermediate';
                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sName}</p>
                      <div className="mt-0.5">
                        <Badge label={sLevel} variant={sLevel} size="xs" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
