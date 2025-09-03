import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'construction.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Status Board table
    db.run(`CREATE TABLE IF NOT EXISTS status_board (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      phase TEXT NOT NULL,
      status TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Labor Management table
    db.run(`CREATE TABLE IF NOT EXISTS labor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT,
      department TEXT,
      contact TEXT,
      daily_rate REAL,
      type TEXT CHECK(type IN ('STAFF', 'NMT', 'CONTRACT')) NOT NULL,
      status TEXT CHECK(status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Materials table
    db.run(`CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      rate REAL,
      supplier TEXT,
      status TEXT CHECK(status IN ('IN_STOCK', 'OUT_OF_STOCK', 'ORDERED')) DEFAULT 'IN_STOCK',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // P&M (Plant & Machinery) table
    db.run(`CREATE TABLE IF NOT EXISTS plant_machinery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      model TEXT,
      ownership TEXT CHECK(ownership IN ('OWN', 'RENTED')) NOT NULL,
      rate REAL,
      operator TEXT,
      status TEXT CHECK(status IN ('OPERATIONAL', 'MAINTENANCE', 'BREAKDOWN')) DEFAULT 'OPERATIONAL',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Construction phases tracking
    db.run(`CREATE TABLE IF NOT EXISTS construction_phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_name TEXT NOT NULL,
      category TEXT CHECK(category IN ('CONSTRUCTION', 'ELECTRICAL', 'MECHANICAL', 'CONSUMABLE', 'SAFETY', 'QA_QC')) NOT NULL,
      progress INTEGER DEFAULT 0,
      responsible_person TEXT,
      start_date TEXT,
      target_date TEXT,
      actual_completion_date TEXT,
      status TEXT CHECK(status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD')) DEFAULT 'NOT_STARTED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Daily Updates table
    db.run(`CREATE TABLE IF NOT EXISTS daily_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      shift TEXT CHECK(shift IN ('MORNING', 'EVENING', 'NIGHT')) NOT NULL,
      weather TEXT,
      manpower_present INTEGER,
      work_description TEXT,
      progress_percentage REAL,
      materials_used TEXT,
      equipment_used TEXT,
      safety_incidents INTEGER DEFAULT 0,
      quality_checks TEXT,
      issues TEXT,
      photos TEXT, -- JSON array of photo paths
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample data
    db.run(`INSERT OR IGNORE INTO status_board (id, project_name, phase, status, progress, start_date, end_date) VALUES 
      (1, 'National Group Tower A', 'Foundation', 'IN_PROGRESS', 75, '2025-08-01', '2025-09-15'),
      (2, 'National Group Tower A', 'Structure', 'NOT_STARTED', 0, '2025-09-16', '2025-12-30'),
      (3, 'National Group Tower B', 'Foundation', 'COMPLETED', 100, '2025-07-01', '2025-08-30')`);

    db.run(`INSERT OR IGNORE INTO construction_phases (id, phase_name, category, progress, responsible_person, start_date, target_date, status) VALUES 
      (1, 'Site Preparation', 'CONSTRUCTION', 100, 'Rajesh Kumar', '2025-08-01', '2025-08-15', 'COMPLETED'),
      (2, 'Foundation Work', 'CONSTRUCTION', 75, 'Suresh Patel', '2025-08-16', '2025-09-15', 'IN_PROGRESS'),
      (3, 'Electrical Planning', 'ELECTRICAL', 50, 'Amit Sharma', '2025-08-20', '2025-09-10', 'IN_PROGRESS'),
      (4, 'HVAC Installation', 'MECHANICAL', 0, 'Deepak Singh', '2025-09-16', '2025-10-30', 'NOT_STARTED'),
      (5, 'Safety Protocol Setup', 'SAFETY', 80, 'Priya Agarwal', '2025-08-01', '2025-08-31', 'IN_PROGRESS'),
      (6, 'Quality Assurance', 'QA_QC', 60, 'Dr. Vikram Joshi', '2025-08-01', '2025-12-31', 'IN_PROGRESS')`, function(err) {
      if (err) {
        console.error('Database initialization error:', err);
        reject(err);
      } else {
        console.log('✅ Database initialized successfully');
        resolve();
      }
    });
  });
};

export {
  db,
  initializeDatabase
};
