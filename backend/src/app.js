import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db.js'; // Note the .js extension is required in ESM

const app = express(); // <--- This line defines "app"

// Middleware
app.use(cors());
app.use(express.json());

// The health check route

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'success',
      message: 'Backend is live and Database is connected!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
