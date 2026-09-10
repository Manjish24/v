import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById
} from "../controllers/enrollmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", requireRoles("trainee", "admin"), enrollInCourse);
router.get("/my-courses", requireRoles("trainee", "admin"), getMyEnrollments);
router.get("/:id", getEnrollmentById);

export default router;
