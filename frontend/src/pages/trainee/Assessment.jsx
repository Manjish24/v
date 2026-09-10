import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { CertificateModal } from "../../components/CertificateModal";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  ArrowRight,
  RefreshCw,
  HelpCircle
} from "lucide-react";

export const Assessment = () => {
  const { id = "asm-001" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins in seconds
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.getAssessment(id);
        setAssessment(response.assessment);
        if (response.existingSubmission) {
          setResult(response.existingSubmission);
        }
      } catch (err) {
        console.error("Failed to load assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (result || !assessment) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result, assessment]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // locked after submission
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (submitting || result) return;
    setSubmitting(true);

    try {
      const response = await api.submitAssessment(id, answers);
      setResult(response.submission);
      if (response.reviewQuestions) {
        setReviewQuestions(response.reviewQuestions);
      }
    } catch (err) {
      alert(err.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading assessment questions...</div>;
  }

  if (!assessment) {
    return <div className="p-12 text-center text-rose-500">Assessment not found.</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const questions = reviewQuestions.length > 0 ? reviewQuestions : assessment.questions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200 uppercase">
            {assessment.courseTitle}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-2">{assessment.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Total Questions: {questions.length} · Passing Threshold: {assessment.passingPercentage}%
          </p>
        </div>

        {!result && (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-sm shrink-0">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} Remaining
            </span>
          </div>
        )}
      </div>

      {/* Result Card if Submitted */}
      {result && (
        <div
          className={`p-6 rounded-3xl border shadow-md ${
            result.passed
              ? "bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-500/30"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Award className={`w-6 h-6 ${result.passed ? "text-amber-400" : "text-rose-500"}`} />
                <h3 className="text-lg font-extrabold">
                  {result.passed ? "Examination Passed! Qualified for Certification" : "Examination Threshold Not Met"}
                </h3>
              </div>
              <p className={`text-xs mt-1 ${result.passed ? "text-emerald-100" : "text-rose-700"}`}>
                Your Score: <strong>{result.percentage}%</strong> ({result.score} / {result.totalMarks} marks).
              </p>
            </div>

            {result.passed && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition"
              >
                View Official Certificate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = answers[q.id];
          const isReview = !!result;

          return (
            <div
              key={q.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-400">Question {qIndex + 1} of {questions.length}</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {q.marks || 10} Marks
                </span>
              </div>

              <p className="text-sm font-bold text-slate-800 leading-relaxed">{q.question}</p>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options?.map((option, optIdx) => {
                  const isChosen = selectedOption === optIdx;
                  const isCorrect = q.correctOptionIndex === optIdx;

                  let optionStyle = "border-slate-200 hover:bg-slate-50 text-slate-700";
                  if (isChosen && !isReview) {
                    optionStyle = "bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-2 ring-blue-500/20";
                  } else if (isReview) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                    } else if (isChosen && !isCorrect) {
                      optionStyle = "bg-rose-50 border-rose-500 text-rose-900";
                    }
                  }

                  return (
                    <button
                      type="button"
                      key={optIdx}
                      disabled={isReview}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition flex items-center space-x-3 ${optionStyle}`}
                    >
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation in review */}
              {isReview && q.explanation && (
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-slate-700 mt-2">
                  <span className="font-bold text-sky-900 block mb-0.5">Official IMD Scientific Explanation:</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Bottom Bar */}
      {!result && (
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Answered: <strong className="text-slate-800">{Object.keys(answers).length}</strong> / {questions.length}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
          >
            <span>{submitting ? "Calculating Score..." : "Submit Examination"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        certificate={{
          certificateId: result?.certificateId,
          recipientName: user?.name || "Trainee",
          courseTitle: assessment.courseTitle,
          score: result?.percentage,
          issueDate: result?.submittedAt
        }}
      />
    </div>
  );
};
