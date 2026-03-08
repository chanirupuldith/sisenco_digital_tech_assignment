import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Check Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Backend is live!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
