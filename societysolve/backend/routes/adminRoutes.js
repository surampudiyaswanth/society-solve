const express = require('express');
const router = express.Router();
const {
  getAdminStatistics,
  getAllUsers,
  getAllProblems,
  toggleUserStatus,
  verifyProblem,
  adminAssignUniversity,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/statistics', getAdminStatistics);
router.get('/dashboard', getAdminStatistics);
router.get('/users', getAllUsers);
router.get('/problems', getAllProblems);
router.patch('/users/:userId/status', toggleUserStatus);
router.patch('/problems/:problemId/verify', verifyProblem);
router.patch('/problems/:problemId/assign', adminAssignUniversity);

module.exports = router;
