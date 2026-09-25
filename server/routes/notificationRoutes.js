import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  seedDemoNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All notification routes require JWT authentication

router.get('/', getMyNotifications);
router.post('/seed', seedDemoNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
