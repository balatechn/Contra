import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all status board items
router.get('/', (req, res) => {
  db.all('SELECT * FROM status_board ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get construction phases
router.get('/phases', (req, res) => {
  db.all('SELECT * FROM construction_phases ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update phase progress
router.put('/phases/:id', (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;
  
  db.run(
    'UPDATE construction_phases SET progress = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [progress, status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, changes: this.changes });
    }
  );
});

// Create new status item
router.post('/', (req, res) => {
  const { project_name, phase, status, progress, start_date, end_date } = req.body;
  
  db.run(
    'INSERT INTO status_board (project_name, phase, status, progress, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [project_name, phase, status, progress, start_date, end_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

export default router;
