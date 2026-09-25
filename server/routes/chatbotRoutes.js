import express from 'express';
import { chatWithAI } from '../controllers/chatbotController.js';

const router = express.Router();

// Allow public visitors and logged-in users to interact with the assistant
router.post('/', chatWithAI);

export default router;