import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

/** @route GET /api/dashboard - Get aggregated dashboard metrics for the authenticated user */
router.get('/', getDashboardData);

export default router;
