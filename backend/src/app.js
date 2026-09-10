import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import traineeRoutes from './routes/trainee.js';
import trainerRoutes from './routes/trainer.js';
import courseRoutes from './routes/courses.js';
import assessmentRoutes from './routes/assessments.js';
import certificateRoutes from './routes/certificates.js';
import competencyRoutes from './routes/competency.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();

// CORS Configuration (Section 61)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server) or matching origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Capacity Connect API is healthy and operational.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Capacity Connect Backend (SIH PS 26075)'
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainee', traineeRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/competency', competencyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler for Unhandled Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
});

export default app;
