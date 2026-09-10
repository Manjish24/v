import { Router } from 'express';
import {
  getAICourseRecommendations,
  getAIYouTubeSummary,
  getAIQueryAssistant
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Authenticated AI routes
router.use(authenticate);

router.post('/course-recommendation', getAICourseRecommendations);
router.post('/youtube-summary', getAIYouTubeSummary);
router.post('/query-assistant', getAIQueryAssistant);

export default router;
