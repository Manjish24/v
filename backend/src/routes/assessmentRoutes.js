import express from "express";
import {
  getAssessmentForTaking,
  submitAssessment,
  getMySubmissions
} from "../controllers/assessmentController.js";
import { createAssessment } from "../controllers/trainerController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { dataService } from "../services/dataService.js";

const router = express.Router();

router.use(verifyToken);

router.get("/my-submissions", getMySubmissions);
router.get("/:id", getAssessmentForTaking);
router.post("/:id/submit", authorizeRoles("trainee", "admin"), submitAssessment);

// Trainer & Admin assessment creation & management
router.post("/", authorizeRoles("trainer", "admin"), createAssessment);
router.delete("/:id", authorizeRoles("trainer", "admin"), async (req, res) => {
  try {
    const assessments = await dataService.getAssessments();
    const index = assessments.findIndex((a) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Assessment not found." });
    assessments.splice(index, 1);
    dataService.save();
    res.status(200).json({ success: true, message: "Assessment removed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete assessment." });
  }
});

export default router;
