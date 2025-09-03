import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all labor records
router.get('/', (req, res) => {
  db.all('SELECT * FROM labor ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get labor by type (STAFF, NMT, CONTRACT)
router.get('/type/:type', (req, res) => {
  const { type } = req.params;
  db.all('SELECT * FROM labor WHERE type = ? ORDER BY name', [type], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new labor record
router.post('/', (req, res) => {
  const { name, designation, department, contact, daily_rate, type } = req.body;
  
  db.run(
    'INSERT INTO labor (name, designation, department, contact, daily_rate, type) VALUES (?, ?, ?, ?, ?, ?)',
    [name, designation, department, contact, daily_rate, type],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update labor record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, designation, department, contact, daily_rate, type, status } = req.body;
  
  db.run(
    'UPDATE labor SET name = ?, designation = ?, department = ?, contact = ?, daily_rate = ?, type = ?, status = ? WHERE id = ?',
    [name, designation, department, contact, daily_rate, type, status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, changes: this.changes });
    }
  );
});

export default router;
