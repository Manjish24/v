import { Router } from 'express';
import { getAssessmentById, submitAssessment, getAssessmentResult } from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Assessment retrieval uses auth so we can strip answers for trainees
router.get('/:id', authenticate, getAssessmentById);
router.post('/:id/submit', authenticate, submitAssessment);
router.get('/:id/result', authenticate, getAssessmentResult);

export default router;
