import mongoose from "mongoose";

export const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  moduleId: { type: String, required: true },
  courseId: { type: String, required: true },
  videoUrl: { type: String, default: "" },
  content: { type: String, default: "" },
  duration: { type: String, default: "30 mins" },
  order: { type: Number, default: 1 },
  documentUrl: { type: String, default: "" }
}, { timestamps: true });

let LessonModel;
try {
  LessonModel = mongoose.model("Lesson", LessonSchema);
} catch {
  LessonModel = mongoose.models.Lesson;
}

export default LessonModel;
