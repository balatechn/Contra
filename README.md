# National Group India - Construction Management System

A comprehensive construction site management application built with SvelteKit frontend and Node.js backend, featuring real-time project tracking, daily updates, and resource management.

## 🏗️ Features

### Core Modules
- **Status Board**: Real-time project status tracking with progress indicators
- **Labor Management**: Track staff, NMT workers, and contractors
- **Materials & P&M**: Inventory management for materials and plant & machinery
- **Daily Updates**: Shift-wise progress reports with date range filtering
- **Construction Phases**: Track multiple construction categories:
  - Construction
  - Electrical
  - Mechanical
  - Consumable
  - Safety
  - QA & QC

### Dashboard Features
- **Real-time Statistics**: Active projects, progress tracking, manpower monitoring
- **Date Range Controls**: Filter data by custom date ranges
- **Visual Progress Indicators**: Progress bars and status badges
- **Gold & Off-white Theme**: Professional construction industry styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   # Start both frontend and backend
   npm run dev:all
   
   # Or start individually:
   npm run server    # Backend API (port 3001)
   npm run dev       # Frontend (port 5173/5174)
   ```

3. **Access the application**:
   - **Frontend Dashboard**: http://localhost:5174
   - **Backend API**: http://localhost:3001
   - **API Health Check**: http://localhost:3001/api/health

## 📊 API Endpoints

### Status & Phases
- `GET /api/status` - Get all status board items
- `GET /api/status/phases` - Get construction phases
- `PUT /api/status/phases/:id` - Update phase progress
- `POST /api/status` - Create new status item

### Labor Management
- `GET /api/labor` - Get all labor records
- `GET /api/labor/type/:type` - Get labor by type (STAFF/NMT/CONTRACT)
- `POST /api/labor` - Add new labor record
- `PUT /api/labor/:id` - Update labor record

### Materials & Plant & Machinery
- `GET /api/materials` - Get all materials
- `GET /api/materials/pm` - Get plant & machinery
- `GET /api/materials/category/:category` - Get materials by category
- `POST /api/materials` - Add new material
- `POST /api/materials/pm` - Add plant & machinery

### Daily Updates
- `GET /api/daily-updates` - Get daily updates (with date filtering)
- `GET /api/daily-updates/date/:date` - Get updates for specific date
- `GET /api/daily-updates/stats` - Get summary statistics
- `POST /api/daily-updates` - Create daily update
- `PUT /api/daily-updates/:id` - Update daily update

## 🗄️ Database Schema

The application uses SQLite database with the following main tables:

- **status_board**: Project status tracking
- **construction_phases**: Phase-wise progress tracking
- **labor**: Worker and staff management
- **materials**: Material inventory
- **plant_machinery**: Equipment tracking (own/rented)
- **daily_updates**: Daily progress reports

## 🎨 Design System

### Color Scheme
- **Primary Gold**: #d4af37
- **Secondary Gold**: #b8860b
- **Light Gold**: #f7e98e
- **Off-white**: #fffbf0
- **Cream**: #f5f5dc

### Status Colors
- **Success**: #2d7d32 (Completed)
- **Warning**: #f57c00 (In Progress)
- **Info**: #1976d2 (Not Started)
- **Danger**: #c62828 (On Hold)

## 📱 Responsive Design

The application is fully responsive with:
- Desktop-first design
- Mobile-friendly sidebar navigation
- Adaptive grid layouts
- Touch-friendly controls

## 🛠️ Technology Stack

### Frontend
- **SvelteKit**: Modern web framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Lucide Svelte**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite**: Embedded database
- **CORS**: Cross-origin requests

### Development Tools
- **Concurrently**: Run multiple commands
- **dotenv**: Environment configuration
- **TypeScript**: Type checking

## 📋 Project Structure

```
project-a/
├── src/                    # SvelteKit frontend
│   ├── routes/            # Page components
│   ├── lib/               # Shared components
│   └── app.css           # Global styles
├── server/                # Node.js backend
│   ├── database/         # Database setup
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── static/               # Static assets
└── package.json          # Dependencies & scripts
```

## 🚦 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=national_group_construction_secret_key_2025
DB_PATH=./server/database/construction.db
```

## 🏢 About National Group India

National Group India is committed to delivering excellence in construction management through innovative technology solutions that enhance productivity, safety, and project visibility.

---

**Built with ❤️ for National Group India Construction Team**
