import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { initializeDatabase } from './database/init.js';
import statusRoutes from './routes/status.js';
import laborRoutes from './routes/labor.js';
import materialsRoutes from './routes/materials.js';
import dailyUpdatesRoutes from './routes/dailyUpdates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Initialize database
  await initializeDatabase();

  // API Routes
  app.use('/api/status', statusRoutes);
  app.use('/api/labor', laborRoutes);
  app.use('/api/materials', materialsRoutes);
  app.use('/api/daily-updates', dailyUpdatesRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'National Group India Construction API' });
  });

  app.listen(PORT, () => {
    console.log(`🏗️  National Group India Construction Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log('Server is ready to accept connections...');
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
  });
}

startServer().catch(console.error);
