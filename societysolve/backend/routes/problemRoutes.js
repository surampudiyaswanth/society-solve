const express = require('express');
const router = express.Router();
const {
  getCategories,
  createProblem,
  getMyProblems,
  getProblemById,
  updateProblemStatus,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { problemUploadMiddleware } = require('../middleware/uploadMiddleware');

// Public category metadata
router.get('/categories', getCategories);

// Citizen problem endpoints
router.post(
  '/',
  protect,
  authorize('citizen', 'admin'),
  problemUploadMiddleware,
  createProblem
);

router.get('/my', protect, authorize('citizen', 'admin'), getMyProblems);

// Detailed problem lookup
router.get('/:problemId', protect, getProblemById);

// Update status endpoint (University, Admin)
router.patch(
  '/:problemId/status',
  protect,
  authorize('university', 'admin'),
  updateProblemStatus
);

module.exports = router;
