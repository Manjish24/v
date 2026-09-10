import { Router } from 'express';
import {
  getTraineeProfile,
  updateTraineeProfile,
  getMyCourses,
  getAvailableCourses,
  enrollInCourse,
  updateCourseProgress,
  getPendingAssessments,
  getMyResults,
  getMyCertificates,
  raiseQuery,
  getMyQueries
} from '../controllers/traineeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Protect all trainee routes
router.use(authenticate, requireRole('TRAINEE', 'ADMIN'));

router.get('/profile', getTraineeProfile);
router.put('/profile', updateTraineeProfile);
router.get('/courses', getMyCourses);
router.get('/courses/available', getAvailableCourses);
router.post('/courses/:courseId/enroll', enrollInCourse);
router.put('/courses/:courseId/progress', updateCourseProgress);
router.get('/assessments/pending', getPendingAssessments);
router.get('/results', getMyResults);
router.get('/certificates', getMyCertificates);
router.post('/queries', raiseQuery);
router.get('/queries', getMyQueries);

export default router;
