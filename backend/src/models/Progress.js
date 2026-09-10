import mongoose from "mongoose";

export const ProgressSchema = new mongoose.Schema({
  traineeId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  completedLessons: [{ type: String }],
  completedModules: [{ type: String }],
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  lastAccessedLesson: { type: String, default: null },
  completionStatus: { type: String, enum: ["not-started", "in-progress", "completed"], default: "in-progress" },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

ProgressSchema.index({ traineeId: 1, courseId: 1 }, { unique: true });

let ProgressModel;
try {
  ProgressModel = mongoose.model("Progress", ProgressSchema);
} catch {
  ProgressModel = mongoose.models.Progress;
}

export default ProgressModel;
