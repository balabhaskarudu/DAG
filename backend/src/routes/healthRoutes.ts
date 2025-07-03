import express from 'express';
import { getDatabase } from '../config/database';
import { getDb } from '../db';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Health check endpoint
router.get('/', asyncHandler(async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    database: 'Unknown',
  };

  try {
    // Try both database connection methods
    let db;
    try {
      db = getDatabase();
    } catch {
      db = getDb();
    }
    
    await db.admin().ping();
    healthCheck.database = 'Connected';
  } catch (error) {
    healthCheck.database = 'Disconnected';
    healthCheck.status = 'ERROR';
  }

  const statusCode = healthCheck.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
}));

// Detailed health check
router.get('/detailed', asyncHandler(async (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'UP',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      database: {
        status: 'DOWN',
        responseTime: 0,
        uri: process.env.MONGO_URI ? `${process.env.MONGO_URI}${process.env.DB_NAME || 'dag_editor'}` : 'Not configured',
      },
    },
  };

  try {
    const startTime = Date.now();
    
    // Try both database connection methods
    let db;
    try {
      db = getDatabase();
    } catch {
      db = getDb();
    }
    
    await db.admin().ping();
    const responseTime = Date.now() - startTime;
    
    detailedHealth.services.database = {
      status: 'UP',
      responseTime,
      uri: process.env.MONGO_URI ? `${process.env.MONGO_URI}${process.env.DB_NAME || 'dag_editor'}` : 'Not configured',
    };
  } catch (error) {
    detailedHealth.status = 'DEGRADED';
    detailedHealth.services.database.status = 'DOWN';
  }

  const statusCode = detailedHealth.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(detailedHealth);
}));

export default router;