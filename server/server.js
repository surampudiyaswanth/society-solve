import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import solutionRoutes from './routes/solutionRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// AI Chatbot & AI Matching routes
import chatbotRoutes from './routes/chatbotRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';

import {
  notFound,
  errorHandler
} from './middleware/errorMiddleware.js';

import {
  securityHeaders,
  authLimiter
} from './middleware/securityMiddleware.js';

// Setup environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers Middleware
app.use(securityHeaders);

// Middleware - Full Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  'https://society-solve-nine.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, cURL, server-to-server)
    if (!origin) return callback(null, true);
    // Allow explicit origins, any *.vercel.app domain, and localhost
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    // Dynamic fallback: reflect origin so valid clients are not blocked
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static folder for uploaded problem attachments and documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/health', healthRoutes);

app.use('/api/auth', authLimiter, authRoutes);

// AI Chatbot
// Chatbot authentication and role handling are managed by chatbotRoutes.
app.use('/api/chat', chatbotRoutes);

// AI Matching Engine
app.use('/api/match', matchingRoutes);

app.use('/api/problems', problemRoutes);

app.use('/api/solutions', solutionRoutes);

app.use('/api/collaborations', collaborationRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/notifications', notificationRoutes);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SocietySolve API',
    mission:
      'Connecting Citizens, Universities, and Industries to solve societal challenges.',
    healthCheck: '/api/health',
    chatbot: '/api/chat',
    matching: '/api/match/:problemId',
    documentation: 'See README.md for setup and endpoints'
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFound);
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `\x1b[36m[SocietySolve Server]\x1b[0m Running in ${
      process.env.NODE_ENV || 'development'
    } mode on http://localhost:${PORT}`
  );
});