import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { PlusCircle, Trash2, ArrowLeft, CheckSquare } from "lucide-react";

export const CreateAssessment = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [assessmentData, setAssessmentData] = useState({
    courseId: "",
    title: "",
    durationMinutes: 20,
    passingPercentage: 70,
    deadline: "2026-10-30T23:59:59.000Z",
    questions: [
      {
        id: "q1",
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        marks: 10,
        explanation: ""
      }
    ]
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.getTrainerCourses();
        const crs = response.courses || [];
        setCourses(crs);
        if (crs.length > 0) {
          setAssessmentData((prev) => ({ ...prev, courseId: crs[0].id }));
        }
      } catch (err) {
        console.error("Failed to load courses for assessment:", err);
      }
    };
    loadCourses();
  }, []);

  const handleAddQuestion = () => {
    const qNum = assessmentData.questions.length + 1;
    setAssessmentData({
      ...assessmentData,
      questions: [
        ...assessmentData.questions,
        {
          id: `q${qNum}`,
          question: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          marks: 10,
          explanation: ""
        }
      ]
    });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...assessmentData.questions];
    updated[qIndex][field] = value;
    setAssessmentData({ ...assessmentData, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...assessmentData.questions];
    updated[qIndex].options[optIndex] = value;
    setAssessmentData({ ...assessmentData, questions: updated });
  };

  const handleRemoveQuestion = (index) => {
    if (assessmentData.questions.length === 1) return;
    setAssessmentData({
      ...assessmentData,
      questions: assessmentData.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assessmentData.title || !assessmentData.courseId) {
      alert("Please provide an assessment title and select an associated course.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createAssessment(assessmentData);
      alert("Assessment created successfully!");
      navigate("/trainer/dashboard");
    } catch (err) {
      alert(err.message || "Failed to create assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate("/trainer/dashboard")}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Subject Assessment</h1>
          <p className="text-xs text-slate-500">
            Build timed MCQ questionnaires with passing thresholds and official explanations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Assessment Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
              <select
                value={assessmentData.courseId}
                onChange={(e) => setAssessmentData({ ...assessmentData, courseId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title</label>
              <input
                type="text"
                required
                value={assessmentData.title}
                onChange={(e) => setAssessmentData({ ...assessmentData, title: e.target.value })}
                placeholder="e.g. DWR Technical Certification Exam"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="180"
                value={assessmentData.durationMinutes}
                onChange={(e) => setAssessmentData({ ...assessmentData, durationMinutes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passing Percentage (%)</label>
              <input
                type="number"
                min="40"
                max="100"
                value={assessmentData.passingPercentage}
                onChange={(e) => setAssessmentData({ ...assessmentData, passingPercentage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">MCQ Questions</h2>
              <p className="text-[11px] text-slate-500">Add questions, 4 options, and designate the correct answer</p>
            </div>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-6">
            {assessmentData.questions.map((q, qIndex) => (
              <div key={qIndex} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Question #{qIndex + 1}</span>
                  {assessmentData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                    placeholder="Enter question statement (e.g. Which dual-pol radar parameter indicates hail?)..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-bold text-slate-600">
                    Options & Correct Answer (Select radio for correct answer)
                  </span>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctOptionIndex === optIndex}
                        onChange={() => handleQuestionChange(qIndex, "correctOptionIndex", optIndex)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-500 w-4">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Scientific Explanation (Visible to trainees during review)
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                    placeholder="e.g. Hail causes tumbling resulting in near-zero ZDR with very high Reflectivity (>55 dBZ)."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/trainer/dashboard")}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
};
