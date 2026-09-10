import express from "express";
import {
  getTraineeDashboard,
  getTraineeCertificates
} from "../controllers/traineeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, requireRoles("trainee", "admin"));

router.get("/dashboard", getTraineeDashboard);
router.get("/certificates", getTraineeCertificates);

export default router;
