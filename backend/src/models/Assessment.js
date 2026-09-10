import mongoose from "mongoose";

export const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, default: 10 },
  explanation: { type: String, default: "" }
});

export const AssessmentSchema = new mongoose.Schema({
  courseId: { type: String, required: true, index: true },
  courseTitle: { type: String, default: "" },
  title: { type: String, required: true },
  trainerId: { type: String, required: true },
  durationMinutes: { type: Number, default: 20 },
  passingPercentage: { type: Number, default: 60 },
  deadline: { type: Date },
  totalMarks: { type: Number, default: 50 },
  questions: [QuestionSchema]
}, { timestamps: true });

export const validateAssessment = (asm) => {
  const errors = [];
  if (!asm.courseId) errors.push("Course ID is required");
  if (!asm.title) errors.push("Title is required");
  if (!Array.isArray(asm.questions) || asm.questions.length === 0) {
    errors.push("At least one question is required");
  }
  return { isValid: errors.length === 0, errors };
};

let AssessmentModel;
try {
  AssessmentModel = mongoose.model("Assessment", AssessmentSchema);
} catch {
  AssessmentModel = mongoose.models.Assessment;
}

export default AssessmentModel;
