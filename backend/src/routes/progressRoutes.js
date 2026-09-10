import express from "express";
import {
  getCourseProgress,
  updateCourseProgress
} from "../controllers/progressController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:courseId", requireRoles("trainee", "admin"), getCourseProgress);
router.put("/:courseId", requireRoles("trainee", "admin"), updateCourseProgress);

export default router;
