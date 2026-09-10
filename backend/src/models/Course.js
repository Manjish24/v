import mongoose from "mongoose";
import { ModuleSchema } from "./Module.js";

export const CourseLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
export const CourseStatus = ["draft", "published", "archived"];

export const CourseSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"], trim: true },
  category: { type: String, required: [true, "Category is required"] },
  trainerId: { type: String, required: true },
  trainerName: { type: String, default: "" },
  duration: { type: String, default: "4 Weeks" },
  level: { type: String, enum: CourseLevels, default: "Intermediate" },
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  status: { type: String, enum: CourseStatus, default: "published" },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  modules: [ModuleSchema]
}, { timestamps: true });

export const validateCourse = (course) => {
  const errors = [];
  if (!course.title) errors.push("Title is required");
  if (!course.category) errors.push("Category is required");
  if (!course.trainerId) errors.push("Trainer ID is required");
  return { isValid: errors.length === 0, errors };
};

let CourseModel;
try {
  CourseModel = mongoose.model("Course", CourseSchema);
} catch {
  CourseModel = mongoose.models.Course;
}

export default CourseModel;
