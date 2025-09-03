// API Configuration for different environments
const API_BASE = import.meta.env.PROD 
  ? '/.netlify/functions/api'  // Production (Netlify)
  : 'http://localhost:3001/api'; // Development

export { API_BASE };
