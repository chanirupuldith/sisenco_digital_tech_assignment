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

/** @route GET    /api/categories      - Get all user categories */
router.get('/', getUserCategories);

/** @route POST   /api/categories      - Create a new category */
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

/** @route PUT    /api/categories/:id  - Update an existing category */
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

/** @route DELETE /api/categories/:id  - Soft-delete a category */
router.delete('/:id', deleteCategory);

export default router;
