import express from "express";
import {
  getTrainerCourses,
  createCourse,
  verifyVideo,
  getYouTubeMetadata,
  updateCourse,
  createAssessment,
  getTrainerAssessments,
  getTraineeProgress,
  getLibraryResources,
  uploadLibraryResource,
  deleteLibraryResource
} from "../controllers/trainerController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All trainer routes require authentication & trainer or admin role
router.use(verifyToken, authorizeRoles("trainer", "admin"));

router.get("/courses", getTrainerCourses);
router.post("/courses", createCourse);
router.post("/verify-video", verifyVideo);
router.get("/youtube-metadata", getYouTubeMetadata);
router.put("/courses/:id", updateCourse);

router.get("/assessments", getTrainerAssessments);
router.post("/assessments", createAssessment);

router.get("/trainee-progress", getTraineeProgress);

router.get("/library", getLibraryResources);
router.post("/library", uploadLibraryResource);
router.delete("/library/:id", deleteLibraryResource);

export default router;
