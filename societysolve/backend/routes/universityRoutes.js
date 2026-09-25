const express = require('express');
const router = express.Router();
const {
  getUniversityProblems,
  getUniversityProblemById,
  assignUniversityToProblem,
  advanceStage,
} = require('../controllers/universityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('university', 'admin'));

router.get('/problems', getUniversityProblems);
router.get('/problems/:problemId', getUniversityProblemById);
router.patch('/problems/:problemId/assign', assignUniversityToProblem);
router.patch('/problems/:problemId/status', advanceStage);

module.exports = router;
