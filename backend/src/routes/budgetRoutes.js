import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import {
  getUserBudgets,
  addBudget,
  updateBudget,
} from '../controllers/budgetController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);

router.get('/', getUserBudgets);

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

router.put(
  '/:id',
  [body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive')],
  validate,
  updateBudget
);

export default router;
