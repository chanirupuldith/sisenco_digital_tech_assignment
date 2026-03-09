import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import {
  getUserTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

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

/** @route GET    /api/transactions     - Get all transactions (filterable by type, category, date) */
router.get('/', getUserTransactions);

/** @route POST   /api/transactions     - Create a new transaction */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('category_id').isInt().withMessage('Category required'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be income or expense'),
    body('date').isDate().withMessage('Valid date required'),
  ],
  validate,
  addTransaction
);

/** @route PUT    /api/transactions/:id - Update an existing transaction */
router.put(
  '/:id',
  [
    body('title').notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('category_id').isInt(),
    body('type').isIn(['income', 'expense']),
    body('date').isDate(),
  ],
  validate,
  updateTransaction
);

/** @route DELETE /api/transactions/:id - Soft-delete a transaction */
router.delete('/:id', deleteTransaction);

export default router;
