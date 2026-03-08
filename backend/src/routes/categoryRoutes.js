import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
  getUserCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
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

router.get('/', getUserCategories);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be either income or expense'),
  ],
  validate,
  addCategory
);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be either income or expense'),
  ],
  validate,
  updateCategory
);

router.delete('/:id', deleteCategory);

export default router;
