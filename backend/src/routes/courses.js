import { Router } from 'express';
import { getAllCourses, getCourseById, submitCourseFeedback } from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/:id/feedback', authenticate, submitCourseFeedback);

export default router;
