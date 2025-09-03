import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { initializeDatabase } from '../../server/database/init.js';
import statusRoutes from '../../server/routes/status.js';
import laborRoutes from '../../server/routes/labor.js';
import materialsRoutes from '../../server/routes/materials.js';
import dailyUpdatesRoutes from '../../server/routes/dailyUpdates.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (only once)
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Routes
app.use('/api/status', async (req, res, next) => {
  await ensureDbInitialized();
  next();
}, statusRoutes);

app.use('/api/labor', async (req, res, next) => {
  await ensureDbInitialized();
  next();
}, laborRoutes);

app.use('/api/materials', async (req, res, next) => {
  await ensureDbInitialized();
  next();
}, materialsRoutes);

app.use('/api/daily-updates', async (req, res, next) => {
  await ensureDbInitialized();
  next();
}, dailyUpdatesRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  await ensureDbInitialized();
  res.json({ status: 'OK', message: 'National Group India Construction API (Netlify)' });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export const handler = serverless(app);
