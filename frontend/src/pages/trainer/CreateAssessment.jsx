import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FileCheck2, Plus, Trash2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingMarks, setPassingMarks] = useState(15);

  const [questions, setQuestions] = useState([
    {
      question: 'What is the primary optimization objective during Ordinary Least Squares (OLS) regression?',
      option_a: 'Minimize classification error rate',
      option_b: 'Minimize Mean Squared Error (MSE)',
      option_c: 'Maximize learning rate',
      option_d: 'Minimize variance only',
      correct_option: 'B',
      marks: 10
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTrainerCourses() {
      try {
        const res = await api.get('/trainer/courses');
        if (res.data.success && res.data.data.length > 0) {
          setCourses(res.data.data);
          setSelectedCourseId(res.data.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    }
    loadTrainerCourses();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 10
      }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError('Please select a course for this assessment.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await api.post('/trainer/assessments', {
        course_id: selectedCourseId,
        title,
        description,
        deadline,
        duration_minutes: durationMinutes,
        passing_marks: passingMarks,
        questions
      });

      if (res.data.success) {
        navigate('/trainer/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create MCQ Assessment</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 15: Create subject questionnaires with server-side deadline enforcement and automated scoring.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assessment Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-500" />
            Evaluation Setup
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Module 1 Foundations Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Instructions / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Mandatory MCQ test evaluating regression and cost functions."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Submission Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passing Marks
              </label>
              <input
                type="number"
                min="1"
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Dynamic MCQ Questions Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Questions ({questions.length})
            </h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-purple-700">Question {idx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  placeholder="Enter the MCQ question..."
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <div key={opt}>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-0.5">
                      Option {opt.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${opt.toUpperCase()} text`}
                      value={q[`option_${opt}`]}
                      onChange={(e) => handleQuestionChange(idx, `option_${opt}`, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800">Correct Option:</span>
                  <select
                    value={q.correct_option}
                    onChange={(e) => handleQuestionChange(idx, 'correct_option', e.target.value)}
                    className="px-3 py-1 text-xs rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Marks:</span>
                  <input
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(idx, 'marks', Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-purple-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
