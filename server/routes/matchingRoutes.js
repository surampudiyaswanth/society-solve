import express from 'express';

const router = express.Router();

router.get('/:problemId', (req, res) => {
  res.json({
    success: true,
    message: 'Matching endpoint ready',
    problemId: req.params.problemId,
    matches: []
  });
});

export default router;