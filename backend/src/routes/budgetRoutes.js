import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import {
  getUserBudgets,
  addBudget,
  updateBudget,
} from '../controllers/budgetController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Validates request fields and returns 400 with errors if any validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);

/** @route GET  /api/budgets     - Get all user budgets with current spending */
router.get('/', getUserBudgets);

/** @route POST /api/budgets     - Create a new monthly budget */
router.post(
  '/',
  [
    body('category_id').isInt().withMessage('Category is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    body('year').isInt({ min: 2000 }).withMessage('Year is invalid'),
  ],
  validate,
  addBudget
);

/** @route PUT  /api/budgets/:id - Update an existing budget amount */
router.put(
  '/:id',
  [body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive')],
  validate,
  updateBudget
);

export default router;
