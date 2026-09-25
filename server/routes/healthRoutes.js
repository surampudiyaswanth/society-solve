import express from 'express';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  const dbInfo = getDbStatus();

  res.status(200).json({
    success: true,
    platform: 'SocietySolve API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    database: dbInfo,
    actors: [
      { role: 'Citizen', description: 'Reports societal problems via interactive category chart' },
      { role: 'University', description: 'Forms research teams and proposes verified solutions' },
      { role: 'Industry', description: 'Provides funding, mentorship, technology, and scale' },
      { role: 'Admin', description: 'Monitors the ecosystem, verifies institutions, approves issues' }
    ]
  });
});

export default router;
