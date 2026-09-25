import express from 'express';
import {
  createSolution,
  getSolutions,
  claimProblem,
  getUniversityStats,
} from '../controllers/solutionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/university-stats', protect, authorize('university', 'admin'), getUniversityStats);
router.post('/claim/:id', protect, authorize('university', 'admin'), claimProblem);

router
  .route('/')
  .post(protect, authorize('university', 'admin'), createSolution)
  .get(getSolutions);

export default router;
