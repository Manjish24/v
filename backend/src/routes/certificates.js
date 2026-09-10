import { Router } from 'express';
import { issueCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Issuance requires authentication
router.post('/issue', authenticate, issueCertificate);

// Public verification does NOT require authentication (Section 18 & 58)
router.get('/:token/verify', verifyCertificate);

export default router;
