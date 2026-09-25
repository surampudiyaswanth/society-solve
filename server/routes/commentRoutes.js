import express from 'express';
import { createComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

// MergeParams to capture :id from parent route (/api/problems/:id/comments)
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, createComment)
  .get(getComments);

export default router;
