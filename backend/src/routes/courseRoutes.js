import express from "express";
import {
  getAllCourses,
  getCourseDetails,
  enrollInCourse,
  updateModuleProgress,
  getMyCourses,
  addCourseFeedback
} from "../controllers/courseController.js";
import {
  createCourse,
  updateCourse
} from "../controllers/trainerController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { dataService } from "../services/dataService.js";

const router = express.Router();

// Public / Trainee browsing
router.get("/", getAllCourses);
router.get("/my-courses", verifyToken, getMyCourses);

// Trainer / Admin course creation & update
router.post("/", verifyToken, authorizeRoles("trainer", "admin"), createCourse);
router.put("/:id", verifyToken, authorizeRoles("trainer", "admin"), updateCourse);
router.delete("/:id", verifyToken, authorizeRoles("trainer", "admin"), async (req, res) => {
  try {
    const course = await dataService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    if (course.trainerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this course." });
    }
    await dataService.deleteCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete course." });
  }
});

router.get("/:id", (req, res, next) => {
  // Optional auth to check enrollment if header provided
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return verifyToken(req, res, () => getCourseDetails(req, res));
  }
  return getCourseDetails(req, res);
});

// Trainee actions
router.post("/:id/enroll", verifyToken, authorizeRoles("trainee", "admin"), enrollInCourse);
router.post("/:id/progress", verifyToken, authorizeRoles("trainee", "admin"), updateModuleProgress);
router.post("/:id/feedback", verifyToken, authorizeRoles("trainee"), addCourseFeedback);

export default router;
