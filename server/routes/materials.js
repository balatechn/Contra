import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all materials
router.get('/', (req, res) => {
  db.all('SELECT * FROM materials ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get plant & machinery
router.get('/pm', (req, res) => {
  db.all('SELECT * FROM plant_machinery ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get materials by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM materials WHERE category = ? ORDER BY name', [category], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new material
router.post('/', (req, res) => {
  const { name, category, quantity, unit, rate, supplier } = req.body;
  
  db.run(
    'INSERT INTO materials (name, category, quantity, unit, rate, supplier) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, quantity, unit, rate, supplier],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Add plant & machinery
router.post('/pm', (req, res) => {
  const { name, type, model, ownership, rate, operator } = req.body;
  
  db.run(
    'INSERT INTO plant_machinery (name, type, model, ownership, rate, operator) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, model, ownership, rate, operator],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update material quantity
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { quantity, status } = req.body;
  
  db.run(
    'UPDATE materials SET quantity = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [quantity, status, id],
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
