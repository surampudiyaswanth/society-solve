import express from 'express';
import { matchStakeholdersForProblem } from '../controllers/matchingController.js';

const router = express.Router();

router.get('/:problemId', matchStakeholdersForProblem);

export default router;