const express = require('express');
const router = express.Router();
const {
  getIndustryProblems,
  submitCollaboration,
  updateCollaboration,
} = require('../controllers/industryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('industry', 'admin'));

router.get('/problems', getIndustryProblems);
router.post('/problems/:problemId/collaborate', submitCollaboration);
router.patch('/problems/:problemId/collaboration', updateCollaboration);

module.exports = router;
