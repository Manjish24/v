import express from "express";
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getCompetencyMapping,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getReports
} from "../controllers/adminController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require admin role
router.use(verifyToken, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/competency-mapping", getCompetencyMapping);

router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

router.get("/reports", getReports);

export default router;
