import mongoose from "mongoose";

export const EnrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  enrolledAt: { type: Date, default: Date.now },
  completedModules: [{ type: String }],
  completedLessons: [{ type: String }],
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ["in-progress", "completed", "dropped"], default: "in-progress" },
  certificateId: { type: String, default: null },
  certificateIssuedAt: { type: Date, default: null },
  certificateScore: { type: Number, default: null },
  assessmentId: { type: String, default: null }
}, { timestamps: true });

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

let EnrollmentModel;
try {
  EnrollmentModel = mongoose.model("Enrollment", EnrollmentSchema);
} catch {
  EnrollmentModel = mongoose.models.Enrollment;
}

export default EnrollmentModel;
