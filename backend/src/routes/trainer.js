import { Router } from 'express';
import {
  getTrainerProfile,
  updateTrainerProfile,
  getTrainerCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseMaterial,
  deleteCourseMaterial,
  createAssessment,
  getCoursePerformance,
  getTrainerLibrary
} from '../controllers/trainerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Protect all trainer routes
router.use(authenticate, requireRole('TRAINER', 'ADMIN'));

router.get('/profile', getTrainerProfile);
router.put('/profile', updateTrainerProfile);
router.get('/courses', getTrainerCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/courses/:id/materials', addCourseMaterial);
router.delete('/materials/:id', deleteCourseMaterial);
router.post('/assessments', createAssessment);
router.get('/courses/:id/performance', getCoursePerformance);
router.get('/library', getTrainerLibrary);

export default router;
