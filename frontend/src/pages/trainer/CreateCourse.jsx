import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import VideoEmbed from '../../components/common/VideoEmbed';
import Badge from '../../components/common/Badge';
import {
  BookOpen,
  Tv,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function CreateCourse() {
  const navigate = useNavigate();

  // Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Machine Learning');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('6 Weeks');
  const [objectivesText, setObjectivesText] = useState('');
  const [prerequisitesText, setPrerequisitesText] = useState('');
  const [status, setStatus] = useState('PUBLISHED');

  // YouTube Material & AI State
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=Gv9_4yMHFhI');
  const [extractedVideoId, setExtractedVideoId] = useState('Gv9_4yMHFhI');
  const [videoTitle, setVideoTitle] = useState('Lecture 1: Core Fundamentals & Architectures');
  const [theoryText, setTheoryText] = useState('');

  // AI Summarizer State (Section 14 & 39)
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiMessage, setAiMessage] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // YouTube URL validator & extractor
  const handleUrlChange = (url) => {
    setYoutubeUrl(url);
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    if (match && match[1].length === 11) {
      setExtractedVideoId(match[1]);
      setError('');
    } else {
      setExtractedVideoId(null);
    }
  };

  // Google Gemini AI Video Summarizer (Section 14 & 39)
  const handleRunAiSummary = async () => {
    if (!youtubeUrl || !extractedVideoId) {
      setError('Please provide a valid YouTube URL first.');
      return;
    }

    setAiLoading(true);
    setAiMessage('');
    setError('');

    try {
      const res = await api.post('/ai/youtube-summary', {
        youtube_url: youtubeUrl,
        course_title: title || subject,
        description: description || 'Lecture video'
      });

      if (res.data.success) {
        const data = res.data.data;
        setAiResult(data);
        setAiMessage('Gemini AI has analyzed the lecture! Review the summary and objectives below.');

        // Optionally prefill description and objectives if empty
        if (!description && data.summary) setDescription(data.summary);
        if (!objectivesText && data.learning_objectives) {
          setObjectivesText(data.learning_objectives.join('\n'));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI summarizer encountered an error.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!extractedVideoId) {
      setError('A valid YouTube lecture video link is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const objectives = objectivesText
        .split('\n')
        .map(o => o.trim())
        .filter(Boolean);

      const prerequisites = prerequisitesText
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean);

      // Step 1: Create Course
      const courseRes = await api.post('/trainer/courses', {
        title,
        description,
        subject,
        difficulty,
        duration,
        learning_objectives: objectives,
        prerequisites,
        status
      });

      if (!courseRes.data.success) {
        setError(courseRes.data.message);
        setSaving(false);
        return;
      }

      const courseId = courseRes.data.data.id;

      // Step 2: Add YouTube Video Material (Section 12)
      await api.post(`/trainer/courses/${courseId}/materials`, {
        title: videoTitle || 'Lecture 1: Core Principles',
        type: 'VIDEO',
        youtube_url: youtubeUrl,
        description: aiResult?.summary || 'Primary lecture video module.'
      });

      // Step 3: Add Theory reading if provided
      if (theoryText.trim()) {
        await api.post(`/trainer/courses/${courseId}/materials`, {
          title: 'Core Reading & Theory',
          type: 'TEXT/THEORY',
          description: theoryText
        });
      }

      navigate('/trainer/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Course & Curriculum</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 12, 14 & 23: Add learning modules, embed YouTube lecture streaming, and apply Google Gemini AI educational summarization.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {aiMessage && (
        <div className="p-4 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      <form onSubmit={handleCreateCourse} className="space-y-6">
        {/* Course Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Basic Course Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Applied Machine Learning with Python"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Machine Learning">Machine Learning</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 6 Weeks (24 Hours)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Comprehensive description of the course, target competencies, and real-world applications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Learning Objectives (1 per line)
              </label>
              <textarea
                rows={3}
                placeholder="Understand linear regression&#10;Compute Mean Squared Error&#10;Implement cross-validation"
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Prerequisites (1 per line)
              </label>
              <textarea
                rows={3}
                placeholder="Basic Python programming&#10;Fundamental Linear Algebra"
                value={prerequisitesText}
                onChange={(e) => setPrerequisitesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* YouTube Video Material & AI Summarization Card (Section 12, 14 & 39) */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tv className="w-5 h-5 text-red-600" />
                YouTube Lecture Video Embedding
              </h2>
              <p className="text-xs text-slate-500">
                Section 12: Stores YouTube video ID. Video is streamed through responsive iframe embedding.
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
              YouTube Embed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lecture Title
              </label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Lecture 1: Supervised Learning Foundations"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Instant Video Embed Preview */}
          {extractedVideoId ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validated YouTube ID: {extractedVideoId}
                </span>

                {/* Gemini AI Summarizer Trigger Button */}
                <button
                  type="button"
                  onClick={handleRunAiSummary}
                  disabled={aiLoading}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading ? 'Gemini AI Analyzing...' : 'Run Gemini AI Summarizer'}
                </button>
              </div>

              <div className="max-w-xl mx-auto">
                <VideoEmbed videoId={extractedVideoId} title={videoTitle} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-500">
              Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=Gv9_4yMHFhI or https://youtu.be/bMknfKXIFA8).
            </p>
          )}

          {/* AI Generated Analysis Review Box (Section 14 & 39) */}
          {aiResult && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Gemini AI Educational Analysis (Review Before Publishing)
                </span>
                <span className="text-[10px] text-purple-700 font-semibold">Grounded in Lecture Data</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong>Summary:</strong> {aiResult.summary}
              </p>

              {aiResult.topics && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 mr-1">Extracted Topics:</span>
                  {aiResult.topics.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-purple-800 text-[10px] font-bold border border-purple-200">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theory / Reading Material */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Core Theory & Academic Reading Notes
          </h2>
          <textarea
            rows={4}
            placeholder="Add theoretical explanations, mathematical derivations, or reading summaries..."
            value={theoryText}
            onChange={(e) => setTheoryText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700"
          >
            <option value="PUBLISHED">Publish Course Immediately</option>
            <option value="DRAFT">Save as Draft</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-purple-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Creating Course...' : 'Save & Publish Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
