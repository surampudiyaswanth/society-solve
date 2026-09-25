import express from 'express';
import {
  getAdminStatistics,
  getAdminUsers,
  verifyUser,
  deleteUser,
  getAdminProblems,
  moderateProblem,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin authorization to all admin routes
router.use(protect, authorize('admin'));

router.get('/statistics', getAdminStatistics);
router.get('/users', getAdminUsers);
router.put('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);

router.get('/problems', getAdminProblems);
router.put('/problems/:id/moderate', moderateProblem);

export default router;
