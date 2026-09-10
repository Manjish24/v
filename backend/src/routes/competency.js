import { Router } from 'express';
import { matchTrainerCompetency, getAllTrainerCompetencies } from '../controllers/competencyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Protected routes for Capacity Competency matching
router.use(authenticate, requireRole('ADMIN', 'TRAINER'));

router.post('/match', matchTrainerCompetency);
router.get('/trainers', getAllTrainerCompetencies);

export default router;
