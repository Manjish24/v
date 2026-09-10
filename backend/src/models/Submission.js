import mongoose from "mongoose";

export const SubmissionSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true, index: true },
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: "" },
  assessmentTitle: { type: String, default: "" },
  userId: { type: String, required: true, index: true },
  traineeName: { type: String, default: "" },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  certificateId: { type: String, default: null },
  answers: { type: Map, of: Number },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

let SubmissionModel;
try {
  SubmissionModel = mongoose.model("Submission", SubmissionSchema);
} catch {
  SubmissionModel = mongoose.models.Submission;
}

export default SubmissionModel;
