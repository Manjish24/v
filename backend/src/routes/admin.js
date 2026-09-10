import { Router } from 'express';
import {
  getPlatformStatistics,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getAdminTrainees,
  getAdminTrainers,
  getAdminQueries,
  updateAdminQuery,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAchievements,
  publishAchievement
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Publicly readable announcements for homepage
router.get('/announcements/public', getAnnouncements);
router.get('/achievements/public', getAchievements);

// Protected strictly to ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/statistics', getPlatformStatistics);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/trainees', getAdminTrainees);
router.get('/trainers', getAdminTrainers);
router.get('/queries', getAdminQueries);
router.put('/queries/:id', updateAdminQuery);
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.get('/achievements', getAchievements);
router.post('/achievements/:id/publish', publishAchievement);

export default router;
