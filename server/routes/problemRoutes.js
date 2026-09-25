import express from 'express';
import {
  createProblem,
  getProblems,
  getMyProblems,
  getProblemById,
  updateProblemStatus,
  seedDemoProblems,
} from '../controllers/problemController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

router.use('/:id/comments', commentRoutes);

router.post('/seed-demo', seedDemoProblems);

router
  .route('/')
  .post(
    protect,
    upload.fields([
      { name: 'images', maxCount: 5 },
      { name: 'documents', maxCount: 3 },
    ]),
    createProblem
  )
  .get(getProblems);

router.get('/my', protect, getMyProblems);
router.put('/:id/status', protect, updateProblemStatus);
router.get('/:id', getProblemById);

export default router;
