import express from 'express';
import {
  createCollaboration,
  getMyCollaborations,
  getIndustryStats,
} from '../controllers/collaborationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/industry-stats', protect, authorize('industry', 'admin'), getIndustryStats);
router.get('/my', protect, authorize('industry', 'admin'), getMyCollaborations);
router.post('/', protect, authorize('industry', 'admin'), createCollaboration);

export default router;
