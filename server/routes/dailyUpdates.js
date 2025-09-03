import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get daily updates with date filtering
router.get('/', (req, res) => {
  const { startDate, endDate } = req.query;
  let query = 'SELECT * FROM daily_updates';
  let params = [];

  if (startDate && endDate) {
    query += ' WHERE date BETWEEN ? AND ?';
    params = [startDate, endDate];
  }

  query += ' ORDER BY date DESC, created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get daily update by date
router.get('/date/:date', (req, res) => {
  const { date } = req.params;
  db.all('SELECT * FROM daily_updates WHERE date = ? ORDER BY shift', [date], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create daily update
router.post('/', (req, res) => {
  const {
    date,
    shift,
    weather,
    manpower_present,
    work_description,
    progress_percentage,
    materials_used,
    equipment_used,
    safety_incidents,
    quality_checks,
    issues,
    photos,
    created_by
  } = req.body;

  db.run(
    `INSERT INTO daily_updates 
     (date, shift, weather, manpower_present, work_description, progress_percentage, 
      materials_used, equipment_used, safety_incidents, quality_checks, issues, photos, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [date, shift, weather, manpower_present, work_description, progress_percentage,
     materials_used, equipment_used, safety_incidents, quality_checks, issues, 
     JSON.stringify(photos || []), created_by],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update daily update
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    weather,
    manpower_present,
    work_description,
    progress_percentage,
    materials_used,
    equipment_used,
    safety_incidents,
    quality_checks,
    issues,
    photos
  } = req.body;

  db.run(
    `UPDATE daily_updates SET 
     weather = ?, manpower_present = ?, work_description = ?, progress_percentage = ?,
     materials_used = ?, equipment_used = ?, safety_incidents = ?, quality_checks = ?,
     issues = ?, photos = ?
     WHERE id = ?`,
    [weather, manpower_present, work_description, progress_percentage,
     materials_used, equipment_used, safety_incidents, quality_checks, issues,
     JSON.stringify(photos || []), id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, changes: this.changes });
    }
  );
});

// Get summary statistics
router.get('/stats', (req, res) => {
  const { startDate, endDate } = req.query;
  let dateFilter = '';
  let params = [];

  if (startDate && endDate) {
    dateFilter = ' WHERE date BETWEEN ? AND ?';
    params = [startDate, endDate];
  }

  db.get(
    `SELECT 
       COUNT(*) as total_updates,
       AVG(manpower_present) as avg_manpower,
       AVG(progress_percentage) as avg_progress,
       SUM(safety_incidents) as total_safety_incidents
     FROM daily_updates${dateFilter}`,
    params,
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    }
  );
});

export default router;
