import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import db from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

try {
  db.connect();
  console.log('Database connected');
} catch (error) {
  console.error('Database connection failed:', error);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;