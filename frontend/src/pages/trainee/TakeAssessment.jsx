import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: 'A' }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await api.get(`/assessments/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setAssessment(data);
          setQuestions(data.questions || []);

          // If already submitted, display the result directly
          if (data.already_submitted && data.user_result) {
            setResult(data.user_result);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading assessment.');
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [id]);

  const handleSelectOption = (qId, optionKey) => {
    if (result) return; // Locked if already submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/assessments/${id}/submit`, {
        answers: selectedAnswers
      });
      if (res.data.success) {
        setResult(res.data.data.result);
        setConfirmOpen(false);
      } else {
        setError(res.data.message);
        setConfirmOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment.');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-xs mt-3">Preparing evaluation environment...</p>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Assessment Error</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <Link to="/trainee/assessments" className="text-blue-600 font-semibold text-xs inline-block">
          Return to Assessments
        </Link>
      </div>
    );
  }

  // Result screen after submission
  if (result) {
    const passed = result.percentage >= 50;
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
              passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Server-Verified Result
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {passed ? 'Assessment Passed!' : 'Assessment Completed'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">{assessment?.title}</p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Score</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {result.score} / {result.total_marks}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Percentage</p>
              <p className={`text-xl sm:text-2xl font-black mt-0.5 ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {result.percentage}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Grade</p>
              <p className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">{result.grade}</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {passed
              ? 'Congratulations! Your score fulfills the qualifying criteria for course completion and certificate issuance.'
              : 'You have completed the assessment. Review the course lectures and materials to solidify foundational concepts.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/trainee/certificates"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Check Certificate Eligibility
            </Link>
            <Link
              to="/trainee/results"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              View Results Ledger
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Test Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{assessment?.course_title}</span>
          <h1 className="text-lg font-bold text-slate-900">{assessment?.title}</h1>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Duration: {assessment?.duration_minutes}m</span>
          </div>
        </div>
      </div>

      {/* Progress meter */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Question {currentIndex + 1} of {totalQ}</span>
          <span>{answeredCount} of {totalQ} Answered</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              Question {currentIndex + 1} ({currentQ.marks} Marks)
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {[
              { key: 'A', text: currentQ.option_a },
              { key: 'B', text: currentQ.option_b },
              { key: 'C', text: currentQ.option_c },
              { key: 'D', text: currentQ.option_d }
            ].map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.key;
              return (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => handleSelectOption(currentQ.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {currentIndex === totalQ - 1 ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                Submit Assessment
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Final Submission">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            You have answered <strong className="text-slate-900">{answeredCount} of {totalQ}</strong> questions.
            Once submitted, your answers are permanently locked and scored on the secure backend server. Multiple attempts are not permitted.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Review Answers
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {submitting ? 'Scoring Answers...' : 'Confirm & Submit'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
